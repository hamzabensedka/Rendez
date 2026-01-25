import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
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
          activeOpacity={0.6}
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
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: 24,
    zIndex: 0, // Below the search input
    marginTop: 0, // Allow shadow to be visible
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    letterSpacing: -0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
