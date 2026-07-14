import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text as UIText } from '@planity/ui';
import { colors, spacing } from '@planity/ui';

interface SalonTabsProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const SalonTabs = React.memo<SalonTabsProps>(function SalonTabs({
  tabs,
  activeTab,
  onTabPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => onTabPress(tab)}
            accessibilityLabel={`Tab ${tab}`}
            accessibilityRole="tab"
          >
            <UIText
              variant="footnote"
              weight={activeTab === tab ? '600' : '400'}
              color={activeTab === tab ? colors.light.text : colors.light.textSecondary}
              numberOfLines={1}
            >
              {tab}
            </UIText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
    paddingHorizontal: spacing.xs,
  },
  activeTab: {
    borderBottomColor: colors.light.text,
  },
});
