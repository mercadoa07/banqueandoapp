// Valida config/cards.json y config/creditProducts.json.
//   npm run validate:data                      → errores y advertencias en consola
//   npm run validate:data -- --check-links     → además revisa que los links respondan
//   npm run validate:data -- --report file.md  → escribe el reporte en markdown
// Sale con código 1 solo si hay ERRORES (datos que no se pueden publicar).
// Las ADVERTENCIAS no frenan: son la lista de trabajo para dejar la base al día.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { cardSchema, creditSchema } from './lib/productSchema.mjs';

const args = process.argv.slice(2);
const CHECK_LINKS = args.includes('--check-links');
const REPORT = args.includes('--report') ? args[args.indexOf('--report') + 1] : null;
const STALE_DAYS = 90;
const PLACEHOLDER_MIN_REPEATS = 5;

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const cards = read('config/cards.json').cards;
const credits = read('config/creditProducts.json').creditProducts;
const usury = read('config/usuryRates.json');

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push({ id, msg });
const warn = (id, msg) => warnings.push({ id, msg });

// --- Mes vigente de usura (hora de Bogotá) ---
const today = new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10);
const thisMonth = today.slice(0, 7);
const months = Object.keys(usury.months).sort();
let usuryMonth = thisMonth;
if (!usury.months[thisMonth]) {
  usuryMonth = months.filter(m => m < thisMonth).pop();
  if (!usuryMonth) err('usura', `No hay tasa de usura para ${thisMonth} ni meses anteriores en config/usuryRates.json`);
  else warn('usura', `Falta la tasa de usura de ${thisMonth}; se valida con la de ${usuryMonth}. Actualizar config/usuryRates.json`);
}
const caps = usuryMonth ? usury.months[usuryMonth].rates : {};

// --- Validación por producto ---
const daysSince = (d) => Math.floor((Date.parse(today) - Date.parse(d)) / 86400000);

const checkCommon = (p) => {
  if (!p.active) return;
  [['applyUrl', p.applyUrl], ['moreInfoUrl', p.moreInfoUrl], ['source.url', p.source?.url]]
    .filter(([, u]) => typeof u === 'string' && u !== u.trim())
    .forEach(([field]) => err(p.id, `${field} tiene espacios al inicio o al final`));
  if (!p.lastVerified) warn(p.id, 'sin fecha de verificación (lastVerified)');
  else if (daysSince(p.lastVerified) > STALE_DAYS) warn(p.id, `verificado hace ${daysSince(p.lastVerified)} días (máx ${STALE_DAYS})`);
};

const checkUsury = (p, maxRate) => {
  if (!p.active) return;
  const cap = caps[p.usuryModality];
  if (cap === undefined || maxRate === undefined) return;
  if (maxRate > cap) {
    const msg = `tasa ${maxRate}% EA supera la usura de ${p.usuryModality} (${cap}% en ${usuryMonth})`;
    if (p.usuryModalityVerified) err(p.id, msg);
    else warn(p.id, `${msg} — modalidad sin verificar`);
  }
};

const ids = new Map();
const registerId = (p, kind) => {
  if (ids.has(p.id)) err(p.id, `id duplicado (también en ${ids.get(p.id)})`);
  ids.set(p.id, kind);
};

const formatZod = (issues) => issues.map(i => `${i.path.join('.') || '(raíz)'}: ${i.message}`).join('; ');

// Los inactivos no se muestran en el quiz: solo se revisa que su id no choque.
// Se listan aparte en el reporte con el motivo.
for (const c of cards) {
  registerId(c, 'tarjetas');
  if (c.active === false) continue;
  const r = cardSchema.safeParse(c);
  if (!r.success) { err(c.id, `esquema: ${formatZod(r.error.issues)}`); continue; }
  checkCommon(c);
  checkUsury(c, c.rates.interestRateEA);
}

