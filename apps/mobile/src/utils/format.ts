/**
 * Formats a number as currency (EUR by default).
 */
export function formatCurrency(amount: number, currency = 'EUR', locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
