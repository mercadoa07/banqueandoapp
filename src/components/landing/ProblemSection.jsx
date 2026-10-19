import React from 'react';
import { CheckCircle2, Ban } from 'lucide-react';

// Los 4 problemas que resuelve
export default function ProblemSection() {
  return (
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
  );
}
