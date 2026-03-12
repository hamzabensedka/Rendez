import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { DEFAULT_SALON_IMAGES } from '../../search/constants';
import type { BookingCartItem } from '../types';

interface BookingServiceListProps {
  items: BookingCartItem[];
  onRemove: (index: number) => void;
  onAddAnother: () => void;
  addAnotherLabel?: string;
}

export function BookingServiceList({
  items,
  onRemove,
  onAddAnother,
  addAnotherLabel = 'ADD ANOTHER SERVICE',
}: BookingServiceListProps) {
  if (items.length === 0) return null;
  return (
    <View style={styles.serviceSection}>
      {items.map((item, index) => (
        <View
          key={`${item.serviceVariantId}-${index}`}
          style={[styles.serviceCard, index > 0 && styles.serviceCardNotFirst]}
        >
          <View style={styles.serviceCardContent}>
            <View style={styles.serviceCardLeft}>
              <Text style={styles.serviceCardName}>{item.name}</Text>
              <View style={styles.serviceCardMeta}>
                <Text style={styles.serviceCardMetaText}>{item.durationMin} min</Text>
                <Text style={styles.serviceCardDot}> • </Text>
                <Text style={styles.serviceCardPrice}>
                  {item.priceCents != null
                    ? `${(item.priceCents / 100).toFixed(0)}€`
                    : '—'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
                accessibilityLabel={`Remove ${item.name}`}
                accessibilityRole="button"
              >
                <Ionicons name="close" size={16} color={colors.light.textSecondary} />
                <Text style={styles.removeButtonText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.serviceCardImageWrap}>
              <Image
                source={{ uri: DEFAULT_SALON_IMAGES[index % DEFAULT_SALON_IMAGES.length] }}
                style={styles.serviceCardImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addServiceButton}
        onPress={onAddAnother}
        accessibilityLabel={addAnotherLabel}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color={colors.light.textSecondary} />
        <Text style={styles.addServiceButtonText}>{addAnotherLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceSection: { padding: spacing.lg },
  serviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    overflow: 'hidden',
    padding: spacing.md,
  },
  serviceCardNotFirst: { marginTop: spacing.md },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  serviceCardLeft: { flex: 1 },
  serviceCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  serviceCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceCardMetaText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  serviceCardDot: { fontSize: 14, color: colors.light.textTertiary },
  serviceCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xl,
  },
  removeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },
  serviceCardImageWrap: {
    width: 96,
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceSecondary,
    marginLeft: spacing.md,
  },
  serviceCardImage: { width: '100%', height: '100%' },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignSelf: 'center',
  },
  addServiceButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
});
