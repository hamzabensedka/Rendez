export interface BookingCartItem {
  serviceVariantId: string;
  name: string;
  durationMin: number;
  priceCents: number | null;
}

/** Type guard: validate parsed route params match BookingCartItem[]. */
export function isBookingCartItems(value: unknown): value is BookingCartItem[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as BookingCartItem).serviceVariantId === 'string' &&
      typeof (item as BookingCartItem).name === 'string' &&
      typeof (item as BookingCartItem).durationMin === 'number' &&
      ((item as BookingCartItem).priceCents === null ||
        typeof (item as BookingCartItem).priceCents === 'number')
  );
}
