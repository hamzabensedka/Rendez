import { useState, useEffect, useMemo, useRef } from 'react';
import type { BookingBusiness } from './useBookingData';
import type { BookingCartItem } from '../types';
import { isBookingCartItems } from '../types';

export type BookingCartItemWithServiceName = BookingCartItem & { serviceName: string };

export interface UseBookingCartParams {
  paramExistingServices: string | undefined;
  initialSingleItem: BookingCartItem | null;
  business: BookingBusiness | null;
}

export interface UseBookingCartResult {
  selectedServices: BookingCartItem[];
  setSelectedServices: React.Dispatch<React.SetStateAction<BookingCartItem[]>>;
  totalPriceCents: number;
  availableVariantsToAdd: BookingCartItemWithServiceName[];
  handleRemoveService: (index: number) => void;
  handleAddService: (item: BookingCartItem) => void;
}

export function useBookingCart(
  params: UseBookingCartParams,
  onRemoveLast: () => void
): UseBookingCartResult {
  const { paramExistingServices, initialSingleItem, business } = params;
  const [selectedServices, setSelectedServices] = useState<BookingCartItem[]>([]);
  const hasInitializedCart = useRef(false);

  useEffect(() => {
    if (typeof paramExistingServices === 'string' && paramExistingServices) {
      try {
        const parsed: unknown = JSON.parse(paramExistingServices);
        if (isBookingCartItems(parsed)) {
          setSelectedServices(parsed);
          hasInitializedCart.current = true;
          return;
        }
      } catch {
        // invalid JSON or shape — ignore
      }
    }
    if (initialSingleItem && !hasInitializedCart.current) {
      setSelectedServices([initialSingleItem]);
      hasInitializedCart.current = true;
    }
  }, [paramExistingServices, initialSingleItem]);

  const totalPriceCents = selectedServices.reduce((sum, s) => sum + (s.priceCents ?? 0), 0);

  const availableVariantsToAdd = useMemo(() => {
    if (!business?.services) return [];
    const selectedIds = new Set(selectedServices.map((s) => s.serviceVariantId));
    const list: BookingCartItemWithServiceName[] = [];
    for (const svc of business.services) {
      for (const v of svc.serviceVariants ?? []) {
        if (selectedIds.has(v.id)) continue;
        list.push({
          serviceVariantId: v.id,
          name: v.name,
          durationMin: v.durationMin,
          priceCents: v.priceCents,
          serviceName: svc.name,
        });
      }
    }
    return list;
  }, [business?.services, selectedServices]);

  function handleRemoveService(index: number) {
    setSelectedServices((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) onRemoveLast();
      return next;
    });
  }

  function handleAddService(item: BookingCartItem) {
    setSelectedServices((prev) => [...prev, item]);
  }

  return {
    selectedServices,
    setSelectedServices,
    totalPriceCents,
    availableVariantsToAdd,
    handleRemoveService,
    handleAddService,
  };
}
