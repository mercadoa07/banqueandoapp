/**
 * ============================================================
 * CONSTANTES Y TEXTOS LEGALES - BANQUEANDO
 * ============================================================
 */

// ============================================================
// CONFIGURACIÓN DE CÁLCULOS DE AHORRO
// ============================================================

export const SAVINGS_CONFIG = {
  // Valor de millas en USD
  mileValues: {
    lifemiles: 0.01,    // Avianca LifeMiles
    latam: 0.01,        // LATAM Pass
    generic: 0.005      // Puntos genéricos
  },
  
  // Gasto mensual con tarjeta que se asume si no lo responde (COP)
  defaultMonthlySpend: 1500000,

  // TRM fija para conversiones
  trm: 3800
};

// ============================================================
// TEXTOS LEGALES
// ============================================================

export const LEGAL_TEXTS = {
  // Footer del Landing
  landingFooter: `Banqueando es una plataforma informativa y de comparación. No somos una entidad financiera, no otorgamos créditos ni tarjetas. Las recomendaciones se basan en la información que proporcionas y datos públicos de cada producto. Todas las ofertas están sujetas a evaluación y aprobación por parte de cada entidad financiera. © ${new Date().getFullYear()} Banqueando.`,
  
  // Footer general (todas las pantallas)
  generalFooter: {
    line1: "La información de cada producto se obtiene de fuentes públicas y de los sitios oficiales de cada entidad",
    line2: "Los datos se actualizan periódicamente pero pueden variar sin previo aviso",
    line3: "Consulta siempre las condiciones oficiales en el sitio web de cada entidad",
    copyright: `Banqueando © ${new Date().getFullYear()}`
  },
  
  // Texto del ahorro estimado
  savingsDisclaimer: `* El ahorro estimado es un cálculo aproximado basado en tu perfil de gasto, beneficios declarados por cada entidad y promedios del mercado. No garantizamos este monto. El ahorro real dependerá de tu uso, cumplimiento de condiciones del banco y cambios en las políticas de cada producto.`,
  
  // Desglose del ahorro (tooltip/modal)
  savingsBreakdown: {
    title: "¿Cómo calculamos el beneficio neto?",
    items: [
      "Cashback: tu gasto mensual × % de devolución × 12 meses",
      "Millas: valoradas a US$0,01 cada una (TRM $3.800)",
      "Menos la cuota de manejo de todo el año, si no la exoneras",
      "Menos los intereses, si financias tus compras (según cómo dijiste que pagas)"
    ],
    footer: "Es un estimado con tu gasto mensual. Si cumples las condiciones para exonerar la cuota de manejo, el beneficio es mayor. Puntos de otros programas no se valoran."
  },
  
  // Popup antes de redirigir a aplicar
  applyPopup: {
    title: "Antes de continuar:",
    items: [
      "Serás redirigido al sitio oficial de {bankName}",
      "La aprobación está sujeta a las políticas de crédito de la entidad",
      "El banco verificará tu información y realizará análisis de riesgo",
      "Banqueando no participa en el proceso de aprobación",
      "No tenemos acceso a tus datos bancarios"
    ]
  },
  
  // Aviso visible en resultados
  notAdvice: 'Banqueando no es asesoría financiera ni una entidad vigilada por la Superintendencia Financiera. Es una comparación orientativa con la información que nos diste y datos públicos de cada producto.'
};

// ============================================================
// RESPONSABLE DEL TRATAMIENTO DE DATOS (Ley 1581 de 2012)
// ============================================================
// Lo exige el Decreto 1377 de 2013: quién responde por los datos y cómo
// contactarlo. Por ahora solo hay correo (decisión del 2026-10-20); nombre,
// documento y ciudad se agregan cuando existan y aparecen solos en las páginas.

export const LEGAL_ENTITY = {
  name: null,          // nombre de la persona natural o razón social
  document: null,      // "C.C. 123..." o "NIT 900..."
  city: null,          // domicilio, ej. "Bogotá D.C., Colombia"
  email: 'apelismercado@gmail.com' // correo para consultas, reclamos y borrado de datos
};

// Fecha de la versión vigente de la política y los términos. Se guarda con
// cada lead para saber qué texto aceptó la persona.
export const CONSENT_VERSION = '2026-10-20';

// ============================================================
// URLS DE PÁGINAS LEGALES
// ============================================================

export const LEGAL_URLS = {
  privacy: "/privacidad",
  terms: "/terminos",
  howWeRecommend: "/como-recomendamos"
};

export default { SAVINGS_CONFIG, LEGAL_TEXTS, LEGAL_URLS, LEGAL_ENTITY, CONSENT_VERSION };
