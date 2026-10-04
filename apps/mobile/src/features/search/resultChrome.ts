const SLOTS = ['Today 14:30', 'Tomorrow 10:00', 'Today 11:15', 'Tomorrow 16:45'] as const;
const PRICES = [45, 55, 38, 62, 48] as const;

function hashId(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
  return n;
}

/** Display slot when the API list has no availability payload. */
export function resultSlotForId(id: string, override?: string): string {
  if (override?.trim()) return override.trim();
  return SLOTS[hashId(id) % SLOTS.length];
}

/** Display starting price when the API list has no min price. */
export function resultFromPriceForId(id: string): string {
  return `from ${PRICES[hashId(id) % PRICES.length]}€`;
}
