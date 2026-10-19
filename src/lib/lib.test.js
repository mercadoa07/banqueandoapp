import { describe, it, expect } from 'vitest';
import { normalizePhone, isValidEmail } from './validation.js';
import { getVisibleQuestions } from './questions.js';
import { getEntityName, createSessionId } from './supabase.js';
import { calculateSavingsBreakdown } from '../engine/savings.js';

describe('normalizePhone', () => {
  it.each([
    ['3001234567', '3001234567'],
    ['300 123 4567', '3001234567'],
    ['+57 300-123-4567', '3001234567'],
    ['573001234567', '3001234567']
  ])('acepta %s', (input, expected) => expect(normalizePhone(input)).toBe(expected));

  it.each(['', '12345', '6011234567', '30012345678', '+1 300 123 4567', null])('rechaza %s', (input) => expect(normalizePhone(input)).toBeNull());
});

describe('isValidEmail', () => {
  it('acepta emails con espacios alrededor', () => expect(isValidEmail('  a@b.co ')).toBe(true));
  it.each(['', 'a@b', 'sin-arroba.com', 'a b@c.co'])('rechaza %s', (e) => expect(isValidEmail(e)).toBe(false));
});

describe('getVisibleQuestions', () => {
  const data = { questions: { cards: [
    { id: 'a' },
    { id: 'b', showIf: { field: 'a', equals: 'si' } },
    { id: 'c', showIf: { field: 'a', notEquals: 'si' } },
    { id: 'd', showIf: { field: 'm', includes: 'x' } }
  ] } };
  const ids = (answers) => getVisibleQuestions(data, 'cards', answers).map(q => q.id);

  it('sin vertical no hay preguntas', () => expect(getVisibleQuestions(data, null, {})).toEqual([]));
  it('aplica equals / notEquals', () => {
    expect(ids({ a: 'si' })).toEqual(['a', 'b']);
    expect(ids({ a: 'no' })).toEqual(['a', 'c']);
  });
  it('aplica includes sobre respuestas múltiples', () => expect(ids({ a: 'si', m: ['x', 'y'] })).toEqual(['a', 'b', 'd']));
});

describe('getEntityName', () => {
  it('prefiere entity, luego bank, luego provider', () => {
    expect(getEntityName({ entity: 'E', bank: 'B', provider: 'P' })).toBe('E');
    expect(getEntityName({ bank: 'B', provider: 'P' })).toBe('B');
    expect(getEntityName({ provider: 'P' })).toBe('P');
    expect(getEntityName(null)).toBeNull();
  });
});

describe('createSessionId', () => {
  it('genera UUIDs distintos', () => {
    const a = createSessionId(), b = createSessionId();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(a).not.toBe(b);
  });
});

describe('calculateSavingsBreakdown', () => {
  it('suma ahorro de cuota y cashback', () => {
    const b = calculateSavingsBreakdown({ fees: { monthlyFee: 0 }, rewards: { cashbackPercent: 1 } }, 1000000);
    expect(b.map(x => x.amount)).toEqual([300000, 120000]);
  });
  it('sin ahorro de cuota si la tarjeta cobra más que el promedio', () => {
    expect(calculateSavingsBreakdown({ fees: { monthlyFee: 40000 }, rewards: {} })).toEqual([]);
  });
});
