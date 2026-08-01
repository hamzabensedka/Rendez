import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaymentStatus } from '@/shared';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const STATUS_CONFIG: Record<PaymentStatus, { label: string; backgroundColor: string; textColor: string }> = {
  pending: {
    label: 'Pending',
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
  },
  processing: {
    label: 'Processing',
    backgroundColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  completed: {
    label: 'Paid',
    backgroundColor: '#D1FAE5',
    textColor: '#065F46',
  },
  failed: {
    label: 'Failed',
    backgroundColor: '#FEE2E2',
    textColor: '#991B1B',
  },
  refunded: {
    label: 'Refunded',
    backgroundColor: '#F3F4F6',
    textColor: '#374151',
  },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.textColor }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
