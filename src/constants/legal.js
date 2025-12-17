/**
 * ============================================================
 * CONSTANTES Y TEXTOS LEGALES - BANQUEANDO
 * ============================================================
 */

// ============================================================
// CONFIGURACIÓN DE CÁLCULOS DE AHORRO
// ============================================================

export const SAVINGS_CONFIG = {
  // Cuota de manejo promedio del mercado (COP/mes)
  averageMonthlyFee: 25000,
  
  // Valor de millas en USD
  mileValues: {
    lifemiles: 0.01,    // Avianca LifeMiles
    latam: 0.01,        // LATAM Pass
    generic: 0.005      // Puntos genéricos
  },
  
  // TRM fija para conversiones
  trm: 3800
};

// ============================================================
// TEXTOS LEGALES
// ============================================================

export const LEGAL_TEXTS = {
  // Footer del Landing
  landingFooter: `Banqueando es una plataforma informativa y de comparación. No somos una entidad financiera, no otorgamos créditos ni tarjetas. Las recomendaciones se basan en la información que proporcionas y datos públicos de cada producto. Todas las ofertas están sujetas a evaluación y aprobación por parte de cada entidad financiera. © 2025 Banqueando.`,
  
  // Footer general (todas las pantallas)
  generalFooter: {
    line1: "La información de tarjetas se obtiene de fuentes públicas y sitios oficiales de cada banco",
    line2: "Los datos se actualizan periódicamente pero pueden variar sin previo aviso",
    line3: "Consulta siempre las condiciones oficiales en el sitio web de cada entidad",
    copyright: "Banqueando © 2025"
  },
  
  // Texto del ahorro estimado
  savingsDisclaimer: `* El ahorro estimado es un cálculo aproximado basado en tu perfil de gasto, beneficios declarados por cada entidad y promedios del mercado. No garantizamos este monto. El ahorro real dependerá de tu uso, cumplimiento de condiciones del banco y cambios en las políticas de cada producto.`,
  
  // Desglose del ahorro (tooltip/modal)
  savingsBreakdown: {
    title: "¿Cómo calculamos tu ahorro?",
    items: [
      "Cuota de manejo: Comparamos vs promedio del mercado ($25.000/mes)",
      "Cashback: Basado en tu gasto mensual × % de devolución",
      "Millas: Valoradas a $0.01 USD (TRM $3.800)"
    ],
    footer: "Este es un estimado. El ahorro real depende de tu uso y las condiciones vigentes de cada banco."
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
  
  // Checkbox de autorización
  authorizationCheckbox: `Autorizo el tratamiento de mis datos personales conforme a la Política de Privacidad y acepto los Términos y Condiciones. Mis datos serán utilizados para enviarme resultados, recomendaciones y ofertas relacionadas con productos financieros.`
};

// ============================================================
// URLS DE PÁGINAS LEGALES
// ============================================================

export const LEGAL_URLS = {
  privacy: "/privacidad.html",
  terms: "/terminos.html"
};

export default { SAVINGS_CONFIG, LEGAL_TEXTS, LEGAL_URLS };
