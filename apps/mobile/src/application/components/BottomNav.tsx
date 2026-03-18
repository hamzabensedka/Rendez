import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@planity/ui';
import { useAuth } from '../providers';

const BOTTOM_NAV_HEIGHT = 56;
const BOTTOM_NAV_MARGIN = 10;

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
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          marginBottom: BOTTOM_NAV_MARGIN,
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
    minHeight: BOTTOM_NAV_HEIGHT,
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

/** Height of bottom nav (for layout padding). Includes margin. */
export const BOTTOM_NAV_TOTAL = BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN;
