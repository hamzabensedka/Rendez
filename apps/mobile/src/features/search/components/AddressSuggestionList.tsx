import React, { useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { HighlightedText } from './HighlightedText';
import { colors, spacing } from '@planity/ui';
import { AddressSuggestion } from '../types';

interface AddressSuggestionListProps {
  suggestions: readonly AddressSuggestion[];
  query: string;
  onSelect: (address: AddressSuggestion) => void;
}

export const AddressSuggestionList = React.memo<AddressSuggestionListProps>(
  function AddressSuggestionList({ suggestions, query, onSelect }) {
    const renderItem: ListRenderItem<AddressSuggestion> = useCallback(
      ({ item }) => (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => onSelect(item)}
          accessibilityLabel={`Address: ${item.address}`}
          accessibilityRole="button"
        >
          <HighlightedText text={item.address} query={query} style={styles.text} />
        </TouchableOpacity>
      ),
      [query, onSelect]
    );

    const keyExtractor = useCallback((item: AddressSuggestion) => item.id, []);

    return (
      <FlatList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  item: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  text: {
    fontSize: 16,
    color: colors.light.text,
    lineHeight: 24,
  },
});
