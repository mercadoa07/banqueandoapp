import React from 'react';
import { Award, BadgeDollarSign, CreditCard, CheckCircle2, Info, Sparkles, DollarSign, AlertCircle } from 'lucide-react';
import { getEntityName } from '../../lib/supabase.js';

const RANK_LABELS = ['MEJOR MATCH', 'ALTERNATIVA', 'OPCIÓN'];
const RANK_COLORS = ['border-cyan-400 bg-gradient-to-br from-cyan-50/50 to-purple-50/50', 'border-gray-200 bg-white', 'border-gray-200 bg-white'];
const RANK_ICONS = [Award, BadgeDollarSign, CreditCard];

const disbursementLabel = (hours) => {
  if (!hours) return 'Variable';
  if (hours <= 24) return '< 24 horas';
  if (hours <= 72) return '1-3 días';
  return '3+ días';
};

const feeLabel = (fees) => {
  if (fees?.feeWaiverCondition?.includes('Sin condiciones')) return '$0 siempre';
  if (fees?.annualFee === 0 || fees?.monthlyFee === 0) return '$0 con condiciones*';
  return `$${(fees?.monthlyFee || 0).toLocaleString()}/mes*`;
};

function CreditDetails({ card }) {
  return (
    <>
      <div className="bg-gray-50 rounded-xl p-3 mb-3 mt-auto">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div><p className="text-xs text-gray-500">Tasa desde</p><p className="font-bold text-gray-800 text-sm">{card.loanDetails?.interestRateEA?.min || 'Variable'}% EA</p></div>
          <div><p className="text-xs text-gray-500">Desembolso</p><p className="font-bold text-gray-800 text-sm">{disbursementLabel(card.loanDetails?.disbursementTimeHours)}</p></div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 text-center"><p className="text-xs text-gray-500">Monto</p><p className="font-semibold text-gray-700 text-sm">${card.loanDetails?.minAmountMillions || 0}M - ${card.loanDetails?.maxAmountMillions || '?'}M</p></div>
      </div>
      <div className="bg-purple-50 rounded-xl p-3 mb-3 border border-purple-100">
        <p className="text-xs text-gray-500 mb-1">Tipo de crédito</p>
        <p className="text-sm font-medium text-purple-800">{card.productType || card.category?.join(', ') || 'Crédito digital'}</p>
      </div>
    </>
  );
}

function CardDetails({ card, isTop, onShowSavings }) {
  return (
    <>
      <div className="bg-gray-50 rounded-xl p-3 mb-3 mt-auto">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div><p className="text-xs text-gray-500">Cuota*</p><p className="font-bold text-gray-800 text-sm">{feeLabel(card.fees)}</p></div>
          <div><p className="text-xs text-gray-500">Tasa*</p><p className="font-bold text-gray-800 text-sm">{card.rates?.interestRateEA || 'N/A'}% EA*</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 rounded-xl mb-3 border border-emerald-100">
        <div className="flex justify-between items-center">
          <div><p className="text-xs text-gray-500 flex items-center"><DollarSign className="w-3 h-3 mr-1" />Ahorro anual</p><p className="text-xl font-bold text-emerald-600">${(card.personalizedSavings || 0).toLocaleString()}</p></div>
          {isTop && <button onClick={onShowSavings} className="text-emerald-600 hover:text-emerald-800 p-1"><Info className="w-5 h-5" /></button>}
        </div>
      </div>
    </>
  );
}

export default function CardResult({ card, rank, vertical, onApply, onShowSavings }) {
  const isTop = rank === 0;
  const RankIcon = RANK_ICONS[rank] || CreditCard;
  return (
    <div className={`rounded-2xl p-5 shadow-lg border-2 ${RANK_COLORS[rank]} flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${isTop ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}><RankIcon className="w-3 h-3 mr-1" />{RANK_LABELS[rank]}</span>
        <div className="text-right"><p className={`text-2xl font-bold ${isTop ? 'bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent' : 'text-gray-700'}`}>{Math.round(card.score)}%</p><p className="text-xs text-gray-400">Match</p></div>
      </div>
      <div className="flex items-center mb-3">
        <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-xl mr-3"><CreditCard className="w-6 h-6 text-white" /></div>
        <div><h3 className="font-bold text-gray-800 text-lg leading-tight">{card.name}</h3><p className="text-gray-500 text-sm">{getEntityName(card)}</p></div>
      </div>
      {isTop && card.whyWinner?.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-100 to-purple-100 rounded-xl p-3 mb-3 border border-cyan-200">
          <h4 className="font-semibold text-cyan-800 text-sm mb-2 flex items-center"><Award className="w-4 h-4 mr-1" />Le gana a las demás porque:</h4>
          <div className="space-y-1">{card.whyWinner.map((reason, idx) => <p key={idx} className="text-xs text-cyan-700 flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />{reason}</p>)}</div>
        </div>
      )}
      {!isTop && card.whyConsider?.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-3 mb-3 border border-amber-200">
          <h4 className="font-semibold text-amber-800 text-sm mb-2 flex items-center"><Info className="w-4 h-4 mr-1" />Podría ser mejor si:</h4>
          <div className="space-y-1">{card.whyConsider.map((reason, idx) => <p key={idx} className="text-xs text-amber-700 flex items-start"><span className="mr-1">→</span>{reason}</p>)}</div>
        </div>
      )}
      {card.benefits?.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-1" />Beneficios</h4>
          <div className="space-y-1">{card.benefits.slice(0, 3).map((benefit, idx) => <div key={idx} className="flex items-center bg-green-50 p-2 rounded-lg"><CheckCircle2 className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" /><span className="text-xs text-gray-700">{benefit}</span></div>)}</div>
        </div>
      )}
      {vertical === 'credit' ? <CreditDetails card={card} /> : <CardDetails card={card} isTop={isTop} onShowSavings={onShowSavings} />}
      {card.cons?.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold text-amber-700 text-sm mb-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />A considerar</h4>
          <div className="space-y-1">{card.cons.slice(0, 2).map((con, idx) => <p key={idx} className="text-xs text-amber-700 flex items-start"><span className="mr-1">•</span>{con.text || con}</p>)}</div>
        </div>
      )}
      <button onClick={() => onApply(card, rank + 1)} className={`w-full py-3 rounded-xl font-semibold transition-all ${isTop ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{isTop ? 'Solicitar Ahora →' : 'Ver más →'}</button>
    </div>
  );
}
