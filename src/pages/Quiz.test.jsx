// Recorre el quiz completo como lo haría una persona. Protege el flujo durante la reorganización:
// mismas pantallas, mismos resultados, mismos datos enviados a Supabase.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from './Quiz.jsx';
import { saveQuizSession, trackApplyClick } from '../lib/supabase.js';

vi.mock('../lib/supabase.js', async (importOriginal) => ({
  ...(await importOriginal()),
  saveQuizSession: vi.fn(async () => true),
  trackApplyClick: vi.fn(async () => true)
}));

const NAV = /^(Anterior|Siguiente|Ver Resultados)$/;
const buttonText = (b) => b.textContent.trim();

// Responde cada pregunta con su primera opción (o la deja como viene si es slider/texto).
async function answerAllQuestions() {
  for (let i = 0; i < 40 && !document.querySelector('input[type=tel]'); i++) {
    const options = screen.getAllByRole('button').filter(b => !NAV.test(buttonText(b)) && !b.disabled);
    if (options.length) fireEvent.click(options[0]);
    fireEvent.click(screen.getAllByRole('button').find(b => /^(Siguiente|Ver Resultados)$/.test(buttonText(b))));
  }
  expect(document.querySelector('input[type=tel]')).not.toBeNull();
}

async function startAndChoose(optionLabel) {
  render(<Quiz />);
  fireEvent.click(await screen.findByRole('button', { name: /Empezar Quiz/ }));
  fireEvent.click(screen.getByText(optionLabel).closest('button'));
}

function fillRegistration({ phone = '+57 300 123 4567', email = ' prueba@ejemplo.com ' } = {}) {
  fireEvent.change(screen.getByPlaceholderText('Ej: 3001234567'), { target: { value: phone } });
  fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: email } });
  // Solo la autorización obligatoria; la de ofertas queda sin marcar.
  fireEvent.click(screen.getByRole('checkbox', { name: /Acepto los Términos/ }));
}

const resultsSummary = () => screen.getAllByRole('heading', { level: 3 })
  .map(h => h.textContent)
  .filter(t => !/^(IMPORTANTE)/.test(t));

beforeEach(() => {
  vi.clearAllMocks();
  window.open = vi.fn();
});

describe('quiz de tarjetas', () => {
  it('recorre el flujo completo, guarda la sesión y registra el clic en Solicitar', async () => {
    await startAndChoose('Nueva tarjeta de crédito');
    await answerAllQuestions();

    // El botón de enviar solo se habilita con celular válido, email y consentimiento.
    const submit = screen.getByRole('button', { name: /Ver mi resultado/ });
    expect(submit.disabled).toBe(true);
    fillRegistration();
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);

    expect(await screen.findByText('MEJOR MATCH', {}, { timeout: 4000 })).toBeTruthy();
    expect(screen.getByText(/Analizamos \d+ tarjetas para ti/)).toBeTruthy();
    expect(screen.getByText(/no es asesoría financiera/)).toBeTruthy();
    expect(resultsSummary()).toMatchSnapshot();

    expect(saveQuizSession).toHaveBeenCalledTimes(1);
    const session = saveQuizSession.mock.calls[0][0];
    expect(session.vertical).toBe('cards');
    expect(session.sessionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(session.user).toMatchObject({ phone: '3001234567', email: 'prueba@ejemplo.com', termsAccepted: true, marketingAccepted: false, age: null, city: null });
    expect(session.answers.product_selection).toBe('nueva_tarjeta');

    fireEvent.click(screen.getByRole('button', { name: /Solicitar Ahora/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }));
    expect(trackApplyClick).toHaveBeenCalledTimes(1);
    expect(trackApplyClick.mock.calls[0][0]).toMatchObject({ sessionId: session.sessionId, rank: 1, vertical: 'cards', product: { id: session.topMatch.id } });
    expect(window.open).toHaveBeenCalledWith(session.topMatch.applyUrl, '_blank', 'noopener');
  });

  it('rechaza un celular que no es colombiano', async () => {
    await startAndChoose('Nueva tarjeta de crédito');
    await answerAllQuestions();
    fillRegistration({ phone: '12345' });
    expect(screen.getByText(/10 dígitos que empiece por 3/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ver mi resultado/ }).disabled).toBe(true);
  });
});

describe('quiz de crédito', () => {
  it('recorre el flujo completo y muestra la entidad de cada crédito', async () => {
    await startAndChoose('Necesito dinero / Crédito');
    await answerAllQuestions();
    fillRegistration();
    fireEvent.click(screen.getByRole('button', { name: /Ver mi resultado/ }));

    expect(await screen.findByText('MEJOR MATCH', {}, { timeout: 4000 })).toBeTruthy();
    expect(screen.getByText(/Analizamos \d+ opciones de crédito para ti/)).toBeTruthy();
    expect(resultsSummary()).toMatchSnapshot();
    expect(saveQuizSession.mock.calls[0][0].vertical).toBe('credit');
    expect(screen.getAllByText('Tipo de crédito').length).toBeGreaterThan(0);
  });

  it('"Volver a empezar" regresa a la pantalla inicial', async () => {
    await startAndChoose('Necesito dinero / Crédito');
    await answerAllQuestions();
    fillRegistration();
    fireEvent.click(screen.getByRole('button', { name: /Ver mi resultado/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Volver a empezar/ }, { timeout: 4000 }));
    expect(screen.getByRole('button', { name: /Empezar Quiz/ })).toBeTruthy();
  });
});
