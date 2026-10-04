import React from 'react';
import { ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

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
    >
      {pills.map((pill) => (
        <Pressable key={pill.id} style={styles.chip} onPress={() => onSelect(pill.id)}>
          <Text style={styles.label}>{pill.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
