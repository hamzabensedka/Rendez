import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, Card, Input } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { register } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';

export default function RegisterScreen() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await register({ name, email, password });
      setAuthUser(response.user);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert(
        'Registration Failed',
        message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="title2" style={styles.title}>
              Create account
            </Text>
            <Text variant="body" color={colors.light.textSecondary}>
              Sign up to get started
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="headline" style={styles.sectionTitle}>
              Sign up
            </Text>
            <Card variant="elevated" padding="lg" style={styles.card}>
              <Input
                label="Full name"
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
              <Input
                label="Email"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Input
                label="Password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <Button
                title={loading ? 'Creating account…' : 'Sign up'}
                onPress={handleRegister}
                variant="primary"
                disabled={loading}
                loading={loading}
                style={styles.button}
              />
            </Card>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.back()}
              accessibilityLabel="Already have an account? Sign in"
              accessibilityRole="button"
            >
              <Text variant="body" color={colors.light.textSecondary}>
                Already have an account?{' '}
                <Text variant="body" weight="600" color={colors.light.accent}>
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
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
  button: {
    marginTop: spacing.sm,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
