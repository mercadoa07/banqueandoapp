// Cálculos financieros del motor (Fase 3). Funciones puras, sin dependencias de React ni de los datos.
import { SAVINGS_CONFIG } from '../constants/legal.js';

// --- Respuestas del quiz → números ---

// Punto medio de cada rango de monto solicitado, en millones de pesos.
export const LOAN_AMOUNT_MILLIONS = {
  '0-1M': 0.5, '1-5M': 3, '5-10M': 7.5, '10-30M': 20,
  '30-50M': 40, '50-100M': 75, '100-200M': 150, '200M+': 300
};

// Plazo deseado → meses (punto medio del rango que muestra la pregunta).
export const TERM_MONTHS = {
  plazo_corto: 6, plazo_medio: 12, plazo_largo: 18, plazo_maximo: 36, plazo_flexible: 12
};
export const DEFAULT_TERM_MONTHS = 12;

// Ingreso mensual (pesos, punto medio del rango).
const INCOME_MID = {
  'ingreso_0': 0, 'ingreso_0-1.5M': 1200000, 'ingreso_1.5-3M': 2250000, 'ingreso_3-5M': 4000000,
  'ingreso_5-10M': 7500000, 'ingreso_10M+': 12000000
};
// Ventas mensuales del negocio (pesos, punto medio del rango).
const SALES_MID = {
  'ventas_0-5M': 3000000, 'ventas_5-15M': 10000000, 'ventas_15-30M': 22500000,
  'ventas_30-50M': 40000000, 'ventas_50-100M': 75000000, 'ventas_100M+': 120000000
};

// Regla de prudencia: el total de cuotas de deuda no debería pasar de este % del ingreso.
export const MAX_DEBT_TO_INCOME = 0.4;
// En negocios, la cuota se compara contra las ventas (no contra la utilidad, que no preguntamos).
export const MAX_DEBT_TO_SALES = 0.15;

/**
 * Cuánto podría pagar al mes en una cuota nueva, según lo que respondió.
 * Devuelve null si no hay datos de ingreso (no se puede juzgar).
 */
export function paymentCapacity(answers) {
  const debt = Number(answers.monthly_debt_payment) || 0;
  if (answers.credit_destination === 'negocio') {
    const sales = SALES_MID[answers.business_monthly_sales];
    return sales === undefined ? null : Math.max(sales * MAX_DEBT_TO_SALES - debt, 0);
  }
  const income = INCOME_MID[answers.monthly_income_personal] ?? INCOME_MID[answers.monthly_income_startup];
  return income === undefined ? null : Math.max(income * MAX_DEBT_TO_INCOME - debt, 0);
}

// --- Crédito: cuota y costo ---

// Tasa efectiva anual (%) → tasa mensual equivalente (fracción).
export const monthlyRateFromEA = (eaPercent) => (1 + eaPercent / 100) ** (1 / 12) - 1;

// Cuota fija mensual (sistema francés). principal en pesos, tasa EA en %, plazo en meses.
export function monthlyPayment(principal, eaPercent, months) {
  if (!principal || !months) return 0;
  const i = monthlyRateFromEA(eaPercent || 0);
  if (i === 0) return principal / months;
  return (principal * i) / (1 - (1 + i) ** -months);
}

/**
 * Cuota estimada de un crédito para lo que pidió la persona.
 * Si pide más de lo que presta el producto, se calcula con el máximo del producto (y se avisa).
 */
