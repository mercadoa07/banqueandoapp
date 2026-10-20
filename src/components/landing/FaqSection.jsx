import React from 'react';

// Preguntas frecuentes
export default function FaqSection() {
  return (
  <section id="preguntas" className="bg-white border-t border-line">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
      <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-[-0.03em] text-ink">Preguntas frecuentes</h2>

      <div className="divide-y divide-line border-y border-line min-w-0">
        {[
          {
            q: "¿Realmente es gratis? ¿Cómo se sostienen?",
            a: "Sí, es gratis para ti. Hoy ninguna entidad nos paga. Si en el futuro recibimos una comisión cuando alguien solicita un producto, lo diremos junto a ese producto, tú pagarás lo mismo que si fueras directo y no cambiará el orden de los resultados: el orden depende solo de tus respuestas."
          },
          {
            q: "¿En qué se diferencian de otros comparadores?",
            a: "Ellos te muestran una tabla con todos los productos para que TÚ compares manualmente. Nosotros hacemos un match 1-a-1 basado en TU perfil específico. No un ranking genérico de \"los 10 mejores\" que no consideran tu situación única."
          },
          {
            q: "¿Mis datos están seguros? ¿Comparten mi información?",
            a: "No vendemos ni compartimos tus datos personales con bancos ni terceros. Te pedimos WhatsApp y correo para mostrarte el resultado y contactarte sobre él; las ofertas solo te llegan si marcas la casilla opcional. Cuando das clic en «Solicitar», vas al sitio oficial de la entidad y no le enviamos tus datos. Puedes pedir que borremos tus datos cuando quieras."
          },
          {
            q: "¿Ustedes aprueban la tarjeta o el crédito?",
            a: "No. Somos un comparador, no un banco. Te recomendamos las mejores opciones para ti y te conectamos con la entidad. Ellos deciden si aprueban basados en su análisis de riesgo. Con tus respuestas te mostramos una probabilidad de aprobación estimada (alta, media o baja), pero no es una garantía."
          },
          {
            q: "¿Qué pasa si ya tengo tarjeta?",
            a: "¡Perfecto! Te mostramos opciones que pueden servirte más para tu perfil y, si nos dices cuánto pagas de cuota de manejo, cuánto ahorrarías. Puedes tener varias tarjetas (es normal y hasta recomendable) y usar cada una para lo que mejor optimiza."
          },
          {
            q: "¿Cuánto tarda el proceso completo?",
            a: "El quiz: 2-3 minutos. Aplicar a la entidad: 5-10 minutos. La aprobación y el desembolso dependen de cada entidad: algunas fintechs responden en minutos y otras tardan días."
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
            a: "Para qué necesitas el dinero y cuánto, si es para ti o para tu negocio, tus ingresos o ventas aproximadas, tu historial crediticio y cuánto pagas hoy en deudas. No necesitas documentos: si decides solicitar, cada entidad te pedirá los suyos."
          }
        ].map((faq, idx) => (
          <details key={idx} className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h3 className="font-display font-bold text-lg text-ink pr-4">
                {faq.q}
              </h3>
              <svg className="w-5 h-5 text-muted group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <p className="mt-3 text-muted leading-relaxed max-w-[65ch]">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
  );
}
