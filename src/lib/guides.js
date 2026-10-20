// Páginas para Google por necesidad ("tarjeta sin cuota de manejo", "crédito para reportados"...).
// Se arman desde la base de productos: cada guía filtra y ordena productos activos.
// Las de crédito solo muestran productos verificados y que sirven para esa necesidad (fit).
import { annualFeeCost } from '../engine/finance.js';

const isActive = (p) => p.active !== false;
const fitsDestination = (p, dest) => (p.fit?.destinations || []).includes(dest);
const waivable = (c) => /exoner|sin cuota con|cuota \$0 si|dejarla en \$0/i.test(c.fees?.feeWaiverCondition || '');

export const CARD_GUIDES = [
  {
    slug: 'sin-cuota-de-manejo',
    short: 'Tarjetas sin cuota de manejo',
    title: 'Tarjetas de crédito sin cuota de manejo en Colombia',
    metaTitle: 'Tarjetas de crédito sin cuota de manejo en Colombia',
    description: 'Qué tarjetas no cobran cuota de manejo y cuáles puedes dejar en $0 cumpliendo una condición, con la tarifa oficial verificada.',
    intro: 'Muchas tarjetas anuncian "sin cuota de manejo", pero casi siempre es con condiciones: un número de compras al mes, un monto mínimo o solo los primeros meses. Aquí separamos las que de verdad no cobran de las que puedes dejar en $0 si cumples la condición.',
    tips: [
      'Lee la condición: "4 compras al mes" o "$500.000 al mes" cambia mucho según cómo usas la tarjeta.',
      'Si no cumples la condición, pagas la cuota completa. Compárala con lo que te devuelve la tarjeta.',
      'Una tarjeta con cuota puede convenirte si sus millas o su cashback valen más que la cuota al año.'
    ],
    quiz: '/quiz?tipo=tarjeta',
    select: (cards) => cards.filter(c => annualFeeCost(c) === 0 || waivable(c)),
    sort: (a, b) => annualFeeCost(a) - annualFeeCost(b)
  },
  {
    slug: 'con-millas',
    short: 'Tarjetas con millas',
    title: 'Tarjetas de crédito con millas LifeMiles y LATAM Pass',
    metaTitle: 'Tarjetas de crédito con millas en Colombia: LifeMiles y LATAM Pass',
    description: 'Tarjetas que acumulan millas LifeMiles o LATAM Pass en Colombia: cuánto acumulan, cuánto cuestan al año y para quién valen la pena.',
    intro: 'Una tarjeta de millas vale la pena cuando lo que acumulas al año supera la cuota de manejo. Eso depende de cuánto gastas con la tarjeta: con gastos bajos, la cuota se come las millas.',
    tips: [
      'Calcula las millas con tu gasto real, no con el ejemplo del banco.',
      'Paga el total cada mes: los intereses borran el valor de las millas.',
      'Revisa la cuota de manejo del año completo y la comisión en compras internacionales.'
    ],
    quiz: '/quiz?tipo=tarjeta',
    select: (cards) => cards.filter(c => c.rewards?.type === 'miles'),
    sort: (a, b) => (b.rewards?.milesPerMillionCOP || 0) - (a.rewards?.milesPerMillionCOP || 0)
  },
  {
    slug: 'primera-tarjeta',
    short: 'Primera tarjeta',
    title: 'Tarjetas de crédito para tu primera tarjeta o sin historial',
    metaTitle: 'Primera tarjeta de crédito en Colombia: opciones sin historial crediticio',
    description: 'Tarjetas que aceptan personas sin historial crediticio en Colombia, con sus requisitos, cuota de manejo y tasa verificadas.',
    intro: 'Si nunca has tenido crédito, varios bancos y fintechs te reciben sin historial. Una primera tarjeta bien usada es la forma más rápida de construir tu historial crediticio.',
    tips: [
      'Empieza con un cupo bajo y paga el total cada mes.',
      'Prefiere una tarjeta sin cuota o con una condición fácil de cumplir.',
      'Evita los avances en efectivo: tienen la tasa más alta y cobran comisión.'
    ],
    quiz: '/quiz?tipo=tarjeta',
    select: (cards) => cards.filter(c => c.requirements?.acceptsFirstTimers),
    sort: (a, b) => annualFeeCost(a) - annualFeeCost(b)
  }
];

