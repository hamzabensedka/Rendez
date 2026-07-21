import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentStatus } from '@planity/shared/types';
import { formatCurrency } from '@/utils/format';

interface PaymentSuccessProps {
  appointmentId: string;
  paymentId: string;
  amount: number;
  onDone: () => void;
}

export function PaymentSuccess({ appointmentId, paymentId, amount, onDone }: PaymentSuccessProps) {
  return (
    <Animated.View entering={ZoomIn.delay(200)} style={styles.container}>
      <Card style={styles.card}>
        <Animated.View entering={ZoomIn} style={styles.iconContainer}>
          <Icon name="check-circle" size={64} color="#4CAF50" />
        </Animated.View>
        <Text variant="h2" style={styles.title}>Payment Successful!</Text>
        <Text variant="body" style={styles.amount}>{formatCurrency(amount)}</Text>

        <View style={styles.details}>
          <DetailRow label="Payment ID" value={paymentId} />
          <DetailRow label="Appointment ID" value={appointmentId} />
          <DetailRow label="Status" value={PaymentStatus.COMPLETED} />
        </View>

        <Button onPress={onDone} style={styles.button}>
          View Appointment
        </Button>
      </Card>
    </Animated.View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="caption" style={styles.label}>{label}</Text>
      <Text variant="body" style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    color: '#4CAF50',
  },
  body: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  details: {
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  button: {
    width: '100%',
  },
});
