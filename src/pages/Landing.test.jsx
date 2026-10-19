// Fija el HTML completo de la página de inicio: separarla en secciones no debe cambiar nada visible.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing.jsx';

const renderLanding = () => render(<MemoryRouter><Landing /></MemoryRouter>);

describe('página de inicio', () => {
  it('renderiza igual que antes', () => {
    const { container } = renderLanding();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('los botones principales llevan al quiz', () => {
    renderLanding();
    const quizLinks = screen.getAllByRole('link').filter(a => a.getAttribute('href')?.startsWith('/quiz'));
    expect(quizLinks.length).toBeGreaterThan(0);
  });
});
