import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Privacy, Terms, HowWeRecommend } from './Legal.jsx';
import { LEGAL_ENTITY, CONSENT_VERSION } from '../constants/legal.js';

const renderPage = (Page) => render(<MemoryRouter><Page /></MemoryRouter>);

describe('páginas legales', () => {
  it('la política explica derechos, plazos y que no se comparten datos', () => {
    renderPage(Privacy);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/tratamiento de datos/);
    expect(screen.getByText(/Ley 1581 de 2012/)).toBeTruthy();
    expect(screen.getByText(/No vendemos ni compartimos tus datos personales/)).toBeTruthy();
    expect(screen.getByText(/10 días hábiles/)).toBeTruthy();
    expect(screen.getByText(/15 días hábiles/)).toBeTruthy();
  });

  it('los términos y "cómo recomendamos" dicen que nadie paga por el orden', () => {
    renderPage(Terms);
    expect(screen.getByText(/no recibe pagos de ninguna entidad/)).toBeTruthy();
    renderPage(HowWeRecommend);
    expect(screen.getByText(/Hoy ninguna nos paga/)).toBeTruthy();
  });

  it('la versión del consentimiento es una fecha válida', () => {
    expect(CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(CONSENT_VERSION))).toBe(false);
  });

  // Sin un correo de contacto la persona no puede ejercer sus derechos.
  it('hay un correo válido para consultas y reclamos, y nada queda "pendiente"', () => {
    expect(LEGAL_ENTITY.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    renderPage(Privacy);
    expect(screen.queryByText(/\[pendiente\]/)).toBeNull();
  });
});