for (const p of credits) {
  registerId(p, 'créditos');
  if (p.active === false) continue;
  const r = creditSchema.safeParse(p);
  if (!r.success) { err(p.id, `esquema: ${formatZod(r.error.issues)}`); continue; }
  const ld = p.loanDetails;
  if (ld.minAmountMillions > ld.maxAmountMillions) err(p.id, `monto mínimo (${ld.minAmountMillions}M) mayor que el máximo (${ld.maxAmountMillions}M)`);
  if (ld.interestRateEA.min > ld.interestRateEA.max) err(p.id, `tasa mínima (${ld.interestRateEA.min}%) mayor que la máxima (${ld.interestRateEA.max}%)`);
  if (p.usuryModality === 'no_aplica') warn(p.id, `no es crédito tradicional (${p.productType}): sin tope de usura; revisar que solo se recomiende a negocios`);
  checkCommon(p);
  checkUsury(p, ld.interestRateEA.max);
}

// --- Valores de relleno: la misma tasa máxima repetida en muchos créditos ---
const byMax = {};
credits.filter(p => p.active).forEach(p => { const m = p.loanDetails?.interestRateEA?.max; (byMax[m] ||= []).push(p.id); });
for (const [max, list] of Object.entries(byMax)) {
  if (list.length >= PLACEHOLDER_MIN_REPEATS) warn('relleno', `${list.length} créditos tienen exactamente ${max}% como tasa máxima (posible valor de relleno): ${list.join(', ')}`);
}

// --- Links (opcional: hace pedidos HTTP a cada entidad) ---
if (CHECK_LINKS) {
  const all = [...cards, ...credits].filter(p => p.active);
  const urls = new Map();
  all.forEach(p => [p.applyUrl, p.source?.url, p.moreInfoUrl].filter(Boolean).forEach(u => { if (!urls.has(u)) urls.set(u, p.id); }));
  const check = async (u) => {
    try {
      const res = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'BanqueandoLinkCheck/1.0 (+https://www.banqueando.co)' } });
      // 401/403/429 suelen ser bloqueo anti-bots, no link roto.
      if (res.status >= 400 && ![401, 403, 429].includes(res.status)) warn(urls.get(u), `link responde ${res.status}: ${u}`);
    } catch (e) {
      warn(urls.get(u), `link no responde (${e.name === 'TimeoutError' ? 'timeout' : e.message}): ${u}`);
    }
  };
  const queue = [...urls.keys()];
  await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await check(queue.shift()); }));
}

// --- Reporte ---
const group = (list) => list.reduce((acc, x) => ((acc[x.id] ||= []).push(x.msg), acc), {});
const section = (title, list) => {
  if (!list.length) return `### ${title}\n\nNinguno.\n`;
  return `### ${title} (${list.length})\n\n` + Object.entries(group(list)).map(([id, msgs]) => `- **${id}**: ${msgs.join(' · ')}`).join('\n') + '\n';
};
const active = [...cards, ...credits].filter(p => p.active);
const verified = active.filter(p => p.lastVerified && daysSince(p.lastVerified) <= STALE_DAYS).length;
const report = [
  `## Validación de datos — ${today}`,
  '',
  `- Productos: ${cards.length} tarjetas + ${credits.length} créditos (${active.length} activos)`,
  `- Verificados en los últimos ${STALE_DAYS} días: **${verified} de ${active.length}**`,
  `- Usura usada: ${usuryMonth || '—'}${CHECK_LINKS ? ' · links revisados' : ''}`,
  '',
  section('Errores (frenan la publicación)', errors),
  section('Advertencias', warnings),
  section('Inactivos (no se muestran en el quiz)', [...cards, ...credits].filter(p => p.active === false).map(p => ({ id: p.id, msg: p.source?.notes || 'sin motivo registrado' })))
].join('\n');

console.log(report);
if (REPORT) writeFileSync(REPORT, report, 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
process.exit(errors.length ? 1 : 0);
