import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { PaymentStep } from './PaymentStep';
import { ReceiptScreen } from './ReceiptScreen';

interface PaymentFlowProps {
  bookingId: string;
  amount: number;
  currency: string;
  onComplete: () => void;
  onDismiss: () => void;
}

type FlowStep = 'payment' | 'receipt';

export function PaymentFlow({ bookingId, amount, currency, onComplete, onDismiss }: PaymentFlowProps) {
  const [step, setStep] = useState<FlowStep>('payment');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId);
    setStep('receipt');
  };

  const handleReceiptDone = () => {
    onComplete?.();
  };

  return (
    <View style={styles.container}>
      {step === 'payment' && (
        <Animated.View key="payment" entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
          <PaymentStep
            bookingId={bookingId}
            amount={amount}
            currency={currency}
            onSuccess={handlePaymentSuccess}
            onBack={onDismiss}
          />
        </Animated.View>
      )}

      {step === 'receipt' && transactionId && (
        <Animated.View key="receipt" entering={FadeIn} exiting={FadeOut} style={styles.stepContainer}>
          <ReceiptScreen
            transactionId={transactionId}
            onDone={handleReceiptDone}
            onRetry={() => setStep('payment')}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
});
