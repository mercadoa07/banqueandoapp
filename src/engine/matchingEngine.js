/**
 * ============================================================
 * BANQUEANDO - MATCHING ENGINE v2.0
 * ============================================================
 * 
 * Este es el "cerebro" del comparador. Recibe las respuestas
 * del usuario y calcula qué tarjetas son mejores para él.
 * 
 * LÓGICA PRINCIPAL:
 * 1. FILTRAR    → Eliminar tarjetas que no puede obtener
 * 2. PUNTUAR    → Calcular score basado en compatibilidad
 * 3. BONIFICAR  → Sumar puntos por matches especiales
 * 4. PENALIZAR  → Restar puntos por incompatibilidades
 * 5. PROS/CONS  → Identificar ventajas y desventajas
 * 6. ORDENAR    → Devolver top 3 con explicaciones
 * 
 * ============================================================
 */

export class MatchingEngine {
  constructor(cards, config) {
    this.cards = cards;
    this.config = config;
    this.debug = false; // Cambiar a true para ver logs
  }

  /**
   * ============================================================
   * MÉTODO PRINCIPAL: calculateMatches
   * ============================================================
   * Este es el método que llama App.jsx cuando el usuario
   * termina el quiz.
   * 
   * @param {Object} answers - Respuestas del usuario
   * @returns {Object} - { topMatch, alternatives, allResults }
   */
  calculateMatches(answers) {
    this.log('🎯 Iniciando cálculo de matches...');
    this.log('📝 Respuestas del usuario:', answers);

    // PASO 1: Filtrar tarjetas que no puede obtener
    const eligibleCards = this.filterByEligibility(answers);
    this.log(`✅ Tarjetas elegibles: ${eligibleCards.length}/${this.cards.length}`);

    // PASO 2-4: Calcular score para cada tarjeta
    const scoredCards = eligibleCards.map(card => {
      const scoreResult = this.calculateCardScore(card, answers);
      const prosConsResult = this.calculateProsCons(card, answers);
      
      return {
        ...card,
        score: Math.min(Math.max(scoreResult.score, 0), this.config.scoring.maxScore),
        matchReasons: scoreResult.reasons,
        pros: prosConsResult.pros,
        cons: prosConsResult.cons,
        personalizedSavings: this.calculateSavings(card, answers)
      };
    });

    // PASO 6: Ordenar por score
    const sortedCards = scoredCards.sort((a, b) => b.score - a.score);

    this.log('🏆 Resultados ordenados:', sortedCards.map(c => `${c.name}: ${c.score}`));

    // Devolver en formato esperado por App.jsx
    return {
      topMatch: sortedCards[0],
      alternatives: sortedCards.slice(1, this.config.display.showTopResults),
      allResults: sortedCards
    };
  }

  /**
   * ============================================================
   * PASO 1: FILTRAR POR ELEGIBILIDAD
   * ============================================================
   * Elimina tarjetas que el usuario NO puede obtener por:
   * - Ingresos insuficientes
   * - Historial crediticio incompatible
   * 
   * NOTA: No elimina, solo marca con penalty severo para que
   * aparezcan al final pero el usuario sepa que existen.
   */
  filterByEligibility(answers) {
    if (!this.config.filters.enableIncomeFilter) {
      return [...this.cards];
    }

    return this.cards.filter(card => {
      // Verificar ingresos
      const userIncomeRange = this.config.incomeRanges[answers.income];
      const userMaxIncome = userIncomeRange?.max || 999999999;
      const cardMinIncome = card.requirements?.minIncome || 0;

      // Si el usuario no especificó ingresos, no filtrar
      if (answers.income === 'skip' || !answers.income) {
        return true;
      }

      // Si estamos en modo estricto, eliminar
      if (this.config.filters.strictMode && userMaxIncome < cardMinIncome) {
        this.log(`❌ ${card.name} filtrada por ingresos (requiere ${cardMinIncome})`);
        return false;
      }

      return true;
    });
  }

  /**
   * ============================================================
   * PASO 2-4: CALCULAR SCORE DE UNA TARJETA
   * ============================================================
   * Combina:
   * - Score base
   * - Puntos por matchFactors
   * - Bonuses por reglas especiales
   * - Penalties por incompatibilidades
   */
  calculateCardScore(card, answers) {
    let score = this.config.scoring.baseScore;
    const reasons = [];

    // PASO 2: Scoring por matchFactors
    const factorResult = this.scoreByMatchFactors(card, answers);
    score += factorResult.points;
    reasons.push(...factorResult.reasons);

    // PASO 3: Aplicar bonuses
    const bonusResult = this.applyBonuses(card, answers);
    score += bonusResult.points;
    reasons.push(...bonusResult.reasons);

    // PASO 4: Aplicar penalties
    const penaltyResult = this.applyPenalties(card, answers);
    score += penaltyResult.points;
    reasons.push(...penaltyResult.reasons);

    this.log(`📊 ${card.name}: base(${this.config.scoring.baseScore}) + factors(${factorResult.points}) + bonus(${bonusResult.points}) + penalty(${penaltyResult.points}) = ${score}`);

    return { score, reasons };
  }

