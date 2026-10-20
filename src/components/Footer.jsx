import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';
import { LEGAL_URLS, LEGAL_ENTITY } from '../constants/legal.js';

// Enlaces a las guías (src/lib/guides.js). Se escriben aquí para no cargar la lógica de las guías en el inicio.
const GUIDES = [
  ['/tarjetas/sin-cuota-de-manejo', 'Tarjetas sin cuota de manejo'],
  ['/tarjetas/con-millas', 'Tarjetas con millas'],
  ['/tarjetas/primera-tarjeta', 'Primera tarjeta'],
  ['/creditos/para-reportados', 'Créditos para reportados'],
  ['/creditos/para-negocio-informal', 'Créditos para negocio informal'],
  ['/creditos/de-libranza', 'Créditos de libranza'],
  ['/creditos/desembolso-rapido', 'Créditos rápidos']
];

const Footer = () => (
  <footer className="bg-white border-t border-line">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
      <div className="min-w-0">
        <BrandLogo />
        <p className="text-muted mt-4 max-w-[46ch]">
          Compara tarjetas de crédito y créditos en Colombia según tu perfil. No somos un banco ni damos asesoría financiera: te ayudamos a comparar.
        </p>
      </div>
      <div>
        <h3 className="font-display font-bold text-ink mb-3">Comparar</h3>
        <ul className="space-y-2">
          <li><Link to="/quiz?tipo=tarjeta" className="text-muted hover:text-ink">Tarjetas de crédito</Link></li>
          <li><Link to="/quiz?tipo=credito" className="text-muted hover:text-ink">Créditos</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-display font-bold text-ink mb-3">Guías</h3>
        <ul className="space-y-2">
          {GUIDES.map(([to, label]) => <li key={to}><Link to={to} className="text-muted hover:text-ink">{label}</Link></li>)}
        </ul>
      </div>
      <div>
        <h3 className="font-display font-bold text-ink mb-3">Legal</h3>
        <ul className="space-y-2">
          <li><Link to={LEGAL_URLS.howWeRecommend} className="text-muted hover:text-ink">Cómo recomendamos</Link></li>
          <li><Link to={LEGAL_URLS.terms} className="text-muted hover:text-ink">Términos y condiciones</Link></li>
          <li><Link to={LEGAL_URLS.privacy} className="text-muted hover:text-ink">Política de datos</Link></li>
          {LEGAL_ENTITY.email && <li><a href={`mailto:${LEGAL_ENTITY.email}`} className="text-muted hover:text-ink">Contacto</a></li>}
        </ul>
      </div>
    </div>
    <div className="border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted flex flex-wrap justify-between gap-2">
        <p>© {new Date().getFullYear()} Banqueando. Comparador independiente de tarjetas y créditos en Colombia.</p>
        <p>Las condiciones finales las define cada entidad.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
