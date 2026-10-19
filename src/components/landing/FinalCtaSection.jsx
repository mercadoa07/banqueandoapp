import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Llamado final
export default function FinalCtaSection() {
  return (
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
  );
}
