import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

// Cómo funciona (dos caminos)
export default function HowItWorksSection() {
  return (
  <section id="como-funciona" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Cómo funciona Banqueando
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dos productos, un mismo proceso inteligente
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Track 1: Tarjetas */}
        <div className="bg-gradient-to-br from-cyan-50 to-purple-50 p-8 rounded-3xl border-2 border-cyan-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Tarjetas de Crédito</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Quiz 2 minutos</h4>
                <p className="text-gray-600">Estilo de vida + hábitos de pago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Algoritmo analiza tu perfil</h4>
                <p className="text-gray-600">Ingresos, hábitos y preferencias</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Top 3 tarjetas con score</h4>
                <p className="text-gray-600">Razones personalizadas del match</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">4</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Aplicas directo al banco</h4>
                <p className="text-gray-600">En el sitio oficial de la entidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Track 2: Crédito */}
        <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-8 rounded-3xl border-2 border-purple-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Crédito para ti o tu negocio</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Quiz 3 minutos</h4>
                <p className="text-gray-600">Situación + necesidad + capacidad</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Algoritmo evalúa tu caso</h4>
                <p className="text-gray-600">Necesidad, capacidad de pago e historial</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Top 3 opciones de crédito</h4>
                <p className="text-gray-600">Tasas + plazos + montos comparados</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">4</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Solicitas directo a la entidad</h4>
                <p className="text-gray-600">En su sitio oficial, sin intermediarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
