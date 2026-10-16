// Qué le pedimos a Claude por cada producto y cómo se mapea a los JSON de config/.
import { z } from 'zod/v4'; // el helper zodOutputFormat del SDK usa zod v4

export const FIELD_NAMES = [
  'interestRateEA',       // tasa única en % efectivo anual
  'interestRateEAMin',    // rango "desde X% EA"
  'interestRateEAMax',    // rango "hasta X% EA"
  'interestRateMonthly',  // solo si la página da la tasa mes vencido y no la EA
  'monthlyFee',           // cuota de manejo mensual, en pesos
  'annualFee',            // cuota de manejo anual, en pesos
  'minIncomeMillions',    // ingreso mínimo exigido, en millones de pesos
  'minAmountMillions',    // monto mínimo del crédito, en millones de pesos
  'maxAmountMillions',    // monto máximo del crédito, en millones de pesos
  'cashbackPercent'       // % de cashback
];

export const ExtractionSchema = z.object({
  productFound: z.boolean(),
  stillOffered: z.enum(['si', 'no', 'no_claro']),
  productNameOnPage: z.string().nullable(),
  officialPageUrl: z.string().nullable(),
  applyUrl: z.string().nullable(),
  fields: z.array(z.object({
    field: z.enum(FIELD_NAMES),
    value: z.number(),
    evidence: z.string(),
    sourceUrl: z.string()
  })),
  notes: z.string()
});

// Dominio oficial de la entidad a partir de sus URLs conocidas.
// nu.com.co → nu.com.co · preapproval.addi.com → addi.com · www.bancolombia.com → bancolombia.com
const SECOND_LEVEL = new Set(['com.co', 'net.co', 'org.co', 'gov.co', 'edu.co', 'com.mx', 'com.br']);
export const baseDomain = (url) => {
  try {
    const parts = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, '').split('.');
    const keep = SECOND_LEVEL.has(parts.slice(-2).join('.')) ? 3 : 2;
    return parts.slice(-keep).join('.');
  } catch { return null; }
};

export const isOnDomain = (url, domains) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return domains.some(d => host === d || host.endsWith('.' + d));
  } catch { return false; }
};

// Mes vencido → efectivo anual (conversión estándar, no se inventa nada).
export const monthlyToEA = (m) => Math.round(((1 + m / 100) ** 12 - 1) * 10000) / 100;

// Ruta en el JSON de cada campo, por tipo de producto. null = solo se reporta, no se aplica.
export const FIELD_PATHS = {
  card: {
    interestRateEA: ['rates', 'interestRateEA'],
    monthlyFee: ['fees', 'monthlyFee'],
    annualFee: ['fees', 'annualFee'],
    minIncomeMillions: ['requirements', 'minIncomeMillions'],
    cashbackPercent: ['rewards', 'cashbackPercent']
  },
  credit: {
    interestRateEAMin: ['loanDetails', 'interestRateEA', 'min'],
    interestRateEAMax: ['loanDetails', 'interestRateEA', 'max'],
    minAmountMillions: ['loanDetails', 'minAmountMillions'],
    maxAmountMillions: ['loanDetails', 'maxAmountMillions']
  }
};

// Campo que tiene que salir verificado para dar el producto por revisado.
export const KEY_FIELDS = {
  card: ['interestRateEA'],
  credit: ['interestRateEAMax', 'interestRateEAMin']
};

export const getPath = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
export const setPath = (obj, path, value) => {
  let o = obj;
  for (const k of path.slice(0, -1)) o = (o[k] ??= {});
  o[path.at(-1)] = value;
};

export const SYSTEM_PROMPT = `Eres un verificador de datos de productos financieros en Colombia para Banqueando, un comparador que recomienda tarjetas de crédito y créditos.

Por cada producto recibes lo que tenemos guardado y el dominio oficial de la entidad. Tu trabajo es encontrar en el sitio oficial los datos vigentes y devolverlos con evidencia.

Cómo buscar:
- Usa web_search y web_fetch solo dentro del dominio oficial que te indican. Las búsquedas útiles suelen ser "<producto> tasa", "tasas y tarifas", "tarifario", "cuota de manejo".
- Muchas entidades publican un tarifario o una página de "tasas y tarifas" (a veces en PDF). Prefiérela sobre la publicidad.
- Haz pocas búsquedas: cuando tengas los datos, termina.

Reglas de los datos (son estrictas):
- Reporta un campo solo si el dato aparece escrito en una página oficial. Nunca estimes, promedies ni completes con conocimiento previo.
- "evidence" es la frase textual de la página, copiada tal cual (máximo 200 caracteres). "sourceUrl" es la URL exacta donde aparece.
- Porcentajes como número: 28.5 para 28,5%. Tasas en efectivo anual (EA). Si la página solo da la tasa mes vencido (MV), repórtala en interestRateMonthly y no conviertas.
- Si la tasa es un rango ("desde X% hasta Y%"), usa interestRateEAMin e interestRateEAMax; si es una sola, interestRateEA (en créditos con tasa única, repórtala en ambos: mínimo y máximo).
- Cuotas de manejo en pesos (19900 para $19.900). Ingreso mínimo y montos de crédito en millones de pesos (1.3 para $1.300.000).
- Si la cuota de manejo es $0 escrito explícitamente, repórtala como 0.
- Si una tasa o un monto no aparece, omite ese campo. Es mejor omitir que adivinar.
- stillOffered: "si" si el sitio lo ofrece hoy, "no" si dice que se descontinuó o no existe, "no_claro" si no lo encontraste.
- officialPageUrl: la página oficial del producto. applyUrl: la página donde se solicita, si existe.
- notes: en una o dos frases, qué encontraste y cualquier condición importante (por ejemplo, "la cuota es $0 solo si se usa una vez al mes"). Si la página muestra fecha de vigencia de las tasas, inclúyela.`;

export const productPrompt = (p, kind, domains) => {
  const current = Object.fromEntries(
    Object.entries(FIELD_PATHS[kind]).map(([f, path]) => [f, getPath(p, path) ?? null])
  );
  return [
    `Tipo: ${kind === 'card' ? 'tarjeta de crédito' : 'crédito'}${p.productType ? ` (${p.productType})` : ''}`,
    `Producto: ${p.name}`,
    `Entidad: ${p.entity || p.bank || p.provider}`,
    `Dominio oficial (busca solo aquí): ${domains.join(', ')}`,
    `URLs que tenemos: ${[p.source?.url, p.applyUrl, p.moreInfoUrl].filter(Boolean).join(' · ') || 'ninguna'}`,
    `Datos guardados hoy (pueden estar desactualizados): ${JSON.stringify(current)}`,
    '',
    'Verifica estos datos en el sitio oficial y devuelve el resultado.'
  ].join('\n');
};
