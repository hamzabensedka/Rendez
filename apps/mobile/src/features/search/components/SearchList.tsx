import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { HighlightedText } from './HighlightedText';

interface SearchListProps<T> {
  data: readonly T[];
  query: string;
  onSelect: (item: T) => void;
  getItemText: (item: T) => string;
  getItemKey?: (item: T, index: number) => string;
  emptyMessage?: string;
  title?: string;
}

export function SearchList<T>({
  data,
  query,
  onSelect,
  getItemText,
  getItemKey,
  emptyMessage,
  title,
}: SearchListProps<T>) {
  const renderItem: ListRenderItem<T> = useCallback(
    ({ item }) => {
      const itemText = getItemText(item);
      return (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => onSelect(item)}
          accessibilityLabel={itemText}
          accessibilityRole="button"
        >
          <HighlightedText text={itemText} query={query} style={styles.itemText} />
        </TouchableOpacity>
      );
    },
    [query, onSelect, getItemText]
  );

  const keyExtractor = useCallback(
    (item: T, index: number) => {
      return getItemKey ? getItemKey(item, index) : `item-${index}`;
    },
    [getItemKey]
  );

  if (data.length === 0 && emptyMessage) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body" color={colors.light.textSecondary}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title ? (
        <Text variant="headline" style={styles.sectionTitle}>{title}</Text>
      ) : null}
      <FlashList
        data={[...data]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.light.background,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing['2xl'],
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemText: {
    fontSize: 16,
    color: colors.light.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
