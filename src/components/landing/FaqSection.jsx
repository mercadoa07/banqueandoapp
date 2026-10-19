import React from 'react';

// Preguntas frecuentes
export default function FaqSection() {
  return (
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
  );
}