export function estimateLoan(product, answers) {
  const ld = product.loanDetails || {};
  const requestedM = LOAN_AMOUNT_MILLIONS[answers.loan_amount];
  if (!requestedM) return null;
  const maxM = ld.maxAmountMillions || requestedM;
  const minM = ld.minAmountMillions || 0;
  const amountM = Math.min(Math.max(requestedM, minM), maxM);
  const principal = amountM * 1e6;
  const months = TERM_MONTHS[answers.desired_term] || DEFAULT_TERM_MONTHS;
  const rateMin = ld.interestRateEA?.min ?? 0;
  const rateMax = ld.interestRateEA?.max ?? rateMin;
  const paymentLow = monthlyPayment(principal, rateMin, months);
  const paymentHigh = monthlyPayment(principal, rateMax, months);
  return {
    principal,
    months,
    rateMin,
    rateMax,
    paymentLow: Math.round(paymentLow),
    paymentHigh: Math.round(paymentHigh),
    totalInterestHigh: Math.round(paymentHigh) * months - principal,
    cappedToMax: requestedM > maxM,
    raisedToMin: requestedM < minM
  };
}

// --- Probabilidad de aprobación ---

const LEVELS = ['baja', 'media', 'alta'];
const down = (level) => LEVELS[Math.max(LEVELS.indexOf(level) - 1, 0)];

/**
 * Qué tan probable es que la entidad apruebe, según historial, formalidad y lo que el producto acepta.
 * Es una orientación, no una promesa: cada entidad hace su propio estudio.
 */
export function approvalLikelihood(product, answers) {
  const req = product.requirements || {};
  const history = answers.credit_history;
  let level;
  if (history === 'historial_reportado') level = req.acceptsReported ? 'media' : 'baja';
  else if (history === 'sin_historial' || history === 'historial_desconocido') level = req.acceptsNoHistory ? 'media' : 'baja';
  else if (history === 'historial_regular') level = 'media';
  else if (history === 'historial_excelente' || history === 'historial_bueno') level = 'alta';
  else level = 'media';

  const informal = answers.business_formalization === 'informal' || answers.employment_status === 'independiente';
  if (informal && !req.acceptsInformal) level = down(level);
  if (answers.employment_status === 'desempleado' || answers.other_income_source === 'sin_ingresos') level = down(level);
  return level;
}

// --- Tarjetas: beneficio neto anual ---

const mileValueCOP = (program) => {
  const key = (program || '').toLowerCase().includes('lifemiles') ? 'lifemiles'
    : (program || '').toLowerCase().includes('latam') ? 'latam' : 'generic';
  return SAVINGS_CONFIG.mileValues[key] * SAVINGS_CONFIG.trm;
};

// Costo anual de la cuota de manejo (sin exoneración). annualFee ya es el total del año cuando viene.
export const annualFeeCost = (card) => card.fees?.annualFee || (card.fees?.monthlyFee || 0) * 12;

/**
 * Lo que la tarjeta le devuelve en el año (cashback + millas) menos lo que cuesta su cuota de manejo.
 * Puede ser negativo. Antes se comparaba contra una cuota "promedio" de $25.000 que la persona quizá no paga.
 */
export function cardAnnualBreakdown(card, monthlySpend = SAVINGS_CONFIG.defaultMonthlySpend) {
  const items = [];
  const yearlySpend = monthlySpend * 12;
  const cashback = card.rewards?.cashbackPercent;
  if (cashback) items.push({ concept: `Cashback (${cashback}% de tu gasto)`, amount: Math.round(yearlySpend * cashback / 100) });
  const milesPerMillion = card.rewards?.milesPerMillionCOP;
  if (milesPerMillion) {
    const miles = (yearlySpend / 1e6) * milesPerMillion;
    items.push({ concept: `Millas ${card.rewards.mileProgram || ''} (${Math.round(miles).toLocaleString('es-CO')} al año)`.replace('  ', ' '), amount: Math.round(miles * mileValueCOP(card.rewards.mileProgram)) });
  }
  const fee = annualFeeCost(card);
  if (fee > 0) items.push({ concept: `Cuota de manejo ($${(card.fees.monthlyFee || Math.round(fee / 12)).toLocaleString('es-CO')}/mes × 12)`, amount: -fee });
  const total = items.reduce((s, x) => s + x.amount, 0);
  return { items, total, feeCost: fee };
}
