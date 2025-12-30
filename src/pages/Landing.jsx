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
  Heart,
  AlertCircle,
  TrendingDown,
  HelpCircle,
  Award,
  Lock,
  Globe,
  BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        {/* Overlays decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
                <span className="text-sm font-semibold text-gray-700">IA personalizada + 2,847 usuarios este mes</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                No hay "mejor tarjeta".
                <br/>
                <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Hay LA TUYA.
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nuestro algoritmo analiza <strong className="text-gray-900">tu forma de pagar</strong>, 
                <strong className="text-gray-900"> tu estilo de vida</strong> y 
                <strong className="text-gray-900"> tus prioridades</strong> 
                para encontrar tu match perfecto en 2 minutos.
                <br/>
                <span className="text-cyan-600 font-semibold">No rankings genéricos. Recomendación 1-a-1.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/quiz"
                  className="group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all inline-flex items-center justify-center transform hover:scale-105"
                >
                  Hacer Quiz Gratis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a 
                  href="#problema" 
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all text-center"
                >
                  Ver el Problema
                </a>
              </div>

              <div className="flex items-center gap-8 text-sm flex-wrap">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-cyan-600" />
                  <span className="text-gray-700 font-medium">2 minutos</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="text-gray-700 font-medium">100% seguro</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                  <span className="text-gray-700 font-medium">Sin costo</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  95% Match
                </div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-3 rounded-xl mr-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Tu Tarjeta Ideal</h3>
                    <p className="text-gray-600">Basado en tu perfil</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center bg-green-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Cashback 3% en supermercados</span>
                  </div>
                  <div className="flex items-center bg-blue-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Sin cuota de manejo primer año</span>
                  </div>
                  <div className="flex items-center bg-purple-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Acumula millas en tus viajes</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-green-600">Ahorras $850K/año</p>
                  <p className="text-sm text-gray-500">vs. tu tarjeta actual</p>
                </div>
              </div>
              
              <div className="absolute top-10 -left-10 w-40 h-40 bg-cyan-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-cyan-600 mr-2" />
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  2,847
                </div>
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Usuarios este mes</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  68%
                </div>
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Ahorra $450K+/año</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-amber-600 mr-2" />
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  4.9/5
                </div>
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Satisfacción promedio</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-purple-600 mr-2" />
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  2 min
                </div>
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">Tiempo promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problema" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              El 68% de colombianos tiene la 
              <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                {' '}tarjeta equivocada
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No porque sean malas tarjetas, sino porque <strong>no son LA SUYA</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-50 p-3 rounded-lg mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Pagas cuota de manejo innecesaria</h3>
                    <p className="text-gray-600">
                      Tu tarjeta cobra $60K/año pero nunca usas sus "beneficios premium". 
                      Hay opciones sin cuota perfectas para tu perfil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-orange-50 p-3 rounded-lg mr-4">
                    <TrendingDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Pierdes dinero en cada compra</h3>
                    <p className="text-gray-600">
                      Compras en Éxito, vuelas por trabajo, pagas Netflix... pero tu tarjeta 
                      no te da nada a cambio. Otras te darían cashback o millas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-yellow-50 p-3 rounded-lg mr-4">
                    <HelpCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Elegiste "porque sí"</h3>
                    <p className="text-gray-600">
                      Fue la primera que te aprobaron, o la del banco donde tienes cuenta. 
                      Nunca comparaste si hay mejores opciones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-purple-600 p-8 md:p-12 rounded-2xl text-white shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6 inline-block">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6">La solución</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <p className="text-lg">
                    <strong>Analizamos tu situación única:</strong> ingresos, forma de pagar, 
                    dónde gastas, qué te importa.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <p className="text-lg">
                    <strong>Comparamos TODAS las opciones:</strong> no solo las populares, 
                    sino las que realmente te convienen.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <p className="text-lg">
                    <strong>Te mostramos cuánto ahorras:</strong> en pesos reales, no en 
                    promesas vagas.
                  </p>
                </div>
              </div>

              <Link 
                to="/quiz"
                className="block w-full bg-white text-purple-600 text-center py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Encontrar Mi Tarjeta →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cómo Funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tres simples pasos para encontrar tu tarjeta ideal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Responde el Quiz</h3>
              <p className="text-gray-600 leading-relaxed">
                15 preguntas sobre tu perfil financiero, estilo de vida e intereses. Toma solo 2-3 minutos.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">IA Analiza tu Perfil</h3>
              <p className="text-gray-600 leading-relaxed">
                Nuestro algoritmo compara tu perfil con todas las tarjetas del mercado colombiano.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Recibe Recomendaciones</h3>
              <p className="text-gray-600 leading-relaxed">
                Te mostramos las 3 mejores opciones con score de compatibilidad y cuánto ahorrarás.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/quiz"
              className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
            >
              Empezar Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por qué usar Banqueando</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No todas las tarjetas son iguales. Encuentra la que realmente te conviene.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Personalizado</h3>
              <p className="text-gray-600 leading-relaxed">
                No recomendamos tarjetas al azar. Cada sugerencia está basada en tu perfil único y necesidades reales.
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

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Independiente</h3>
              <p className="text-gray-600 leading-relaxed">
                No pertenecemos a ningún banco. Nuestras recomendaciones son 100% imparciales.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estilo de Vida</h3>
              <p className="text-gray-600 leading-relaxed">
                Consideramos tus intereses, hobbies y valores personales, no solo tu perfil financiero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
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
                a: "100% gratis para ti. Los bancos nos pagan una comisión si decides aplicar a través de nosotros (tú pagas lo mismo que si fueras directo al banco). Esto nos permite ser independientes y recomendarte LO QUE REALMENTE TE CONVIENE, no lo que más nos paga."
              },
              {
                q: "¿En qué se diferencian de otros comparadores?",
                a: "Ellos te muestran una tabla con todas las tarjetas para que TÚ compares manualmente. Nosotros hacemos un match 1-a-1 basado en TU perfil específico. No un ranking genérico de \"las 10 mejores\" que no consideran tu situación única."
              },
              {
                q: "¿Mis datos están seguros? ¿Comparten mi información?",
                a: "Tus datos están encriptados y NUNCA se comparten con terceros sin tu consentimiento explícito. El quiz es anónimo. Solo si decides aplicar a una tarjeta, te redirigimos al banco con los datos que tú autorices."
              },
              {
                q: "¿Ustedes aprueban la tarjeta?",
                a: "No. Somos un comparador, no un banco. Te recomendamos las mejores opciones para ti y te conectamos con el banco. Ellos deciden si aprueban basados en su análisis de riesgo. Nuestro quiz pre-filtra para mostrarte solo tarjetas donde tienes alta probabilidad de aprobación según tu perfil."
              },
              {
                q: "¿Qué pasa si ya tengo tarjeta?",
                a: "¡Perfecto! El 80% de nuestros usuarios ya tienen tarjeta. Te mostraremos opciones mejores para tu perfil. Puedes tener varias tarjetas (es normal y hasta recomendable) y usar cada una para lo que mejor optimiza."
              },
              {
                q: "¿Cuánto tarda el proceso completo?",
                a: "El quiz: 2 minutos. Aplicar al banco: 5-10 minutos. Aprobación del banco: 24-72 horas. Recibir tarjeta física: 5-10 días hábiles. Todo depende del banco que elijas."
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

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para encontrar tu tarjeta ideal?
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            2,847 colombianos encontraron su match este mes. 
            <br/>
            <strong className="text-white">¿Cuánto estás perdiendo con la tarjeta equivocada?</strong>
          </p>
          <Link 
            to="/quiz"
            className="inline-flex items-center bg-white text-cyan-600 px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Hacer Quiz Gratis
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
