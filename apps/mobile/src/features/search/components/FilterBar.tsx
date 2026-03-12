import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@planity/ui';
import { colors, spacing, shadows } from '@planity/ui';
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
          <Button
            key={filter.id}
            title={filter.label}
            onPress={() => onSelect(filter.id)}
            variant="secondary"
            size="sm"
            leftIcon={filter.icon ? (
              <Ionicons
                name={filter.icon as React.ComponentProps<typeof Ionicons>['name']}
                size={18}
                color={colors.light.accent}
              />
            ) : undefined}
            style={styles.chip}
            textStyle={{ fontWeight: '500' }}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.background,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  chip: {
    backgroundColor: colors.light.surface,
    borderWidth: 0,
    ...shadows.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
});
