import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo.jsx';
import { LEGAL_URLS } from '../constants/legal.js';

const LINKS = [
  { to: '/quiz?tipo=tarjeta', label: 'Tarjetas' },
  { to: '/quiz?tipo=credito', label: 'Créditos' },
  { to: LEGAL_URLS.howWeRecommend, label: 'Cómo recomendamos' }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-line sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <BrandLogo />

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} className="text-muted hover:text-ink font-medium transition-colors">{l.label}</Link>
            ))}
            <Link to="/quiz" className="bg-ink text-white px-5 py-2.5 rounded-full font-semibold hover:bg-black transition-colors">
              Comparar
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/quiz" className="bg-ink text-white px-4 py-2 rounded-full font-semibold text-sm">Comparar</Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-ink"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-line">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-3 text-ink font-medium border-b border-line last:border-0">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
