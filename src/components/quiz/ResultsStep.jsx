import React, { useState } from 'react';
import { AlertCircle, Sparkles, User } from 'lucide-react';
import CardResult from './CardResult.jsx';
import { ApplyPopup, LegalFooter, SavingsBreakdownModal, CARD_SHADOW, PAGE_BG } from './shared.jsx';
import { LEGAL_TEXTS, LEGAL_URLS } from '../../constants/legal.js';

const DISCLAIMERS = {
  credit: [
    ['Tasas de interés:', 'Son referenciales y pueden variar según tu perfil crediticio.'],
    ['Aprobación:', 'Sujeta a estudio de crédito de cada entidad.'],
    ['Tiempos de desembolso:', 'Pueden variar según documentación y verificación.']
  ],
  cards: [
    ['Tasas de interés:', 'Varían mensualmente. Consulta el tarifario vigente del banco.'],
    ['Cuota de manejo $0:', 'Casi siempre requiere cumplir condiciones.'],
    ['Aprobación:', 'Sujeta a estudio de crédito del banco.']
  ]
};

function NoResults({ onReset }) {
  return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No encontramos resultados</h2>
        <p className="text-gray-500 mb-6">No pudimos encontrar productos que coincidan con tu perfil.</p>
        <button onClick={onReset} className="w-full bg-ink text-white py-4 rounded-2xl font-semibold">Volver a intentar</button>
      </div>
    </div>
  );
}

export default function ResultsStep({ results, vertical, user, answers, activeCount, applyTarget, onApply, onConfirmApply, onCloseApply, onReset }) {
  const [showSavings, setShowSavings] = useState(false);
  const { topMatch, alternatives } = results;
  if (!topMatch) return <NoResults onReset={onReset} />;

  const products = [topMatch, ...(alternatives || [])].filter(Boolean).slice(0, 3);
  const verticalKey = vertical === 'credit' ? 'credit' : 'cards';

  return (
    <div className={`${PAGE_BG} p-4 py-8`}>
      <div className="max-w-6xl mx-auto">
        {user && <div className="bg-ink rounded-2xl p-4 mb-6 text-white text-center shadow-lg max-w-md mx-auto flex items-center justify-center"><User className="w-5 h-5 mr-2" /><p>Hola, <strong>{user.user_metadata?.name || user.email}</strong></p></div>}
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center mb-8 max-w-md mx-auto" style={CARD_SHADOW}>
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">¡Encontramos tu match!</h1>
          <p className="text-gray-500 text-sm">{vertical === 'credit' ? `Analizamos ${activeCount.credit} opciones de crédito para ti` : `Analizamos ${activeCount.cards} tarjetas para ti`}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {products.map((card, idx) => <CardResult key={card.id} card={card} rank={idx} vertical={vertical} onApply={onApply} onShowSavings={() => setShowSavings(true)} />)}
        </div>
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 max-w-2xl mx-auto mb-6">
          <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center"><AlertCircle className="w-4 h-4 mr-2" />IMPORTANTE - Lee antes de solicitar:</h4>
          <ul className="text-xs text-amber-700 space-y-1">
            {DISCLAIMERS[verticalKey].map(([title, text]) => <li key={title}>• <strong>{title}</strong> {text}</li>)}
          </ul>
          <p className="text-xs text-amber-800 mt-3 pt-3 border-t border-amber-200">
            {LEGAL_TEXTS.notAdvice} El orden depende solo de tus respuestas: ninguna entidad paga por aparecer.{' '}
            <a href={LEGAL_URLS.howWeRecommend} target="_blank" rel="noopener noreferrer" className="underline font-medium">Cómo recomendamos</a>
          </p>
        </div>
        <div className="text-center mb-6"><button onClick={onReset} className="text-accent hover:text-cyan-800 font-medium">← Volver a empezar</button></div>
        <LegalFooter />
      </div>
      {showSavings && <SavingsBreakdownModal card={topMatch} monthlySpend={answers.monthly_spend || 1500000} onClose={() => setShowSavings(false)} />}
      {applyTarget && <ApplyPopup card={applyTarget.card} onConfirm={onConfirmApply} onClose={onCloseApply} />}
    </div>
  );
}
