import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Button } from '@planity/ui/Button';
import { Card } from '@planity/ui/Card';
import { Typography } from '@planity/ui/Typography';
import { Spacer } from '@planity/ui/Spacer';
import { useTheme } from '@planity/ui/ThemeProvider';
import { PaymentStatus, PaymentMethod } from '@planity/shared/types/payment';
import { apiClient } from '../../lib/api-client';
import { useAuth } from '../../hooks/useAuth';

interface PaymentStepProps {
  appointmentId: string;
  amount: number;
  currency: string;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
}

interface PaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  receiptUrl?: string;
}

export function PaymentStep({
  bookingId,
  amount,
  currency,
  onSuccess,
  onBack,
}: PaymentStepProps) {
  const { colors, spacing } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const paymentMutation = useMutation<PaymentResponse, Error, { bookingId: string; method: PaymentMethod }>({
    mutationFn: async (payload) => {
      const response = await apiPayment.post('/payments/process', {
        bookingId: payload.bookingId,
        method: payload.method,
        amount,
        currency,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 'succeeded') {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
        onSuccess(data.transactionId);
      } else if (data.status === 'failed') {
        setPaymentError('Payment failed. Please try again.');
      }
    },
    onError: (error) => {
      setPaymentError(error.message || 'An unexpected error occurred.');
    },
  });

  const handlePay = () => {
    if (!user) {
      Alert.alert('Authentication required', 'Please log in to complete payment.');
      return;
    }
    setPaymentError(null);
    paymentMutation.mutate({ bookingId, method: selectedMethod });
  };

  const paymentMethods: { method: PaymentMethod; label: string }[] = [
    { method: 'card', label: 'Credit/Debit Card' },
    { method: 'wallet', label: 'Digital Wallet' },
    { method: 'bank_transfer', label: 'Bank Transfer' },
  ];

  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.container}>
      <Card padding={spacing.lg}>
        <Typography variant="h2" style={styles.title}>
          Payment
        </Typography>
        <Spacer height={spacing.md} />

        <Typography variant="body" color={colors.textSecondary}>
          Booking #{bookingId}
        </Typography>
        <Spacer height={spacing.sm} />
        <Typography variant="h1" style={{ color: colors.primary }}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)}
        </Typography>
        <Spacer height={spacing.lg} />

        <Typography variant="subtitle1" style={styles.sectionTitle}>
          Select payment method
        </Typography>
        <Spacer height={spacing.sm} />

        {paymentMethods.map((pm) => (
          <Card
            key={pm.method}
            onPress={() => setSelectedMethod(pm.method)}
            variant={selectedMethod === pm.method ? 'elevated' : 'outlined'}
            style={[
              styles.methodCard,
              selectedMethod === pm.method && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            padding={spacing.md}
          >
            <Typography variant="body" style={{ fontWeight: selectedMethod === pm.method ? '600' : '400' }}>
              {pm.label}
            </Typography>
          </Card>
        ))}

        <Spacer height={spacing.lg} />

        {paymentError && (
          <Animated.View entering={FadeInDown} style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
            <Typography variant="body2" color={colors.error}>
              {paymentError}
            </Typography>
          </Animated.View>
        )}

        <Spacer height={spacing.md} />

        <Button
          title={paymentMutation.isPending ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)}`}
          onPress={handlePay}
          disabled={paymentMutation.isPending}
          loading={paymentMutation.isPending}
          fullWidth
        />

        <Spacer height={spacing.sm} />

        <Button
          title="Back"
          variant="text"
          onPress={onBack}
          disabled={paymentMutation.isPending}
          fullWidth
        />
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  methodCard: {
    marginBottom: 8,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});
