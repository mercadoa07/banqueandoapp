// Celular colombiano: 10 dígitos que empiezan por 3 (se aceptan espacios, guiones y +57).
export const normalizePhone = (value) => {
  const digits = (value || '').replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('57') ? digits.slice(2) : digits;
  return /^3\d{9}$/.test(local) ? local : null;
};

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
