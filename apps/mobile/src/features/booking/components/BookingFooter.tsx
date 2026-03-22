import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing } from '@planity/ui';

interface BookingFooterProps {
  totalPriceCents: number;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled: boolean;
  loading: boolean;
  /** Offset from bottom (e.g. for global bottom nav + safe area). The bar is positioned at this value. */
  bottomOffset?: number;
}

export function BookingFooter({
  totalPriceCents,
  confirmLabel = 'CONFIRM DATE',
  onConfirm,
  disabled,
  loading,
  bottomOffset = 0,
}: BookingFooterProps) {
  return (
    <View style={[styles.bottomBar, { bottom: bottomOffset }]}>
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>TOTAL PRICE</Text>
        <Text style={styles.totalValue}>
          {(totalPriceCents / 100).toFixed(2).replace('.', ',')} €
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.confirmButton, (disabled || loading) && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={disabled || loading}
        accessibilityLabel={confirmLabel}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  totalBlock: { flexDirection: 'column' },
  totalLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
  },
  confirmButton: {
    minWidth: 180,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
});
