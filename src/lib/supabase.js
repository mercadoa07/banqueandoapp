/**
 * ============================================================
 * SUPABASE - Configuración y conexión
 * ============================================================
 * 
 * Este archivo conecta la app con Supabase para guardar
 * las sesiones del quiz y analytics.
 * 
 * UBICACIÓN: src/lib/supabase.js
 * ============================================================
 */

// Configuración de Supabase
const SUPABASE_URL = 'https://aaofldffwmqbkykyupii.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A3MAhIiNYXnzbBuEwBpAxw_moFD4Btc';

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
 */
export async function saveQuizSession({ answers, topMatch, alternatives, timeToComplete }) {
  const sessionData = {
    // Datos del dispositivo
    device_type: getDeviceType(),
    user_agent: navigator.userAgent.substring(0, 500), // Limitar longitud
    
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
