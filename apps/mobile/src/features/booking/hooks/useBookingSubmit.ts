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
      await api.post('/appointments', payload);
      Alert.alert('Success', 'Appointment booked!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/bookings') },
      ]);
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
