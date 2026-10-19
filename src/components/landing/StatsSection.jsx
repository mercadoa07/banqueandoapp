import React from 'react';

// Cifras
export default function StatsSection() {
  return (
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
  );
}
