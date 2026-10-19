import React from 'react';
import { Sparkles, Shield, Clock, CheckCircle2, CreditCard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

// Hero de dos productos (tarjetas y créditos)
export default function HeroSection() {
  return (
  <section className="relative overflow-hidden bg-white pt-20 pb-32">
    {/* Overlays decorativos */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Badge superior */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-full px-4 py-2">
          <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
          <span className="text-sm font-semibold text-gray-700">IA personalizada • Tarjetas + Crédito • 2,847 usuarios</span>
        </div>
      </div>

      {/* Central Headline */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
          ¿Qué decisión financiera
          <br/>
          <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            necesitas tomar hoy?
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Elige tu necesidad y encuentra tu match perfecto en 2 minutos
        </p>
      </div>

      {/* ============================================ */}
      {/* DESKTOP: Dual Product Cards (visible md and up) */}
      {/* ============================================ */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Card 1: Tarjetas de Crédito */}
        <div className="bg-white rounded-3xl p-8 border-2 border-cyan-400 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all hover:scale-105">
          
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Tarjetas de Crédito
          </h3>

          {/* Subtitle */}
          <p className="text-cyan-600 font-semibold mb-4">
            Comparamos todas las tarjetas y te mostramos la mejor para ti
          </p>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Analizamos tarjetas de bancos y fintechs en Colombia. Según tu ingreso, historial y forma de uso, <strong className="text-gray-800">te mostramos las tarjetas que realmente te convienen y puedes obtener.</strong>
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Comparamos tarjetas de <strong>bancos y fintechs</strong></span>
            </div>
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Filtramos las que <strong>sí aplican a tu perfil</strong></span>
            </div>
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Te mostramos la <strong>mejor opción para ti</strong></span>
            </div>
          </div>

          {/* CTA */}
          <Link 
            to="/quiz"
            className="block w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-full font-bold text-lg text-center hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
          >
            👉 Encontrar mi tarjeta ideal
          </Link>

          <p className="text-center text-gray-500 text-sm mt-3">
            ⏱️ 2 minutos • 🔒 Gratis y seguro
          </p>
        </div>

        {/* Card 2: Créditos */}
        <div className="bg-white rounded-3xl p-8 border-2 border-purple-400 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all hover:scale-105">
          
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Créditos
          </h3>

          {/* Subtitle */}
          <p className="text-purple-600 font-semibold mb-4">
            Comparamos todos los créditos y te mostramos la mejor opción para ti
          </p>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Analizamos créditos personales y para negocios, en bancos y fintechs. Según tu necesidad y perfil, <strong className="text-gray-800">te mostramos las opciones más viables para ti.</strong>
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>Créditos personales y para negocio</strong></span>
            </div>
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Comparamos <strong>bancos + fintechs</strong></span>
            </div>
            <div className="flex items-start text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Te mostramos el crédito <strong>más viable para ti</strong></span>
            </div>
          </div>

          {/* CTA */}
          <Link 
            to="/quiz"
            className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-full font-bold text-lg text-center hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            👉 Encontrar mi crédito ideal
          </Link>

          <p className="text-center text-gray-500 text-sm mt-3">
            ⏱️ 3 minutos • 🔒 Gratis y seguro
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE: Decision Tree (visible only on mobile) */}
      {/* ============================================ */}
      <div className="md:hidden">
        {/* Tree Title */}
        <div className="text-center mb-8">
          <p className="text-gray-900 font-bold text-xl mb-6">¿Qué necesitas hoy?</p>
          
          {/* Visual Fork */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-purple-400"></div>
          </div>
        </div>

        {/* Mobile Product Cards (stacked) */}
        <div className="space-y-6">
          {/* Mobile Card: Tarjetas */}
          <div className="bg-white rounded-2xl p-6 border-2 border-cyan-400 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Tarjetas
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Comparamos todas las tarjetas y te mostramos la mejor para ti. Bancos y fintechs.
            </p>
            
            <Link 
              to="/quiz"
              className="block w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-full font-bold text-center"
            >
              👉 Encontrar mi tarjeta
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400/50 to-purple-400/50"></div>
          </div>

          {/* Mobile Card: Crédito */}
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-400 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Créditos
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Comparamos todos los créditos y te mostramos la mejor opción. Personales y para negocio.
            </p>
            
            <Link 
              to="/quiz"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-full font-bold text-center"
            >
              👉 Encontrar mi crédito
            </Link>
          </div>
        </div>

        {/* Mobile Trust Indicators */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-cyan-600" />
            <span>2-3 min</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-purple-600" />
            <span>100% seguro</span>
          </div>
        </div>
      </div>

    </div>
  </section>
  );
}
