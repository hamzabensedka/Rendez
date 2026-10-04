import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export interface ExploreSalonCardProps {
  name: string;
  neighborhood?: string;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  imageUri?: string;
  onPress: () => void;
}

const webMono =
  Platform.OS === 'web'
    ? ({ filter: 'grayscale(1) contrast(1.08)' } as Record<string, string>)
    : null;

export function ExploreSalonCard({
  name,
  neighborhood,
  ratingAvg,
  ratingCount,
  imageUri,
  onPress,
}: ExploreSalonCardProps) {
  const rating =
    ratingAvg != null
      ? `${ratingAvg.toFixed(1)}${ratingCount != null ? ` · ${ratingCount}` : ''}`
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.photo, webMono]} />
      ) : (
        <View style={styles.photo} />
      )}
      <View style={styles.metaRow}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {rating ? (
          <View style={styles.rating}>
            <Ionicons name="star-outline" size={12} color={T.colors.muted} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        ) : null}
      </View>
      {neighborhood ? <Text style={styles.place}>{neighborhood}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  pressed: { opacity: 0.86 },
  photo: {
    width: '100%',
    height: 196,
    borderRadius: 0,
    backgroundColor: T.colors.past,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontFamily: T.font.display,
    fontSize: 18,
    lineHeight: 24,
    color: T.colors.ink,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  ratingText: {
    fontFamily: T.font.body,
    fontSize: 13,
    lineHeight: 18,
    color: T.colors.muted,
  },
  place: {
    marginTop: 2,
    fontFamily: T.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: T.colors.muted,
  },
});
