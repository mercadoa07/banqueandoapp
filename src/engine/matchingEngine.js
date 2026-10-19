/**
 * BANQUEANDO - MATCHING ENGINE v5.0 (MULTI-VERTICAL)
 * Soporta: Tarjetas (cards) y Crédito Unificado (credit)
 * v5: beneficio neto real en tarjetas; cuota, capacidad de pago, probabilidad
 *     de aprobación y top 3 variado en créditos.
 */
import { annualFeeCost, cardAnnualBreakdown, estimateLoan, paymentCapacity, approvalLikelihood } from './finance.js';

export const ENGINE_VERSION = '5.0';

// ============================================
// CARDS MATCHING ENGINE
// ============================================
export class MatchingEngine {
  constructor(cards, config) {
    this.cards = cards;
    this.config = config;
    this.debug = false;
  }

  calculateMatches(answers) {
    const eligibleCards = this.filterByEligibility(answers);
    const scoredCards = eligibleCards.map(card => {
      const scoreResult = this.calculateCardScore(card, answers);
      const benefits = this.extractBenefits(card, answers);
      
      return {
        ...card,
        score: Math.min(Math.max(scoreResult.score, 0), 100),
        matchReasons: scoreResult.reasons,
        benefits: benefits,
        cons: card.cons || [],
        ...this.calculateSavings(card, answers)
      };
    });

    const sortedCards = scoredCards.sort((a, b) => b.score - a.score);
    const topCards = sortedCards.slice(0, 3);
    const cardsWithComparison = this.generateComparativeReasons(topCards, answers);

    return {
      topMatch: cardsWithComparison[0],
      alternatives: cardsWithComparison.slice(1, 3),
      allResults: sortedCards
    };
  }

  getTopResults(answers) {
    return this.calculateMatches(answers);
  }

  filterByEligibility(answers) {
    return this.cards.filter(card => {
      if (!this.checkIncomeEligibility(card, answers)) return false;
      
      if (answers.product_selection === 'cambiar_tarjeta' && answers.current_card_bank) {
        const cardBank = (card.bank || '').toLowerCase();
        if (cardBank.includes(answers.current_card_bank)) return false;
      }
      
      if (answers.credit_history === 'reported' && !card.requirements?.acceptsReported) {
        return false;
      }
      
      return true;
    });
  }

  checkIncomeEligibility(card, answers) {
    if (answers.income === 'skip' || !answers.income) return true;
    
    const incomeRanges = {
      '0-2': 2000000, '2-4': 4000000, '4-6': 6000000, 
      '6-10': 10000000, '10+': 999999999
    };
    
    const userMaxIncome = incomeRanges[answers.income] || 999999999;
    // Los datos guardan el ingreso mínimo en millones (minIncomeMillions).
    const cardMinIncome = (card.requirements?.minIncomeMillions || 0) * 1000000;
    
    return userMaxIncome >= cardMinIncome;
  }

  calculateCardScore(card, answers) {
    let score = 40;
    const reasons = [];
    
    if (answers.payment_behavior) {
      const paymentMatch = card.matchFactors?.paymentBehavior || [];
      if (paymentMatch.includes(answers.payment_behavior)) {
        score += 25;
        reasons.push(answers.payment_behavior === 'full' 
          ? 'Optimizada para pago total' 
          : 'Buena tasa para financiar');
      }
    }
    
    // Cuota de manejo real: la anual o la mensual × 12 (antes solo miraba la anual y premiaba tarjetas que sí cobran).
    if (answers.fee_sensitivity === 'no_fee' && annualFeeCost(card) === 0) {
      score += 20;
      reasons.push('Sin cuota de manejo');
    }
    
    if (answers.digital_preference) {
      const digitalMatch = card.matchFactors?.digitalPreference || [];
      if (digitalMatch.includes(answers.digital_preference)) {
        score += 15;
      }
    }
    
    if (answers.interests?.length) {
      const interestMatch = card.matchFactors?.interests || [];
      const matches = answers.interests.filter(i => interestMatch.includes(i));
      score += matches.length * 5;
    }
    
    if (answers.product_selection === 'cambiar_tarjeta' && answers.current_card_pain) {
      const pains = Array.isArray(answers.current_card_pain) ? answers.current_card_pain : [answers.current_card_pain];
      const solved = card.painPointsSolved || [];
      const matched = pains.filter(p => solved.includes(p));
      score += matched.length * 5;
    }
    
    return { score: Math.min(score, 100), reasons };
  }

