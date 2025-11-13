/**
 * Formatea un número como moneda en pesos argentinos
 * @param {number} value - El valor a formatear
 * @returns {string} - El valor formateado como moneda
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formatea una fecha en formato local argentino
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha en formato corto
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada (DD/MM/YYYY)
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('es-AR');
};

/**
 * Formatea un número grande con separadores de miles
 * @param {number} value - El valor a formatear
 * @returns {string} - El valor formateado
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('es-AR').format(value);
};

/**
 * Calcula el porcentaje entre dos valores
 * @param {number} value - Valor actual
 * @param {number} total - Valor total
 * @returns {string} - Porcentaje formateado
 */
export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};
