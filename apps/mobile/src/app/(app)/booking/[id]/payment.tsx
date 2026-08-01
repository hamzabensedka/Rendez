import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography } from '@shared/ui/Typography';
import { useTheme } from '@shared/ui/themeProvider';
import { apiClient } from '../../../../lib/api-client';
import { PaymentFlow } from '../../../../features/payment/PaymentFlow';

interface BookingPaymentInfo {
  id: string;
  totalAmount: number;
  currency: string;
  status: string;
}

export default function BookingPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: booking, isLoading, error } = useQuery<BookingPaymentInfo>({
    queryKey: ['booking', id, 'payment'],
    queryFn: async () => {
      const response = await apiClient.get(`/bookings/${id}/payment-info`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="body" style={{ marginTop: 12 }}>Loading payment details...</Typography>
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.centered}>
        <Typography variant="body" color={colors.error}>
          Could not load booking payment details.
        </Typography>
      </View>
    );
  }

  return (
    <PaymentFlow
      bookingId={booking.id}
      amount={booking.totalAmount}
      currency={booking.currency}
      onComplete={() => router.replace('/appointments')}
      onDismiss={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
