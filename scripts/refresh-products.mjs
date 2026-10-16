// Lector automático: verifica los productos contra el sitio oficial de cada entidad con Claude.
//
//   ANTHROPIC_API_KEY=... node scripts/refresh-products.mjs [opciones]
//     --ids nu_classic,addi_1   solo esos productos
//     --limit 3                 como máximo N productos (para medir costo)
//     --stale-days 90           solo los no verificados en N días (por defecto 90)
//     --all                     todos los activos, aunque estén al día
//     --dry-run                 no modifica los JSON, solo reporta
//     --report archivo.md       escribe el reporte en markdown
//
// Reglas: nunca publica solo (el workflow abre un PR para revisión humana); solo aplica un dato
// si viene con frase de evidencia y URL dentro del dominio oficial; si no encuentra algo, no lo toca.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
  ExtractionSchema, SYSTEM_PROMPT, productPrompt, FIELD_PATHS, KEY_FIELDS,
  baseDomain, isOnDomain, monthlyToEA, getPath, setPath
} from './lib/extraction.mjs';

const MODEL = 'claude-opus-5-5';
const PRICE = { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 }; // USD por millón de tokens
const CONCURRENCY = 3;

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const IDS = opt('--ids')?.split(',').map(s => s.trim()).filter(Boolean) ?? null;
const LIMIT = opt('--limit') ? Number(opt('--limit')) : null;
const STALE_DAYS = opt('--stale-days') ? Number(opt('--stale-days')) : 90;
const ALL = args.includes('--all');
const DRY_RUN = args.includes('--dry-run');
const REPORT = opt('--report');

const today = new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10);
const daysSince = (d) => Math.floor((Date.parse(today) - Date.parse(d)) / 86400000);

// --- Datos (se respeta CRLF + 2 espacios de los JSON del repo) ---
const path = (p) => new URL(`../${p}`, import.meta.url);
const read = (p) => JSON.parse(readFileSync(path(p), 'utf8'));
const write = (p, data) => writeFileSync(path(p), JSON.stringify(data, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
const files = {
  card: { file: 'config/cards.json', key: 'cards' },
  credit: { file: 'config/creditProducts.json', key: 'creditProducts' }
};
const data = { card: read(files.card.file), credit: read(files.credit.file) };

const candidates = [
  ...data.card.cards.map(p => ({ p, kind: 'card' })),
  ...data.credit.creditProducts.map(p => ({ p, kind: 'credit' }))
].filter(({ p }) => p.active !== false)
 .filter(({ p }) => (IDS ? IDS.includes(p.id) : ALL || !p.lastVerified || daysSince(p.lastVerified) > STALE_DAYS));
const queue = LIMIT ? candidates.slice(0, LIMIT) : candidates;

if (!queue.length) {
  console.log('No hay productos para verificar con esos filtros.');
  process.exit(0);
}

const client = new Anthropic();

// --- Una consulta a Claude por producto ---
const usageTotal = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, searches: 0, fetches: 0 };
const addUsage = (u) => {
  usageTotal.input += u.input_tokens || 0;
  usageTotal.output += u.output_tokens || 0;
  usageTotal.cacheRead += u.cache_read_input_tokens || 0;
  usageTotal.cacheWrite += u.cache_creation_input_tokens || 0;
  usageTotal.searches += u.server_tool_use?.web_search_requests || 0;
  usageTotal.fetches += u.server_tool_use?.web_fetch_requests || 0;
};

async function askClaude(p, kind, domains) {
  const tools = [
    { type: 'web_search_20260209', name: 'web_search', max_uses: 4, allowed_domains: domains },
    { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 4, allowed_domains: domains }
  ];
  const messages = [{ role: 'user', content: productPrompt(p, kind, domains) }];

  // pause_turn: el servidor pausó una búsqueda larga; se reenvía para que continúe.
  for (let turn = 0; turn < 5; turn++) {
    const res = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: zodOutputFormat(ExtractionSchema) },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools,
      messages
    });
    addUsage(res.usage);
    if (res.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: res.content });
      continue;
    }
    if (res.stop_reason === 'refusal') throw new Error(`Claude no respondió (refusal: ${res.stop_details?.category ?? 'sin categoría'})`);
    if (res.stop_reason === 'max_tokens') throw new Error('respuesta cortada por max_tokens');
    const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    const parsed = ExtractionSchema.safeParse(JSON.parse(text));
    if (!parsed.success) throw new Error('la respuesta no cumple el esquema');
    return parsed.data;
  }
  throw new Error('demasiadas pausas (pause_turn)');
}