  extractBenefits(card, _answers) {
    return card.benefits?.slice(0, 5) || [];
  }

  // Beneficio neto anual: lo que devuelve (cashback + millas) menos lo que cuesta la cuota de manejo.
  // Puede ser negativo. Antes se sumaba siempre una "cuota promedio" de $25.000/mes que la persona quizá no paga.
  calculateSavings(card, answers) {
    const breakdown = cardAnnualBreakdown(card, Number(answers.monthly_spend) || undefined);
    return { personalizedSavings: breakdown.total, annualBreakdown: breakdown };
  }

  generateComparativeReasons(topCards, _answers) {
    if (topCards.length < 2) return topCards;
    const [winner, ...alts] = topCards;
    
    const winnerReasons = [];
    if (annualFeeCost(winner) === 0 && alts.some(a => annualFeeCost(a) > 0)) {
      winnerReasons.push('Sin cuota de manejo');
    }
    if (winner.personalizedSavings > (alts[0]?.personalizedSavings || 0) + 50000) {
      winnerReasons.push('Mayor beneficio neto al año');
    }
    if (!winnerReasons.length) winnerReasons.push('Mejor match para tu perfil');
    
    return [
      { ...winner, whyWinner: winnerReasons },
      ...alts.map(a => ({ ...a, whyConsider: ['Alternativa viable'] }))
    ];
  }
}

// ============================================
// CREDIT MATCHING ENGINE (nuevo - unificado)
// ============================================
export class CreditMatchingEngine {
  constructor(products, config) {
    this.products = products;
    this.config = config;
  }

  getTopResults(answers) {
    // Filtrar por elegibilidad básica
    let eligible = this.products.filter(product => {
      return this.checkEligibility(product, answers);
    });
    
    // Si no hay elegibles, usar TODOS los productos pero con score penalizado
    let useFallback = false;
    if (eligible.length === 0) {
      eligible = this.products;
      useFallback = true;
    }

    const capacity = paymentCapacity(answers);

    // Calcular score para cada producto
    const scored = eligible.map(product => {
      let { score, reasons } = this.calculateScore(product, answers);
      
      // Penalizar si es fallback (no cumple requisitos)
      if (useFallback) {
        score = Math.max(score - 20, 30); // Mínimo 30%
        reasons = ['Opción disponible aunque no cumples todos los requisitos', ...reasons];
      }

      // Cuota estimada vs. lo que podría pagar al mes (40% del ingreso, o 15% de las ventas, menos sus deudas).
      const loanEstimate = estimateLoan(product, answers);
      const warnings = [];
      let affordability = 'sin_datos';
      if (loanEstimate && capacity !== null) {
        if (loanEstimate.paymentHigh <= capacity) affordability = 'ok';
        else if (loanEstimate.paymentLow <= capacity) {
          affordability = 'ajustada';
          score -= 10;
          warnings.push('La cuota podría quedar justa para tu capacidad de pago');
        } else {
          affordability = 'excede';
          score -= 25;
          warnings.push('La cuota estimada supera lo que podrías pagar al mes');
        }
      }

      const approval = approvalLikelihood(product, answers);
      if (approval === 'baja') score -= 10;
      const millions = loanEstimate ? String(loanEstimate.principal / 1e6).replace('.', ',') : '';
      if (loanEstimate?.cappedToMax) warnings.push(`Presta hasta $${millions}M: menos de lo que pediste`);
      if (loanEstimate?.raisedToMin) warnings.push(`Presta desde $${millions}M: más de lo que pediste`);
      
      return { 
        ...product, 
        score: Math.min(Math.max(score, 0), 100), 
        matchReasons: reasons,
        loanEstimate,
        affordability,
        approval,
        warnings
      };
    });

    // Ordenar por score y armar un top 3 variado (no tres productos casi iguales)
    const sorted = scored.sort((a, b) => b.score - a.score);
    const top = this.pickDiverseTop(sorted);

    // Generar razones comparativas
    const topWithReasons = this.generateComparativeReasons(top, answers);
    
    return {
      topMatch: topWithReasons[0] || null,
      alternatives: topWithReasons.slice(1),
      allResults: sorted
    };
  }

