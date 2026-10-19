// Pesos colombianos: $1.234.567 (negativos como -$120.000).
export const formatCOP = (n) => `${n < 0 ? '-' : ''}$${Math.round(Math.abs(n)).toLocaleString('es-CO')}`;
