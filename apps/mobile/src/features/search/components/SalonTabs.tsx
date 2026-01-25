import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';

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
      {/* 
        Tabs container using flex row to distribute tabs evenly (1/3 each).
        The bottom border of the container acts as the full-width underline.
      */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => onTabPress(tab)}
            accessibilityLabel={`Onglet ${tab}`}
            accessibilityRole="button"
          >
            <Text 
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tab: {
    flex: 1, // Each tab takes equal width (1/3 if there are 3 tabs)
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3, // Thicker border for active state
    borderBottomColor: 'transparent',
    // Ensure the border sits exactly on the bottom line of the container
    marginBottom: -1, 
    paddingHorizontal: 4,
  },
  activeTab: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  activeTabText: {
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
});
