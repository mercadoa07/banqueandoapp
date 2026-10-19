// "Perfiles dorados": fijan lo que recomienda el motor para perfiles típicos.
// Si un cambio de código o de datos mueve el top 3, el snapshot falla y el cambio se ve en el PR.
// Para aceptar un cambio intencional: npx vitest run -u (y revisar el diff del snapshot).
import { describe, it, expect } from 'vitest';
import cardsData from '../../config/cards.json';
import creditData from '../../config/creditProducts.json';
import { createMatchingEngine, createCreditMatchingEngine } from './matchingEngine.js';
import { CARD_PROFILES, CREDIT_PROFILES } from './goldenProfiles.js';

const cards = createMatchingEngine(cardsData, {});
const credit = createCreditMatchingEngine(creditData, {});

const summarize = (r) => ({
  top: [r.topMatch, ...r.alternatives].filter(Boolean).map(p => ({
    id: p.id,
    score: p.score,
    reasons: p.whyWinner || p.whyConsider || [],
    ...(p.personalizedSavings !== undefined && { savings: p.personalizedSavings }),
    ...(p.pickLabel && { pick: p.pickLabel, approval: p.approval, affordability: p.affordability, payment: p.loanEstimate && [p.loanEstimate.paymentLow, p.loanEstimate.paymentHigh] })
  })),
  eligible: r.allResults.length
});

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

  it('si la cuota supera la capacidad de pago, lo advierte y no lo pone como mejor opción si hay alternativas', () => {
    const r = credit.getTopResults(CREDIT_PROFILES['pide más de lo que puede pagar']);
    const excede = r.allResults.filter(p => p.affordability === 'excede');
    expect(excede.length).toBeGreaterThan(0);
    excede.forEach(p => expect(p.warnings).toContain('La cuota estimada supera lo que podrías pagar al mes'));
    if (r.allResults.some(p => p.affordability !== 'excede')) expect(r.topMatch.affordability).not.toBe('excede');
  });

  it('el top 3 de crédito es variado y cada alternativa dice por qué está', () => {
    for (const a of Object.values(CREDIT_PROFILES)) {
      const r = credit.getTopResults(a);
      const ids = [r.topMatch, ...r.alternatives].map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
      r.alternatives.forEach(p => expect(p.whyConsider[0]).toBe(p.pickLabel));
      // "Menor costo" nunca es un producto que presta menos de lo pedido, si había otros que sí prestaban todo.
      const cheap = r.alternatives.find(p => p.pickLabel === 'Menor costo');
      if (cheap && r.allResults.slice(1, 11).some(p => !p.loanEstimate?.cappedToMax && p.id !== r.topMatch.id)) expect(cheap.loanEstimate?.cappedToMax).toBeFalsy();
    }
  });

  it('el beneficio neto de las tarjetas descuenta la cuota de manejo', () => {
    const r = cards.getTopResults({ income: '10+', monthly_spend: 1000000 });
    r.allResults.filter(c => !c.rewards?.cashbackPercent && !c.rewards?.milesPerMillionCOP && (c.fees.monthlyFee || c.fees.annualFee))
      .forEach(c => expect(c.personalizedSavings).toBeLessThan(0));
  });

  it('los puntajes quedan entre 0 y 100', () => {
    for (const a of Object.values(CARD_PROFILES)) cards.getTopResults(a).allResults.forEach(c => { expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100); });
    for (const a of Object.values(CREDIT_PROFILES)) credit.getTopResults(a).allResults.forEach(c => { expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100); });
  });
});