// --- Aplicar solo lo que viene con evidencia válida ---
function apply(p, kind, ex, domains) {
  const result = { id: p.id, name: p.name, entity: p.entity, changes: [], confirmed: [], rejected: [], notes: ex.notes, stillOffered: ex.stillOffered, officialPageUrl: ex.officialPageUrl, applyUrl: ex.applyUrl };
  const paths = FIELD_PATHS[kind];
  const verified = new Set();

  // Tasa mes vencido sin EA: se convierte (fórmula estándar) y se reporta como derivada.
  const fields = [...ex.fields];
  const monthly = fields.find(f => f.field === 'interestRateMonthly');
  const hasEA = fields.some(f => /^interestRateEA/.test(f.field));
  if (monthly && !hasEA) {
    const ea = monthlyToEA(monthly.value);
    const derived = kind === 'card' ? ['interestRateEA'] : ['interestRateEAMin', 'interestRateEAMax'];
    derived.forEach(field => fields.push({ ...monthly, field, value: ea, evidence: `${monthly.evidence} (MV ${monthly.value}% → ${ea}% EA)` }));
  }

  for (const f of fields) {
    const target = paths[f.field];
    if (!target) continue; // campo que no aplica a este tipo de producto
    if (!f.evidence?.trim()) { result.rejected.push(`${f.field}: sin frase de evidencia`); continue; }
    if (!isOnDomain(f.sourceUrl, domains)) { result.rejected.push(`${f.field}: la fuente ${f.sourceUrl} no es del dominio oficial`); continue; }
    if (f.value < 0 || (/Rate|Percent/.test(f.field) && f.value > 200)) { result.rejected.push(`${f.field}: valor fuera de rango (${f.value})`); continue; }
    if (f.field === 'cashbackPercent' && p.rewards?.type !== 'cashback') continue;

    const before = getPath(p, target);
    verified.add(f.field);
    if (before === f.value) { result.confirmed.push(f.field); continue; }
    result.changes.push({ field: f.field, before, after: f.value, evidence: f.evidence, sourceUrl: f.sourceUrl });
    if (!DRY_RUN) setPath(p, target, f.value);
  }

  const keyOk = KEY_FIELDS[kind].some(k => verified.has(k));
  result.verified = ex.productFound && ex.stillOffered === 'si' && keyOk;
  if (result.verified && !DRY_RUN) {
    p.lastVerified = today;
    if (ex.officialPageUrl && isOnDomain(ex.officialPageUrl, domains)) p.source = { ...p.source, url: ex.officialPageUrl };
  }
  return result;
}

// --- Correr con concurrencia limitada ---
const results = [];
const failures = [];
let next = 0;
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (next < queue.length) {
    const { p, kind } = queue[next++];
    const domains = [...new Set([p.source?.url, p.applyUrl, p.moreInfoUrl].filter(Boolean).map(baseDomain).filter(Boolean))];
    if (!domains.length) { failures.push({ id: p.id, error: 'sin URL para saber el dominio oficial' }); continue; }
    try {
      console.log(`→ ${p.id} (${domains.join(', ')})`);
      const ex = await askClaude(p, kind, domains);
      results.push(apply(p, kind, ex, domains));
    } catch (e) {
      failures.push({ id: p.id, error: e instanceof Anthropic.APIError ? `API ${e.status}: ${e.message}` : e.message });
    }
  }
}));

if (!DRY_RUN) {
  write(files.card.file, data.card);
  write(files.credit.file, data.credit);
}

// --- Reporte ---
const cost = (usageTotal.input * PRICE.input + usageTotal.output * PRICE.output + usageTotal.cacheRead * PRICE.cacheRead + usageTotal.cacheWrite * PRICE.cacheWrite) / 1e6;
const fmt = (v) => (v === undefined || v === null ? '—' : String(v));
const lines = [
  `## Lector automático — ${today}${DRY_RUN ? ' (simulación, sin cambios)' : ''}`,
  '',
  `- Revisados: ${results.length} de ${queue.length} · verificados: **${results.filter(r => r.verified).length}** · con cambios: **${results.filter(r => r.changes.length).length}** · fallidos: ${failures.length}`,
  `- Costo aproximado de tokens: **US$ ${cost.toFixed(2)}** (${usageTotal.input.toLocaleString('es-CO')} entrada, ${usageTotal.output.toLocaleString('es-CO')} salida, ${usageTotal.cacheRead.toLocaleString('es-CO')} de caché) + ${usageTotal.searches} búsquedas web y ${usageTotal.fetches} páginas leídas`,
  ''
];
const withChanges = results.filter(r => r.changes.length);
if (withChanges.length) {
  lines.push('### Cambios propuestos (revisar la evidencia antes de aprobar)', '');
  for (const r of withChanges) {
    lines.push(`**${r.name}** (\`${r.id}\`, ${r.entity})`, '', '| Campo | Antes | Ahora | Evidencia |', '|---|---|---|---|');
    r.changes.forEach(c => lines.push(`| ${c.field} | ${fmt(c.before)} | **${c.after}** | "${c.evidence.replace(/\|/g, '/')}" — [fuente](${c.sourceUrl}) |`));
    lines.push('');
  }
}
const attention = results.filter(r => !r.verified || r.rejected.length || r.stillOffered === 'no');
if (attention.length) {
  lines.push('### Requieren revisión manual', '');
  attention.forEach(r => {
    const why = [];
    if (r.stillOffered === 'no') why.push('⚠️ el sitio indica que ya no se ofrece');
    else if (!r.verified) why.push('no se pudo verificar la tasa en el sitio oficial');
    if (r.rejected.length) why.push(`datos descartados: ${r.rejected.join('; ')}`);
    lines.push(`- **${r.name}** (\`${r.id}\`): ${why.join(' · ')}. ${r.notes}${r.officialPageUrl ? ` [Página](${r.officialPageUrl})` : ''}`);
  });
  lines.push('');
}
const confirmedOnly = results.filter(r => r.verified && !r.changes.length);
if (confirmedOnly.length) lines.push('### Verificados sin cambios', '', confirmedOnly.map(r => `\`${r.id}\``).join(', '), '');
if (failures.length) lines.push('### Fallidos', '', ...failures.map(f => `- \`${f.id}\`: ${f.error}`), '');

const report = lines.join('\n');
console.log('\n' + report);
if (REPORT) writeFileSync(REPORT, report, 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
// Si fallaron todos (clave inválida, sin saldo, API caída), la corrida debe verse en rojo.
if (failures.length === queue.length) process.exit(1);
