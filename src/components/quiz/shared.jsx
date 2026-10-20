import React from 'react';
import { X } from 'lucide-react';
import { LEGAL_TEXTS, LEGAL_URLS } from '../../constants/legal.js';
import { cardAnnualBreakdown } from '../../engine/finance.js';
import { formatCOP } from '../../lib/format.js';
import { getEntityName } from '../../lib/supabase.js';

export const CARD_SHADOW = { boxShadow: '0 0 40px rgba(8, 145, 178, 0.12)' };
export const PAGE_BG = 'min-h-screen bg-paper';

export const BanqueandoLogo = ({ className = 'w-16 h-16' }) => (
  <img src="/logo.png" alt="Banqueando" className={`${className} object-contain`} />
);

export const LegalFooter = ({ variant = 'general' }) => (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <div className="text-xs text-gray-400 space-y-1 text-center">
      {variant === 'landing' ? <p>{LEGAL_TEXTS.landingFooter}</p> : (
        <><p>• {LEGAL_TEXTS.generalFooter.line1}</p><p>• {LEGAL_TEXTS.generalFooter.line2}</p><p>• {LEGAL_TEXTS.generalFooter.line3}</p></>
      )}
      <p className="mt-3 font-medium">{LEGAL_TEXTS.generalFooter.copyright}</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
        <a href={LEGAL_URLS.privacy} className="text-accent hover:text-cyan-700">Política de datos</a>
        <a href={LEGAL_URLS.terms} className="text-accent hover:text-cyan-700">Términos</a>
        <a href={LEGAL_URLS.howWeRecommend} className="text-accent hover:text-cyan-700">Cómo recomendamos</a>
      </div>
    </div>
  </div>
);

export const SavingsBreakdownModal = ({ card, monthlySpend, onClose }) => {
  // El motor ya lo calculó con el gasto y la forma de pago de la persona; si no, se calcula aquí.
  const { items: breakdown, total } = card.annualBreakdown || cardAnnualBreakdown(card, monthlySpend);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{LEGAL_TEXTS.savingsBreakdown.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-3 mb-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">{item.concept}</span>
              <span className={`font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{item.amount > 0 ? '+' : ''}{formatCOP(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
            <span className="font-bold text-gray-800">Beneficio neto estimado</span>
            <span className={`font-bold text-lg ${total < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCOP(total)}/año</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic">{LEGAL_TEXTS.savingsBreakdown.footer}</p>
        <button onClick={onClose} className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Entendido</button>
      </div>
    </div>
  );
};

export const ApplyPopup = ({ card, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{LEGAL_TEXTS.applyPopup.title}</h3>
      <div className="space-y-2 mb-6">
        {LEGAL_TEXTS.applyPopup.items.map((item, idx) => (
          <div key={idx} className="flex items-start"><span className="text-accent mr-2">•</span><span className="text-sm text-gray-600">{item.replace('{bankName}', getEntityName(card) || 'la entidad')}</span></div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 bg-ink text-white py-3 rounded-xl font-medium hover:shadow-lg">Continuar →</button>
      </div>
    </div>
  </div>
);
