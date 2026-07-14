import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';

export interface FilterPillItem {
  id: string;
  label: string;
}

interface RendezFilterPillsProps {
  pills: readonly FilterPillItem[];
  onSelect: (id: string) => void;
}

export const RendezFilterPills = React.memo<RendezFilterPillsProps>(function RendezFilterPills({
  pills,
  onSelect,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {pills.map((pill) => (
        <TouchableOpacity
          key={pill.id}
          style={styles.pill}
          onPress={() => onSelect(pill.id)}
          activeOpacity={0.7}
        >
          <Text variant="footnote" weight="500">
            {pill.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -spacing.lg,
  },
  container: {
    paddingHorizontal: spacing.lg,
    gap: 8,
    paddingBottom: spacing.sm,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
});
