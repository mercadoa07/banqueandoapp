import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Analytics will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// GUARDAR SESIÓN DEL QUIZ
// ============================================
export const saveQuizSession = async ({ 
  answers, 
  topMatch, 
  alternatives, 
  timeToComplete,
  vertical,
  user 
}) => {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save');
    return null;
  }

  try {
    // Extraer respuestas individuales para columnas separadas
    const individualAnswers = extractIndividualAnswers(answers, vertical);

    const sessionData = {
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
      
      // Respuestas completas en JSON (backup)
      answers: answers,
      
      // Respuestas individuales en columnas separadas
      ...individualAnswers,
      
      // Resultado principal
      top_match_id: topMatch?.id || null,
      top_match_name: topMatch?.name || null,
      top_match_bank: topMatch?.bank || null,
      top_match_score: topMatch?.score || null,
      
      // Alternativas
      alternatives: alternatives?.map(a => ({
        id: a.id,
        name: a.name,
        bank: a.bank,
        score: a.score
      })) || [],
      
      // Métricas
      time_to_complete_seconds: timeToComplete,
      
      // Términos aceptados
      terms_accepted: user?.termsAccepted || false,
      terms_accepted_at: user?.termsAcceptedAt || null,
      
      // Timestamp
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz session:', error);
      throw error;
    }

    console.log('Quiz session saved:', data?.id);
    return data;
  } catch (error) {
    console.error('Error in saveQuizSession:', error);
    return null;
  }
};

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

// ============================================
// OTRAS FUNCIONES ÚTILES
// ============================================

// Obtener estadísticas de respuestas
export const getAnswerStats = async (vertical, questionId) => {
  if (!supabase) return null;

  const columnName = `answer_${questionId}`;
  
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select(columnName)
    .eq('vertical', vertical)
    .not(columnName, 'is', null);

  if (error) {
    console.error('Error getting answer stats:', error);
    return null;
  }

  // Contar frecuencias
  const counts = {};
  data.forEach(row => {
    const value = row[columnName];
    if (Array.isArray(value)) {
      value.forEach(v => {
        counts[v] = (counts[v] || 0) + 1;
      });
    } else {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  return counts;
};

// Obtener leads por ciudad
export const getLeadsByCity = async () => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('user_city')
    .not('user_city', 'is', null);

  if (error) {
    console.error('Error getting leads by city:', error);
    return null;
  }

  const counts = {};
  data.forEach(row => {
    const city = row.user_city;
    counts[city] = (counts[city] || 0) + 1;
  });

  return counts;
};

// Obtener leads por rango de ingreso
export const getLeadsByIncome = async (vertical = 'cards') => {
  if (!supabase) return null;

  const columnName = vertical === 'cards' ? 'answer_income' : 'answer_monthly_income_personal';
  
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select(columnName)
    .eq('vertical', vertical)
    .not(columnName, 'is', null);

  if (error) {
    console.error('Error getting leads by income:', error);
    return null;
  }

  const counts = {};
  data.forEach(row => {
    const income = row[columnName];
    counts[income] = (counts[income] || 0) + 1;
  });

  return counts;
};
