import React, { useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { HighlightedText } from './HighlightedText';
import { AddressSuggestion } from '../types';

interface AddressSuggestionListProps {
  suggestions: AddressSuggestion[];
  query: string;
  onSelect: (address: AddressSuggestion) => void;
}

export const AddressSuggestionList = React.memo<AddressSuggestionListProps>(
  function AddressSuggestionList({ suggestions, query, onSelect }) {
  const renderItem: ListRenderItem<AddressSuggestion> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.6}
        onPress={() => onSelect(item)}
        accessibilityLabel={`Adresse: ${item.address}`}
        accessibilityRole="button"
      >
        <HighlightedText text={item.address} query={query} style={styles.text} />
      </TouchableOpacity>
    ),
    [query, onSelect]
  );

  const keyExtractor = useCallback(
    (item: AddressSuggestion) => item.id,
    []
  );

  return (
    <FlatList
      data={suggestions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: 0, // Allow shadow to be visible
    zIndex: 0, // Below the search input
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
});
