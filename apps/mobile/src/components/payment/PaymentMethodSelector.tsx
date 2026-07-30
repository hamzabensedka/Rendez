import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Animated, {
  FadeInRight,
  Layout,
} from 'react-native-reanimated';
import { apiClient } from '@/lib/api-client';
import { colors, spacing, typography } from '@/theme';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  lastFour?: string;
  brand?: string;
  isDefault: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selectedMethodId,
  onSelect,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const {
    data: methods,
    isLoading,
    error,
    refetch,
  } = useQuery<PaymentMethod[]>({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/methods');
      return response.data;
    },
  });

  const sortedMethods = useMemo(() => {
    if (!methods) return [];
    return [...methods].sort((a, b) => (a.isDefault ? -1 : 1));
  }, [methods]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }

  if (error || !methods) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load payment methods.</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (methods.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No saved payment methods.</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      {sortedMethods.map((method, index) => (
        <Animated.View
          key={method.id}
          entering={FadeInRight(200).delay(index * 50)}
          layout={Layout.springify()}
        >
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethodId === method.id && styles.methodCardSelected,
              disabled && styles.methodCardDisabled,
            ]}
            onPress={() => onSelect(method.id)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedMethodId === method.id }}
            accessibilityLabel={`${method.brand || 'Card'} ending in ${method.lastFour || '****'}`}
          >
            <View style={styles.radioOuter}>
              {selectedMethodId === method.id && <View style={styles.radioInner} />}
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>
                {method.brand ? `${method.brand} ` : ''}•••• {method.lastFour || '****'}
              </Text>
              {method.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodCardDisabled: {
    opacity: 0.6,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  methodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  defaultBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  errorContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
  retryButton: {
    padding: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  addButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
