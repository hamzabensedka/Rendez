import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import type { PaymentReceipt as PaymentReceiptType } from '@plan/plan-shared';

interface PaymentReceiptProps {
  receipt: PaymentReceiptType;
}

/**
 * Displays a payment receipt with all relevant details.
 */
export function PaymentReceipt({ receipt }: PaymentReceiptProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✅</Text>
        <Text style={styles.headerTitle}>Payment Successful</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Receipt Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Receipt ID</Text>
          <Text style={styles.value}>{receipt.paymentId}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Business</Text>
          <Text style={styles.value}>{receipt.businessName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{receipt.serviceName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {format(new Date(receipt.date), 'PPP')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>{receipt.method}</Text>
        </View>

        {receipt.transactionId && (
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{receipt.transactionId}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>
            {receipt.currency.toUpperCase()} {receipt.amount.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Paid on {format(new Date(receipt.paidAt), 'PPpp')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#1a1a2e',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6c63ff',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 24,
  },
});
