import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { Typography } from '@shared/ui/Typography';
import { Spacer } from '@shared/ui/Spacer';
import { useTheme } from '@shared/ui/themeProvider';
import { PaymentStatus } from '@shared/types/payment';
import { apiPayment } from '../../lib/api-client';

interface ReceiptData {
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string;
  businessName: string;
  serviceName: string;
}

export default function ReceiptScreen() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const router = useRouter();
  const { colors, spacing } = useTheme();

  const { data: receipt, isLoading, error } = useQuery<ReceiptData>({
    queryKey: ['receipt', transactionId],
    queryFn: async () => {
      const response = await apiClient.get(`/payments/receipt/${transactionId}`);
      return response.data;
    },
    enabled: !!transactionId,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Typography variant="body">Loading receipt...</Typography>
      </View>
    );
  }

  if (error || !receipt) {
    return (
      <View style={styles.centered}>
        <Typography variant="body" color={colors.error}>
          Failed to load receipt.
        </Typography>
        <Spacer height={spacing.md} />
        <Button title="Go to Appointments" onPress={() => router.replace('/appointments')} />
      </View>
    );
  }

  const isSuccess = receipt.status === 'succeeded';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Card padding={spacing.lg}>
          <Typography variant="h4" style={{ textAlign: 'center', marginBottom: spacing.md }}>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </Typography>

          <View style={[styles.statusBadge, { backgroundColor: isSuccess ? colors.successLight : colors.errorLight }]}>
            <Typography
              variant="body"
              color={isSuccess ? colors.success : colors.error}
              style={{ fontWeight: '600' }}
            >
              {isSuccess ? '✓ Paid' : '✗ Failed'}
            </Typography>
          </View>

          <Spacer height={spacing.lg} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Transaction ID</Typography>
            <Typography variant="body">{receipt.transactionId}</Typography>
          </View>

          <Spacer height={spacing.sm} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Booking ID</Typography>
            <Typography variant="body">{receipt.bookingId}</Typography>
          </View>

          <Spacer height={spacing.sm} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Business</Typography>
            <Typography variant="body">{receipt.businessName}</Typography>
          </View>

          <Spacer height={spacing.sm} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Service</Typography>
            <Typography variant="body">{receipt.serviceName}</Typography>
          </View>

          <Spacer height={spacing.sm} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Date</Typography>
            <Typography variant="body">{new Date(receipt.date).toLocaleDateString()}</Typography>
          </View>

          <Spacer height={spacing.sm} />

          <View style={styles.row}>
            <Typography variant="body2" color={colors.textSecondary}>Amount</Typography>
            <Typography variant="h3" style={{ color: colors.primary }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: receipt.currency }).format(receipt.amount)}
            </Typography>
          </View>

          <Spacer height={spacing.xl} />

          <Button
            title="View My Appointments"
            onPress={() => router.replace('/appointments')}
            fullWidth
          />
          <Spacer height={spacing.sm} />
          <Button
            title="Back to Home"
            variant="outlined"
            onPress={() => router.replace('/')}
            fullWidth
          />
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
});
