import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon as any} size={22} color={THEME.colors.primary} style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={THEME.colors.outline} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const bottomInset = useBottomNavInset();

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, router]);

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: 'heart-outline', label: 'Favorites', onPress: () => router.push('/(main)/favorites') },
    { icon: 'calendar-outline', label: 'My bookings', onPress: () => router.push('/(main)/bookings') },
    { icon: 'card-outline', label: 'Payment methods', onPress: () => {} },
    { icon: 'settings-outline', label: 'Settings', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      
      {/* Top App Bar */}
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ATELIER</Text>
          <View style={styles.headerAvatar}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }}
              style={styles.headerAvatarImage}
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Headline Section */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user.name || 'Alexandra Vancamp'}</Text>
          <Text style={styles.userEmail}>{user.email || 'alexandra.v@atelier.design'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PRO MEMBER</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
            />
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  headerContainer: {
    backgroundColor: `${THEME.colors.surface}CC`, // 80% opacity
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onSurface,
    textTransform: 'uppercase',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  headlineSection: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  headline: {
    fontSize: THEME.typography.displayLarge.fontSize,
    fontWeight: THEME.typography.displayLarge.fontWeight,
    letterSpacing: THEME.typography.displayLarge.letterSpacing,
    lineHeight: THEME.typography.displayLarge.lineHeight,
    color: THEME.colors.primary,
  },
  profileCard: {
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    marginBottom: THEME.spacing['2xl'],
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    marginBottom: THEME.spacing.lg,
    backgroundColor: '#E8C4B8', // Soft peachy tone for the avatar background
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: THEME.typography.headline.fontSize,
    fontWeight: THEME.typography.headline.fontWeight,
    letterSpacing: THEME.typography.headline.letterSpacing,
    color: THEME.colors.onSurface,
    marginBottom: THEME.spacing.xs,
  },
  userEmail: {
    fontSize: THEME.typography.body.fontSize,
    fontWeight: THEME.typography.body.fontWeight,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: THEME.spacing.md,
  },
  badge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onPrimary,
    textTransform: 'uppercase',
  },
  menuSection: {
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing['2xl'],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: THEME.spacing.lg,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: THEME.spacing.md,
  },
  menuLabel: {
    fontSize: THEME.typography.body.fontSize,
    fontWeight: '500',
    color: THEME.colors.onSurface,
  },
  signOutButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.lg,
    borderRadius: 9999,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: THEME.typography.body.fontSize,
    fontWeight: '600',
    color: THEME.colors.onPrimary,
  },
});
