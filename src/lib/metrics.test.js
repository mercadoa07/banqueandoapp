import { describe, it, expect } from 'vitest';
import { funnel, questionReach, topProducts, leadsByDay, computeDashboard } from './metrics.js';

const NOW = Date.parse('2026-10-19T17:00:00Z');
const at = (daysAgo) => new Date(NOW - daysAgo * 86400000).toISOString();
const ev = (visit_id, event, extra = {}) => ({ visit_id, event, created_at: at(1), vertical: 'cards', ...extra });

// 3 visitas: A llega hasta el clic, B abandona en la pregunta 2, C solo empieza.
const events = [
  ev('A', 'quiz_start', { vertical: null }), ev('A', 'vertical_selected'),
  ...[0, 1, 2, 3, 4, 5].map(i => ev('A', 'question_view', { step: i, question_id: `q${i}` })),
  ev('A', 'registration_view'), ev('A', 'results_view', { session_id: 's1' }),
  ev('B', 'quiz_start', { vertical: null }), ev('B', 'vertical_selected'),
  ev('B', 'question_view', { step: 0, question_id: 'q0' }), ev('B', 'question_view', { step: 1, question_id: 'q1' }),
  ev('B', 'question_view', { step: 1, question_id: 'q1' }), // volvió a ver la misma: cuenta una vez
  ev('C', 'quiz_start', { vertical: null })
];
const clicks = [{ session_id: 's1', product_id: 'nu', product_name: 'Nu', entity: 'Nu Colombia', vertical: 'cards', created_at: at(1) }];
const sessions = [{ id: 's1', vertical: 'cards', created_at: at(1) }, { id: 's2', vertical: 'credit', created_at: at(40) }];

describe('funnel', () => {
  it('cuenta visitas únicas por paso y su porcentaje', () => {
    const f = funnel(events, clicks);
    expect(f.map(s => s.count)).toEqual([3, 2, 2, 1, 1, 1, 1]);
    expect(f[1]).toMatchObject({ label: 'Eligió producto', ofStart: 66.7, fromPrevious: 66.7 });
    expect(f.at(-1).label).toBe('Clic en Solicitar');
  });
});

describe('questionReach', () => {
  it('muestra cuántos vieron cada pregunta y cuántos se perdieron', () => {
    const q = questionReach(events);
    expect(q.slice(0, 3)).toEqual([
      { questionId: 'q0', step: 0, count: 2, lost: 0 },
      { questionId: 'q1', step: 1, count: 2, lost: 0 },
      { questionId: 'q2', step: 2, count: 1, lost: 1 }
    ]);
  });
});

describe('topProducts y leadsByDay', () => {
  it('ordena productos por clics', () => {
    expect(topProducts([...clicks, ...clicks, { product_id: 'r', product_name: 'Rappi', created_at: at(1) }])[0]).toMatchObject({ productId: 'nu', clicks: 2 });
  });
  it('incluye días en cero', () => {
    const d = leadsByDay(sessions, 7, NOW);
    expect(d).toHaveLength(7);
    expect(d.reduce((s, x) => s + x.count, 0)).toBe(1);
  });
});

describe('computeDashboard', () => {
  it('filtra por rango de días', () => {
    expect(computeDashboard({ events, sessions, clicks }, { days: 30, now: NOW }).kpis).toMatchObject({ visits: 3, leads: 1, conversion: 33.3, clicks: 1, clickRate: 100 });
    expect(computeDashboard({ events, sessions, clicks }, { days: 90, now: NOW }).kpis.leads).toBe(2);
  });
  it('filtra por vertical sin perder las visitas que aún no la eligieron', () => {
    const d = computeDashboard({ events, sessions, clicks }, { days: 90, vertical: 'credit', now: NOW });
    expect(d.kpis).toMatchObject({ visits: 3, leads: 1, clicks: 0 });
  });
  it('marca los leads que dieron clic', () => {
    expect(computeDashboard({ events, sessions, clicks }, { days: 90, now: NOW }).recent.find(s => s.id === 's1').clicked).toBe(true);
  });
});
