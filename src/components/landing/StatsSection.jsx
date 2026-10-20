import React from 'react';

// Datos del servicio. Solo cosas verificables: nada de usuarios ni calificaciones inventadas.
const STATS = [
  ['2 min', 'Tiempo del quiz'],
  ['$0', 'Costo para ti'],
  ['Top 3', 'Opciones con sus razones'],
  ['0', 'Consultas a centrales de riesgo']
];

export default function StatsSection() {
  return (
  <section className="py-16 bg-white border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(([value, label]) => (
          <div key={label}>
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {value}
            </div>
            <div className="text-gray-600 font-medium text-sm md:text-base">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}
