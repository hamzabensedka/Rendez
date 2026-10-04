import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface BookingFooterProps {
  totalPriceCents: number;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled: boolean;
  loading: boolean;
  bottomOffset?: number;
}

export function BookingFooter({
  totalPriceCents,
  confirmLabel = 'Continue',
  onConfirm,
  disabled,
  loading,
  bottomOffset = 0,
}: BookingFooterProps) {
  return (
    <View style={[styles.bottomBar, { bottom: bottomOffset }]}>
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{(totalPriceCents / 100).toFixed(0)}€</Text>
      </View>
      <TouchableOpacity
        style={[styles.confirmButton, (disabled || loading) && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={disabled || loading}
        accessibilityLabel={confirmLabel}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color={T.colors.bookedText} />
        ) : (
          <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: T.colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.colors.rule,
  },
  totalBlock: { flexDirection: 'column' },
  totalLabel: {
    fontFamily: T.font.label,
    fontSize: 11,
    letterSpacing: 1.4,
    color: T.colors.muted,
    marginBottom: 2,
  },
  totalValue: {
    fontFamily: T.font.display,
    fontSize: 20,
    color: T.colors.ink,
  },
  confirmButton: {
    minWidth: 140,
    height: 52,
    borderRadius: T.radius.card,
    backgroundColor: T.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmButtonText: {
    fontFamily: T.font.medium,
    fontSize: 15,
    color: T.colors.bookedText,
  },
});
