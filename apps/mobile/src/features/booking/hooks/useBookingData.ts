import { useMemo, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNextDays } from '@planity/shared';
import api from '../../../shared/lib/api';
import { queryKeys } from '../../../application/query/queryKeys';

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
  name?: string;
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
  slotsError: boolean;
  loadAvailability: () => Promise<void>;
}

/**
 * Loads business + selected service variant and manages availability slots via TanStack Query.
 */
export function useBookingData(
  businessId: string | undefined,
  serviceVariantId: string | undefined
): UseBookingDataResult {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const availableDates = getNextDays(new Date(), 14);

  const businessQuery = useQuery({
    queryKey: queryKeys.business(businessId),
    queryFn: async () => {
      const response = await api.get(`/businesses/${businessId}`);
      return response.data as BookingBusiness;
    },
    enabled: Boolean(businessId && serviceVariantId),
  });

  const business = businessQuery.data ?? null;

  const serviceVariant = useMemo((): ServiceVariant | null => {
    if (!business || !serviceVariantId) return null;
    for (const service of business.services ?? []) {
        const variant = service.serviceVariants?.find(
          (v: { id: string }) => v.id === serviceVariantId
        );
      if (variant) {
        return { ...variant, service: { id: service.id, name: service.name } };
      }
    }
    return null;
  }, [business, serviceVariantId]);

  const dateStr = selectedDate.toISOString().split('T')[0];

  const availabilityQuery = useQuery({
    queryKey: queryKeys.availability(businessId ?? '', serviceVariantId ?? '', dateStr),
    queryFn: async () => {
      const response = await api.get(`/businesses/${businessId}/availability`, {
        params: { serviceVariantId, date: dateStr },
      });
      const apiSlots = response.data?.slots ?? [];
      return Array.isArray(apiSlots) ? apiSlots : [];
    },
    enabled: Boolean(businessId && serviceVariantId),
  });

  const slots = availabilityQuery.data ?? [];
  const slotsError = availabilityQuery.isError;

  const loadAvailability = useCallback(async () => {
    if (!businessId || !serviceVariantId) return;
    await queryClient.invalidateQueries({
      queryKey: queryKeys.availability(businessId, serviceVariantId, dateStr),
    });
  }, [queryClient, businessId, serviceVariantId, dateStr]);

  return {
    business,
    serviceVariant,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingBusiness: businessQuery.isPending,
    loadingSlots: availabilityQuery.isPending,
    slotsError,
    loadAvailability,
  };
}
