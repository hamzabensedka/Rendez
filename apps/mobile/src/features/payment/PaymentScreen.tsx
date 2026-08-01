import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import { usePayment } from '../../hooks/usePayment';
import { PaymentStatus, PaymentMethod } from '@planity/shared';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { PaymentReceipt } from './components/PaymentReceipt';
import { PaymentStatusBadge } from './components/PaymentStatusBadge';
import { formatCurrency } from '../../utils/format';

export default function PaymentScreen() {
  const { appointmentId, amount, businessName, serviceName } = useLocalSearchParams<{
    appointmentId: string;
    amount: string;
    businessName: string;
    serviceName: string;
  }>();

  const queryClient = useQueryClient();
  const { processPayment, isLoading, error } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const numericAmount = parseFloat(amount || '0');

  const paymentMutation = useMutation({
    mutationFn: () =>
      processPayment({
        appointmentId: appointmentId!,
        amount: numericAmount,
        method: selectedMethod,
      }),
    onSuccess: (data) => {
      setPaymentStatus(data.status);
      setTransactionId(data.transactionId);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
    },
    onError: (err: Error) => {
      setPaymentStatus('failed');
      Alert.alert('Payment Failed', err.message || 'An unexpected error occurred. Please try again.');
    },
  });

  const handlePay = () => {
    if (!appointmentId || numericAmount <= 0) {
      Alert.alert('Invalid Payment', 'Missing appointment details or invalid amount.');
      return;
    }
    paymentMutation.mutate();
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setTransactionId(null);
    paymentMutation.reset();
  };

  const isLoading = paymentMutation.isPending;

  if (paymentStatus === 'completed' && transactionId) {
    return (
      <PaymentReceipt
        appointmentId={appointmentId!}
        transactionId={transactionId}
        amount={numericAmount}
        businessName={businessName || 'Business'}
        serviceName={serviceName || 'Service'}
        method={selectedMethod}
        onDone={() => {
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>
            Complete your payment to confirm the appointment
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} layout={Layout}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Business</Text>
              <Text style={styles.summaryValue}>{businessName || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{serviceName || '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(numericAmount)}</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          layout={Layout}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <PaymentMethodSelector
            selected={selectedMethod}
            onSelect={setSelectedMethod}
            disabled={isLoading}
          />
        </Animated.View>

        {paymentStatus === 'failed' && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
            <PaymentStatusBadge status="failed" />
            <Text style={styles.errorText}>
              {error?.message || 'Payment could not be processed. Please try again.'}
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.buttonContainer}>
          <Button
            onPress={handlePay}
            disabled={isLoading || numericAmount <= 0}
            loading={isLoading}
            title={`Pay ${formatCurrency(numericAmount)}`}
            accessibilityLabel={`Pay ${formatCurrency(numericAmount)} for ${serviceName || 'service'}`}
          />
          {paymentStatus === 'failed' && (
            <Button
              onPress={handleRetry}
              variant="outline"
              title="Try Again"
              style={styles.retryButton}
              accessibilityLabel="Retry payment"
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.secureNotice}>
          <Text style={styles.secureIcon}>🔒</Text>
          <Text style={styles.secureText}>
            Your payment information is encrypted and secure
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#DC2626',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  retryButton: {
    marginTop: 12,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secureIcon: {
    fontSize: 16,
  },
  secureText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
