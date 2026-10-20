import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cardsData from '../../config/cards.json';
import creditData from '../../config/creditProducts.json';
import { findGuide, guideProducts, GUIDE_KINDS } from '../lib/guides.js';
import { annualFeeCost } from '../engine/finance.js';
import { formatCOP, formatMillions } from '../lib/format.js';
import { getEntityName, trackApplyClick } from '../lib/supabase.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { LEGAL_URLS } from '../constants/legal.js';

const fmtDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtPct = (n) => `${String(n).replace('.', ',')}%`;
const hoursLabel = (h) => (h == null ? 'Sin dato' : h <= 24 ? 'Menos de 24 horas' : h <= 72 ? '1 a 3 días' : 'Más de 3 días');

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-display font-bold text-ink">{value}</p>
    </div>
  );
}

function ApplyLink({ product, kind, rank }) {
  const onClick = () => { trackApplyClick({ sessionId: null, product, rank, vertical: kind === 'tarjetas' ? 'cards' : 'credit' }).catch(() => {}); };
  return (
    <a href={product.applyUrl} target="_blank" rel="noopener noreferrer" onClick={onClick} className="text-sm font-semibold text-accent hover:underline">
      Ver en el sitio de la entidad →
    </a>
  );
}

function CardItem({ card, rank }) {
  const fee = annualFeeCost(card);
  return (
    <li className="bg-white border border-line rounded-2xl p-5 grid gap-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg text-ink">{card.name}</h3>
          <p className="text-sm text-muted">{getEntityName(card)}</p>
        </div>
        {card.lastVerified && <span className="text-xs text-muted self-start">Verificada {fmtDate(card.lastVerified)}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Fact label="Cuota de manejo" value={fee === 0 ? '$0' : `${formatCOP(fee / 12)}/mes`} />
        <Fact label="Tasa" value={`${fmtPct(card.rates.interestRateEA)} EA${/tasa sin confirmar/i.test(card.source?.notes || '') ? ' (por confirmar)' : ''}`} />
        <Fact label="Ingreso mínimo" value={card.requirements?.minIncomeMillions ? formatMillions(card.requirements.minIncomeMillions) : 'Sin mínimo publicado'} />
      </div>
      {card.fees?.feeWaiverCondition && <p className="text-sm text-ink bg-paper rounded-xl px-3 py-2"><b>Cuota:</b> {card.fees.feeWaiverCondition}</p>}
      <ul className="text-sm text-muted list-disc pl-5 space-y-1">
        {(card.benefits || []).slice(0, 3).map(b => <li key={b}>{b}</li>)}
      </ul>
      <ApplyLink product={card} kind="tarjetas" rank={rank} />
    </li>
  );
}

function CreditItem({ product, rank }) {
  const rate = product.loanDetails?.interestRateEA;
  return (
    <li className="bg-white border border-line rounded-2xl p-5 grid gap-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg text-ink">{product.name}</h3>
          <p className="text-sm text-muted">{product.productType}</p>
        </div>
        {product.lastVerified && <span className="text-xs text-muted self-start">Verificado {fmtDate(product.lastVerified)}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Fact label="Monto" value={`${formatMillions(product.loanDetails?.minAmountMillions)} – ${formatMillions(product.loanDetails?.maxAmountMillions)}`} />
        <Fact label="Tasa" value={rate ? (rate.min === rate.max ? `${fmtPct(rate.max)} EA` : `${fmtPct(rate.min)} – ${fmtPct(rate.max)} EA`) : 'Sin dato'} />
        <Fact label="Desembolso" value={hoursLabel(product.loanDetails?.disbursementTimeHours)} />
      </div>
      {product.fit?.why && <p className="text-sm text-ink bg-paper rounded-xl px-3 py-2">{product.fit.why}</p>}
      <ApplyLink product={product} kind="creditos" rank={rank} />
    </li>
  );
}

function NotFound() {
  usePageMeta('Página no encontrada | Banqueando', null, { noindex: true });
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <h1 className="font-display font-extrabold text-3xl text-ink mb-4">No encontramos esta guía</h1>
      <Link to="/" className="text-accent font-semibold">Volver al inicio →</Link>
    </div>
  );
}

export default function Guide({ kind }) {
  const { slug } = useParams();
  const guide = findGuide(kind, slug);
  usePageMeta(guide ? `${guide.metaTitle} | Banqueando` : 'Banqueando', guide?.description);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const products = guide ? guideProducts(guide, kind, kind === 'tarjetas' ? cardsData : creditData) : [];
  const others = Object.entries(GUIDE_KINDS).flatMap(([k, list]) => list.map(g => ({ ...g, kind: k }))).filter(g => !(g.kind === kind && g.slug === slug));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      {!guide ? <NotFound /> : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent mb-3">{kind === 'tarjetas' ? 'Guía de tarjetas' : 'Guía de créditos'}</p>
          <h1 className="font-display font-extrabold text-[34px] sm:text-5xl leading-[1.05] tracking-[-0.03em] mb-5 [text-wrap:balance]">{guide.title}</h1>
          <p className="text-lg text-muted max-w-[62ch] mb-8">{guide.intro}</p>

          <div className="bg-ink text-white rounded-2xl p-6 mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-[46ch]">¿Cuál te conviene a ti? Responde unas preguntas y te mostramos las tres mejores para tu caso, con cuánto ganas o pagas al año.</p>
            <Link to={guide.quiz} className="bg-white text-ink px-5 py-2.5 rounded-full font-semibold whitespace-nowrap">Comparar gratis</Link>
          </div>

          <h2 className="font-display font-bold text-2xl mb-4">{products.length} {kind === 'tarjetas' ? (products.length === 1 ? 'tarjeta' : 'tarjetas') : (products.length === 1 ? 'crédito' : 'créditos')} que aplican</h2>
          <ol className="grid gap-4 mb-12">
            {products.map((p, i) => kind === 'tarjetas' ? <CardItem key={p.id} card={p} rank={i + 1} /> : <CreditItem key={p.id} product={p} rank={i + 1} />)}
          </ol>

          <h2 className="font-display font-bold text-2xl mb-4">Qué mirar antes de elegir</h2>
          <ul className="grid gap-2 text-muted list-disc pl-5 mb-12 max-w-[65ch]">
            {guide.tips.map(t => <li key={t}>{t}</li>)}
          </ul>

          <p className="text-sm text-muted border-t border-line pt-6 mb-10 max-w-[70ch]">
            Datos tomados de las tarifas oficiales de cada entidad en la fecha indicada. Pueden cambiar: confirma las condiciones en el sitio de la entidad antes de solicitar. Banqueando no es asesoría financiera y ninguna entidad paga por aparecer. <Link to={LEGAL_URLS.howWeRecommend} className="text-accent underline">Cómo recomendamos</Link>
          </p>

          <h2 className="font-display font-bold text-xl mb-3">Otras guías</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map(g => (
              <li key={`${g.kind}/${g.slug}`}><Link to={`/${g.kind}/${g.slug}`} className="inline-block bg-white border border-line hover:border-ink rounded-full px-4 py-2 text-sm text-ink">{g.title}</Link></li>
            ))}
          </ul>
        </main>
      )}
      <Footer />
    </div>
  );
}
