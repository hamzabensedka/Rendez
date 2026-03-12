import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, Card } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { useAuth } from '../../../application/providers';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header - Explore style */}
        <View style={styles.header}>
          <Text variant="title2" style={styles.headerTitle}>
            Profile
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text variant="headline" style={styles.sectionTitle}>
              Account
            </Text>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.infoRow}>
                <Text variant="footnote" color={colors.light.textSecondary} style={styles.label}>
                  Name
                </Text>
                <Text variant="body">{user.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="footnote" color={colors.light.textSecondary} style={styles.label}>
                  Email
                </Text>
                <Text variant="body">{user.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="footnote" color={colors.light.textSecondary} style={styles.label}>
                  Role
                </Text>
                <Text variant="body">{user.role}</Text>
              </View>
            </Card>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push('/(tabs)/favorites')}
              activeOpacity={0.7}
            >
              <Text variant="body">Favorites</Text>
              <Text variant="footnote" color={colors.light.textSecondary}>View saved businesses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push('/(tabs)/bookings')}
              activeOpacity={0.7}
            >
              <Text variant="body">My bookings</Text>
              <Text variant="footnote" color={colors.light.textSecondary}>Upcoming appointments</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Button
              title="Sign out"
              onPress={handleLogout}
              variant="outline"
              style={[styles.signOutButton, { borderColor: colors.light.error }]}
              textStyle={{ color: colors.light.error }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    marginBottom: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  card: {
    marginTop: spacing.xs,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.light.surfaceSecondary,
    borderRadius: 8,
  },
  label: {
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  signOutButton: {
    alignSelf: 'stretch',
  },
});