  /**
   * Top 3 variado: el mejor puntaje, luego el de menor costo y luego el más rápido
   * (o el más fácil de aprobar), buscando entre los 10 mejores. Evita opciones que la persona
   * no podría pagar salvo que no haya otras. Cada alternativa lleva el porqué en pickLabel.
   */
  pickDiverseTop(sorted) {
    if (sorted.length <= 1) return sorted.map(p => ({ ...p, pickLabel: 'Mejor match' }));
    const [winner, ...rest] = sorted;
    const minScore = winner.score - 35;
    let pool = rest.slice(0, 10).filter(p => p.score >= minScore);
    const affordable = pool.filter(p => p.affordability !== 'excede');
    if (affordable.length >= 2) pool = affordable;

    const picks = [{ ...winner, pickLabel: 'Mejor match' }];
    const taken = new Set([winner.id]);
    const take = (candidates, label) => {
      const p = candidates.find(c => !taken.has(c.id));
      if (p) { taken.add(p.id); picks.push({ ...p, pickLabel: label }); }
    };
    // Costo comparable: misma plata pedida. Los que prestan menos de lo pedido no compiten por "menor costo"
    // (su cuota es menor solo porque prestan menos).
    const cost = (p) => p.loanEstimate?.paymentHigh ?? p.loanDetails?.interestRateEA?.max ?? Infinity;
    const fullAmount = pool.filter(p => !p.loanEstimate?.cappedToMax);
    const APPROVAL_RANK = { alta: 2, media: 1, baja: 0 };

    if (fullAmount.length) take([...fullAmount].sort((a, b) => cost(a) - cost(b) || b.score - a.score), 'Menor costo');
    const fastest = [...pool].filter(p => p.loanDetails?.disbursementTimeHours != null)
      .sort((a, b) => a.loanDetails.disbursementTimeHours - b.loanDetails.disbursementTimeHours || b.score - a.score);
    const winnerHours = winner.loanDetails?.disbursementTimeHours ?? Infinity;
    if (fastest.length && fastest.find(p => !taken.has(p.id))?.loanDetails.disbursementTimeHours < winnerHours) take(fastest, 'Desembolso más rápido');
    else take([...pool].sort((a, b) => (APPROVAL_RANK[b.approval] - APPROVAL_RANK[a.approval]) || b.score - a.score), 'Más fácil de aprobar');
    // Si el grupo era chico, completar por puntaje.
    while (picks.length < 3 && rest.some(p => !taken.has(p.id))) take(rest, 'Alternativa');
    return picks;
  }

  checkEligibility(product, answers) {
    // Filtros muy básicos - solo cosas que realmente descalifican
    
    // Si requiere Bold y no lo tiene, no puede aplicar
    if (product.requirements?.requiresBoldDatafono || product.requirements?.requiresBold) {
      const hasRelBold = answers.entity_relationships?.includes('rel_bold');
      if (!hasRelBold) return false;
    }
    
    // Si está reportado y el producto NO acepta reportados, filtrar
    // (pero muchos productos no tienen este campo, así que solo filtrar si explícitamente lo rechaza)
    if (answers.credit_history === 'historial_reportado') {
      if (product.requirements?.acceptsReported === false) {
        return false;
      }
    }
    
    // Todo lo demás pasa - la penalización se hace en el score
    return true;
  }

