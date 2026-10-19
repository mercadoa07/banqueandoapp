// Perfiles típicos para fijar (snapshot) y comparar lo que recomienda el motor.
export const CARD_PROFILES = {
  'primera tarjeta, ingreso bajo, sin cuota': { product_selection: 'nueva_tarjeta', income: '0-2', credit_history: 'none', payment_behavior: 'full', fee_sensitivity: 'no_fee', digital_preference: 'digital', interests: ['technology'], monthly_spend: 800000 },
  'viajero frecuente, ingreso alto': { product_selection: 'nueva_tarjeta', income: '10+', payment_behavior: 'full', fee_sensitivity: 'value_benefits', interests: ['travel'], travel_frequency: 'frequent', monthly_spend: 6000000 },
  'financia compras, ingreso medio': { product_selection: 'nueva_tarjeta', income: '4-6', payment_behavior: 'finance', fee_sensitivity: 'low_fee', interests: ['shopping'], monthly_spend: 2500000 },
  'cambiar tarjeta de Bancolombia por cuota alta': { product_selection: 'cambiar_tarjeta', income: '2-4', current_card_bank: 'bancolombia', current_card_pain: ['cuota_alta', 'app_mala'], payment_behavior: 'sometimes', fee_sensitivity: 'no_fee' },
  'reportado en centrales': { product_selection: 'nueva_tarjeta', income: '2-4', credit_history: 'reported', payment_behavior: 'full' },
  'sin responder ingreso': { product_selection: 'nueva_tarjeta', income: 'skip', payment_behavior: 'full', fee_sensitivity: 'no_fee' }
};

export const CREDIT_PROFILES = {
  'emergencia personal, urgente, independiente': { product_selection: 'necesito_credito', credit_destination: 'personal', monthly_income_personal: 'ingreso_1.5-3M', credit_history: 'historial_bueno', desired_term: 'plazo_medio', loan_purpose: ['emergencia_personal'], loan_amount: '1-5M', loan_urgency: 'inmediato', employment_status: 'independiente', priority_preference: 'prioridad_velocidad', process_preference: 'proceso_digital' },
  'consolidar deuda, busca tasa': { product_selection: 'necesito_credito', credit_destination: 'personal', monthly_income_personal: 'ingreso_5-10M', monthly_debt_payment: 1500000, credit_history: 'historial_excelente', desired_term: 'plazo_maximo', loan_purpose: ['consolidar_deuda'], loan_amount: '10-30M', loan_urgency: 'normal', employment_status: 'empleado', priority_preference: 'prioridad_tasa' },
  'reportado, monto pequeño': { product_selection: 'necesito_credito', credit_destination: 'personal', monthly_income_personal: 'ingreso_0-1.5M', desired_term: 'plazo_corto', loan_purpose: ['emergencia_personal'], loan_amount: '0-1M', loan_urgency: 'urgente', credit_history: 'historial_reportado' },
  'pyme formal, capital de trabajo': { product_selection: 'necesito_credito', credit_destination: 'negocio', business_monthly_sales: 'ventas_100M+', credit_history: 'historial_bueno', desired_term: 'plazo_largo', loan_purpose: ['capital_trabajo'], loan_amount: '50-100M', loan_urgency: 'normal', business_formalization: 'formal', priority_preference: 'prioridad_balance' },
  'micronegocio informal, inventario': { product_selection: 'necesito_credito', credit_destination: 'negocio', business_monthly_sales: 'ventas_0-5M', loan_purpose: ['inventario'], loan_amount: '1-5M', loan_urgency: 'urgente', business_formalization: 'informal', credit_history: 'sin_historial' },
  'cliente Bold': { product_selection: 'necesito_credito', credit_destination: 'negocio', loan_purpose: ['capital_trabajo'], loan_amount: '5-10M', entity_relationships: ['rel_bold'], business_formalization: 'formal' },
  'pide más de lo que puede pagar': { product_selection: 'necesito_credito', credit_destination: 'personal', loan_purpose: ['compra_especifica'], loan_amount: '30-50M', desired_term: 'plazo_corto', monthly_income_personal: 'ingreso_1.5-3M', credit_history: 'historial_bueno' }
};
