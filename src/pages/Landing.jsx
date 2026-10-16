import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Zap,
  AlertCircle,
  Award,
  Lock,
  BarChart3,
  Building2,
  Layers,
  Rocket,
  DollarSign,
  Ban
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ============================================ */}
      {/* HERO SECTION - DUAL PRODUCT HERO (FONDO BLANCO) */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* STATS SECTION */}
      {/* ============================================ */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                2,847
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Usuarios este mes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                35%
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Personas financiadas</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Satisfacción promedio</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                2 min
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Tiempo promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROBLEM SECTION - 4 PROBLEMAS */}
      {/* ============================================ */}
      <section id="problema" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              68% de los colombianos no tiene claro cuál es 
              <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                {' '}el producto adecuado para él
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No es por falta de opciones. Es por <strong>falta de claridad al comparar</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Problems */}
            <div className="space-y-6">
              {/* Problem 1 */}
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">No sabes si tu tarjeta es realmente la mejor del mercado</h3>
                    <p className="text-gray-600">
                      Elegiste tu tarjeta hace años por comodidad o porque te la ofreció tu banco. 
                      Pero el mercado cambió: hay nuevas opciones con mejores beneficios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Comparas solo por tasa o cuota, ignorando lo que realmente importa</h3>
                    <p className="text-gray-600">
                      Te enfocas en un solo factor sin considerar el panorama completo: 
                      beneficios, programa de puntos, seguros incluidos, alianzas comerciales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">No sabes si necesitas tarjeta o crédito</h3>
                    <p className="text-gray-600">
                      Financias compras grandes con tarjeta cuando un préstamo tendría mejor tasa. 
                      O pides crédito cuando una tarjeta con beneficios sería más conveniente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem 4 */}
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Tu banco te ofrece "lo que tiene", no lo que necesitas</h3>
                    <p className="text-gray-600">
                      Tu asesor bancario te muestra solo los productos de SU entidad. 
                      Nunca comparas con otras 15 opciones del mercado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Solution */}
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-10 rounded-3xl text-white shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-3xl font-bold mb-6">La solución: Match financiero personalizado</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 mr-3 flex-shrink-0" />
                    <span className="text-lg">Comparamos TODO el mercado (no solo un banco)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 mr-3 flex-shrink-0" />
                    <span className="text-lg">Analizamos TU situación real (no promedios genéricos)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 mr-3 flex-shrink-0" />
                    <span className="text-lg">Te mostramos POR QUÉ cada opción te conviene</span>
                  </div>
                </div>

                <div className="bg-white/20 p-4 rounded-xl text-center">
                  <div className="text-4xl font-black mb-2">$450K</div>
                  <div className="text-cyan-100">Ahorro promedio por año al optimizar tu producto financiero</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMO FUNCIONA - DUAL TRACK */}
      {/* ============================================ */}
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
                    <p className="text-gray-600">15+ variables personales</p>
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
                    <p className="text-gray-600">Seguimiento del proceso de aprobación</p>
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
                    <p className="text-gray-600">20+ variables de viabilidad</p>
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
                    <h4 className="font-bold text-gray-900 mb-1">Conectamos con entidades</h4>
                    <p className="text-gray-600">Pre-aprobación rápida y seguimiento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENEFICIOS - 6 CARDS, GRID 3x2 */}
      {/* ============================================ */}
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
                Te mostramos exactamente cuánto ahorrarás en cuotas, tasas y beneficios vs. otras opciones.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Totalmente Gratis</h3>
              <p className="text-gray-600 leading-relaxed">
                Sin costos ocultos, sin comisiones. Nuestro servicio es 100% gratuito para ti.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tecnología IA</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritmo inteligente que aprende de miles de perfiles para darte la mejor recomendación.
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

      {/* ============================================ */}
      {/* FAQs - 9 PREGUNTAS */}
      {/* ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas saber antes de empezar
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Realmente es gratis? ¿Cómo se sostienen?",
                a: "100% gratis para ti. Los bancos y fintechs nos pagan una comisión si decides aplicar a través de nosotros (tú pagas lo mismo que si fueras directo). Esto nos permite ser independientes y recomendarte LO QUE REALMENTE TE CONVIENE, no lo que más nos paga."
              },
              {
                q: "¿En qué se diferencian de otros comparadores?",
                a: "Ellos te muestran una tabla con todos los productos para que TÚ compares manualmente. Nosotros hacemos un match 1-a-1 basado en TU perfil específico. No un ranking genérico de \"los 10 mejores\" que no consideran tu situación única."
              },
              {
                q: "¿Mis datos están seguros? ¿Comparten mi información?",
                a: "Tus datos están encriptados y NUNCA se comparten con terceros sin tu consentimiento explícito. El quiz es anónimo. Solo si decides aplicar a un producto, te redirigimos a la entidad con los datos que tú autorices."
              },
              {
                q: "¿Ustedes aprueban la tarjeta o el crédito?",
                a: "No. Somos un comparador, no un banco. Te recomendamos las mejores opciones para ti y te conectamos con la entidad. Ellos deciden si aprueban basados en su análisis de riesgo. Nuestro quiz pre-filtra para mostrarte solo productos donde tienes alta probabilidad de aprobación según tu perfil."
              },
              {
                q: "¿Qué pasa si ya tengo tarjeta?",
                a: "¡Perfecto! El 80% de nuestros usuarios ya tienen tarjeta. Te mostraremos opciones mejores para tu perfil. Puedes tener varias tarjetas (es normal y hasta recomendable) y usar cada una para lo que mejor optimiza."
              },
              {
                q: "¿Cuánto tarda el proceso completo?",
                a: "El quiz: 2-3 minutos. Aplicar a la entidad: 5-10 minutos. Aprobación: 24-72 horas (algunos fintechs aprueban en minutos). Desembolso de crédito: 24-48 horas según la entidad."
              },
              {
                q: "¿Qué tipos de crédito comparan?",
                a: "Comparamos múltiples opciones: líneas de crédito, crédito de capital de trabajo, financiamiento de facturas, crédito para inventario, préstamos para expansión, y crédito de consumo. Dependiendo de tu perfil, te mostramos las opciones más compatibles."
              },
              {
                q: "¿Necesito ser empresa formal o también aplica para informales?",
                a: "Trabajamos con ambos. Tenemos opciones para empresas formalmente constituidas (SAS, Ltda, etc) y también para emprendedores e informales con ingresos demostrables. El quiz determina qué opciones aplican para tu caso específico."
              },
              {
                q: "¿Qué información necesito para el quiz de crédito?",
                a: "Información básica: situación actual, antigüedad (personal o del negocio), ingresos mensuales aproximados, y para qué necesitas el crédito. No necesitas estados financieros ni documentos para el quiz. Solo los pedimos si decides aplicar a una opción específica."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-gray-900 pr-4">
                    {faq.q}
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA FINAL */}
      {/* ============================================ */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para optimizar tus finanzas?
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            Más de 2,847 personas y negocios encontraron su solución financiera ideal este mes.
            <br/>
            <strong className="text-white">Tarjeta personal o crédito. ¿Cuál necesitas hoy?</strong>
          </p>
          <Link 
            to="/quiz"
            className="inline-flex items-center bg-white text-cyan-600 px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Empezar Ahora
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
          <p className="text-cyan-100 mt-6 text-sm flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Tus datos son privados y nunca se comparten con terceros
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
