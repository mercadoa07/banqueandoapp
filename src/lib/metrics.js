// Agregaciones del tablero interno a partir de las filas crudas de Supabase.
// Funciones puras: se prueban sin red y no dependen de React.

const DAY_MS = 86400000;

export const inRange = (rows, days, now = Date.now()) =>
  (days ? rows.filter(r => now - Date.parse(r.created_at) <= days * DAY_MS) : rows);

const distinct = (rows, key = 'visit_id') => new Set(rows.map(r => r[key]).filter(Boolean)).size;
const pct = (part, total) => (total ? Math.round((part / total) * 1000) / 10 : 0);

/**
 * Embudo por visitas únicas. Cada paso cuenta visitas que llegaron al menos hasta ahí.
 * "Mitad del quiz" = vieron la pregunta 5 o una posterior.
 */
export function funnel(events, clicks) {
  const by = (pred) => new Set(events.filter(pred).map(e => e.visit_id));
  const sessionToVisit = new Map(events.filter(e => e.event === 'results_view' && e.session_id).map(e => [e.session_id, e.visit_id]));
  const clickedVisits = new Set(clicks.map(c => sessionToVisit.get(c.session_id)).filter(Boolean));
  const steps = [
    ['Empezó el quiz', by(e => e.event === 'quiz_start')],
    ['Eligió producto', by(e => e.event === 'vertical_selected')],
    ['Primera pregunta', by(e => e.event === 'question_view' && e.step === 0)],
    ['Mitad del quiz', by(e => e.event === 'question_view' && e.step >= 4)],
    ['Llegó al formulario', by(e => e.event === 'registration_view')],
    ['Vio sus resultados', by(e => e.event === 'results_view')],
    ['Clic en Solicitar', clickedVisits]
  ];
  const first = steps[0][1].size;
  return steps.map(([label, set], i) => {
    const prev = i ? steps[i - 1][1].size : set.size;
    return { label, count: set.size, ofStart: pct(set.size, first), fromPrevious: pct(set.size, prev) };
  });
}

// Visitas únicas que vieron cada pregunta, en el orden del quiz: muestra dónde se van.
export function questionReach(events) {
  const byQuestion = new Map();
  for (const e of events) {
    if (e.event !== 'question_view' || !e.question_id) continue;
    const q = byQuestion.get(e.question_id) || { questionId: e.question_id, step: e.step, visits: new Set() };
    q.step = Math.min(q.step, e.step);
    q.visits.add(e.visit_id);
    byQuestion.set(e.question_id, q);
  }
  const list = [...byQuestion.values()].sort((a, b) => a.step - b.step).map(q => ({ questionId: q.questionId, step: q.step, count: q.visits.size }));
  return list.map((q, i) => ({ ...q, lost: i ? Math.max(list[i - 1].count - q.count, 0) : 0 }));
}

export function topProducts(clicks, limit = 8) {
  const counts = new Map();
  for (const c of clicks) {
    const key = c.product_id || c.product_name;
    const row = counts.get(key) || { productId: c.product_id, name: c.product_name, entity: c.entity, clicks: 0 };
    row.clicks += 1;
    counts.set(key, row);
  }
  return [...counts.values()].sort((a, b) => b.clicks - a.clicks).slice(0, limit);
}

// Leads por día (hora de Colombia), incluyendo los días sin leads.
export function leadsByDay(sessions, days, now = Date.now()) {
  const toDay = (ms) => new Date(ms - 5 * 3600 * 1000).toISOString().slice(0, 10);
  const counts = new Map();
  for (let i = days - 1; i >= 0; i--) counts.set(toDay(now - i * DAY_MS), 0);
  for (const s of sessions) {
    const d = toDay(Date.parse(s.created_at));
    if (counts.has(d)) counts.set(d, counts.get(d) + 1);
  }
  return [...counts.entries()].map(([day, count]) => ({ day, count }));
}

export function computeDashboard({ events = [], sessions = [], clicks = [] }, { days = 30, vertical = 'all', now = Date.now() } = {}) {
  const byVertical = (rows) => (vertical === 'all' ? rows : rows.filter(r => r.vertical === vertical));
  const ev = byVertical(inRange(events, days, now)).concat(
    // quiz_start ocurre antes de elegir vertical: se incluye siempre para no subestimar visitas.
    vertical === 'all' ? [] : inRange(events, days, now).filter(e => e.event === 'quiz_start')
  );
  const se = byVertical(inRange(sessions, days, now));
  const cl = byVertical(inRange(clicks, days, now));
  const visits = distinct(ev.filter(e => e.event === 'quiz_start'));
  const clickedSessions = new Set(cl.map(c => c.session_id).filter(Boolean));
  return {
    kpis: {
      visits,
      leads: se.length,
      conversion: pct(se.length, visits),
      clicks: cl.length,
      leadsWithClick: se.filter(s => clickedSessions.has(s.id)).length,
      clickRate: pct(se.filter(s => clickedSessions.has(s.id)).length, se.length)
    },
    funnel: funnel(ev, cl),
    questions: questionReach(ev),
    products: topProducts(cl),
    perDay: leadsByDay(se, Math.min(days || 90, 90), now),
    recent: [...se].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 25)
      .map(s => ({ ...s, clicked: clickedSessions.has(s.id) }))
  };
}
