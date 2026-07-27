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
import { useMutation, useQuery } from '@tanstack/react-query';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { PaymentStatus } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { colors, typography, spacing, radius } from '@/theme';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret: string | null;
}

interface BookingDetails {
  id: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  status: string;
  paymentStatus: PaymentStatus;
}

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

export default function PaymentScreen() {
  const { id: bookingId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receipt, setReceipt] = useState<{
    transactionId: string;
    amount: number;
    date: string;
  } | null>(null);

  const { data: booking, isLoading: isLoadingBooking } = useQuery<BookingDetails>({
    queryKey: ['booking', bookingId],
    queryFn: () => apiClient.get(`/api/bookings/${bookingId}`).then((r) => r.data),
    enabled: !!bookingId,
  });

  const { data: paymentIntent, isLoading: isLoadingIntent } = useQuery<PaymentSummary>({
    queryKey: ['payment-intent', bookingId],
    queryFn: () =>
      apiClient.post(`/api/payments/create-intent`, { bookingId }).then((r) => r.data),
    enabled: !!bookingId,
  });

  const processPayment = useCallback(async () => {
    if (!cardNumber || !expiry || !cvc || !cardholderName) {
      setPaymentError('Veuillez remplir tous les champs de la carte.');
      return;
    }

    if (!paymentIntent?.id) {
      setPaymentError('Session de paiement invalide. Veuillez réessayer.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await apiClient.post('/api/payments/confirm', {
        paymentIntentId: paymentIntent.id,
        bookingId,
        paymentMethod: {
          card: {
            number: cardNumber.replace(/\s/g, ''),
            expMonth: parseInt(expiry.split('/')[0], 10),
            expYear: parseInt(`20${expiry.split('/')[1]}`, 10),
            cvc,
          },
          billingDetails: {
            name: cardholderName,
          },
        },
      });

      const result = response.data;

      if (result.status === PaymentStatus.SUCCEEDED) {
        setPaymentSuccess(true);
        setReceipt({
          transactionId: result.transactionId,
          amount: paymentIntent.amount,
          date: new Date().toISOString(),
        });
      } else if (result.status === PaymentStatus.REQUIRES_ACTION) {
        Alert.alert(
          'Authentification requise',
          'Votre banque nécessite une authentification supplémentaire.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace(`/booking/${bookingId}/payment/3ds?clientSecret=${result.clientSecret}`);
              },
            },
          ]
        );
      } else {
        setPaymentError(
          result.errorMessage || 'Le paiement a échoué. Veuillez vérifier vos informations.'
        );
      }
    } catch (error: any) {
      setPaymentError(
        error?.response?.data?.message ||
          'Une erreur est survenue lors du paiement. Veuillez réessayer.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cardNumber, expiry, cvc, cardholderName, paymentIntent, bookingId, router]);

  const isLoading = isLoadingBooking || isLoadingIntent;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Préparation du paiement...</Text>
      </View>
    );
  }

  if (paymentSuccess && receipt) {
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
        <ScrollView contentContainerStyle={styles.receiptContainer}>
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Paiement réussi !</Text>
            <Text style={styles.successSubtitle}>
              Votre rendez-vous est confirmé.
            </Text>
          </Animated.View>

          <Card style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Reçu de paiement</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction</Text>
              <Text style={styles.receiptValue}>{receipt.transactionId}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Montant</Text>
              <Text style={styles.receiptValue}>
                {formatCurrency(receipt.amount)}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptValue}>
                {new Date(receipt.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            {booking && (
              <>
                <View style={styles.divider} />
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Service</Text>
                  <Text style={styles.receiptValue}>{booking.serviceName}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Établissement</Text>
                  <Text style={styles.receiptValue}>{booking.businessName}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Rendez-vous</Text>
                  <Text style={styles.receiptValue}>
                    {booking.date} à {booking.time}
                  </Text>
                </View>
              </>
            )}
          </Card>

          <View style={styles.receiptActions}>
            <Button
              title="Voir mes rendez-vous"
              onPress={() => router.replace('/appointments')}
              variant="primary"
            />
            <Button
              title="Retour à l'accueil"
              onPress={() => router.replace('/')}
              variant="outline"
              style={styles.secondaryButton}
            />
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Booking Summary */}
        {booking && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{booking.serviceName}</Text>
              <Text style={styles.summaryPrice}>
                {formatCurrency(booking.price * 100)}
              </Text>
            </View>
            <Text style={styles.summaryBusiness}>{booking.businessName}</Text>
            <Text style={styles.summaryDate}>
              {booking.date} à {booking.time}
            </Text>
          </Card>
        )}

        {/* Payment Form */}
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Paiement sécurisé</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro de carte</Text>
            <Input
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
              editable={!isProcessing}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>Date d'expiration</Text>
              <Input
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                placeholder="MM/AA"
                keyboardType="number-pad"
                maxLength={5}
                editable={!isProcessing}
                style={styles.input}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>CVC</Text>
              <Input
                value={cvc}
                onChangeText={(text) => setCvc(text.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                editable={!isProcessing}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Titulaire de la carte</Text>
            <Input
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="Nom complet"
              autoCapitalize="words"
              editable={!isProcessing}
              style={styles.input}
            />
          </View>

          {paymentError && (
            <Animated.View entering={FadeInDown} style={styles.errorContainer}>
              <Text style={styles.errorText}>{paymentError}</Text>
            </Animated.View>
          )}

          <View style={styles.paymentActions}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              disabled={isProcessing}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
            <Button
              title={isProcessing ? 'Paiement en cours...' : `Payer ${paymentIntent ? formatCurrency(paymentIntent.amount) : ''}`}
              onPress={processPayment}
              disabled={isProcessing}
              loading={isProcessing}
              variant="primary"
              style={styles.payButton}
            />
          </View>

          <View style={styles.secureBadge}>
            <Text style={styles.secureIcon}>🔒</Text>
            <Text style={styles.secureText}>
              Paiement sécurisé par cryptage SSL
            </Text>
          </View>
        </Card>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  summaryBusiness: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentCard: {
    padding: spacing.lg,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  payButton: {
    flex: 1,
  },
  secureBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  secureIcon: {
    fontSize: 14,
  },
  secureText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  // Receipt styles
  receiptContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  successIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  receiptCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  receiptLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  receiptActions: {
    gap: spacing.md,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