  /**
   * ============================================================
   * SCORING POR MATCH FACTORS
   * ============================================================
   * Compara las respuestas del usuario con los matchFactors
   * definidos en cada tarjeta.
   * 
   * Los pesos vienen de config.weights
   */
  scoreByMatchFactors(card, answers) {
    let points = 0;
    const reasons = [];
    const { weights, scoring } = this.config;

    if (!card.matchFactors) return { points, reasons };

    Object.entries(card.matchFactors).forEach(([factor, cardValues]) => {
      const userValue = answers[factor];
      const weight = weights[factor] || 5;

      if (!userValue) return;

      let matched = false;
      let matchStrength = 0;

      if (Array.isArray(userValue)) {
        // Usuario seleccionó múltiples opciones
        const matches = userValue.filter(v => cardValues.includes(v));
        if (matches.length > 0) {
          matchStrength = (matches.length / userValue.length);
          matched = true;
        }
      } else {
        // Usuario seleccionó una opción
        if (cardValues.includes(userValue)) {
          matchStrength = 1;
          matched = true;
        }
      }

      if (matched) {
        const factorPoints = (scoring.exactMatchPoints * weight * matchStrength) / 10;
        points += factorPoints;
        
        const reasonText = this.generateMatchReason(factor, userValue, factorPoints);
        if (reasonText) reasons.push(reasonText);
      }
    });

    return { points, reasons };
  }

  /**
   * ============================================================
   * APLICAR BONUSES
   * ============================================================
   * Revisa cada regla de bonus en config y aplica si corresponde
   */
  applyBonuses(card, answers) {
    let points = 0;
    const reasons = [];

    this.config.bonusRules.forEach(rule => {
      if (this.evaluateRule(rule.conditions, card, answers)) {
        points += rule.bonus;
        reasons.push({
          type: 'bonus',
          text: rule.name,
          points: rule.bonus
        });
        this.log(`  ✨ Bonus aplicado: ${rule.name} (+${rule.bonus})`);
      }
    });

    return { points, reasons };
  }

  /**
   * ============================================================
   * APLICAR PENALTIES
   * ============================================================
   * Revisa cada regla de penalty en config y aplica si corresponde
   */
  applyPenalties(card, answers) {
    let points = 0;
    const reasons = [];

    this.config.penaltyRules.forEach(rule => {
      // Caso especial: verificación de ingresos
      if (rule.conditions.type === 'income_check') {
        if (!this.checkIncomeEligibility(card, answers)) {
          points += rule.penalty;
          reasons.push({
            type: 'penalty',
            text: 'Puede requerir ingresos mayores a los indicados',
            points: rule.penalty
          });
        }
        return;
      }

      if (this.evaluateRule(rule.conditions, card, answers)) {
        points += rule.penalty;
        reasons.push({
          type: 'penalty',
          text: rule.name,
          points: rule.penalty
        });
        this.log(`  ⚠️ Penalty aplicado: ${rule.name} (${rule.penalty})`);
      }
    });

    return { points, reasons };
  }

  /**
   * ============================================================
   * EVALUAR UNA REGLA
   * ============================================================
   * Verifica si las condiciones de una regla se cumplen
   */
  evaluateRule(conditions, card, answers) {
    const { userFactor, userValue, userValueIn, userValueIncludes,
            cardField, cardValue, cardValueIn, cardValueLessThan, 
            cardValueGreaterThan } = conditions;

    // Verificar condición del usuario
    const userAnswer = answers[userFactor];
    if (!userAnswer) return false;

    let userConditionMet = false;

    if (userValue !== undefined) {
      userConditionMet = userAnswer === userValue;
    } else if (userValueIn) {
      userConditionMet = userValueIn.includes(userAnswer);
    } else if (userValueIncludes) {
      userConditionMet = Array.isArray(userAnswer) 
        ? userAnswer.includes(userValueIncludes)
        : userAnswer === userValueIncludes;
    } else {
      userConditionMet = true; // No hay condición de usuario
    }

    if (!userConditionMet) return false;

    // Verificar condición de la tarjeta
    const cardFieldValue = this.getNestedValue(card, cardField);

    if (cardValue !== undefined) {
      return cardFieldValue === cardValue;
    } else if (cardValueIn) {
      return cardValueIn.includes(cardFieldValue);
    } else if (cardValueLessThan !== undefined) {
      return cardFieldValue < cardValueLessThan;
    } else if (cardValueGreaterThan !== undefined) {
      return cardFieldValue > cardValueGreaterThan;
    }

    return true;
  }

