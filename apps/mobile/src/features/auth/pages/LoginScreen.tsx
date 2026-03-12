import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, Card, Input } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { login } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';

export default function LoginScreen() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      setAuthUser(response.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="title2" style={styles.title}>
              Welcome back
            </Text>
            <Text variant="body" color={colors.light.textSecondary}>
              Sign in to continue
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="headline" style={styles.sectionTitle}>
              Sign in
            </Text>
            <Card variant="elevated" padding="lg" style={styles.card}>
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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <Button
                title={loading ? 'Signing in…' : 'Sign in'}
                onPress={handleLogin}
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
              onPress={() => router.push('/(auth)/register')}
            >
              <Text variant="body" color={colors.light.textSecondary}>
                Don't have an account?{' '}
                <Text variant="body" weight="600" color={colors.light.accent}>
                  Sign up
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