export const CREDIT_GUIDES = [
  {
    slug: 'para-reportados',
    short: 'Créditos para reportados',
    title: 'Créditos para reportados en centrales de riesgo',
    metaTitle: 'Créditos para reportados en Datacrédito en Colombia',
    description: 'Créditos que aceptan personas reportadas en centrales de riesgo en Colombia, con montos, tasas y tiempos de desembolso verificados.',
    intro: 'Estar reportado no cierra todas las puertas. Algunas fintechs y créditos de libranza estudian tu caso aunque tengas un reporte, sobre todo por montos bajos. La tasa suele ser más alta, así que compara antes de aceptar.',
    tips: [
      'Pide solo lo que puedes pagar: un nuevo atraso empeora el reporte.',
      'Desconfía de quien te pida pagar antes de desembolsar: las entidades serias no lo hacen.',
      'Si eres empleado o pensionado, la libranza suele tener mejor tasa.'
    ],
    quiz: '/quiz?tipo=credito',
    select: (products) => products.filter(p => p.requirements?.acceptsReported && (fitsDestination(p, 'personal') || fitsDestination(p, 'negocio')))
  },
  {
    slug: 'para-negocio-informal',
    short: 'Créditos para negocio informal',
    title: 'Créditos para negocios informales y emprendedores',
    metaTitle: 'Créditos para negocio informal en Colombia (sin RUT ni Cámara de Comercio)',
    description: 'Créditos para negocios sin RUT ni registro mercantil en Colombia: microcréditos y préstamos en efectivo, con montos y tasas verificados.',
    intro: 'Si tu negocio no está formalizado, los bancos tradicionales casi siempre te dicen que no. Hay microcréditos y préstamos de uso libre que sí estudian a negocios informales y emprendedores.',
    tips: [
      'Ten a mano extractos o un registro de tus ventas: ayuda a que te aprueben.',
      'Compara la cuota con lo que vende tu negocio al mes, no con lo que esperas vender.',
      'Formalizarte (RUT) abre créditos con mejores tasas más adelante.'
    ],
    quiz: '/quiz?tipo=credito',
    select: (products) => products.filter(p => fitsDestination(p, 'negocio') && (!p.fit.formalization || p.fit.formalization.includes('informal')) && p.requirements?.acceptsInformal)
  },
  {
    slug: 'de-libranza',
    short: 'Créditos de libranza',
    title: 'Créditos de libranza para empleados y pensionados',
    metaTitle: 'Créditos de libranza en Colombia para empleados y pensionados',
    description: 'Créditos de libranza en Colombia: se descuentan de tu nómina o pensión y suelen tener mejor tasa. Montos, tasas y requisitos verificados.',
    intro: 'La libranza se paga con un descuento directo de tu nómina o pensión. Como el riesgo es menor, la tasa suele ser más baja que la de un crédito de libre inversión. Sirve para empleados con contrato y pensionados, cuando la empresa o el fondo tiene convenio.',
    tips: [
      'Pregunta si tu empresa o fondo de pensiones tiene convenio con la entidad.',
      'Mira el plazo: a más plazo, cuota más baja pero más intereses en total.',
      'Úsala para unificar deudas caras, no para gastos del día a día.'
    ],
    quiz: '/quiz?tipo=credito',
    select: (products) => products.filter(p => (p.category || []).includes('libranza'))
  },
  {
    slug: 'desembolso-rapido',
    short: 'Créditos rápidos',
    title: 'Créditos con desembolso en menos de 24 horas',
    metaTitle: 'Créditos rápidos en Colombia: desembolso en menos de 24 horas',
    description: 'Créditos con desembolso en menos de 24 horas en Colombia, con montos, tasas y condiciones verificados en el sitio de cada entidad.',
    intro: 'Cuando necesitas el dinero ya, la velocidad tiene un costo: los créditos más rápidos suelen ser de montos bajos y con tasas cerca del máximo legal. Úsalos para emergencias puntuales y págalos pronto.',
    tips: [
      'Revisa el costo total, no solo la cuota: algunos cobran cargos fijos además de intereses.',
      'Pide el monto justo y el plazo más corto que puedas pagar.',
      'Si no es urgente, un crédito más lento puede salirte bastante más barato.'
    ],
    quiz: '/quiz?tipo=credito',
    select: (products) => products.filter(p => (p.loanDetails?.disbursementTimeHours ?? 99) <= 24)
  }
];

// Productos de una guía: activos, y en crédito además verificados y con fit.
export function guideProducts(guide, kind, data) {
  if (kind === 'tarjetas') {
    const cards = (data.cards || []).filter(isActive);
    return guide.select(cards).sort(guide.sort || (() => 0));
  }
  const credits = (data.creditProducts || []).filter(p => isActive(p) && p.lastVerified && p.fit?.destinations?.length);
  return guide.select(credits).sort((a, b) => (a.loanDetails?.interestRateEA?.min ?? 99) - (b.loanDetails?.interestRateEA?.min ?? 99));
}

export const GUIDE_KINDS = { tarjetas: CARD_GUIDES, creditos: CREDIT_GUIDES };
export const findGuide = (kind, slug) => (GUIDE_KINDS[kind] || []).find(g => g.slug === slug) || null;
export const allGuidePaths = () => Object.entries(GUIDE_KINDS).flatMap(([kind, list]) => list.map(g => `/${kind}/${g.slug}`));
