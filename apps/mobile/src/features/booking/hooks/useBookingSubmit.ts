import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { generateIdempotencyKey } from '@planity/shared';
import api from '../../../shared/lib/api';
import { useAuth } from '../../../application/providers';
import type { BookingCartItem } from '../types';
import type { BookingBusiness } from './useBookingData';

export interface UseBookingSubmitParams {
  businessId: string | undefined;
  business: BookingBusiness | null;
  selectedServices: BookingCartItem[];
  displayName: string;
}

function formatSuccessDate(isoDate: string): string {
  const d = new Date(isoDate);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function formatSuccessTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function useBookingSubmit(params: UseBookingSubmitParams) {
  const router = useRouter();
  const { user } = useAuth();
  const { businessId, business, selectedServices, displayName } = params;
  const [booking, setBooking] = useState(false);

  async function handleConfirmDate(selectedSlot: string | null) {
    if (!selectedSlot || !businessId || selectedServices.length === 0) {
      Alert.alert('Error', 'Please select a time slot and at least one service');
      return;
    }
    if (!user) {
      router.push({
        pathname: '/(tabs)/booking/identification',
        params: {
          selectedSlot,
          existingServices: JSON.stringify(selectedServices),
          businessId,
          businessName: displayName,
        },
      });
      return;
    }
    const locationId = business?.locations?.[0]?.id;
    if (!locationId) {
      Alert.alert('Error', 'Unable to complete booking. Please try again.');
      return;
    }
    setBooking(true);
    try {
      const payload = {
        businessId,
        locationId,
        items: selectedServices.map((s) => ({ serviceVariantId: s.serviceVariantId, quantity: 1 })),
        startAt: selectedSlot,
        idempotencyKey: generateIdempotencyKey(),
      };
      const { data } = await api.post<{ id?: string }>('/appointments', payload);
      const loc = business?.locations?.[0] as { address1?: string; postalCode?: string; city?: string } | undefined;
      const address = loc
        ? [loc.address1, loc.postalCode, loc.city].filter(Boolean).join(', ')
        : '';
      const totalMinutes = selectedServices.reduce((sum, s) => sum + (s.durationMin ?? 0), 0);
      const serviceLabel = selectedServices.length === 1
        ? selectedServices[0].name
        : selectedServices.map((s) => s.name).join(', ');
      router.replace({
        pathname: '/(tabs)/booking/success',
        params: {
          businessName: displayName,
          serviceLabel,
          durationMinutes: String(totalMinutes),
          dateFormatted: formatSuccessDate(selectedSlot),
          timeFormatted: formatSuccessTime(selectedSlot),
          address: address || undefined,
          appointmentId: data?.id,
        },
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Something went wrong. Please try again or choose another slot.';
      Alert.alert('Booking failed', message);
    } finally {
      setBooking(false);
    }
  }

  return { booking, handleConfirmDate };
}
