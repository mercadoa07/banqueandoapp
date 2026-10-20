import React from 'react';
import { Link } from 'react-router-dom';
import { CARD_COUNTS } from '../../constants/landing.js';
import { LEGAL_URLS } from '../../constants/legal.js';

// Franja oscura: por qué confiar, con hechos verificables en lugar de adjetivos.
export default function TrustBand() {
  const facts = [
    [`${CARD_COUNTS.verified} / ${CARD_COUNTS.active}`, 'Tarjetas verificadas', 'Cada dato viene de la hoja de tarifas oficial del banco, con su fecha.'],
    ['$0', 'Pagos por aparecer', 'El orden depende solo de tus respuestas. Si algún día hay comisión, lo diremos.'],
    ['0', 'Consultas a centrales', 'Comparar no afecta tu historial. Solo usamos lo que tú respondes.']
  ];
  return (
    <section id="confianza" className="bg-night text-night-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="font-display font-extrabold text-3xl md:text-[44px] leading-[1.08] tracking-[-0.03em] max-w-[18ch] mb-4 [text-wrap:balance]">
          Te mostramos lo que el banco no pone en grande.
        </h2>
        <p className="text-lg text-night-muted max-w-[52ch] mb-10">
          Revisamos las tarifas oficiales de cada producto y calculamos el costo real con tu forma de usarlo: cuota, intereses y lo que te devuelve.
        </p>
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {facts.map(([num, title, text]) => (
            <div key={title} className="min-w-0">
              <p className="font-display font-extrabold text-[44px] leading-none tracking-[-0.03em] mb-3">{num}</p>
              <h3 className="font-display font-bold text-lg mb-1.5">{title}</h3>
              <p className="text-night-muted max-w-[34ch]">{text}</p>
            </div>
          ))}
        </div>
        <Link to={LEGAL_URLS.howWeRecommend} className="inline-block mt-10 text-night-accent font-semibold hover:underline">
          Cómo recomendamos →
        </Link>
      </div>
    </section>
  );
}
