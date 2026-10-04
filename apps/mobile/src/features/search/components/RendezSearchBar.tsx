import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface RendezSearchBarProps {
  categoryLabel: string;
  addressLine: string;
  addressPlaceholder?: string;
  onPress: () => void;
}

export const RendezSearchBar = React.memo<RendezSearchBarProps>(function RendezSearchBar({
  categoryLabel,
  addressLine,
  addressPlaceholder = 'Address, city',
  onPress,
}) {
  const hasAddress = Boolean(addressLine?.trim());
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Edit search"
    >
      <Ionicons name="search" size={18} color={T.colors.muted} />
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {categoryLabel}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {hasAddress ? addressLine : addressPlaceholder}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    paddingVertical: 12,
    backgroundColor: T.colors.paper,
  },
  pressed: { opacity: 0.86 },
  content: { flex: 1, minWidth: 0 },
  category: {
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
  },
  address: {
    fontFamily: T.font.body,
    fontSize: 13,
    color: T.colors.muted,
    marginTop: 2,
  },
});
