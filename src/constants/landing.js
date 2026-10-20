// Cifras que muestra la página de inicio. Salen de config/cards.json y finance.js;
// landing.test.js verifica que coincidan con los datos, así que si cambian los datos la prueba avisa.
// No se importa cards.json aquí para no sumar ese peso a la página de inicio.

// Resultado de ejemplo de la portada: perfil que quiere millas, paga el total y gasta $1,5M al mes.
export const HERO_EXAMPLE = {
  cardId: 'latam_pass_platinum',
  name: 'LATAM Pass Visa Platinum',
  entity: 'Banco de Bogotá',
  network: 'VISA',
  verified: '2026-10-16',
  monthlySpend: 1500000,
  miles: 21600,
  milesValue: 820800,
  annualFee: 480000,
  net: 340800,
  rateEA: 24.98,
  minIncomeMillions: 4,
  loungeVisits: 4
};

// Tarjetas activas y cuántas tienen tarifas verificadas.
export const CARD_COUNTS = { active: 12, verified: 12 };

// Entidades que aparecen en la franja "Comparamos productos de" (todas con productos activos).
export const FEATURED_ENTITIES = ['Bancolombia', 'Davivienda', 'BBVA', 'Banco de Bogotá', 'DAVIbank', 'Nu', 'RappiCard', 'Banco Falabella', 'Nequi', 'Lineru'];
