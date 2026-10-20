import React from 'react';
import { Target, TrendingUp, Shield, Zap, Layers, Rocket } from 'lucide-react';

// Beneficios (6 tarjetas, grilla 3x2)
export default function BenefitsSection() {
  return (
  <section id="beneficios" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Por qué usar Banqueando</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          La plataforma que te ayuda a tomar mejores decisiones financieras.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-cyan-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">100% Personalizado</h3>
          <p className="text-gray-600 leading-relaxed">
            No recomendamos productos al azar. Cada sugerencia está basada en tu perfil único y necesidades reales.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <TrendingUp className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ahorra Dinero</h3>
          <p className="text-gray-600 leading-relaxed">
            Te mostramos un estimado de lo que ganas o pagas al año con cada tarjeta, y la cuota aproximada de cada crédito.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Totalmente Gratis</h3>
          <p className="text-gray-600 leading-relaxed">
            Sin costos ocultos. Usar Banqueando no te cuesta nada.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Reglas transparentes</h3>
          <p className="text-gray-600 leading-relaxed">
            Te explicamos por qué aparece cada producto, y ninguna entidad paga por salir primero.
          </p>
        </div>

        {/* Nuevo Beneficio 5 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-cyan-100 to-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <Layers className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Dos soluciones, una plataforma</h3>
          <p className="text-gray-600 leading-relaxed">
            Desde tarjetas personales hasta crédito para tu negocio. Todo tu ecosistema financiero en un solo lugar.
          </p>
        </div>

        {/* Nuevo Beneficio 6 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-purple-100 to-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
            <Rocket className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pensado para crecer</h3>
          <p className="text-gray-600 leading-relaxed">
            Especialmente diseñado para emprendedores, freelancers y negocios en crecimiento que buscan financiamiento inteligente.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
}
