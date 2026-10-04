import React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { SearchResultsFilter } from '../types';

interface FilterBarProps {
  filters: readonly SearchResultsFilter[];
  onSelect: (filterId: string) => void;
}

export const FilterBar = React.memo<FilterBarProps>(function FilterBar({ filters, onSelect }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <Pressable key={filter.id} style={styles.chip} onPress={() => onSelect(filter.id)}>
            <Text style={styles.label}>{filter.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: T.colors.paper,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    backgroundColor: T.colors.paper,
  },
  label: {
    fontFamily: T.font.medium,
    fontSize: 13,
    color: T.colors.ink,
  },
});
