import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers';
import { providerTheme } from '../theme/providerTheme';
import { isProviderRole } from '../../shared/lib/auth';

const FLOOR = providerTheme;

const CONSUMER_NAV_CONTENT = 72;
const PROVIDER_NAV_CONTENT = 72;

function providerTab(segments: string[]): 'floor' | 'desk' | 'team' | 'account' | 'other' {
  const path = segments.join('/');
  if (path.includes('profile')) return 'account';
  if (path.includes('desk')) return 'desk';
  if (path.includes('staff')) return 'team';
  if (path.includes('provider-portal') && !path.includes('schedule')) return 'floor';
  return 'other';
}

function clientTab(segments: string[]): 'explore' | 'appointments' | 'saved' | 'account' | 'other' {
  const path = segments.join('/');
  if (path.includes('profile')) return 'account';
  if (path.includes('bookings')) return 'appointments';
  if (path.includes('favorites')) return 'saved';
  if (path.includes('explore') || path.includes('search-results') || path.includes('business')) {
    return 'explore';
  }
  return 'other';
}

export function useIsBottomNavVisible(): boolean {
  const { user } = useAuth();
  return !!user;
}

export function useNavClearance(): number {
  const insets = useSafeAreaInsets();
  const visible = useIsBottomNavVisible();
  const { user } = useAuth();
  const height = isProviderRole(user?.role) ? PROVIDER_NAV_CONTENT : CONSUMER_NAV_CONTENT;
  return visible ? height + insets.bottom : 0;
}

export function useBottomNavInset(): number {
  const insets = useSafeAreaInsets();
  const navClearance = useNavClearance();
  if (navClearance === 0) {
    return insets.bottom + 24;
  }
  return navClearance + 16;
}

export function useFloatingBarOffset(): number {
  const insets = useSafeAreaInsets();
  const navClearance = useNavClearance();
  return navClearance > 0 ? navClearance : insets.bottom;
}

export function useScrollClearance(overlayHeight = 0, extra = 16): number {
  const chrome = useFloatingBarOffset();
  return chrome + overlayHeight + extra;
}

interface NavItemProps {
  icon: string;
  activeIcon?: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  showActiveMark?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  activeIcon,
  label,
  isActive,
  onPress,
  accessibilityLabel,
  showActiveMark = true,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.item}
      onPress={onPress}
    >
      {showActiveMark ? (
        isActive ? <View style={styles.activeMark} /> : <View style={styles.activeMarkSpacer} />
      ) : null}
      <Ionicons
        name={(isActive ? activeIcon || icon : icon) as 'home-outline'}
        size={22}
        color={isActive ? FLOOR.colors.ink : FLOOR.colors.muted}
      />
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
};

export function BottomNav() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments() as string[];
  const isProvider = isProviderRole(user?.role);
  const pTab = providerTab(segments);
  const cTab = clientTab(segments);

  if (!user) {
    return null;
  }

  const navTo = (path: string) => () => {
    router.push(path as never);
  };

  if (isProvider) {
    return (
      <View
        style={[
          styles.bar,
          {
            height: PROVIDER_NAV_CONTENT + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <NavItem
          icon="grid-outline"
          label="Floor"
          isActive={pTab === 'floor'}
          onPress={navTo('/(main)/provider-portal')}
          accessibilityLabel="Floor"
        />
        <NavItem
          icon="list-outline"
          label="Desk"
          isActive={pTab === 'desk'}
          onPress={navTo('/(main)/provider-portal/desk')}
          accessibilityLabel="Desk"
        />
        <NavItem
          icon="people-outline"
          label="Team"
          isActive={pTab === 'team'}
          onPress={navTo('/(main)/provider-portal/staff')}
          accessibilityLabel="Team"
        />
        <NavItem
          icon="person-outline"
          activeIcon="person"
          label="Account"
          isActive={pTab === 'account'}
          onPress={navTo('/(main)/profile')}
          accessibilityLabel="Account"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.bar,
        styles.barClient,
        {
          height: CONSUMER_NAV_CONTENT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <NavItem
        icon="compass-outline"
        label="Explore"
        isActive={cTab === 'explore'}
        onPress={navTo('/(main)/explore')}
        accessibilityLabel="Explore"
        showActiveMark={false}
      />
      <NavItem
        icon="calendar-outline"
        label="Appointments"
        isActive={cTab === 'appointments'}
        onPress={navTo('/(main)/bookings')}
        accessibilityLabel="Appointments"
        showActiveMark={false}
      />
      <NavItem
        icon="heart-outline"
        activeIcon="heart"
        label="Saved"
        isActive={cTab === 'saved'}
        onPress={navTo('/(main)/favorites')}
        accessibilityLabel="Saved"
        showActiveMark={false}
      />
      <NavItem
        icon="person-outline"
        activeIcon="person"
        label="Account"
        isActive={cTab === 'account'}
        onPress={navTo('/(main)/profile')}
        accessibilityLabel="Account"
        showActiveMark={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: FLOOR.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: FLOOR.colors.rule,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  barClient: {
    backgroundColor: FLOOR.colors.paper,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  activeMark: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: FLOOR.colors.ink,
    marginBottom: 2,
  },
  activeMarkSpacer: {
    width: 16,
    height: 2,
    marginBottom: 2,
  },
  label: {
    fontFamily: FLOOR.font.label,
    fontSize: 10,
    letterSpacing: 0.6,
    color: FLOOR.colors.muted,
  },
  labelActive: {
    color: FLOOR.colors.ink,
    fontFamily: FLOOR.font.display,
  },
});

export const BOTTOM_NAV_TOTAL = CONSUMER_NAV_CONTENT;
