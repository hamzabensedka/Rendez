import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export const EXPLORE_TABS = [
  { id: 'hair', label: 'Hair', slugs: [] as string[] },
  { id: 'color', label: 'Color', slugs: [] as string[] },
  { id: 'beard', label: 'Beard', slugs: ['barbier'] },
  { id: 'nails', label: 'Nails', slugs: ['manucure'] },
] as const;

export type ExploreTabId = (typeof EXPLORE_TABS)[number]['id'];

interface ExploreCategoryTabsProps {
  activeId: ExploreTabId;
  onChange: (id: ExploreTabId) => void;
}

export function ExploreCategoryTabs({ activeId, onChange }: ExploreCategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {EXPLORE_TABS.map((tab) => {
        const active = tab.id === activeId;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            style={styles.tab}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.rule, active && styles.ruleActive]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 28,
    paddingBottom: 4,
  },
  tab: {
    alignItems: 'flex-start',
  },
  label: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.muted,
    paddingBottom: 8,
  },
  labelActive: {
    fontFamily: T.font.display,
    color: T.colors.ink,
  },
  rule: {
    alignSelf: 'stretch',
    height: 2,
    backgroundColor: 'transparent',
  },
  ruleActive: {
    backgroundColor: T.colors.ink,
  },
});
