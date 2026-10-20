// Pesos colombianos: $1.234.567 (negativos como -$120.000).
export const formatCOP = (n) => `${n < 0 ? '-' : ''}$${Math.round(Math.abs(n)).toLocaleString('es-CO')}`;

// Montos guardados en millones: menos de un millón en pesos ($50.000) y desde un millón como $5,2M.
export const formatMillions = (m) => {
  if (m == null) return '?';
  if (m < 1) return formatCOP(m * 1e6);
  return `$${String(Math.round(m * 10) / 10).replace('.', ',')}M`;
};
