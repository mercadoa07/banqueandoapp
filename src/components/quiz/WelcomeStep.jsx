import React from 'react';
import { Sparkles, TrendingUp, Heart, Lock } from 'lucide-react';
import { BanqueandoLogo, LegalFooter, CARD_SHADOW, PAGE_BG } from './shared.jsx';

export default function WelcomeStep({ onStart }) {
  return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center" style={CARD_SHADOW}>
          <div className="mb-6 flex justify-center"><BanqueandoLogo className="w-24 h-24" /></div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-700 bg-clip-text text-transparent">Banqueando</h1>
          <p className="text-ink font-medium mb-1">Compara tarjetas y créditos con números reales</p>
          <p className="text-gray-400 text-sm mb-6">Respondes unas preguntas y te mostramos tus tres mejores opciones, con sus razones.</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-paper p-3 rounded-xl border border-line"><Sparkles className="w-6 h-6 text-accent mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Personal</p><p className="text-xs text-gray-400">Para ti</p></div>
            <div className="bg-paper p-3 rounded-xl border border-line"><TrendingUp className="w-6 h-6 text-accent mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Ahorra</p><p className="text-xs text-gray-400">Dinero</p></div>
            <div className="bg-paper p-3 rounded-xl border border-line"><Heart className="w-6 h-6 text-accent mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Gratis</p><p className="text-xs text-gray-400">100%</p></div>
          </div>
          <button onClick={onStart} className="w-full bg-ink text-white py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg">Empezar Quiz →</button>
          <p className="text-xs text-gray-400 mt-4 flex items-center justify-center"><Lock className="w-3 h-3 mr-1" />Tus datos son privados</p>
        </div>
        <LegalFooter variant="landing" />
      </div>
    </div>
  );
}