  /**
   * ============================================================
   * PASO 5: CALCULAR PROS Y CONTRAS
   * ============================================================
   * Para cada tarjeta, identifica:
   * - ✅ PROS: Por qué SÍ le conviene
   * - ⚠️ CONS: Por qué podría NO convenirle
   */
  calculateProsCons(card, answers) {
    const pros = [];
    const cons = [];
    const { prosConsRules } = this.config;

    // Evaluar PROS
    prosConsRules.pros.forEach(rule => {
      if (this.evaluateProConCondition(rule.condition, card)) {
        let text = rule.text;
        // Reemplazar {value} con el valor real
        const value = this.getNestedValue(card, rule.condition.field);
        text = text.replace('{value}', this.formatValue(value, rule.condition.field));
        
        pros.push({
          icon: rule.icon,
          text: text
        });
      }
    });

    // Evaluar CONS
    prosConsRules.cons.forEach(rule => {
      if (this.evaluateProConCondition(rule.condition, card)) {
        let text = rule.text;
        const value = this.getNestedValue(card, rule.condition.field);
        text = text.replace('{value}', this.formatValue(value, rule.condition.field));
        
        cons.push({
          icon: rule.icon,
          text: text
        });
      }
    });

    // Limitar cantidad mostrada
    const maxShow = this.config.display.showProsConsPerCard;
    return {
      pros: pros.slice(0, maxShow),
      cons: cons.slice(0, maxShow)
    };
  }

  /**
   * Evalúa una condición de pro/con
   */
  evaluateProConCondition(condition, card) {
    const value = this.getNestedValue(card, condition.field);
    
    if (condition.equals !== undefined) return value === condition.equals;
    if (condition.lessThan !== undefined) return value < condition.lessThan;
    if (condition.greaterThan !== undefined) return value > condition.greaterThan;
    if (condition.in) return condition.in.includes(value);
    
    return false;
  }

  /**
   * ============================================================
   * UTILIDADES
   * ============================================================
   */

  // Obtener valor anidado: "fees.annualFee" → card.fees.annualFee
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Verificar elegibilidad por ingresos
  checkIncomeEligibility(card, answers) {
    if (answers.income === 'skip' || !answers.income) return true;
    
    const userIncomeRange = this.config.incomeRanges[answers.income];
    if (!userIncomeRange) return true;
    
    const userMaxIncome = userIncomeRange.max;
    const cardMinIncome = card.requirements?.minIncome || 0;
    
    return userMaxIncome >= cardMinIncome;
  }

  // Calcular ahorros personalizados
  calculateSavings(card, answers) {
    const monthlySpend = answers.monthlySpend || 1500000;
    const annualSpend = monthlySpend * 12;
    let savings = 0;

    switch (card.rewards?.type) {
      case 'cashback':
        const rate = parseFloat(card.rewards.rate) / 100 || 0.02;
        savings = annualSpend * rate;
        break;
      case 'miles':
        const milesEarned = (annualSpend / 4000) * 1;
        savings = milesEarned * 50; // Valor estimado por milla
        break;
      case 'points':
        savings = annualSpend * 0.01;
        break;
      default:
        savings = annualSpend * 0.005;
    }

    // Restar cuota de manejo
    savings -= card.fees?.annualFee || 0;
    
    return Math.max(Math.floor(savings), 0);
  }

  // Generar razón de match legible
  generateMatchReason(factor, value, points) {
    const templates = {
      interests: `Coincide con tus intereses`,
      digitalPreference: `Experiencia digital ideal para ti`,
      feeSensitivity: `Se ajusta a tu preferencia de cuota`,
      paymentBehavior: `Compatible con tu forma de pago`,
      shoppingPlaces: `Beneficios en tus lugares frecuentes`,
      travelFreq: `Ideal para tu frecuencia de viajes`,
      values: `Alineada con tus valores`,
      cardUsage: `Perfecta para el uso que le darás`
    };

    if (points < 3) return null; // No mostrar matches débiles
    return templates[factor] || null;
  }

  // Formatear valores para mostrar
  formatValue(value, field) {
    if (field.includes('Fee') || field.includes('Income')) {
      return value.toLocaleString();
    }
    return value;
  }

  // Logger para debug
  log(...args) {
    if (this.debug) {
      console.log('[MatchingEngine]', ...args);
    }
  }
}

/**
 * ============================================================
 * FACTORY FUNCTION
 * ============================================================
 * Crea una instancia del engine con los datos cargados
 */
export function createMatchingEngine(cardsData, configData) {
  return new MatchingEngine(cardsData.cards, configData);
}

export default MatchingEngine;
