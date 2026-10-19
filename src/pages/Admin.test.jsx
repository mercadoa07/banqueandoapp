// El tablero con sesión simulada y datos de ejemplo (sin red).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const now = new Date().toISOString();
const DATA = {
  quiz_events: [
    { visit_id: 'A', event: 'quiz_start', vertical: null, created_at: now },
    { visit_id: 'A', event: 'vertical_selected', vertical: 'cards', created_at: now },
    { visit_id: 'A', event: 'question_view', vertical: 'cards', step: 0, question_id: 'income', created_at: now },
    { visit_id: 'A', event: 'registration_view', vertical: 'cards', created_at: now },
    { visit_id: 'A', event: 'results_view', vertical: 'cards', session_id: 's1', created_at: now },
    { visit_id: 'B', event: 'quiz_start', vertical: null, created_at: now }
  ],
  quiz_sessions: [{ id: 's1', created_at: now, vertical: 'cards', user_name: 'Ana Prueba', user_phone: '3001234567', user_email: 'ana@ejemplo.com', top_match_name: 'Nu Tarjeta de Crédito', top_match_bank: 'Nu Colombia' }],
  apply_clicks: [{ session_id: 's1', vertical: 'cards', product_id: 'nu_classic', product_name: 'Nu Tarjeta de Crédito', entity: 'Nu Colombia', rank: 1, created_at: now }]
};

let sessionEmail = 'apelismercado@gmail.com';
vi.mock('../lib/supabase.js', () => {
  const query = (table) => ({ select: () => ({ gte: () => ({ limit: async () => ({ data: DATA[table], error: null }) }) }) });
  return {
    supabase: {
      from: query,
      auth: {
        getSession: async () => ({ data: { session: sessionEmail ? { user: { email: sessionEmail } } : null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {},
        signInWithOtp: async () => ({ error: null })
      }
    }
  };
});

const { default: Admin } = await import('./Admin.jsx');

beforeEach(() => { sessionEmail = 'apelismercado@gmail.com'; });

describe('tablero /admin', () => {
  it('muestra KPIs, embudo, productos y leads al administrador', async () => {
    render(<Admin />);
    expect(await screen.findByText('Tablero Banqueando')).toBeTruthy();
    expect(await screen.findByText('Visitas al quiz')).toBeTruthy();
    expect(screen.getByText('50% de las visitas')).toBeTruthy(); // 1 lead / 2 visitas
    expect(screen.getByText('Embudo del quiz')).toBeTruthy();
    expect(screen.getAllByText('Nu Tarjeta de Crédito').length).toBeGreaterThan(0);
    expect(screen.getByText('Ana Prueba')).toBeTruthy();
    expect(screen.getByRole('link', { name: '3001234567' }).getAttribute('href')).toBe('https://wa.me/573001234567');
    // Por pregunta solo con una vertical elegida (cada quiz tiene sus preguntas).
    expect(screen.getByText(/Elige «Tarjetas» o «Crédito»/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tarjetas' }));
    expect(screen.getByText(/1\. ¿Cuál es tu ingreso mensual aproximado\?/)).toBeTruthy();
  });

  it('sin sesión pide el correo', async () => {
    sessionEmail = null;
    render(<Admin />);
    expect(await screen.findByRole('button', { name: 'Enviarme el enlace' })).toBeTruthy();
  });

  it('otra cuenta no ve datos', async () => {
    sessionEmail = 'otro@correo.com';
    render(<Admin />);
    expect(await screen.findByText(/no tiene acceso al tablero/)).toBeTruthy();
    expect(screen.queryByText('Ana Prueba')).toBeNull();
  });
});
