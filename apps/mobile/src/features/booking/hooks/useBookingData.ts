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

export interface BookingStaff {
  id: string;
  name: string;
}

export interface BookingBusiness {
  id: string;
  name?: string;
  locations?: Array<{ id: string }>;
  staff?: BookingStaff[];
  services?: Array<{
    id: string;
    name: string;
    serviceVariants?: Array<{
      id: string;
      name: string;
      durationMin: number;
      priceCents: number | null;
    }>;
  }>;
}

export interface UseBookingDataResult {
  business: BookingBusiness | null;
  serviceVariant: ServiceVariant | null;
  staff: BookingStaff[];
  slots: Slot[];
  availableDates: Date[];
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  loadingBusiness: boolean;
  loadingSlots: boolean;
  slotsError: boolean;
  loadAvailability: () => Promise<void>;
}

function toLocalDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Loads business + selected service variant and manages availability slots via TanStack Query.
 */
export function useBookingData(
  businessId: string | undefined,
  serviceVariantId: string | undefined,
  selectedStaffId: string | null,
  cartVariantIds: string[],
  options?: { slots?: boolean }
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
  const staff = business?.staff ?? [];

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

  const dateStr = toLocalDateParam(selectedDate);
  const variantIds = cartVariantIds.length > 0 ? cartVariantIds : serviceVariantId ? [serviceVariantId] : [];
  const extraIds = variantIds.filter((id) => id !== serviceVariantId);
  const variantKey = variantIds.slice().sort().join(',');

  const availabilityQuery = useQuery({
    queryKey: queryKeys.availability(businessId ?? '', variantKey, dateStr, selectedStaffId),
    queryFn: async () => {
      const response = await api.get(`/businesses/${businessId}/availability`, {
        params: {
          serviceVariantId,
          date: dateStr,
          ...(selectedStaffId ? { staffId: selectedStaffId } : {}),
          ...(extraIds.length ? { serviceVariantIds: extraIds.join(',') } : {}),
        },
      });
      const apiSlots = response.data?.slots ?? [];
      return Array.isArray(apiSlots) ? (apiSlots as Slot[]) : [];
    },
    enabled: Boolean(businessId && serviceVariantId && variantIds.length > 0 && options?.slots !== false),
  });

  const slots = availabilityQuery.data ?? [];
  const slotsError = availabilityQuery.isError;

  const loadAvailability = useCallback(async () => {
    if (!businessId || !serviceVariantId) return;
    await queryClient.invalidateQueries({
      queryKey: queryKeys.availability(businessId, variantKey, dateStr, selectedStaffId),
    });
  }, [queryClient, businessId, serviceVariantId, variantKey, dateStr, selectedStaffId]);

  return {
    business,
    serviceVariant,
    staff,
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
