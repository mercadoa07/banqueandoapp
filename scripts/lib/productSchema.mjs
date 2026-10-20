// Esquema de los productos de config/*.json.
// Lo usa scripts/validate-data.mjs. La app no lo importa (no suma peso al bundle).
import { z } from 'zod';

export const USURY_MODALITIES = [
  'consumo_ordinario',
  'consumo_bajo_monto',
  'productivo_urbano',
  'productivo_rural',
  'productivo_mayor_monto',
  'popular_productivo_urbano',
  'popular_productivo_rural',
  'vivienda',      // régimen propio, sin tope en usuryRates.json
  'no_aplica'      // no es crédito (inversión, arriendo, salario bajo demanda…)
];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha YYYY-MM-DD');
const url = z.string().url();
const pct = z.number().min(0).max(200);

// Campos de trazabilidad comunes (Fase 1).
const traceability = {
  entity: z.string().min(1),
  active: z.boolean(),
  lastVerified: isoDate.nullable(),
  source: z.object({
    url: url.nullable(),
    notes: z.string().nullable().optional()
  }),
  usuryModality: z.enum(USURY_MODALITIES),
  usuryModalityVerified: z.boolean()
};

export const cardSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'id en snake_case'),
  name: z.string().min(1),
  bank: z.string().min(1),
  network: z.string().optional(),
  category: z.array(z.string()),
  fees: z.object({
    annualFee: z.number().min(0),
    monthlyFee: z.number().min(0),
    feeWaiverCondition: z.string().nullable().optional(),
    internationalFeePercent: z.number().min(0).optional()
  }),
  rates: z.object({
    interestRateEA: pct,
    cashAdvanceRateEA: pct.optional()
  }),
  requirements: z.object({
    minIncomeMillions: z.number().min(0),
    minAge: z.number().int().optional(),
    maxAge: z.number().int().optional(),
    acceptsReported: z.boolean().optional()
  }).passthrough(),
  benefits: z.array(z.string()),
  applyUrl: url,
  moreInfoUrl: url.optional(),
  ...traceability
}).passthrough();

// Valores válidos de las respuestas del quiz (config/questions.json) que usa `fit`.
export const FIT_VALUES = {
  destinations: ['personal', 'negocio', 'iniciar_negocio'],
  purposes: ['emergencia_personal', 'consolidar_deuda', 'compra_especifica', 'inversion_negocio', 'capital_trabajo', 'inventario', 'iniciar_negocio', 'oportunidad', 'libre_inversion'],
  employment: ['empleado_fijo', 'empleado_temporal', 'independiente', 'empresario', 'pensionado', 'desempleado'],
  formalization: ['informal', 'rut_pn', 'establecimiento', 'empresa'],
  sectors: ['retail', 'food', 'services', 'tech', 'manufacturing', 'health', 'education', 'logistics', 'construction', 'other']
};
const fitList = (key) => z.array(z.enum(FIT_VALUES[key]));

// Para quién sirve el crédito (lo usa fitsNeed en el motor). destinations vacío = no se recomienda.
const fitSchema = z.object({
  destinations: fitList('destinations'),
  purposes: fitList('purposes').min(1).optional(),
  employment: fitList('employment').min(1).optional(),
  formalization: fitList('formalization').min(1).optional(),
  sectors: fitList('sectors').min(1).optional(),
  why: z.string().min(1)
}).strict();

export const creditSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'id en snake_case'),
  name: z.string().min(1),
  provider: z.string().min(1),
  providerType: z.string(),
  category: z.array(z.string()),
  productType: z.string(),
  loanDetails: z.object({
    minAmountMillions: z.number().min(0),
    maxAmountMillions: z.number().min(0),
    interestRateEA: z.object({ min: pct, max: pct }),
    disbursementTimeHours: z.number().min(0).optional(),
    approvalTimeHours: z.number().min(0).optional()
  }).passthrough(),
  requirements: z.object({}).passthrough(),
  benefits: z.array(z.string()),
  useCase: z.array(z.string()),
  applyUrl: url,
  fit: fitSchema.optional(),
  ...traceability
}).passthrough().refine(p => !p.active || p.fit, { message: 'un crédito activo necesita `fit` (para quién sirve)', path: ['fit'] });
