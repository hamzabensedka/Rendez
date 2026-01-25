import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchResultsFilter } from '../types';

interface FilterBarProps {
  filters: readonly SearchResultsFilter[];
  onSelect: (filterId: string) => void;
}

export const FilterBar = React.memo<FilterBarProps>(function FilterBar({
  filters,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={styles.chip}
            onPress={() => onSelect(filter.id)}
            activeOpacity={0.7}
            accessibilityLabel={`Filtrer par ${filter.label}`}
            accessibilityRole="button"
          >
            {filter.icon && (
              <Ionicons 
                name={filter.icon as any} 
                size={18} 
                color="#5856D6" 
                style={styles.icon} 
              />
            )}
            <Text style={styles.label}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
});
