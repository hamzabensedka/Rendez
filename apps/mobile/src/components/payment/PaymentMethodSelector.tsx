import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import type { PaymentMethodType } from '@plan/plan-shared';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  style?: ViewStyle;
}

const PAYMENT_METHODS: {
  type: PaymentMethodType;
  label: string;
  icon: string;
}[] = [
  { type: 'credit', label: 'Credit Card', icon: '💳' },
  { type: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
  { type: 'google_pay', label: 'Google Pay', icon: '🤖' },
  { type: 'paypal', label: 'PayPal', icon: '🅿️' },
];

/**
 * Payment method selector component.
 * Displays available payment methods and allows selection.
 */
export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  style,
}: PaymentMethodSelectorProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Payment Method</Text>
      <View style={styles.methodsContainer}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.type;
          return (
            <TouchableOpacity
              key={method.type}
              style={[
                styles.methodItem,
                isSelected && styles.methodItemSelected,
              ]}
              onPress={() => onSelect(method.type)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Pay with ${method.label}`}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text
                style={[
                  styles.methodLabel,
                  isSelected && styles.methodLabelSelected,
                ]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    minWidth: '45%',
  },
  methodItemSelected: {
    borderColor: '#6c63ff',
    backgroundColor: '#f0efff',
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  methodLabelSelected: {
    color: '#6c63ff',
    fontWeight: '600',
  },
});
