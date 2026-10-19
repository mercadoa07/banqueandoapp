import React from 'react';
import { Sparkles } from 'lucide-react';
import { PAGE_BG } from './shared.jsx';

export default function CalculatingStep({ vertical }) {
  return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="text-center">
        <div className="mb-6"><div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-4 rounded-2xl shadow-lg inline-block"><Sparkles className="w-12 h-12 text-white animate-pulse" /></div></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analizando tu perfil...</h2>
        <p className="text-gray-500">{vertical === 'credit' ? 'Encontrando tu crédito ideal' : 'Encontrando tu tarjeta ideal'}</p>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
