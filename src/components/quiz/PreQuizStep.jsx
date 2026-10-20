import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BanqueandoLogo, CARD_SHADOW, PAGE_BG } from './shared.jsx';
import { DEFAULT_PREQUIZ_OPTIONS } from '../../lib/questions.js';

export default function PreQuizStep({ preQuiz, onChoose, onBack }) {
  const options = preQuiz?.options || DEFAULT_PREQUIZ_OPTIONS;
  return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8" style={CARD_SHADOW}>
          <div className="text-center mb-8">
            <BanqueandoLogo className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{preQuiz?.question || '¿Qué estás buscando hoy?'}</h2>
            <p className="text-gray-500 text-sm">{preQuiz?.subtitle || 'Selecciona una opción para personalizar tu experiencia'}</p>
          </div>
          <div className="space-y-4">
            {options.map((option) => (
              <button key={option.value} onClick={() => onChoose(option)} className="w-full p-5 rounded-2xl border-2 border-gray-100 text-left transition-all hover:border-ink hover:bg-paper hover:shadow-lg group">
                <div className="flex items-center">
                  <div className="bg-paper p-3 rounded-xl mr-4"><span className="text-2xl">{option.emoji}</span></div>
                  <div className="flex-1"><h3 className="font-bold text-gray-800 text-lg mb-1">{option.label}</h3><p className="text-gray-500 text-sm">{option.description}</p></div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-cyan-500" />
                </div>
              </button>
            ))}
          </div>
          <button onClick={onBack} className="w-full mt-6 text-gray-400 hover:text-gray-600 text-sm">← Volver</button>
        </div>
      </div>
    </div>
  );
}
