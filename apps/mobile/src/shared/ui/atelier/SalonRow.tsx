import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export interface SalonRowProps {
  name: string;
  neighborhood?: string;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  nextSlot?: string;
  fromPrice?: string;
  imageUri?: string;
  onPress: () => void;
}

export function SalonRow({
  name,
  neighborhood,
  ratingAvg,
  ratingCount,
  nextSlot,
  fromPrice,
  imageUri,
  onPress,
}: SalonRowProps) {
  const rating =
    ratingAvg != null
      ? `${ratingAvg.toFixed(1)}${ratingCount != null ? ` · ${ratingCount}` : ''}`
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} /> : null}
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        {rating ? <Text style={styles.meta}>{rating}</Text> : null}
        {neighborhood ? <Text style={styles.place}>{neighborhood}</Text> : null}
        {nextSlot || fromPrice ? (
          <Text style={styles.slot}>
            {[nextSlot, fromPrice].filter(Boolean).join(' ')}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  pressed: { opacity: 0.86 },
  thumb: { width: 72, height: 72, borderRadius: T.radius.card, backgroundColor: T.colors.past },
  body: { flex: 1, justifyContent: 'center' },
  name: {
    fontFamily: T.font.display,
    fontSize: 20,
    lineHeight: 24,
    color: T.colors.ink,
  },
  meta: {
    marginTop: 4,
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
  },
  place: {
    marginTop: 2,
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
  },
  slot: {
    marginTop: 6,
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
  },
});
