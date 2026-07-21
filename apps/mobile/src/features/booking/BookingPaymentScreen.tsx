import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/components/ui/Text';
import { Spinner } from '@/components/ui/Spinner';
import { PaymentStep } from '@/features/payment/PaymentStep';
import { PaymentSuccess } from '@/features/payment/PaymentSuccess';
import { PaymentFailure } from '@/features/payment/PaymentFailure';
import { api } from '@/lib/api';
import { Appointment } from '@planity/shared/types';

type ScreenState = 'confirm' | 'payment' | 'success' | 'failure';

export default function BookingPaymentScreen() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('confirm');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const { data: appointment, isLoading, error } = useQuery<Appointment>({
    queryKey: ['appointment', appointmentId],
    queryFn: () => api.get(`/appointments/${appointmentId}`).then((r) => r.data),
    enabled: !!appointmentId,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="large" />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={styles.centered}>
        <Text variant="body">Unable to load appointment details.</Text>
      </View>
    );
  }

  const amount = appointment.service?.price ?? 0;

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id);
    setScreenState('success');
  };

  const handlePaymentFailure = () => {
    setScreenState('failure');
  };

  const handleDone = () => {
    router.replace({
      pathname: '/appointments/[id]',
      params: { id: appointmentId },
    });
  };

  return (
    <View style={styles.container}>
      {screenState === 'confirm' && (
        <ConfirmPayment
          appointment={appointment}
          amount={amount}
          onProceed={() => setScreenState('payment')}
          onCancel={() => router.back()}
        />
      )}
      {screenState === 'payment' && (
        <PaymentStep
          appointmentId={appointmentId}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onBack={() => setScreenState('confirm')}
        />
      )}
      {screenState === 'success' && (
        <PaymentSuccess
          appointmentId={appointmentId}
          paymentId={paymentId!}
          amount={amount}
          onDone={handleDone}
        />
      )}
      {screenState === 'failure' && (
        <PaymentFailure
          appointmentId={appointmentId}
          onRetry={() => setScreenState('payment')}
          onCancel={() => router.back()}
        />
      )}
    </View>
  );
}

interface ConfirmProps {
  appointment: Appointment;
  amount: number;
  onProceed: () => void;
  onCancel: () => void;
}

function ConfirmPayment({ appointment, amount, onProceed, onCancel }: ConfirmProps) {
  return (
    <View style={styles.confirmContainer}>
      <Text variant="h2">Confirm Payment</Text>
      <Card style={styles.summaryCard}>
        <Text variant="body">Service: {appointment.service?.name}</Text>
        <Text variant="body">Date: {new Date(appointment.startTime).toLocaleString()}</Text>
        <Text variant="body">Amount: {formatCurrency(amount)}</Text>
      </Card>
      <View style={styles.actions}>
        <Button variant="outline" onPress={onCancel}>Cancel</Button>
        <Button onPress={onProceed}>Proceed to Payment</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmContainer: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginVertical: 20,
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});
