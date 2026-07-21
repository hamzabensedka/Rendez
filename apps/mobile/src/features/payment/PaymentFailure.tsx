import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, Shake } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

interface PaymentFailureProps {
  appointmentId: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function PaymentFailure({ appointmentId, onRetry, onCancel }: PaymentFailureProps) {
  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Card style={styles.card}>
        <Animated.View entering={ShakeIn} style={styles.iconContainer}>
          <Icon name="error-outline" size={64} color="#F44336" />
        </Animated.View>
        <Text variant="h2" style={styles.title}>Payment Failed</Text>
        <Text variant="body" style={styles.message}>
          We couldn't process your payment. Please check your card details and try again.
        </Text>
        <Text variant="caption" style={styles.appointmentRef}>
          Appointment: {appointmentId}
        </Text>
        <View style={styles.actions}>
          <Button variant="outline" onPress={onCancel}>Cancel</Button>
          <Button onPress={onRetry}>Try Again</Button>
        </View>
      </Card>
    </Animated.View>
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
    color: '#F44336',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  appointmentRef: {
    marginBottom: 24,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
});
