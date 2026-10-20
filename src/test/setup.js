import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());

// jsdom no implementa scrollTo (lo usan las páginas legales al abrir).
window.scrollTo = () => {};
