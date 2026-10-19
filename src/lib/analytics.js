// Registro anónimo de los pasos del quiz (tabla quiz_events) para medir dónde abandona la gente.
// Sin datos personales: solo un id de visita aleatorio, el paso y la vertical.
// Nunca bloquea al usuario: si falla, se ignora.
import { supabase } from './supabase.js';

export const QUIZ_EVENTS = ['quiz_start', 'vertical_selected', 'question_view', 'registration_view', 'results_view'];

export function trackEvent(visitId, event, { vertical = null, step = null, questionId = null, sessionId = null } = {}) {
  if (!supabase || !visitId) return;
  supabase.from('quiz_events')
    .insert([{ visit_id: visitId, event, vertical, step, question_id: questionId, session_id: sessionId }])
    .then(({ error }) => { if (error) console.warn('[analytics]', error.message); }, () => {});
}
