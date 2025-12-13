/**
 * Matching Engine para Banqueando
 * Este archivo contiene toda la lógica de matching.
 * Lee la configuración desde matchingConfig.json
 */

export class MatchingEngine {
  constructor(cards, config) {
    this.cards = cards;
    this.config = config;
  }

  /**
   * Calcula el match score para todas las tarjetas
   * @param {Object} answers - Respuestas del usuario del quiz
   * @returns {Array} - Tarjetas ordenadas por score con razones
   */
  calculateMatches(answers) {
    const results = this.cards.map(card => {
      const { score, reasons } = this.scoreCard(card, answers);
      const savings = this.calculateSavings(card, answers);
      
      return {
        ...card,
        score: Math.min(Math.max(score, 0), this.config.maxScore),
        reasons,
        personalizedSavings: savings
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Calcula el score de una tarjeta específica
   */
  scoreCard(card, answers) {
    let score = this.config.baseScore;
    const reasons = [];

    // 1. Scoring por matchFactors directos
    const factorScore = this.scoreMatchFactors(card, answers);
    score += factorScore.points;
    reasons.push(...factorScore.reasons);

    // 2. Aplicar bonus rules
    const bonusScore = this.applyBonusRules(card, answers);
    score += bonusScore.points;
    reasons.push(...bonusScore.reasons);

    // 3. Aplicar penalty rules
    const penaltyScore = this.applyPenaltyRules(card, answers);
    score += penaltyScore.points;
    reasons.push(...penaltyScore.reasons);

    return { score, reasons };
  }

  /**
   * Scoring basado en matchFactors de la tarjeta
   */
  scoreMatchFactors(card, answers) {
    let points = 0;
    const reasons = [];
    const { weights, matchFactorScoring } = this.config;

    if (!card.matchFactors) return { points, reasons };

    Object.entries(card.matchFactors).forEach(([factor, cardValues]) => {
      const userValue = answers[factor];
      if (!userValue) return;

      const weight = weights[factor] || 5;
      let matched = false;

      // Check si el valor del usuario está en los valores de la tarjeta
      if (Array.isArray(userValue)) {
        // Usuario seleccionó múltiples (ej: interests)
        const matches = userValue.filter(v => cardValues.includes(v));
        if (matches.length > 0) {
          points += (matchFactorScoring.partialMatch * matches.length * weight) / 10;
          matched = true;
          reasons.push(this.generateReason(factor, matches));
        }
      } else {
        // Usuario seleccionó uno (ej: paymentBehavior)
        if (cardValues.includes(userValue)) {
          points += (matchFactorScoring.exactMatch * weight) / 10;
          matched = true;
          reasons.push(this.generateReason(factor, userValue));
        }
      }
    });

    return { points, reasons };
  }

  /**
   * Aplica reglas de bonus
   */
  applyBonusRules(card, answers) {
    let points = 0;
    const reasons = [];

    this.config.bonusRules.forEach(rule => {
      if (this.evaluateCondition(rule.condition, answers)) {
        // Verificar condición AND si existe
        if (rule.andCondition && !this.evaluateCondition(rule.andCondition, answers)) {
          return;
        }

        // Verificar requisito de tarjeta si existe
        if (rule.cardRequirement && !this.evaluateCardRequirement(rule.cardRequirement, card)) {
          return;
        }

        // Verificar categoría de tarjeta si existe
        if (rule.cardCategory && card.category !== rule.cardCategory) {
          return;
        }

        points += rule.bonus;
        reasons.push(`✨ ${rule.name}`);
      }
    });

    return { points, reasons };
  }

  /**
   * Aplica reglas de penalización
   */
  applyPenaltyRules(card, answers) {
    let points = 0;
    const reasons = [];

    this.config.penaltyRules.forEach(rule => {
      // Caso especial: verificación de ingresos
      if (rule.conditionType === 'income_check') {
        if (!this.checkIncomeEligibility(card, answers)) {
          points += rule.penalty;
          reasons.push(`⚠️ Puede requerir ingresos mayores`);
        }
        return;
      }

      if (this.evaluateCondition(rule.condition, answers)) {
        if (rule.cardRequirement && this.evaluateCardRequirement(rule.cardRequirement, card)) {
          points += rule.penalty;
        }
      }
    });

    return { points, reasons };
  }

  /**
   * Evalúa una condición contra las respuestas
   */
  evaluateCondition(condition, answers) {
    const userValue = answers[condition.factor];
    if (!userValue) return false;

    if (condition.equals) {
      return userValue === condition.equals;
    }
    if (condition.includes) {
      return Array.isArray(userValue) 
        ? userValue.includes(condition.includes)
        : userValue === condition.includes;
    }
    if (condition.in) {
      return condition.in.includes(userValue);
    }

    return false;
  }

  /**
   * Evalúa un requisito de tarjeta
   */
  evaluateCardRequirement(requirement, card) {
    const value = this.getNestedValue(card, requirement.field);
    
    if (requirement.equals !== undefined) {
      return value === requirement.equals;
    }
    if (requirement.lessThan !== undefined) {
      return value < requirement.lessThan;
    }
    if (requirement.greaterThan !== undefined) {
      return value > requirement.greaterThan;
    }

    return false;
  }

  /**
   * Obtiene valor anidado de un objeto (ej: "fees.annualFee")
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Verifica elegibilidad por ingresos
   */
  checkIncomeEligibility(card, answers) {
    const incomeRanges = {
      '0-2': 1500000,
      '2-4': 3000000,
      '4-6': 5000000,
      '6-10': 8000000,
      '10+': 15000000
    };

    const userIncome = incomeRanges[answers.income] || 0;
    const minRequired = card.requirements?.minIncome || 0;

    return userIncome >= minRequired;
  }

  /**
   * Calcula ahorros personalizados
   */
  calculateSavings(card, answers) {
    const { savingsCalculation } = this.config;
    const monthlySpend = answers.monthlySpend || 1500000;
    const annualSpend = monthlySpend * savingsCalculation.annualSpendMonths;

    let savings = 0;

    // Calcular según tipo de reward
    switch (card.rewards?.type) {
      case 'cashback':
        const cashbackRate = parseFloat(card.rewards.rate) / 100 || savingsCalculation.baseRewardsRate;
        savings = annualSpend * cashbackRate * savingsCalculation.cashbackMultiplier;
        break;
      
      case 'miles':
        const milesPerDollar = 1; // Simplificado
        const annualMiles = (annualSpend / 4000) * milesPerDollar;
        savings = annualMiles * savingsCalculation.milesValue;
        break;
      
      case 'points':
        savings = annualSpend * savingsCalculation.baseRewardsRate;
        break;
      
      default:
        savings = annualSpend * 0.005; // Mínimo por usar tarjeta
    }

    // Restar cuota de manejo
    savings -= card.fees?.annualFee || 0;

    return Math.max(Math.floor(savings), 0);
  }

  /**
   * Genera razón legible para el usuario
   */
  generateReason(factor, value) {
    const reasonTemplates = {
      interests: (v) => `Coincide con tus intereses: ${Array.isArray(v) ? v.join(', ') : v}`,
      digitalPreference: () => 'Experiencia digital ideal para ti',
      feeSensitivity: () => 'Sin cuota de manejo',
      paymentBehavior: (v) => v === 'full' 
        ? 'Optimizada para quien paga el total' 
        : 'Tasa competitiva para financiar',
      shoppingPlaces: (v) => `Beneficios especiales en ${Array.isArray(v) ? v.slice(0,2).join(' y ') : v}`,
      team: (v) => `Patrocina ${v} - beneficios para hinchas`,
      values: () => 'Alineada con tus valores',
      travelFreq: () => 'Perfecta para tu frecuencia de viajes'
    };

    const template = reasonTemplates[factor];
    return template ? template(value) : `Match en ${factor}`;
  }

  /**
   * Obtiene las mejores tarjetas según configuración
   */
  getTopResults(answers) {
    const allResults = this.calculateMatches(answers);
    const { showTopResults, showAlternatives, minScoreToShow } = this.config.displaySettings;

    const qualified = allResults.filter(card => card.score >= minScoreToShow);

    return {
      topMatch: qualified[0] || allResults[0],
      alternatives: qualified.slice(1, 1 + showAlternatives),
      allResults: qualified.slice(0, showTopResults + showAlternatives)
    };
  }
}

/**
 * Factory function para crear el engine
 */
export function createMatchingEngine(cardsData, configData) {
  return new MatchingEngine(cardsData.cards, configData);
}

export default MatchingEngine;
