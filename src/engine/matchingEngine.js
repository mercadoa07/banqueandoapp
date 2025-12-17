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
      const benefits = this.extractBenefits(card, answers);
      
      return {
        ...card,
        score: Math.min(Math.max(scoreResult.score, 0), this.config.scoring.maxScore),
        matchReasons: scoreResult.reasons,
        benefits: benefits,
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
   * MÉTODO ALIAS: getTopResults (para compatibilidad con App.jsx)
   * ============================================================
   */
  getTopResults(answers) {
    return this.calculateMatches(answers);
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
        
        const reasonText = this.generateMatchReason(factor, userValue, cardValues, factorPoints);
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

  /**
   * ============================================================
   * EXTRAER BENEFICIOS DE LA TARJETA
   * ============================================================
   * Genera lista de beneficios legibles para mostrar al usuario
   */
  extractBenefits(card, answers) {
    const benefits = [];
    
    // Beneficios desde el campo benefits de la tarjeta (si existe)
    if (card.benefits && Array.isArray(card.benefits)) {
      benefits.push(...card.benefits.slice(0, 5));
    }
    
    // Generar beneficios desde los datos de la tarjeta
    if (benefits.length < 3) {
      // Cuota gratis
      if (card.fees?.annualFee === 0 || card.fees?.monthlyFee === 0) {
        benefits.push('✨ Sin cuota de manejo');
      }
      
      // Rewards
      if (card.rewards?.type === 'miles') {
        const rate = card.rewards.milesPerCOP || 4000;
        benefits.push(`✈️ Acumula 1 milla por cada $${rate.toLocaleString()} gastados`);
      } else if (card.rewards?.type === 'cashback') {
        const rate = card.rewards.rate || '2%';
        benefits.push(`💰 ${rate} de cashback en compras`);
      } else if (card.rewards?.type === 'points') {
        benefits.push('🎁 Acumula puntos canjeables');
      }
      
      // Seguros
      if (card.perks?.travelInsurance) {
        benefits.push('🛡️ Seguro de viaje incluido');
      }
      if (card.perks?.purchaseProtection) {
        benefits.push('🛡️ Protección de compras');
      }
      
      // Salas VIP
      if (card.perks?.loungeAccess) {
        benefits.push('👑 Acceso a salas VIP en aeropuertos');
      }
      
      // Sin comisión internacional
      if (card.fees?.foreignTransactionFee === 0) {
        benefits.push('🌎 Sin comisión por compras internacionales');
      }
      
      // App digital
      if (card.digital?.appRating && card.digital.appRating >= 4.5) {
        benefits.push(`📱 App excelente (${card.digital.appRating}/5)`);
      }
      
      // Tasa baja
      if (card.rates?.interestRateEA && card.rates.interestRateEA < 25) {
        benefits.push(`📉 Tasa competitiva: ${card.rates.interestRateEA}% EA`);
      }
    }
    
    // Limitar a 5 beneficios
    return benefits.slice(0, 5);
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

  // Generar razón de match legible y personalizada
  generateMatchReason(factor, userValue, cardValues, points) {
    if (points < 2) return null; // No mostrar matches débiles
    
    const valueLabels = {
      // Intereses
      travel: 'viajar',
      sports: 'deportes',
      entertainment: 'entretenimiento',
      dining: 'gastronomía',
      shopping: 'compras',
      education: 'educación',
      gaming: 'gaming y tecnología',
      family: 'familia',
      wellness: 'salud y bienestar',
      // Digital preference
      digital: '100% digital',
      hybrid: 'híbrido (app + oficinas)',
      traditional: 'atención presencial',
      // Fee sensitivity
      no_fee: 'sin cuota de manejo',
      flexible: 'beneficios sobre cuota',
      // Payment behavior
      full: 'pagar el total cada mes',
      sometimes: 'pago mixto',
      finance: 'pagar en cuotas',
      minimum: 'pago mínimo',
      // Card usage
      daily: 'compras diarias',
      big_purchases: 'compras grandes',
      services: 'servicios y suscripciones',
      online: 'compras internacionales',
      emergency: 'emergencias',
      balance_transfer: 'compra de cartera',
      // Shopping places
      exito: 'Éxito',
      carulla: 'Carulla',
      jumbo: 'Jumbo',
      olimpica: 'Olímpica',
      falabella: 'Falabella',
      rappi: 'Rappi',
      avianca: 'Avianca',
      latam: 'LATAM',
      netflix: 'streaming',
      spotify: 'Spotify',
      terpel: 'Terpel',
      // Values
      environment: 'medio ambiente',
      entrepreneurship: 'emprendimiento',
      inclusion: 'inclusión financiera',
      technology: 'tecnología',
      social_welfare: 'bienestar social'
    };

    const templates = {
      interests: (val) => {
        if (Array.isArray(val)) {
          const labels = val.map(v => valueLabels[v] || v).slice(0, 2);
          return `Te gusta ${labels.join(' y ')} → Tiene beneficios especiales para ti`;
        }
        return `Te gusta ${valueLabels[val] || val} → Beneficios alineados`;
      },
      digitalPreference: (val) => {
        if (val === 'digital') return 'Prefieres 100% digital → App premiada y sin filas';
        if (val === 'hybrid') return 'Prefieres híbrido → Buena app + sucursales';
        if (val === 'traditional') return 'Prefieres oficinas → Red amplia de sucursales';
        return null;
      },
      feeSensitivity: (val) => {
        if (val === 'no_fee') return 'Quieres sin cuota → Esta no cobra cuota de manejo';
        if (val === 'flexible') return 'Valoras beneficios → Excelente relación costo/beneficio';
        return null;
      },
      paymentBehavior: (val) => {
        if (val === 'full') return 'Pagas el total → Maximiza beneficios y rewards';
        if (val === 'finance' || val === 'minimum') return 'Financias compras → Tasa de interés competitiva';
        return null;
      },
      shoppingPlaces: (val) => {
        if (Array.isArray(val) && val.length > 0) {
          const labels = val.map(v => valueLabels[v] || v).slice(0, 2);
          return `Compras en ${labels.join(', ')} → Puntos extra en estos comercios`;
        }
        return null;
      },
      travelFreq: (val) => {
        if (val === '6+' || val === '3-5') return 'Viajas frecuentemente → Acumula millas rápido';
        if (val === '1-2') return 'Viajas ocasionalmente → Millas sin vencimiento';
        return null;
      },
      travelPreference: (val) => {
        if (val === 'miles') return 'Quieres millas → Programa de millas robusto';
        if (val === 'cashback') return 'Prefieres cashback → Devolución directa a tu bolsillo';
        if (val === 'vip') return 'Valoras experiencias → Acceso a salas VIP';
        return null;
      },
      cardUsage: (val) => {
        if (Array.isArray(val)) {
          if (val.includes('travel')) return 'Usarás para viajes → Seguro de viaje incluido';
          if (val.includes('online')) return 'Compras online → Sin comisión internacional';
          if (val.includes('daily')) return 'Uso diario → Cashback en todas las compras';
          if (val.includes('balance_transfer')) return 'Quieres compra de cartera → Tasa preferencial';
        }
        return null;
      },
      values: (val) => {
        if (Array.isArray(val)) {
          if (val.includes('environment')) return 'Te importa el ambiente → Tarjeta eco-friendly';
          if (val.includes('technology')) return 'Te gusta la tecnología → Innovación constante';
        }
        return null;
      },
      team: (val) => {
        if (val && val !== 'none') {
          return `Hincha de ${valueLabels[val] || val} → Beneficios exclusivos para fans`;
        }
        return null;
      }
    };

    const template = templates[factor];
    if (template) {
      return template(userValue);
    }
    
    return null;
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