  calculateScore(product, answers) {
    let score = 40; // Base score
    const reasons = [];
    
    // +25 puntos: Velocidad de desembolso vs urgencia
    const disbursementHours = product.loanDetails?.disbursementTimeHours || 72;
    if (answers.loan_urgency === 'inmediato' && disbursementHours <= 24) {
      score += 25;
      reasons.push('Desembolso en menos de 24 horas');
    } else if (answers.loan_urgency === 'urgente' && disbursementHours <= 72) {
      score += 20;
      reasons.push('Desembolso rápido (1-3 días)');
    } else if (answers.loan_urgency === 'normal') {
      score += 10;
    } else if (answers.loan_urgency === 'flexible') {
      score += 5;
    }
    
    // +20 puntos: Prioridad (velocidad vs tasa)
    const minRate = product.loanDetails?.interestRateEA?.min || 25;
    if (answers.priority_preference === 'prioridad_velocidad') {
      if (disbursementHours <= 24) {
        score += 20;
        reasons.push('Aprobación express');
      } else if (disbursementHours <= 48) {
        score += 15;
      }
    } else if (answers.priority_preference === 'prioridad_tasa') {
      if (minRate < 18) {
        score += 20;
        reasons.push('Tasa competitiva desde ' + minRate + '% EA');
      } else if (minRate < 23) {
        score += 10;
        reasons.push('Tasa razonable');
      }
    } else if (answers.priority_preference === 'prioridad_balance') {
      if (disbursementHours <= 72 && minRate < 25) {
        score += 15;
        reasons.push('Buen balance rapidez/tasa');
      }
    }
    
    // +15 puntos: Match con propósito del crédito
    if (answers.loan_purpose && product.useCase) {
      const purposes = Array.isArray(answers.loan_purpose) ? answers.loan_purpose : [answers.loan_purpose];
      const useCaseLower = product.useCase.map(uc => uc.toLowerCase());
      
      const purposeMapping = {
        'emergencia_personal': ['emergencia', 'urgente', 'personal'],
        'consolidar_deuda': ['consolidar', 'deuda', 'cartera'],
        'compra_especifica': ['compra', 'activo', 'libre'],
        'inversion_negocio': ['inversión', 'negocio', 'capital', 'emprendimiento'],
        'capital_trabajo': ['capital', 'trabajo', 'nómina', 'inventario'],
        'inventario': ['inventario', 'mercancía', 'capital'],
        'iniciar_negocio': ['iniciar', 'emprender', 'inicial', 'micro'],
        'oportunidad': ['oportunidad', 'libre'],
        'libre_inversion': ['libre', 'personal', 'gastos']
      };
      
      let matchCount = 0;
      purposes.forEach(p => {
        const keywords = purposeMapping[p] || [];
        if (keywords.some(kw => useCaseLower.some(uc => uc.includes(kw)))) {
          matchCount++;
        }
      });
      
      if (matchCount > 0) {
        score += 10 + (matchCount * 3);
        reasons.push('Ideal para tu necesidad');
      }
    }
    
    // +15 puntos: Acepta informales (si el usuario es informal)
    if ((answers.business_formalization === 'informal' || answers.employment_status === 'independiente') 
        && product.requirements?.acceptsInformal) {
      score += 15;
      reasons.push('Acepta trabajadores informales');
    }
    
    // +15 puntos: Acepta reportados (si el usuario está reportado)
    if (answers.credit_history === 'historial_reportado' && product.requirements?.acceptsReported) {
      score += 15;
      reasons.push('Acepta reportados en DataCrédito');
    }
    
    // +10 puntos: Acepta sin historial (si el usuario no tiene historial)
    if ((answers.credit_history === 'sin_historial' || answers.credit_history === 'historial_desconocido') 
        && product.requirements?.acceptsNoHistory) {
      score += 10;
      reasons.push('No requiere historial crediticio');
    }
    
    // +10 puntos: Proceso digital (la mayoría de fintechs son digitales)
    if (answers.process_preference === 'proceso_digital') {
      score += 10;
      if (!reasons.includes('100% digital')) {
        reasons.push('100% digital');
      }
    }
    
    // +10 puntos: Match por categoría
    if (product.category && Array.isArray(product.category)) {
      if (answers.credit_destination === 'personal' && product.category.includes('personal')) {
        score += 10;
        if (!reasons.includes('Ideal para personas naturales')) {
          reasons.push('Ideal para personas naturales');
        }
      }
      if (answers.credit_destination === 'negocio' && 
          (product.category.includes('empresarial') || product.category.includes('micro') || product.category.includes('emprendedor'))) {
        score += 10;
        reasons.push('Diseñado para negocios');
      }
    }
    
    // Penalizaciones
    
    // -15 puntos: Si es informal y producto no acepta informales
    if ((answers.business_formalization === 'informal' || answers.employment_status === 'independiente') 
        && !product.requirements?.acceptsInformal) {
      score -= 15;
    }
    
    // -15 puntos: Si está reportado y producto no acepta reportados
    if (answers.credit_history === 'historial_reportado' && !product.requirements?.acceptsReported) {
      score -= 15;
    }
    
    // -10 puntos: Monto solicitado vs rango del producto
    if (answers.loan_amount && product.loanDetails) {
      const amountRanges = {
        '0-1M': 0.5, '1-5M': 3, '5-10M': 7.5, '10-30M': 20, 
        '30-50M': 40, '50-100M': 75, '100-200M': 150, '200M+': 300
      };
      const requestedMid = amountRanges[answers.loan_amount] || 5;
      const productMax = product.loanDetails.maxAmountMillions || 100;
      const productMin = product.loanDetails.minAmountMillions || 0;
      
      // Si el máximo del producto es menor que lo que necesita  
      if (productMax < requestedMid * 0.5) {
        score -= 15;
      }
      // Si el mínimo es mayor que lo que necesita
      if (productMin > requestedMid * 2) {
        score -= 10;
      }
    }

    return { score: Math.max(score, 10), reasons };
  }

