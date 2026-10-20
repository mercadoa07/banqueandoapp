import React from 'react';
import { Link } from 'react-router-dom';

// Entrada directa al quiz de cada producto.
const CHOICES = [
  { to: '/quiz?tipo=tarjeta', title: 'Tarjetas de crédito', text: 'Sin cuota, con millas o con cashback. Según cómo pagas y en qué gastas.', go: '8 a 10 preguntas' },
  { to: '/quiz?tipo=credito', title: 'Créditos', text: 'Personales o para tu negocio, con la cuota estimada y si te cabe en el bolsillo.', go: '9 a 11 preguntas' }
];

export default function ChoicesSection() {
  return (
    <section id="empezar" className="bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em] text-ink mb-8">¿Qué quieres comparar?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {CHOICES.map(c => (
            <Link key={c.to} to={c.to} className="group bg-white border border-line hover:border-ink rounded-2xl p-6 md:p-7 flex flex-col gap-2.5 transition-colors min-w-0">
              <h3 className="font-display font-bold text-2xl tracking-tight text-ink">{c.title}</h3>
              <p className="text-muted">{c.text}</p>
              <span className="mt-2 font-semibold text-accent">{c.go} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
