import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';

interface RendezSearchBarProps {
  categoryLabel: string;
  address: string;
  onPress: () => void;
}

export const RendezSearchBar = React.memo<RendezSearchBarProps>(function RendezSearchBar({
  categoryLabel,
  address,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Edit search"
    >
      <Ionicons
        name="search"
        size={20}
        color={colors.light.textSecondary}
        style={styles.searchIcon}
      />
      <View style={styles.content} pointerEvents="none">
        <View style={styles.pill}>
          <Text variant="caption" weight="600">
            {categoryLabel}
          </Text>
        </View>
        <Text
          variant="body"
          color={colors.light.textSecondary}
          numberOfLines={1}
          style={styles.address}
        >
          {address}
        </Text>
      </View>
      <View style={styles.editButton}>
        <Ionicons name="pencil" size={16} color={colors.light.textSecondary} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.light.background,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  pill: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  address: {
    flex: 1,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
});
