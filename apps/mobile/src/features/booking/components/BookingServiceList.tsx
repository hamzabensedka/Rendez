import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';
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
  addAnotherLabel = 'Add another',
}: BookingServiceListProps) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Services</Text>
      {items.map((item, index) => (
        <View key={`${item.serviceVariantId}-${index}`} style={styles.row}>
          <View style={styles.body}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.durationMin} min</Text>
          </View>
          <Text style={styles.price}>
            {item.priceCents != null ? `${(item.priceCents / 100).toFixed(0)}€` : '—'}
          </Text>
          <Pressable
            onPress={() => onRemove(index)}
            accessibilityLabel={`Remove ${item.name}`}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ))}
      <Pressable onPress={onAddAnother} style={styles.add} accessibilityRole="button">
        <Text style={styles.addText}>{addAnotherLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingTop: 8 },
  heading: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  body: { flex: 1 },
  name: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  meta: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, marginTop: 2 },
  price: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  remove: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
  add: { paddingVertical: 14 },
  addText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textDecorationLine: 'underline',
  },
});
