import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { PaymentStatus, PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
}

interface PaymentResponse {
  payment: {
    id: string;
    status: PaymentStatus;
    receiptUrl?: string;
    amount: number;
    currency: string;
    createdAt: string;
  };
  appointment: {
    id: string;
    status: string;
  };
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: keyof typeof Icons }[] = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'creditCard' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'apple' },
  { id: 'google_pay', label: 'Google Pay', icon: 'google' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    appointmentId?: string;
    businessName?: string;
    serviceName?: string;
    amount?: string;
    currency?: string;
    date?: string;
    time?: string;
  }>();

  const appointmentId = params.appointmentId || '';
  const businessName = params.businessName || 'Business';
  const serviceName = params.serviceName || 'Service';
  const amount = parseFloat(params.amount || '0');
  const currency = params.currency || 'EUR';
  const date = params.date || '';
  const time = params.time || '';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);

  const createPaymentIntentMutation = useMutation<PaymentIntent, Error, void>({
    mutationFn: async () => {
      const { data } = await apiClient.post<PaymentIntent>(
        '/payments/create-intent',
        {
          appointmentId,
          amount,
          currency,
          paymentMethod: selectedMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
  });

  const confirmPaymentMutation = useMutation<PaymentResponse, Error, { paymentIntentId: string }>({
    mutationFn: async ({ paymentIntentId }) => {
      const { data } = await apiClient.post<PaymentResponse>(
        '/payments/confirm',
        {
          paymentIntentId,
          appointmentId,
          paymentMethod: selectedMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      setPaymentStatus(data.payment.status);
      if (data.payment.receiptUrl) {
        setReceiptUrl(data.payment.receiptUrl);
      }
    },
    onError: (error: Error) => {
      setPaymentStatus('failed');
      setPaymentError(error.message || 'Payment failed. Please try again.');
    },
  });

  const handlePay = useCallback(async () => {
    if (!appointmentId) {
      Alert.alert('Error', 'No appointment found. Please go back and try again.');
      return;
    }

    if (amount <= 0) {
      Alert.alert('Error', 'Invalid payment amount.');
      return;
    }

    setPaymentStatus('processing');
    setPaymentError(null);

    try {
      const intent = await createPaymentIntentMutation.mutateAsync();

      if (intent.status === 'requires_action' || intent.status === 'requires_payment_method') {
        setPaymentStatus('requires_action');
        // In a real app, handle 3DS or additional auth here
        // For now, simulate confirmation
        await confirmPaymentMutation.mutateAsync({ paymentIntentId: intent.id });
      } else if (intent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        setReceiptUrl(null);
      } else {
        await confirmPaymentMutation.mutateAsync({ paymentIntentId: intent.id });
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      setPaymentError(error?.message || 'An unexpected error occurred.');
    }
  }, [
    appointmentId,
    amount,
    createPaymentIntentMutation,
    confirmPaymentMutation,
  ]);

  const handleViewReceipt = useCallback(() => {
    if (receiptUrl) {
      router.push(`/booking/receipt?url=${encodeURIComponent(receiptUrl)}&appointmentId=${appointmentId}`);
    }
  }, [receiptUrl, appointmentId, router]);

  const handleGoToAppointments = useCallback(() => {
    router.replace('/(app)/appointments');
  }, [router]);

  const handleRetry = useCallback(() => {
    setPaymentStatus('pending');
    setPaymentError(null);
  }, []);

  const isProcessing =
    paymentStatus === 'processing' ||
    createPaymentIntentMutation.isPending ||
    confirmPaymentMutation.isPending;

  const isSuccess = paymentStatus === 'succeeded';
  const isFailed = paymentStatus === 'failed';

  if (isSuccess) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={styles.successContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.iconWrapper}>
            <View style={styles.successIcon}>
              <Icons.checkCircle size={64} color="#22c55e" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()}>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>
              Your appointment at {businessName} has been confirmed.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(500).springify()} style={styles.receiptCard}>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent style={styles.summaryContent}>
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
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>{time}</Text>
                </View>
                <Separator style={styles.summarySeparator} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                  <Text style={styles.summaryValueBold}>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency,
                    }).format(amount)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Status</Text>
                  <Badge variant="success">
                    <Text style={styles.badgeText}>Confirmed</Text>
                  </Badge>
                </View>
              </CardContent>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(500).springify()} style={styles.actions}>
            {receiptUrl && (
              <Button variant="outline" onPress={handleViewReceipt} style={styles.actionButton}>
                <Icons.receipt size={18} color="#0f172a" />
                <Text style={styles.buttonText}>View Receipt</Text>
              </Button>
            )}
            <Button onPress={handleGoToAppointments} style={styles.actionButton}>
              <Icons.calendar size={18} color="#ffffff" />
              <Text style={[styles.buttonText, styles.primaryButtonText]}>My Appointments</Text>
            </Button>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icons.chevronLeft size={24} color="#0f172a" />
          </Pressable>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Order Summary Card */}
        <Card style={styles.orderCard}>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{serviceName} at {businessName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {date} at {time}
              </Text>
            </View>
            <Separator style={styles.summarySeparator} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency,
                }).format(amount)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(val) => setSelectedMethod(val as PaymentMethod)}
            style={styles.radioGroup}
          >
            {PAYMENT_METHODS.map((method) => {
              const IconComponent = Icons[method.icon];
              return (
                <View key={method.id} style={styles.radioItem}>
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} style={styles.radioLabel}>
                    <View style={styles.radioLabelContent}>
                      {IconComponent && <IconComponent size={20} color="#64748b" />}
                      <Text style={styles.radioLabelText}>{method.label}</Text>
                    </View>
                  </Label>
                </View>
              );
            })}
          </RadioGroup>
        </View>

        {/* Error State */}
        {isFailed && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
            <View style={styles.errorContent}>
              <Icons.alertTriangle size={20} color="#ef4444" />
              <Text style={styles.errorText}>{paymentError || 'Payment failed'}</Text>
            </View>
            <Button variant="outline" onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Button>
          </Animated.View>
        )}

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.processingText}>
              {paymentStatus === 'requires_action'
                ? 'Verifying payment...'
                : 'Processing payment...'}
            </Text>
            <Text style={styles.processingSubtext}>
              Please do not close this screen.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Pay Button */}
      {!isProcessing && !isFailed && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.footerContent}>
            <View style={styles.footerAmount}>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.footerValue}>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency,
                }).format(amount)}
              </Text>
            </View>
            <Button
              onPress={handlePay}
              disabled={isProcessing || amount <= 0}
              style={styles.payButton}
            >
              <Icons.lock size={16} color="#ffffff" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSpacer: {
    width: 40,
  },
  orderCard: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  radioGroup: {
    gap: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  radioLabel: {
    flex: 1,
    cursor: 'pointer',
  },
  radioLabelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioLabelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },
  summarySeparator: {
    marginVertical: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderColor: '#dc2626',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  processingSubtext: {
    fontSize: 13,
    color: '#94a3b8',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerAmount: {
    gap: 2,
  },
  footerLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  footerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#6366f1',
    borderRadius: 12,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  successContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  receiptCard: {
    width: '100%',
    marginBottom: 24,
  },
  summaryContent: {
    gap: 4,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});