  generateComparativeReasons(topProducts, _answers) {
    if (topProducts.length === 0) return [];
    if (topProducts.length === 1) {
      return [{ ...topProducts[0], whyWinner: topProducts[0].matchReasons || ['Mejor opción disponible'] }];
    }
    
    const [winner, ...alts] = topProducts;
    
    const winnerReasons = [...(winner.matchReasons || [])];
    
    // Comparar con alternativas
    if (winner.loanDetails?.interestRateEA?.min < (alts[0]?.loanDetails?.interestRateEA?.min || 100)) {
      if (!winnerReasons.some(r => r.includes('tasa'))) {
        winnerReasons.push('Mejor tasa del grupo');
      }
    }
    if (winner.loanDetails?.disbursementTimeHours < (alts[0]?.loanDetails?.disbursementTimeHours || 999)) {
      if (!winnerReasons.some(r => r.includes('rápido') || r.includes('24'))) {
        winnerReasons.push('Desembolso más rápido');
      }
    }
    
    if (winnerReasons.length === 0) {
      winnerReasons.push('Mejor match para tu perfil');
    }
    
    return [
      { ...winner, whyWinner: winnerReasons.slice(0, 4) },
      ...alts.map(a => ({ 
        ...a, 
        whyConsider: [a.pickLabel, ...(a.matchReasons?.slice(0, 1) || [])].filter(Boolean)
      }))
    ];
  }
}

// ============================================
// FACTORY FUNCTIONS
// ============================================
// Los productos con active: false (datos sin verificar o que no aplican) no entran al motor.
const onlyActive = (list) => (Array.isArray(list) ? list : []).filter(p => p.active !== false);

export function createMatchingEngine(cardsData, configData) {
  const cards = cardsData.cards || cardsData;
  return new MatchingEngine(onlyActive(cards), configData || {});
}

export function createCreditMatchingEngine(productsData, configData) {
  const products = productsData.creditProducts || productsData.businessLoans || productsData.loans || productsData;
  return new CreditMatchingEngine(onlyActive(products), configData || {});
}

// Mantener compatibilidad con código existente
export function createBusinessMatchingEngine(loansData, configData) {
  return createCreditMatchingEngine(loansData, configData);
}

export default MatchingEngine;
