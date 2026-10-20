import { createClient } from '@supabase/supabase-js';
import { CONSENT_VERSION } from '../constants/legal.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Leads and clicks will not be saved.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// ID DE SESIÓN
// ============================================
// Se genera en el navegador (y se usa como quiz_sessions.id) para no tener que leer
// de vuelta la fila insertada: con RLS correcto la clave pública solo puede insertar.
export const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

// ============================================
// GUARDAR SESIÓN DEL QUIZ
// ============================================
export const saveQuizSession = async ({
  sessionId,
  answers,
  topMatch,
  alternatives,
  timeToComplete,
  vertical,
  user
}) => {
  if (!supabase) return false;

  const sessionData = {
    id: sessionId,

    // Dispositivo
    device_type: getDeviceType(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 500) : null,

    // Datos del usuario
    user_id: user?.id || null,
    user_email: user?.email || null,
    user_name: user?.user_metadata?.name || null,
    user_phone: user?.phone || user?.user_metadata?.phone || null,
    user_age: user?.age || user?.user_metadata?.age || null,
    user_gender: user?.gender || user?.user_metadata?.gender || null,
    user_city: user?.city || user?.user_metadata?.city || null,

    // Vertical (cards o credit)
    vertical: vertical,
    product_selection: answers?.product_selection || null,
    quiz_completed: true,

    // Respuestas completas en JSON (backup)
    answers: answers,

    // Respuestas individuales en columnas separadas
    ...extractIndividualAnswers(answers, vertical),

    // Resultado principal
    top_match_id: topMatch?.id || null,
    top_match_name: topMatch?.name || null,
    top_match_bank: getEntityName(topMatch),
    top_match_score: topMatch?.score ?? null,
    top_match_reasons: topMatch?.whyWinner || topMatch?.matchReasons || [],

    // Alternativas
    alternative_1_id: alternatives?.[0]?.id || null,
    alternative_1_score: alternatives?.[0]?.score ?? null,
    alternative_2_id: alternatives?.[1]?.id || null,
    alternative_2_score: alternatives?.[1]?.score ?? null,

    // Métricas
    time_to_complete_seconds: timeToComplete,

    // Consentimiento: solo true si la persona marcó la casilla
    accepted_terms: user?.termsAccepted === true,
    accepted_privacy: user?.termsAccepted === true,
    accepted_at: user?.termsAcceptedAt || null,
    accepted_marketing: user?.marketingAccepted === true, // casilla opcional de ofertas
    consent_version: user?.termsAccepted === true ? CONSENT_VERSION : null,

    created_at: new Date().toISOString()
  };

  // Sin .select(): la clave pública no tiene (ni debe tener) permiso de lectura.
  const { error } = await supabase.from('quiz_sessions').insert([sessionData]);

  if (error) {
    console.error('Error saving quiz session:', error);
    return false;
  }
  return true;
};

// ============================================
// REGISTRAR CLIC EN "APLICAR"
// ============================================
export const trackApplyClick = async ({ sessionId, product, rank, vertical }) => {
  if (!supabase || !product) return false;

  const { error } = await supabase.from('apply_clicks').insert([{
    session_id: sessionId || null,
    vertical: vertical || null,
    product_id: product.id || null,
    product_name: product.name || null,
    entity: getEntityName(product),
    rank: rank ?? null, // posición en resultados: 1 = mejor match
    score: product.score ?? null,
    apply_url: product.applyUrl || null,
    created_at: new Date().toISOString()
  }]);

  if (error) {
    console.error('Error tracking apply click:', error);
    return false;
  }
  return true;
};

const getDeviceType = () => {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
};

// `entity` es el campo normalizado (Fase 1); `bank`/`provider` quedan por compatibilidad.
export const getEntityName = (product) => product?.entity || product?.bank || product?.provider || null;

// ============================================
// EXTRAER RESPUESTAS INDIVIDUALES
// ============================================
const extractIndividualAnswers = (answers, vertical) => {
  if (!answers) return {};

  const result = {
    // Común
    answer_product_selection: answers.product_selection || null,
  };

  if (vertical === 'cards') {
    // Tarjetas
    result.answer_income = answers.income || null;
    result.answer_credit_history = answers.credit_history || null;
    result.answer_current_cards = answers.current_cards || null;
    result.answer_current_card_bank = answers.current_card_bank || null;
    result.answer_current_card_pain = Array.isArray(answers.current_card_pain) ? answers.current_card_pain : null;
    result.answer_payment_behavior = answers.payment_behavior || null;
    result.answer_monthly_spend = answers.monthly_spend ? parseInt(answers.monthly_spend) : null;
    result.answer_fee_sensitivity = answers.fee_sensitivity || null;
    result.answer_interests = Array.isArray(answers.interests) ? answers.interests : null;
    result.answer_shopping_places = Array.isArray(answers.shopping_places) ? answers.shopping_places : null;
    result.answer_travel_frequency = answers.travel_frequency || null;
    result.answer_travel_preference = answers.travel_preference || null;
    result.answer_digital_preference = answers.digital_preference || null;
  }

  if (vertical === 'credit') {
    // Crédito - Necesidad
    result.answer_loan_purpose = Array.isArray(answers.loan_purpose) ? answers.loan_purpose : null;
    result.answer_loan_amount = answers.loan_amount || null;
    result.answer_loan_urgency = answers.loan_urgency || null;
    result.answer_credit_destination = answers.credit_destination || null;

    // Crédito - Perfil Negocio
    result.answer_business_formalization = answers.business_formalization || null;
    result.answer_business_age = answers.business_age || null;
    result.answer_business_sector = answers.business_sector || null;
    result.answer_business_monthly_sales = answers.business_monthly_sales || null;

    // Crédito - Perfil Personal
    result.answer_employment_status = answers.employment_status || null;
    result.answer_monthly_income_personal = answers.monthly_income_personal || null;

    // Crédito - Perfil Iniciar Negocio
    result.answer_other_income_source = answers.other_income_source || null;
    result.answer_monthly_income_startup = answers.monthly_income_startup || null;

    // Crédito - Elegibilidad
    result.answer_credit_history_credit = answers.credit_history || null;
    result.answer_monthly_debt_payment = answers.monthly_debt_payment ? parseInt(answers.monthly_debt_payment) : null;
    result.answer_available_documents = Array.isArray(answers.available_documents) ? answers.available_documents : null;
    result.answer_entity_relationships = Array.isArray(answers.entity_relationships) ? answers.entity_relationships : null;

    // Crédito - Preferencias
    result.answer_priority_preference = answers.priority_preference || null;
    result.answer_process_preference = answers.process_preference || null;
    result.answer_desired_term = answers.desired_term || null;
    result.answer_about_you = answers.about_you || null;
    result.answer_loan_purpose_detail = answers.loan_purpose_detail || null;
  }

  return result;
};

// Las estadísticas de leads (por ciudad, ingreso, respuestas) se sacaron del frontend:
// leer `quiz_sessions` desde el navegador exige abrir la tabla a la clave pública.
// Se consultan desde el panel de Supabase o un backend con la service key.
