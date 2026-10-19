import React from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CreditCard, TrendingUp, Heart, DollarSign, Smartphone } from 'lucide-react';
import { BanqueandoLogo, CARD_SHADOW, PAGE_BG } from './shared.jsx';
import { QuestionInput } from './questionTypes.jsx';

const SECTION_ICONS = { TrendingUp, DollarSign, Heart, Smartphone, CreditCard, Sparkles };

export default function QuestionStep({ question, index, total, sections, value, onAnswer, onNext, onPrev }) {
  if (!question) return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="text-center"><BanqueandoLogo className="w-16 h-16 mx-auto mb-4 animate-pulse" /><p className="text-gray-500">Cargando preguntas...</p></div>
    </div>
  );

  const section = sections.find(s => s.id === question.section);
  const SectionIcon = SECTION_ICONS[section?.icon] || CreditCard;
  const isLast = index === total - 1;
  const progress = ((index + 1) / total) * 100;

  return (
    <div className={`${PAGE_BG} p-4 py-8`}>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={CARD_SHADOW}>
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center"><SectionIcon className="w-5 h-5 text-white mr-2" /><span className="text-white font-medium text-sm">{section?.name || 'Quiz'}</span></div>
              <span className="text-white/70 text-sm bg-white/20 px-3 py-1 rounded-full">{index + 1} / {total}</span>
            </div>
            <div className="bg-white/20 rounded-full h-2"><div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{question.question}</h3>
            {question.subtitle && <p className="text-gray-500 text-sm mb-5">{question.subtitle}</p>}
            <QuestionInput question={question} value={value} onAnswer={onAnswer} />
          </div>
          <div className="p-5 bg-gray-50 flex justify-between items-center">
            <button onClick={onPrev} disabled={index === 0} className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}><ChevronLeft className="w-5 h-5 mr-1" />Anterior</button>
            <button onClick={onNext} className="flex items-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]">
              {isLast ? <><Sparkles className="w-5 h-5 mr-2" />Ver Resultados</> : <>Siguiente<ChevronRight className="w-5 h-5 ml-1" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
