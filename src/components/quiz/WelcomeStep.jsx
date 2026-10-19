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
          <p className="text-gray-500 font-medium mb-1">Encuentra Tu Producto Ideal</p>
          <p className="text-gray-400 text-sm mb-6">En 2 minutos analizamos tu perfil y te recomendamos el producto perfecto</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-3 rounded-xl border border-cyan-100"><Sparkles className="w-6 h-6 text-cyan-600 mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Personal</p><p className="text-xs text-gray-400">Para ti</p></div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-xl border border-purple-100"><TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Ahorra</p><p className="text-xs text-gray-400">Dinero</p></div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 rounded-xl border border-emerald-100"><Heart className="w-6 h-6 text-emerald-600 mx-auto mb-1" /><p className="text-xs font-semibold text-gray-700">Gratis</p><p className="text-xs text-gray-400">100%</p></div>
          </div>
          <button onClick={onStart} className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]">Empezar Quiz →</button>
          <p className="text-xs text-gray-400 mt-4 flex items-center justify-center"><Lock className="w-3 h-3 mr-1" />Tus datos son privados</p>
        </div>
        <LegalFooter variant="landing" />
      </div>
    </div>
  );
}
