import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/format';
import { useRouter } from 'expo-router';

interface PaymentReceiptProps {
  appointmentId: string;
  transactionId: string;
  amount: number;
  businessName: string;
  serviceName: string;
  method: string;
  onDone?: () => void;
}

export function PaymentReceipt({
  appointmentId,
  transactionId,
  amount,
  businessName,
  serviceName,
  method,
  onDone,
}: PaymentReceiptProps) {
  const router = useRouter();

  const handleDone = () => {
    onDone?.();
    router.replace('/(tabs)/appointments');
  };

  const methodLabels: Record<string, string> = {
    card: 'Credit/Debit Card',
    wallet: 'Digital Wallet',
    bank_transfer: 'Bank Transfer',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={ZoomIn.delay(200).duration(500)} style={styles.successIcon}>
          <Text style={styles.checkmark}>✅</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.header}>
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your appointment has been confirmed
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(400)}>
          <Card style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Receipt</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value} selectable>
                {transactionId}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Appointment ID</Text>
              <Text style={styles.value} selectable>
                {appointmentId}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Business</Text>
              <Text style={styles.value}>{businessName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Service</Text>
              <Text style={styles.value}>{serviceName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{methodLabels[method] || method}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Amount Paid</Text>
              <Text style={styles.totalValue}>{formatCurrency(amount)}</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.buttonContainer}>
          <Button
            onPress={handleDone}
            title="View My Appointments"
            size="large"
            fullWidth
            accessibilityLabel="Go to my appointments"
          />
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
    alignItems: 'center',
  },
  successIcon: {
    marginTop: 40,
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#059669',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  receiptCard: {
    width: '100%',
    padding: 20,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
  },
});
