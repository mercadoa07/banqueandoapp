// "Perfiles dorados": fijan lo que recomienda el motor para perfiles típicos.
// Si un cambio de código o de datos mueve el top 3, el snapshot falla y el cambio se ve en el PR.
// Para aceptar un cambio intencional: npx vitest run -u (y revisar el diff del snapshot).
import { describe, it, expect } from 'vitest';
import cardsData from '../../config/cards.json';
import creditData from '../../config/creditProducts.json';
import { createMatchingEngine, createCreditMatchingEngine } from './matchingEngine.js';

const cards = createMatchingEngine(cardsData, {});
const credit = createCreditMatchingEngine(creditData, {});

const summarize = (r) => ({
  top: [r.topMatch, ...r.alternatives].filter(Boolean).map(p => ({
    id: p.id,
    score: p.score,
    reasons: p.whyWinner || p.whyConsider || [],
    ...(p.personalizedSavings !== undefined && { savings: p.personalizedSavings })
  })),
  eligible: r.allResults.length
});

const CARD_PROFILES = {
  'primera tarjeta, ingreso bajo, sin cuota': { product_selection: 'nueva_tarjeta', income: '0-2', credit_history: 'none', payment_behavior: 'full', fee_sensitivity: 'no_fee', digital_preference: 'digital', interests: ['technology'], monthly_spend: 800000 },
  'viajero frecuente, ingreso alto': { product_selection: 'nueva_tarjeta', income: '10+', payment_behavior: 'full', fee_sensitivity: 'value_benefits', interests: ['travel'], travel_frequency: 'frequent', monthly_spend: 6000000 },
  'financia compras, ingreso medio': { product_selection: 'nueva_tarjeta', income: '4-6', payment_behavior: 'finance', fee_sensitivity: 'low_fee', interests: ['shopping'], monthly_spend: 2500000 },
  'cambiar tarjeta de Bancolombia por cuota alta': { product_selection: 'cambiar_tarjeta', income: '2-4', current_card_bank: 'bancolombia', current_card_pain: ['cuota_alta', 'app_mala'], payment_behavior: 'sometimes', fee_sensitivity: 'no_fee' },
  'reportado en centrales': { product_selection: 'nueva_tarjeta', income: '2-4', credit_history: 'reported', payment_behavior: 'full' },
  'sin responder ingreso': { product_selection: 'nueva_tarjeta', income: 'skip', payment_behavior: 'full', fee_sensitivity: 'no_fee' }
};

const CREDIT_PROFILES = {
  'emergencia personal, urgente, independiente': { product_selection: 'necesito_credito', credit_destination: 'personal', loan_purpose: ['emergencia_personal'], loan_amount: '1-5M', loan_urgency: 'inmediato', employment_status: 'independiente', priority_preference: 'prioridad_velocidad', process_preference: 'proceso_digital' },
  'consolidar deuda, busca tasa': { product_selection: 'necesito_credito', credit_destination: 'personal', loan_purpose: ['consolidar_deuda'], loan_amount: '10-30M', loan_urgency: 'normal', employment_status: 'empleado', priority_preference: 'prioridad_tasa' },
  'reportado, monto pequeño': { product_selection: 'necesito_credito', credit_destination: 'personal', loan_purpose: ['emergencia_personal'], loan_amount: '0-1M', loan_urgency: 'urgente', credit_history: 'historial_reportado' },
  'pyme formal, capital de trabajo': { product_selection: 'necesito_credito', credit_destination: 'negocio', loan_purpose: ['capital_trabajo'], loan_amount: '50-100M', loan_urgency: 'normal', business_formalization: 'formal', priority_preference: 'prioridad_balance' },
  'micronegocio informal, inventario': { product_selection: 'necesito_credito', credit_destination: 'negocio', loan_purpose: ['inventario'], loan_amount: '1-5M', loan_urgency: 'urgente', business_formalization: 'informal', credit_history: 'sin_historial' },
  'cliente Bold': { product_selection: 'necesito_credito', credit_destination: 'negocio', loan_purpose: ['capital_trabajo'], loan_amount: '5-10M', entity_relationships: ['rel_bold'], business_formalization: 'formal' }
};

describe('motor de tarjetas — perfiles dorados', () => {
  for (const [name, answers] of Object.entries(CARD_PROFILES)) {
    it(name, () => expect(summarize(cards.getTopResults(answers))).toMatchSnapshot());
  }
});

describe('motor de crédito — perfiles dorados', () => {
  for (const [name, answers] of Object.entries(CREDIT_PROFILES)) {
    it(name, () => expect(summarize(credit.getTopResults(answers))).toMatchSnapshot());
  }
});

describe('reglas del motor', () => {
  it('no recomienda productos inactivos', () => {
    const inactive = new Set([...cardsData.cards, ...creditData.creditProducts].filter(p => p.active === false).map(p => p.id));
    expect(inactive.size).toBeGreaterThan(0);
    for (const answers of Object.values(CREDIT_PROFILES)) {
      credit.getTopResults(answers).allResults.forEach(p => expect(inactive.has(p.id)).toBe(false));
    }
  });

  it('filtra tarjetas por ingreso mínimo (en millones)', () => {
    const low = cards.getTopResults({ income: '0-2' }).allResults;
    low.forEach(c => expect(c.requirements.minIncomeMillions).toBeLessThanOrEqual(2));
    expect(cards.getTopResults({ income: '10+' }).allResults.length).toBeGreaterThan(low.length);
  });

  it('al cambiar de tarjeta excluye el banco actual', () => {
    const r = cards.getTopResults({ product_selection: 'cambiar_tarjeta', current_card_bank: 'bancolombia' });
    r.allResults.forEach(c => expect(c.bank.toLowerCase()).not.toContain('bancolombia'));
  });

  it('sin relación con Bold no recomienda productos que la exigen', () => {
    const r = credit.getTopResults({ credit_destination: 'negocio' });
    r.allResults.forEach(p => expect(p.requirements?.requiresBold || p.requirements?.requiresBoldDatafono).toBeFalsy());
  });

  it('los puntajes quedan entre 0 y 100', () => {
    for (const a of Object.values(CARD_PROFILES)) cards.getTopResults(a).allResults.forEach(c => { expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100); });
    for (const a of Object.values(CREDIT_PROFILES)) credit.getTopResults(a).allResults.forEach(c => { expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100); });
  });
});
