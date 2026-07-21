import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextInput } from '@/components/ui/TextInput';
import { Spinner } from '@/components/ui/Spinner';
import { PaymentStatus } from '@planity/shared/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/utils/format';

interface PaymentStepProps {
  appointmentId: string;
  amount: number;
  onSuccess: (paymentId: string) => void;
  onBack: () => void;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
}

interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  receiptUrl: string;
}

const INITIAL_CARD: CardDetails = {
  number: '',
  expiry: '',
  cvc: '',
};

export function PaymentStep({ appointmentId, amount, onSuccess, onBack }: PaymentStepProps) {
  const [card, setCard] = useState<CardDetails>(INITIAL_CARD);
  const [errors, setErrors] = useState<Partial<CardDetails>>({});
  const queryClient = useQueryClient();

  const paymentMutation = useMutation<PaymentResponse, Error, { appointmentId: string; card: CardDetails }>({
    mutationFn: async ({ appointmentId, card }) => {
      const response = await api.post(`/appointments/${appointmentId}/pay`, {
        cardNumber: card.number.replace(/\s/g, ''),
        expiryMonth: card.expiry.split('/')[0],
        expiryYear: card.expiry.split('/')[1],
        cvc: card.cvc,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      onSuccess(data.id);
    },
    onError: (error) => {
      Alert.alert('Payment Failed', error.message || 'Please check your card details and try again.');
    },
  });

  const validateCard = useCallback((): boolean => {
    const newErrors: Partial<CardDetails> = {};

    if (!card.number || card.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Enter a valid card number';
    }
    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.expiry = 'Enter a valid expiry (MM/YY)';
    } else {
      const [month, year] = card.expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card is expired';
      }
    }
    if (!card.cvc || card.cvc.length < 3) {
      newErrors.cvc = 'Enter a valid CVC';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [card]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    paymentMutation.mutate({ appointmentId, card });
  }, [validate, paymentMutation, appointmentId, card]);

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutUp} style={styles.container}>
      <Card style={styles.card}>
        <Text variant="h2" style={styles.title}>Payment Details</Text>
        <Text variant="body" style={styles.amount}>
          Total: {formatCurrency(amount)}
        </Text>

        <View style={styles.field}>
          <Text variant="label" style={styles.label}>Card Number</Text>
          <TextInput
            value={card.number}
            onChangeText={(t) => setCard((c) => ({ ...c, number: formatCardNumber(t) }))}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
            error={errors.number}
            testID="card-number-input"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text variant="label" style={styles.label}>Expiry</Text>
            <TextInput
              value={card.expiry}
              onChangeText={(t) => setCard((c) => ({ ...c, expiry: formatExpiry(t) }))}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              error={errors.expiry}
              status="expiry-input"
            />
          </View>
          <View style={styles.halfField}>
            <Text variant="label" style={styles.label}>CVC</Text>
            <TextInput
              value={card.cvc}
              onChangeText={(t) => setCard((c) => ({ ...c, cvc: t.replace(/\D/g, '').slice(0, 4) }))}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              error={errors.cvc}
              status="cvc-input"
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button variant="outline" onPress={onBack} disabled={paymentMutation.isPending}>
            Back
          </Button>
          <Button onPress={handleSubmit} disabled={paymentMutation.isPending}>
            {paymentMutation.isPending ? <Spinner size="small" color="white" /> : `Pay ${formatCurrency(amount)}`}
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  amount: {
    marginBottom: 24,
    fontWeight: '600',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfField: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
