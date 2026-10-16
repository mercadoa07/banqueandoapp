// Migración única (Fase 1, 2026-10-14): agrega los campos de trazabilidad a cada producto.
// No inventa datos: lo que no se sabe queda en null o marcado como no verificado.
//   node scripts/migrate-products-v3.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
// Los JSON del repo usan CRLF y 2 espacios: se respeta para no ensuciar el diff.
const write = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');

// Modalidad de usura de un crédito, inferida por tipo y categoría. Queda como NO verificada.
// Ojo: "Libre Inversión" SÍ es crédito de consumo; solo "Inversión en…/Inversión Cultivos" no lo es.
const NOT_CREDIT = /^inversi[oó]n |colaborativa|arriendo|salario bajo demanda|crowdfactoring|factoring|confirming|adelanto de facturas|anticipo producci[oó]n/i;
const inferCreditModality = (p) => {
  const cats = p.category || [];
  if (NOT_CREDIT.test(p.productType || '')) return 'no_aplica';
  if (cats.includes('vivienda')) return 'vivienda';
  if (cats.includes('agro')) return 'productivo_rural';
  if (cats.includes('micro') || cats.includes('emprendedor')) return 'popular_productivo_urbano';
  if (cats.includes('empresarial')) return 'productivo_urbano';
  return 'consumo_ordinario';
};

const withTrace = (p, { entity, sourceUrl, modality, modalityVerified }) => ({
  ...p,
  entity,
  active: p.active ?? true,
  lastVerified: p.lastVerified ?? null,
  source: p.source ?? { url: sourceUrl, notes: null },
  usuryModality: p.usuryModality ?? modality,
  usuryModalityVerified: p.usuryModalityVerified ?? modalityVerified
});

// Tarjetas: siempre consumo y ordinario (eso sí es seguro).
const cardsPath = 'config/cards.json';
const cards = read(cardsPath);
cards.version = '3.0';
cards.cards = cards.cards.map(c => withTrace(c, {
  entity: c.bank,
  sourceUrl: c.moreInfoUrl || c.applyUrl,
  modality: 'consumo_ordinario',
  modalityVerified: true
}));
write(cardsPath, cards);

// Créditos.
const creditPath = 'config/creditProducts.json';
const credit = read(creditPath);
credit.version = '3.0';
// Ids con caracteres que rompen URLs/consultas (verificado: nada en src/ los referencia).
const RENAMED_IDS = { "d'una_14": 'duna_14' };
// Se desactivan (no se borran) hasta verificarlos contra la página de la entidad.
const DEACTIVATE = {
  guama_24: 'Sin link de la entidad (applyUrl vacío).',
  r5_32: 'Tasa máxima 0.35% < mínima 22%: dato mal cargado (¿35%?).',
  a2censo_39: 'Tasa máxima 0.18% < mínima 10%: dato mal cargado.',
  crediorbe_42: 'Tasa máxima 0.35% < mínima 22%: dato mal cargado (¿35%?).',
  ledn_44: 'Monto mínimo 100M > máximo 5M: dato mal cargado.',
  sosty_45: 'Monto mínimo 10M > máximo 5M: dato mal cargado.',
  unergy_46: 'Monto mínimo 50M > máximo 5M: dato mal cargado.',
  mattilda_49: 'Monto mínimo 10M > máximo 5M: dato mal cargado.',
  terrenta_50: 'Producto de inversión, no de crédito: no aplica al quiz "necesito dinero".',
  agroune_51: 'Producto de inversión, no de crédito: no aplica al quiz "necesito dinero".'
};
credit.creditProducts = credit.creditProducts.map(p => {
  const migrated = withTrace({ ...p, id: RENAMED_IDS[p.id] || p.id }, {
    entity: p.provider,
    sourceUrl: p.applyUrl || null,
    modality: inferCreditModality(p),
    modalityVerified: false
  });
  const reason = DEACTIVATE[migrated.id];
  return reason ? { ...migrated, active: false, source: { ...migrated.source, notes: `Desactivado 2026-10-14: ${reason}` } } : migrated;
});
write(creditPath, credit);

const count = (arr, f) => arr.reduce((acc, x) => ((acc[f(x)] = (acc[f(x)] || 0) + 1), acc), {});
console.log('Tarjetas migradas:', cards.cards.length);
console.log('Créditos migrados:', credit.creditProducts.length, count(credit.creditProducts, p => p.usuryModality));
