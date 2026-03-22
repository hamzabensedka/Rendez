import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@planity/ui';
import { useAuth } from '../providers';

// Height of the visible nav content (icons + padding). Does NOT include safe area.
const BOTTOM_NAV_CONTENT_HEIGHT = 56;  // Adjust this value (56 = more compact, 64 = more spacious)

/** Whether the global bottom nav is currently visible (hidden when not logged in or on Explore). */
export function useIsBottomNavVisible(): boolean {
  const { user } = useAuth();
  const segments = useSegments();
  const firstSegment = Array.isArray(segments) ? segments[1] : undefined;
  return !!user && firstSegment !== 'explore';
}

export function BottomNav() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const firstSegment = Array.isArray(segments) ? segments[1] : undefined;
  const isExplore = firstSegment === 'explore';

  if (isExplore) {
    return null;
  }

  const navTo = (path: string) => () => {
    router.push(path as any);
  };

  const isBookings = firstSegment === 'bookings';

  return (
    <View
      style={[
        styles.container,
        {
          // Total height = content + safe area, positioned at bottom
          height: BOTTOM_NAV_CONTENT_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <TouchableOpacity style={styles.item} onPress={navTo('/(tabs)/explore')}>
        <Ionicons name="home" size={24} color={colors.light.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={navTo('/(tabs)/explore')}>
        <Ionicons name="search" size={24} color={colors.light.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={navTo('/(tabs)/bookings')}>
        <Ionicons
          name="calendar"
          size={24}
          color={isBookings ? colors.light.text : colors.light.textSecondary}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={navTo('/(tabs)/favorites')}>
        <Ionicons name="heart-outline" size={24} color={colors.light.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={navTo('/(tabs)/profile')}>
        <Ionicons name="person-outline" size={24} color={colors.light.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    // Content area height - icons will be centered in this space
    height: BOTTOM_NAV_CONTENT_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: '#fff',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

/**
 * Total height to add when positioning elements above the bottom nav.
 * This is the content height only - safe area is added separately via insets.bottom.
 */
export const BOTTOM_NAV_TOTAL = BOTTOM_NAV_CONTENT_HEIGHT;
