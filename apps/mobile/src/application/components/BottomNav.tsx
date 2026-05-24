import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers';
import { editorialTheme } from '../theme/editorialTheme';

const THEME = editorialTheme;

// Height of the visible nav content (icons + padding). Does NOT include safe area.
const BOTTOM_NAV_CONTENT_HEIGHT = 64;

/** Whether the global bottom nav is currently visible (hidden when not logged in or on Explore). */
export function useIsBottomNavVisible(): boolean {
  const { user } = useAuth();
  const segments = useSegments();
  const firstSegment = Array.isArray(segments) ? (segments as string[])[1] : undefined;
  return !!user && firstSegment !== 'explore';
}

/** Bottom padding for scroll content: safe area + nav bar when the nav is shown. */
export function useBottomNavInset(): number {
  const insets = useSafeAreaInsets();
  const visible = useIsBottomNavVisible();
  if (!visible) {
    return insets.bottom + 24;
  }
  return insets.bottom + BOTTOM_NAV_TOTAL + 16;
}

interface NavItemProps {
  icon: string;
  activeIcon?: string;
  isActive: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  activeIcon,
  isActive,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={(isActive ? (activeIcon || icon) : icon) as any} 
        size={22} 
        color={isActive ? THEME.colors.onPrimary : THEME.colors.onSurfaceVariant} 
        style={{ opacity: isActive ? 1 : 0.6 }}
      />
    </TouchableOpacity>
  );
};

export function BottomNav() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const firstSegment = Array.isArray(segments) ? (segments as string[])[1] : undefined;
  const isExplore = firstSegment === 'explore';

  if (!user || isExplore) {
    return null;
  }

  const navTo = (path: string) => () => {
    router.push(path as any);
  };

  const isProfile = firstSegment === 'profile';
  const isBookings = firstSegment === 'bookings';
  const isFavorites = firstSegment === 'favorites';

  return (
    <View
      style={[
        styles.container,
        {
          height: BOTTOM_NAV_CONTENT_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Frosted glass effect container */}
      <View style={styles.glassContainer}>
        <NavItem
          icon="home-outline"
          isActive={false}
          onPress={navTo('/(main)/explore')}
          accessibilityLabel="Home, Explore"
        />
        <NavItem
          icon="calendar-outline"
          isActive={isBookings}
          onPress={navTo('/(main)/bookings')}
          accessibilityLabel="Bookings"
        />
        <NavItem
          icon="heart-outline"
          activeIcon="heart"
          isActive={isFavorites}
          onPress={navTo('/(main)/favorites')}
          accessibilityLabel="Favorites"
        />
        <NavItem
          icon="person-outline"
          activeIcon="person"
          isActive={isProfile}
          onPress={navTo('/(main)/profile')}
          accessibilityLabel="Profile"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  glassContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: `${THEME.colors.surface}CC`, // 80% opacity for frosted glass
    // Note: backdrop-filter blur is web-only, on mobile we use opacity
  },
  item: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  itemActive: {
    backgroundColor: THEME.colors.primary,
    transform: [{ scale: 1.1 }],
  },
});

/**
 * Total height to add when positioning elements above the bottom nav.
 * This is the content height only - safe area is added separately via insets.bottom.
 */
export const BOTTOM_NAV_TOTAL = BOTTOM_NAV_CONTENT_HEIGHT;
