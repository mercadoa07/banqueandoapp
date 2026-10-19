import { describe, it, expect } from 'vitest';
import { monthlyPayment, monthlyRateFromEA, estimateLoan, paymentCapacity, approvalLikelihood, cardAnnualBreakdown, annualFeeCost, switchSavings } from './finance.js';

describe('monthlyPayment (cuota fija)', () => {
  it('sin interés es capital / meses', () => expect(monthlyPayment(1200000, 0, 12)).toBe(100000));
  it('12% EA ≈ 0,9489% mensual', () => expect(monthlyRateFromEA(12)).toBeCloseTo(0.009489, 5));
  it('$10M a 24% EA en 12 meses ≈ $934.500', () => {
    // A mano: i = 1,24^(1/12) − 1 = 1,8088%; (1+i)^−12 = 1/1,24; cuota = 10M × 0,018088 / 0,193548 ≈ 934.535
    expect(Math.round(monthlyPayment(10e6, 24, 12))).toBeGreaterThan(934000);
    expect(Math.round(monthlyPayment(10e6, 24, 12))).toBeLessThan(935000);
  });
});

describe('estimateLoan', () => {
  const product = { loanDetails: { minAmountMillions: 1, maxAmountMillions: 5, interestRateEA: { min: 20, max: 28 } } };
  it('usa el punto medio del monto pedido y el plazo elegido', () => {
    const e = estimateLoan(product, { loan_amount: '1-5M', desired_term: 'plazo_medio' });
    expect(e.principal).toBe(3e6);
    expect(e.months).toBe(12);
    expect(e.paymentLow).toBeLessThan(e.paymentHigh);
    expect(e.totalInterestHigh).toBe(e.paymentHigh * 12 - 3e6);
  });
  it('si pide más de lo que presta, calcula con el máximo y lo avisa', () => {
    const e = estimateLoan(product, { loan_amount: '10-30M' });
    expect(e.principal).toBe(5e6);
    expect(e.cappedToMax).toBe(true);
  });
  it('sin monto pedido no estima', () => expect(estimateLoan(product, {})).toBeNull());
});

describe('paymentCapacity', () => {
  it('personal: 40% del ingreso menos deudas actuales', () => {
    expect(paymentCapacity({ credit_destination: 'personal', monthly_income_personal: 'ingreso_3-5M' })).toBe(1600000);
    expect(paymentCapacity({ credit_destination: 'personal', monthly_income_personal: 'ingreso_3-5M', monthly_debt_payment: 1000000 })).toBe(600000);
  });
  it('negocio: 15% de las ventas menos deudas', () => {
    expect(paymentCapacity({ credit_destination: 'negocio', business_monthly_sales: 'ventas_5-15M' })).toBe(1500000);
  });
  it('nunca negativa', () => expect(paymentCapacity({ monthly_income_personal: 'ingreso_0-1.5M', monthly_debt_payment: 5e6 })).toBe(0));
  it('sin datos de ingreso no juzga', () => expect(paymentCapacity({ credit_destination: 'personal' })).toBeNull());
});

describe('approvalLikelihood', () => {
  const lenient = { requirements: { acceptsReported: true, acceptsNoHistory: true, acceptsInformal: true } };
  const strict = { requirements: { acceptsReported: false, acceptsNoHistory: false, acceptsInformal: false } };
  it('buen historial → alta', () => expect(approvalLikelihood(strict, { credit_history: 'historial_bueno' })).toBe('alta'));
  it('reportado → media si lo acepta, baja si no', () => {
    expect(approvalLikelihood(lenient, { credit_history: 'historial_reportado' })).toBe('media');
    expect(approvalLikelihood(strict, { credit_history: 'historial_reportado' })).toBe('baja');
  });
  it('informal en producto que no acepta informales baja un nivel', () => {
    expect(approvalLikelihood(strict, { credit_history: 'historial_excelente', business_formalization: 'informal' })).toBe('media');
  });
});

describe('cardAnnualBreakdown (beneficio neto)', () => {
  it('cashback menos cuota de manejo', () => {
    const b = cardAnnualBreakdown({ fees: { monthlyFee: 10000, annualFee: 0 }, rewards: { cashbackPercent: 1 } }, 1e6);
    expect(b.items.map(x => x.amount)).toEqual([120000, -120000]);
    expect(b.total).toBe(0);
  });
  it('sin cuota ni beneficios es 0 (antes sumaba $300.000 de "ahorro" ficticio)', () => {
    expect(cardAnnualBreakdown({ fees: { monthlyFee: 0, annualFee: 0 }, rewards: {} }, 1e6).total).toBe(0);
  });
  it('valora millas y puede quedar negativo', () => {
    const b = cardAnnualBreakdown({ fees: { monthlyFee: 30000, annualFee: 360000 }, rewards: { milesPerMillionCOP: 1000, mileProgram: 'LifeMiles' } }, 1e6);
    expect(b.items[0].amount).toBe(456000); // 12.000 millas × US$0,01 × 3.800
    expect(b.total).toBe(456000 - 360000);
  });
  it('annualFee ya es el total del año; si no viene, mensual × 12', () => {
    expect(annualFeeCost({ fees: { monthlyFee: 30000, annualFee: 360000 } })).toBe(360000);
    expect(annualFeeCost({ fees: { monthlyFee: 18500, annualFee: 0 } })).toBe(222000);
  });
});

describe('intereses por financiar y ahorro frente a la tarjeta actual', () => {
  const card = { fees: { monthlyFee: 0, annualFee: 0 }, rates: { interestRateEA: 28 }, rewards: { cashbackPercent: 1 } };
  it('quien paga el total no paga intereses', () => {
    expect(cardAnnualBreakdown(card, 1e6, { paymentBehavior: 'full' }).interestCost).toBe(0);
  });
  it('quien financia paga saldo promedio × tasa EA', () => {
    // casi siempre financia: 1,5 meses de gasto (1,5M) × 28% = 420.000 al año
    const b = cardAnnualBreakdown(card, 1e6, { paymentBehavior: 'finance' });
    expect(b.interestCost).toBe(420000);
    expect(b.total).toBe(120000 - 420000);
  });
  it('ahorro en cuota al cambiarse, según lo que paga hoy', () => {
    expect(switchSavings({ fees: { monthlyFee: 0, annualFee: 0 } }, 'fee_15_25k')).toBe(240000);
    expect(switchSavings({ fees: { monthlyFee: 30000, annualFee: 360000 } }, 'fee_15_25k')).toBe(-120000);
    expect(switchSavings({ fees: { monthlyFee: 0 } }, 'fee_unknown')).toBeNull();
    expect(switchSavings({ fees: { monthlyFee: 0 } }, undefined)).toBeNull();
  });
});
