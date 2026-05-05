/**
 * Formats a number as US-style currency (e.g. $1,234.56) with exactly two decimal places.
 * Defaults to USD. On invalid currency or formatter errors, falls back to `$` + two decimals.
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
}
