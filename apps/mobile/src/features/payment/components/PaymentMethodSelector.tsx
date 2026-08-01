import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { PaymentMethod } from '@/shared';

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  icon: string;
}

const METHODS: PaymentMethodOption[] = [
  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'wallet', label: 'Digital Wallet', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <View style={styles.container}>
      {METHODS.map((method) => {
        const isSelected = selected === method.value;
        return (
          <TouchableOpacity
            key={method.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onSelect(method.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled }}
            accessibilityLabel={`Pay with ${method.label}`}
          >
            <Text style={styles.icon}>{method.icon}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {method.label}
            </Text>
            {isSelected && <View style={styles.checkmark} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  labelSelected: {
    color: '#1D4ED8',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
