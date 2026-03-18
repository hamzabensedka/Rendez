import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Text, Button, Card, Input } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { login } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';
import { useKeyboardHeight } from '../../../application/hooks/useKeyboardHeight';

export default function LoginScreen() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const keyboardHeight = useKeyboardHeight();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

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
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Login Failed', message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: spacing['3xl'] + keyboardHeight },
            ]}
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
            {!showForm ? (
              <Animated.View
                key="sign-in-button"
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(180)}
                style={styles.triggerWrapper}
              >
                <TouchableOpacity
                  onPress={handleShowForm}
                  activeOpacity={0.85}
                  style={styles.signInTrigger}
                >
                  <Text variant="headline" style={styles.signInTriggerText}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View
                key="login-form"
                entering={FadeInDown.duration(320)}
                exiting={FadeOutUp.duration(200)}
                style={styles.formWrapper}
              >
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
              </Animated.View>
            )}
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
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
  triggerWrapper: {
    marginTop: spacing.xs,
  },
  signInTrigger: {
    backgroundColor: colors.light.text,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signInTriggerText: {
    color: colors.light.surface,
  },
  formWrapper: {
    marginTop: spacing.xs,
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
