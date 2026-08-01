import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProcessPayment, usePaymentStatus, usePaymentReceipt } from '@/hooks/usePayment';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { PaymentStatusIndicator } from '@/components/payment/PaymentStatusIndicator';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import type { PaymentMethodType } from '@plan/plan-shared';

/**
 * Payment screen for processing payments for appointments.
 * Handles the complete payment flow: method selection, processing, status display, and receipt.
 */
export default function PaymentScreen() {
  const { appointmentId, amount, currency, businessName, serviceName, date } =
    useLocalSearchParams<{
      appointmentId: string;
      amount: string;
      currency: string;
      businessName: string;
      serviceName: string;
      date: string;
    }>();

  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('credit');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const processPayment = useProcessPayment();
  const { data: paymentStatus } = usePaymentStatus(paymentId ?? undefined);
  const { data: receipt } = usePaymentReceipt(
    paymentStatus?.status === 'completed' ? paymentId ?? undefined : undefined,
  );

  const handlePayment = useCallback(async () => {
    if (!appointmentId || !amount || !currency) {
      Alert.alert('Error', 'Missing payment details');
      return;
    }

    try {
      const response = await processPayment.mutateAsync({
        appointmentId: appointmentId as string,
        amount: parseFloat(amount as string),
        currency: currency as string,
        method: selectedMethod,
      });
      setPaymentId(response.id);
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }, [appointmentId, amount, currency, selectedMethod, processPayment]);

  const handleRetry = useCallback(() => {
    setPaymentId(null);
    processPayment.reset();
  }, [processPayment]);

  const handleViewReceipt = useCallback(() => {
    setShowReceipt(true);
  }, []);

  const handleDone = useCallback(() => {
    router.replace('/(app)/appointments');
  }, [router]);

  // Show receipt view
  if (showReceipt && receipt) {
    return (
      <SafeAreaView style={styles.container}>
        <PaymentReceipt receipt={receipt} />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show payment status after processing
  if (paymentId && paymentStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentStyle={styles.content}>
          <PaymentStatusIndicator
            status={paymentStatus.status}
            message={
              paymentStatus.status === 'processing'
                ? 'Please wait while we process your payment...'
                : paymentStatus.status === 'completed'
                  ? 'Your payment has been processed successfully!'
                  : paymentStatus.status === 'failed'
                    ? 'Payment could not be processed. Please try again.'
                    : undefined
            }
          />

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>
                {(currency as string)?.toUpperCase() ?? 'USD'}{' '}
                {parseFloat(amount as string).toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method</Text>
              <Text style={styles.detailValue}>{selectedMethod}</Text>
            </View>
            {paymentStatus.transactionId && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue}>
                  {paymentStatus.transactionId}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {paymentStatus.status === 'completed' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleViewReceipt}
            >
              <Text style={styles.primaryButtonText}>View Receipt</Text>
            </TouchableOpacity>
          )}
          {paymentStatus.status === 'failed' && (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRetry}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.back()}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Initial payment method selection
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>
            Complete your payment to confirm the appointment
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Business</Text>
            <Text style={styles.summaryValue}>{businessName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{serviceName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{date}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              {(currency as string)?.toUpperCase()}{' '}
              {parseFloat(amount as string).toFixed(2)}
            </Text>
          </View>
        </View>

        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            processPayment.isPending && styles.primaryButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={processPayment.isPending}
        >
          <Text style={styles.primaryButtonText}>
            {processPayment.isPending
              ? 'Processing...'
              : `Pay ${(currency as string)?.toUpperCase() || 'USD'} ${parseFloat(amount as string).toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6c63ff',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  secondaryButtonText: {
    color: '#6c63ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
