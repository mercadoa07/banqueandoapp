// La página de inicio muestra cifras fijas para no cargar cards.json. Esta prueba las ata a los datos:
// si cambia una tarifa o se verifica/desactiva una tarjeta, falla y hay que actualizar landing.js.
import { describe, it, expect } from 'vitest';
import cardsData from '../../config/cards.json';
import creditData from '../../config/creditProducts.json';
import { cardAnnualBreakdown } from '../engine/finance.js';
import { HERO_EXAMPLE as ex, CARD_COUNTS, FEATURED_ENTITIES } from './landing.js';

const activeCards = cardsData.cards.filter(c => c.active !== false);
const activeCredit = creditData.creditProducts.filter(p => p.active !== false);

describe('cifras de la página de inicio', () => {
  it('el resultado de ejemplo coincide con la tarjeta y el cálculo real', () => {
    const card = activeCards.find(c => c.id === ex.cardId);
    expect(card, 'la tarjeta del ejemplo debe estar activa').toBeTruthy();
    expect(card.name).toBe(ex.name);
    expect(card.entity).toBe(ex.entity);
    expect(card.network.toUpperCase()).toBe(ex.network);
    expect(card.lastVerified).toBe(ex.verified);
    expect(card.rates.interestRateEA).toBe(ex.rateEA);
    expect(card.requirements.minIncomeMillions).toBe(ex.minIncomeMillions);
    expect(card.features.loungeVisits).toBe(ex.loungeVisits);

    const b = cardAnnualBreakdown(card, ex.monthlySpend, { paymentBehavior: 'full' });
    expect(b.total).toBe(ex.net);
    expect(b.feeCost).toBe(ex.annualFee);
    expect(b.interestCost).toBe(0);
    expect(b.items.find(i => i.amount > 0).amount).toBe(ex.milesValue);
    expect(Math.round(ex.monthlySpend * 12 / 1e6 * card.rewards.milesPerMillionCOP)).toBe(ex.miles);
  });

  it('el conteo de tarjetas verificadas es el real', () => {
    expect(CARD_COUNTS.active).toBe(activeCards.length);
    expect(CARD_COUNTS.verified).toBe(activeCards.filter(c => c.lastVerified).length);
  });

  it('cada entidad de la franja tiene al menos un producto activo', () => {
    const haystack = [...activeCards, ...activeCredit]
      .map(p => [p.entity, p.bank, p.provider, p.name].filter(Boolean).join(' ').toLowerCase());
    for (const e of FEATURED_ENTITIES) {
      expect(haystack.some(h => h.includes(e.toLowerCase())), e).toBe(true);
    }
  });
});
