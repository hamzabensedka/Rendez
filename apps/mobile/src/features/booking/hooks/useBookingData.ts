import { useEffect, useState, useCallback } from 'react';
import { getNextDays } from '@planity/shared';
import api from '../../../shared/lib/api';

export interface Slot {
  startAt: string;
  staffId: string | null;
}

export interface ServiceVariant {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number | null;
  service: { id: string; name: string };
}

export interface BookingBusiness {
  id: string;
  locations?: Array<{ id: string }>;
  services?: Array<{
    id: string;
    name: string;
    serviceVariants?: Array<{ id: string; name: string; durationMin: number; priceCents: number | null }>;
  }>;
}

export interface UseBookingDataResult {
  business: BookingBusiness | null;
  serviceVariant: ServiceVariant | null;
  slots: Slot[];
  availableDates: Date[];
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  loadingBusiness: boolean;
  loadingSlots: boolean;
  loadAvailability: () => Promise<void>;
}

/**
 * Loads business + selected service variant and manages availability slots.
 * Use when the screen has businessId and serviceVariantId (e.g. from route params).
 */
export function useBookingData(
  businessId: string | undefined,
  serviceVariantId: string | undefined
): UseBookingDataResult {
  const [business, setBusiness] = useState<BookingBusiness | null>(null);
  const [serviceVariant, setServiceVariant] = useState<ServiceVariant | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const availableDates = getNextDays(new Date(), 14);

  const loadBusinessAndVariant = useCallback(async () => {
    if (!businessId || !serviceVariantId) {
      setLoadingBusiness(false);
      return;
    }
    setLoadingBusiness(true);
    try {
      const response = await api.get(`/businesses/${businessId}`);
      const businessData = response.data as BookingBusiness;
      setBusiness(businessData);
      let found: ServiceVariant | null = null;
      for (const service of businessData.services ?? []) {
        const variant = service.serviceVariants?.find((v) => v.id === serviceVariantId);
        if (variant) {
          found = { ...variant, service: { id: service.id, name: service.name } };
          break;
        }
      }
      setServiceVariant(found);
    } catch {
      setBusiness(null);
      setServiceVariant(null);
    } finally {
      setLoadingBusiness(false);
    }
  }, [businessId, serviceVariantId]);

  const loadAvailability = useCallback(async () => {
    if (!businessId || !serviceVariantId) return;
    setLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/businesses/${businessId}/availability`, {
        params: { serviceVariantId, date: dateStr },
      });
      setSlots(response.data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [businessId, serviceVariantId, selectedDate]);

  useEffect(() => {
    loadBusinessAndVariant();
  }, [loadBusinessAndVariant]);

  useEffect(() => {
    if (businessId && serviceVariantId) {
      loadAvailability();
    }
  }, [businessId, serviceVariantId, loadAvailability]);

  return {
    business,
    serviceVariant,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingBusiness,
    loadingSlots,
    loadAvailability,
  };
}
