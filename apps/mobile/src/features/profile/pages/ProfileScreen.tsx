import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../application/providers';
import { colors, spacing, typography, radius } from '@planity/ui';

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
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Name</Text>
          <Text style={styles.cardValue}>{user.name}</Text>

          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{user.email}</Text>

          <Text style={styles.cardLabel}>Role</Text>
          <Text style={styles.cardValue}>{user.role}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing['3xl'],
    backgroundColor: colors.light.surface,
  },
  title: {
    ...typography.largeTitle,
    color: colors.light.text,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  cardLabel: {
    ...typography.footnote,
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  cardValue: {
    ...typography.body,
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.light.error,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
});


