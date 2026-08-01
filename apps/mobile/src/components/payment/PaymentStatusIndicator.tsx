import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { PaymentStatus } from '@plan/plan-shared';

interface PaymentStatusIndicatorProps {
  status: PaymentStatus;
  message?: string;
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { color: string; icon: string; label: string }
> = {
  pending: { color: '#f59e0b', icon: '⏳', label: 'Pending' },
  processing: { color: '#3b82f6', icon: '🔄', label: 'Processing' },
  completed: { color: '#10b981', icon: '✅', label: 'Completed' },
  failed: { color: '#ef4444', icon: '❌', label: 'Failed' },
  refunded: { color: '#6b7280', icon: '↩️', label: 'Refunded' },
  cancelled: { color: '#6b7280', icon: '🚫', label: 'Cancelled' },
};

/**
 * Displays the current payment status with appropriate styling and animation.
 */
export function PaymentStatusIndicator({
  status,
  message,
}: PaymentStatusIndicatorProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        {status === 'processing' ? (
          <ActivityIndicator size="large" color={config.color} />
        ) : (
          <Text style={styles.icon}>{config.icon}</Text>
        )}
      </View>
      <Text style={[styles.statusLabel, { color: config.color }]}>
        {config.label}
      </Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  statusContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 36,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
