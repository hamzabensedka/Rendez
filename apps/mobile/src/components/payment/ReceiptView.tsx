import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing } from '@/theme';

interface ReceiptViewProps {
  appointmentId: string;
  transactionId: string;
  amount: number;
  onDone: () => void;
}

export function ReceiptView({
  appointmentId,
  transactionId,
  amount,
  onDone,
}: ReceiptViewProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown(400)} layout={Layout.springify()}>
        <Card style={styles.successCard}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.success}
            style={styles.icon}
          />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>Your booking is confirmed.</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp(600)} layout={Layout.springify()}>
        <Card style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Receipt</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Appointment ID</Text>
            <Text style={styles.value}>{appointmentId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{transactionId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>${amount.toFixed(2)}</Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp(800)} layout={Layout.springify()}>
        <Button
          title="View Appointment"
          onPress={onDone}
          style={styles.doneButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  successCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  receiptCard: {
    padding: spacing.lg,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.success,
  },
  doneButton: {
    marginTop: spacing.md,
  },
});
