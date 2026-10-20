import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { HERO_EXAMPLE as ex } from '../../constants/landing.js';
import { formatCOP } from '../../lib/format.js';

const fmtDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtNum = (n) => n.toLocaleString('es-CO');
const fmtPct = (n) => `${String(n).replace('.', ',')}%`;

// Resultado de ejemplo: muestra desde el primer segundo lo que la persona va a recibir.
function ExampleResult() {
  return (
    <article className="bg-white border border-line rounded-3xl p-5 sm:p-6 shadow-[0_24px_60px_-32px_rgba(13,21,23,0.35)] min-w-0" aria-label="Ejemplo de resultado">
      <div className="flex justify-between items-start gap-3 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider bg-accent-soft text-accent px-2.5 py-1 rounded-full">Tu mejor opción</span>
        <span className="text-xs text-muted text-right">Tarifas verificadas<br />{fmtDate(ex.verified)}</span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-24 shrink-0 aspect-[1.586] rounded-lg bg-gradient-to-br from-[#22313A] to-ink" aria-hidden="true">
          <span className="absolute left-3 top-5 w-4 h-3 rounded-sm bg-gradient-to-br from-[#E4C98A] to-[#B9975A]" />
          <span className="absolute right-2 bottom-1.5 text-[10px] font-display font-extrabold italic text-white tracking-wide">{ex.network}</span>
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-lg leading-tight text-ink">{ex.name}</p>
          <p className="text-sm text-muted">{ex.entity}</p>
        </div>
      </div>

      <p className="font-display font-extrabold text-4xl sm:text-[44px] leading-none tracking-tight text-good">+{formatCOP(ex.net)}</p>
      <p className="text-sm text-muted mt-1.5 mb-4">te deja al año, ya descontada la cuota de manejo</p>

      <ul className="border-t border-line pt-3 mb-4 grid gap-2 text-sm tabular-nums">
        <li className="flex justify-between gap-3"><span>{fmtNum(ex.miles)} millas LATAM Pass</span><span className="font-semibold text-good">+{formatCOP(ex.milesValue)}</span></li>
        <li className="flex justify-between gap-3"><span>Cuota de manejo del año</span><span className="font-semibold text-bad">−{formatCOP(ex.annualFee)}</span></li>
        <li className="flex justify-between gap-3"><span>Intereses (pagas el total)</span><span>$0</span></li>
      </ul>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[[fmtPct(ex.rateEA), 'Tasa EA'], [`$${ex.minIncomeMillions}M`, 'Ingreso mínimo'], [ex.loungeVisits, 'Salas VIP al año']].map(([v, l]) => (
          <div key={l} className="bg-paper rounded-xl px-3 py-2.5">
            <b className="block font-display font-bold text-ink">{v}</b>
            <span className="text-xs text-muted">{l}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted mb-4">Por qué está primero: quieres acumular millas y pagas el total cada mes.</p>
      <p className="text-xs text-muted text-center">Ejemplo con un gasto de {formatCOP(ex.monthlySpend)} al mes</p>
    </article>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-12 items-center">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent mb-4">Comparador independiente · Colombia</p>
          <h1 className="font-display font-extrabold text-[40px] sm:text-6xl leading-[1.02] tracking-[-0.035em] text-ink mb-5 [text-wrap:balance]">
            Tu próxima tarjeta o crédito, <span className="text-muted">con números reales.</span>
          </h1>
          <p className="text-lg text-muted max-w-[34ch] mb-7">
            Respondes unas preguntas y te mostramos las tres opciones que más te convienen, cuánto ganas o pagas al año y por qué.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/quiz?tipo=tarjeta" className="bg-ink text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition-colors">Comparar tarjetas</Link>
            <Link to="/quiz?tipo=credito" className="bg-white text-ink border border-line px-6 py-3 rounded-full font-semibold hover:border-ink transition-colors">Comparar créditos</Link>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mt-6 text-sm text-muted">
            {['Gratis', 'No consulta centrales de riesgo', 'Ninguna entidad paga por aparecer'].map(t => (
              <li key={t} className="flex items-center gap-1.5"><Check className="w-4 h-4 text-accent" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
        <ExampleResult />
      </div>
    </section>
  );
}
