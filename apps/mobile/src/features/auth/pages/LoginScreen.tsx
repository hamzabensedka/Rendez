import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { homeHrefForRole, login, forgotPassword } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';
import { useKeyboardHeight } from '../../../application/hooks/useKeyboardHeight';
import { DEV_LOGIN_ACCOUNTS } from '../devAccounts';
import { AtelierField } from '../../../shared/ui/atelier/AtelierField';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const keyboardHeight = useKeyboardHeight();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'client' | 'professional'>('client');
  const [hidePassword, setHidePassword] = useState(true);

  function fillDevAccount(account: (typeof DEV_LOGIN_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.label === 'Professional' ? 'professional' : 'client');
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert('Enter your email', 'Type your email above, then tap "Forgot password".');
      return;
    }
    try {
      await forgotPassword(email);
    } catch {
      // Server always returns 200; ignore network noise for UX simplicity.
    }
    Alert.alert(
      'Check your email',
      'If an account exists for that address, we sent a link to reset your password.'
    );
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      setAuthUser(response.user);
      router.replace(homeHrefForRole(response.user.role));
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Sign in failed', message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topBar}>
          <Text style={styles.mark}>ATELIER</Text>
          <Pressable
            onPress={() => router.replace('/(main)/explore')}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={24} color={T.colors.ink} />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        >
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: 48 + keyboardHeight }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{`Welcome\nback`}</Text>

            <View style={styles.seg}>
              <Pressable
                onPress={() => {
                  setRole('client');
                  const acc = DEV_LOGIN_ACCOUNTS.find((a) => a.label === 'Client');
                  if (__DEV__ && acc) fillDevAccount(acc);
                }}
                style={[styles.segItem, role === 'client' && styles.segItemOn]}
                accessibilityRole="button"
                accessibilityLabel="Client"
              >
                <Text style={[styles.segText, role === 'client' && styles.segTextOn]}>Client</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setRole('professional');
                  const acc = DEV_LOGIN_ACCOUNTS.find((a) => a.label === 'Professional');
                  if (__DEV__ && acc) fillDevAccount(acc);
                }}
                style={[styles.segItem, role === 'professional' && styles.segItemOn]}
                accessibilityRole="button"
                accessibilityLabel="Professional"
              >
                <Text style={[styles.segText, role === 'professional' && styles.segTextOn]}>
                  Professional
                </Text>
              </Pressable>
            </View>

            <AtelierField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              hideLabel
            />
            <View>
              <AtelierField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
                autoCapitalize="none"
                hideLabel
              />
              <Pressable
                style={styles.eye}
                onPress={() => setHidePassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={hidePassword ? 'Show password' : 'Hide password'}
              >
                <Ionicons
                  name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={T.colors.muted}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [styles.inkBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              <Text style={styles.inkBtnText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
            </Pressable>

            <View style={styles.links}>
              <Pressable onPress={handleForgotPassword} accessibilityRole="button">
                <Text style={styles.quiet}>Forgot password?</Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/(main)/explore')}
                accessibilityRole="button"
              >
                <Text style={styles.quiet}>Continue without account</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(auth)/register')}
                accessibilityRole="button"
              >
                <Text style={styles.quiet}>Create account</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper },
  safe: { flex: 1, backgroundColor: T.colors.paper },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  mark: {
    fontFamily: T.font.headline,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: T.colors.ink,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 32 },
  title: {
    fontFamily: T.font.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    fontWeight: '700',
    color: T.colors.ink,
    width: '80%',
    marginBottom: 48,
  },
  seg: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  segItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: T.colors.rule,
    backgroundColor: 'transparent',
  },
  segItemOn: { backgroundColor: T.colors.ink, borderColor: T.colors.ink },
  segText: { fontFamily: T.font.medium, fontSize: 14, lineHeight: 20, color: T.colors.muted },
  segTextOn: { color: T.colors.bookedText },
  eye: { position: 'absolute', right: 0, top: 0, padding: 4 },
  inkBtn: {
    height: 52,
    backgroundColor: T.colors.ink,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  inkBtnText: {
    fontFamily: T.font.medium,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.bookedText,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  links: { marginTop: 32, gap: 16 },
  quiet: {
    fontFamily: T.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: T.colors.muted,
    textDecorationLine: 'underline',
    textDecorationColor: T.colors.rule,
  },
});
