import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { PaymentStatus } from '@planity/shared';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { ReceiptView } from '@/components/payment/ReceiptView';
import { colors, typography, spacing } from '@/theme';

type PaymentState = 'idle' | 'processing' | 'success' | 'failure';

interface PaymentPayload {
  appointmentId: string;
  amount: number;
  paymentMethodId: string;
}

export default function PaymentScreen() {
  const { businessId, appointmentId, amount } = useLocalSearchParams<{
    businessId: string;
    appointmentId: string;
    amount: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount || '0');

  const paymentMutation = useMutation({
    mutationFn: async (payload: PaymentPayload) => {
      const response = await apiClient.post('/payments/charge', payload);
      return response.data;
    },
    onSuccess: (data) => {
      setPaymentState('success');
      setTransactionId(data.transactionId);
    },
    onError: (error: any) => {
      setPaymentState('failure');
      Alert.alert(
        'Payment Failed',
        error?.response?.data?.message || 'An unexpected error occurred. Please try again.'
      );
    },
  });

  const handlePay = useCallback(() => {
    if (!selectedMethodId) {
      Alert.alert('Missing Payment Method', 'Please select a payment method to continue.');
      return;
    }

    if (!appointmentId) {
      Alert.alert('Error', 'Appointment information is missing.');
      return;
    }

    setPaymentState('processing');
    paymentMutation.mutate({
      appointmentId,
      amount: parsedAmount,
      paymentMethodId: selectedMethodId,
    });
  }, [selectedMethodId, appointmentId, parsedAmount, paymentMutation]);

  const handleDone = useCallback(() => {
    router.replace({
      pathname: '/(app)/appointments/[id]',
      params: { id: appointmentId },
    });
  }, [router, appointmentId]);

  const handleRetry = useCallback(() => {
    setPaymentState('idle');
    paymentMutation.reset();
  }, [paymentMutation]);

  if (!appointmentId || !businessId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style="textError">Missing booking information. Please go back and try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style="container">
      <ScrollView
        contentContainerStyle="contentContainer"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} layout={Layout.springify()}>
          <Text style="title">Payment</Text>
          <Text style="subtitle">Complete your booking by paying securely</Text>
        </Animated.View>

        {paymentState === 'success' && transactionId ? (
          <Animated.View entering={FadeIn(300)} layout={Layout.springify()}>
            <ReceiptView
              appointmentId={appointmentId}
              transactionId={transactionId}
              amount={parsedAmount}
              onDone={handleDone}
            />
          </Animated.View>
        ) : (
          <>
            <Animated.View entering={FadeInDown(0.3)} layout={Layout.springify()}>
              <Card style="card">
                <Text style="cardTitle">Booking Summary</Text>
                <View style="summaryRow">
                  <Text style="summaryLabel">Appointment ID</Text>
                  <Text style="summaryValue">{appointmentId}</Text>
                </View>
                <View style="summaryRow">
                  <Text style="summaryLabel">Amount</Text>
                  <Text style="summaryValue">${parsedAmount.toFixed(2)}</Text>
                </View>
              </Card>
            </Animated.View>

            <Animated.View entering={FadeInDown(0.5)} layout={Layout.springify()}>
              <PaymentMethodSelector
                selectedMethodId={selectedMethodId}
                onSelect={setSelectedMethodId}
                disabled={paymentState === 'processing'}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown(0.7)} layout={Layout.springify()}>
              {paymentState === 'processing' ? (
                <View style="processingContainer">
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style="processingText">Processing payment...</Text>
                </View>
              ) : (
                <>
                  {paymentState === 'failure' && (
                    <View style="failureContainer">
                      <Text style="failureText">Payment failed. Please try again.</Text>
                      <TouchableOpacity onPress={handleRetry} style="retryButton">
                        <Text style="retryButtonText">Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Button
                    title={`Pay $${parsedAmount.toFixed(2)}`}
                    onPress={handlePay}
                    disabled={!selectedMethodId || paymentState === 'processing'}
                    loading={paymentState === 'processing'}
                    style="payButton"
                  />
                </>
              )}
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  processingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  failureContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  failureText: {
    fontSize: 15,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  payButton: {
    marginTop: spacing.md,
  },
  textError: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
