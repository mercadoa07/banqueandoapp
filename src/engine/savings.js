import { SAVINGS_CONFIG } from '../constants/legal.js';

// Desglose del ahorro anual estimado de una tarjeta (modal "¿de dónde sale el ahorro?").
export const calculateSavingsBreakdown = (card, monthlySpend = 1500000) => {
  const breakdown = [];
  const cardFee = card.fees?.monthlyFee || 0;
  const feeSavings = (SAVINGS_CONFIG.averageMonthlyFee - cardFee) * 12;
  if (feeSavings > 0) breakdown.push({ concept: `Cuota de manejo ($0 vs promedio $${SAVINGS_CONFIG.averageMonthlyFee.toLocaleString()}/mes)`, amount: feeSavings });
  if (card.rewards?.cashbackPercent) breakdown.push({ concept: `Cashback (${card.rewards.cashbackPercent}% de tu gasto)`, amount: Math.round(monthlySpend * (card.rewards.cashbackPercent / 100) * 12) });
  if (card.rewards?.milesPerCOP) {
    const milesPerYear = (monthlySpend / card.rewards.milesPerCOP) * 12;
    const mileValue = SAVINGS_CONFIG.mileValues[card.rewards.mileProgram] || SAVINGS_CONFIG.mileValues.generic;
    breakdown.push({ concept: `Millas (${Math.round(milesPerYear).toLocaleString()} millas/año)`, amount: Math.round(milesPerYear * mileValue * SAVINGS_CONFIG.trm) });
  }
  return breakdown;
};
