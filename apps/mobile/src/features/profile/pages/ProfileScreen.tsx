import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const bottomInset = useBottomNavInset();

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={THEME.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={[styles.body, { paddingBottom: bottomInset + 24 }]}>
            <Text variant="title2" style={styles.title}>
              Account
            </Text>
            <Text style={styles.subtitle}>Sign in to manage bookings and favorites.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Create account</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.body, { paddingBottom: bottomInset + 24 }]}>
          <Text variant="title2" style={styles.title}>
            Account
          </Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {user.role === 'providerOwner' || user.role === 'providerStaff' ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(main)/provider-portal')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Provider portal</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.outline,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});
