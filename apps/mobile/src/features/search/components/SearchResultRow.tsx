import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export interface SearchResultRowProps {
  name: string;
  neighborhood?: string;
  nextSlot?: string;
  fromPrice?: string;
  imageUri?: string;
  onPress: () => void;
}

const webMono =
  Platform.OS === 'web'
    ? ({ filter: 'grayscale(1) contrast(1.06)' } as Record<string, string>)
    : null;

export function SearchResultRow({
  name,
  neighborhood,
  nextSlot,
  fromPrice,
  imageUri,
  onPress,
}: SearchResultRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.thumb, webMono]} />
      ) : (
        <View style={styles.thumb} />
      )}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {neighborhood ? (
          <Text style={styles.place} numberOfLines={1}>
            {neighborhood}
          </Text>
        ) : null}
        <View style={styles.bottom}>
          {nextSlot ? (
            <View style={styles.slot}>
              <Text style={styles.slotText}>{nextSlot}</Text>
            </View>
          ) : (
            <View />
          )}
          {fromPrice ? <Text style={styles.price}>{fromPrice}</Text> : null}
        </View>
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
  thumb: {
    width: 72,
    height: 72,
    borderRadius: T.radius.card,
    backgroundColor: T.colors.past,
  },
  body: { flex: 1, minWidth: 0, justifyContent: 'center' },
  name: {
    fontFamily: T.font.display,
    fontSize: 16,
    lineHeight: 22,
    color: T.colors.ink,
  },
  place: {
    marginTop: 2,
    fontFamily: T.font.body,
    fontSize: 13,
    lineHeight: 18,
    color: T.colors.muted,
  },
  bottom: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  slot: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    backgroundColor: T.colors.surface,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  slotText: {
    fontFamily: T.font.medium,
    fontSize: 12,
    lineHeight: 16,
    color: T.colors.ink,
  },
  price: {
    fontFamily: T.font.body,
    fontSize: 14,
    lineHeight: 18,
    color: T.colors.ink,
  },
});
