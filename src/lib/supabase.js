/**
 * ============================================================
 * SUPABASE - Configuración, Auth y Analytics
 * ============================================================
 * 
 * Este archivo conecta la app con Supabase para:
 * - Autenticación con Google
 * - Guardar sesiones del quiz
 * - Analytics
 * 
 * UBICACIÓN: src/lib/supabase.js
 * ============================================================
 */

// Configuración de Supabase
const SUPABASE_URL = 'https://aaofldffwmqbkykyupii.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A3MAhIiNYXnzbBuEwBpAxw_moFD4Btc';

// URL de redirección después del login
const REDIRECT_URL = window.location.origin;

/**
 * Cliente simple de Supabase (sin dependencias externas)
 * Usamos fetch nativo para no agregar librerías
 */
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.headers = {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
  }

  /**
   * Insertar un registro en una tabla
   */
  async insert(table, data) {
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[Supabase] Error inserting:', error);
        return { error };
      }

      return { success: true };
    } catch (error) {
      console.error('[Supabase] Network error:', error);
      return { error: error.message };
    }
  }

  /**
   * Obtener registros de una tabla
   */
  async select(table, options = {}) {
    try {
      let url = `${this.url}/rest/v1/${table}?select=*`;
      
      if (options.limit) {
        url += `&limit=${options.limit}`;
      }
      if (options.order) {
        url += `&order=${options.order}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[Supabase] Error selecting:', error);
        return { error, data: [] };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('[Supabase] Network error:', error);
      return { error: error.message, data: [] };
    }
  }
}

// Crear instancia del cliente
export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * ============================================================
 * FUNCIONES DE AUTENTICACIÓN
 * ============================================================
 */

/**
 * Iniciar sesión con Google
 */
export async function signInWithGoogle() {
  try {
    const redirectTo = `${REDIRECT_URL}?auth=callback`;
    const authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    
    // Guardar estado del quiz antes de redirigir
    const quizState = sessionStorage.getItem('banqueando_quiz_state');
    if (quizState) {
      sessionStorage.setItem('banqueando_quiz_state_backup', quizState);
    }
    
    // Redirigir a Google
    window.location.href = authUrl;
    
    return { success: true };
  } catch (error) {
    console.error('[Auth] Error con Google:', error);
    return { error: error.message };
  }
}

/**
 * Obtener sesión actual del usuario
 */
export async function getSession() {
  try {
    // Buscar token en URL (después de callback)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Obtener datos del usuario
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        
        // Recuperar teléfono guardado antes del login
        const savedPhone = sessionStorage.getItem('banqueando_phone');
        if (savedPhone) {
          user.phone = savedPhone;
          user.user_metadata = user.user_metadata || {};
          user.user_metadata.phone = savedPhone;
        }
        
        // Guardar en sessionStorage
        sessionStorage.setItem('banqueando_user', JSON.stringify(user));
        sessionStorage.setItem('banqueando_token', accessToken);
        return { user, accessToken };
      }
    }
    
    // Buscar sesión guardada
    const savedUser = sessionStorage.getItem('banqueando_user');
    const savedToken = sessionStorage.getItem('banqueando_token');
    
    if (savedUser && savedToken) {
      return { user: JSON.parse(savedUser), accessToken: savedToken };
    }
    
    return { user: null };
  } catch (error) {
    console.error('[Auth] Error obteniendo sesión:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Cerrar sesión
 */
export function signOut() {
  sessionStorage.removeItem('banqueando_user');
  sessionStorage.removeItem('banqueando_token');
  sessionStorage.removeItem('banqueando_quiz_state');
  return { success: true };
}

/**
 * Guardar estado del quiz (para recuperar después del login)
 */
export function saveQuizState(state) {
  sessionStorage.setItem('banqueando_quiz_state', JSON.stringify(state));
}

/**
 * Recuperar estado del quiz
 */
export function getQuizState() {
  const state = sessionStorage.getItem('banqueando_quiz_state') 
    || sessionStorage.getItem('banqueando_quiz_state_backup');
  
  // Limpiar backup
  sessionStorage.removeItem('banqueando_quiz_state_backup');
  
  return state ? JSON.parse(state) : null;
}

/**
 * ============================================================
 * FUNCIONES DE ANALYTICS
 * ============================================================
 */

/**
 * Detectar tipo de dispositivo
 */
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Guardar sesión del quiz
 * 
 * @param {Object} params
 * @param {Object} params.answers - Respuestas del usuario
 * @param {Object} params.topMatch - Tarjeta ganadora
 * @param {Array} params.alternatives - Tarjetas alternativas
 * @param {number} params.timeToComplete - Tiempo en segundos
 * @param {Object} params.user - Usuario autenticado (opcional)
 */
export async function saveQuizSession({ answers, topMatch, alternatives, timeToComplete, user }) {
  const sessionData = {
    // Datos del dispositivo
    device_type: getDeviceType(),
    user_agent: navigator.userAgent.substring(0, 500),
    
    // Datos del usuario (si está autenticado)
    user_id: user?.id || null,
    user_email: user?.email || null,
    user_name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
    user_phone: user?.user_metadata?.phone || user?.phone || null,
    
    // Aceptación de términos legales
    accepted_terms: user?.termsAccepted || true,
    accepted_privacy: user?.termsAccepted || true,
    accepted_at: user?.termsAcceptedAt || new Date().toISOString(),
    
    // Respuestas del quiz
    answers: answers,
    
    // Resultado principal
    top_match_id: topMatch?.id || null,
    top_match_name: topMatch?.name || null,
    top_match_score: topMatch?.score || null,
    top_match_reasons: topMatch?.matchReasons || topMatch?.reasons || [],
    
    // Alternativas
    alternative_1_id: alternatives?.[0]?.id || null,
    alternative_1_score: alternatives?.[0]?.score || null,
    alternative_2_id: alternatives?.[1]?.id || null,
    alternative_2_score: alternatives?.[1]?.score || null,
    
    // Metadata
    quiz_completed: true,
    time_to_complete_seconds: timeToComplete || null
  };

  console.log('[Analytics] Guardando sesión:', sessionData);
  
  const result = await supabase.insert('quiz_sessions', sessionData);
  
  if (result.error) {
    console.error('[Analytics] Error guardando sesión:', result.error);
  } else {
    console.log('[Analytics] ✅ Sesión guardada exitosamente');
  }
  
  return result;
}

/**
 * Obtener estadísticas básicas (para dashboard futuro)
 */
export async function getStats() {
  const { data, error } = await supabase.select('quiz_sessions', {
    order: 'created_at.desc',
    limit: 100
  });
  
  if (error) {
    return { error };
  }
  
  // Calcular estadísticas
  const stats = {
    totalSessions: data.length,
    byDevice: {},
    topMatchWins: {},
    avgScore: 0
  };
  
  let totalScore = 0;
  
  data.forEach(session => {
    // Por dispositivo
    const device = session.device_type || 'unknown';
    stats.byDevice[device] = (stats.byDevice[device] || 0) + 1;
    
    // Por tarjeta ganadora
    const winner = session.top_match_name || 'unknown';
    stats.topMatchWins[winner] = (stats.topMatchWins[winner] || 0) + 1;
    
    // Score promedio
    if (session.top_match_score) {
      totalScore += session.top_match_score;
    }
  });
  
  stats.avgScore = data.length > 0 ? Math.round(totalScore / data.length) : 0;
  
  return { stats, data };
}

export default supabase;
