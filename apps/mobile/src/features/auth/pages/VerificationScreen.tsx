import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeHrefForRole, register, resendVerification } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export default function VerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login: setAuthUser, pendingRegistration, setPendingRegistration } = useAuth();
  const email = pendingRegistration?.email ?? '';
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!pendingRegistration?.email || !pendingRegistration?.password) {
      router.back();
    }
  }, [pendingRegistration, router]);

  async function handleContinue() {
    setLoading(true);
    try {
      const name = pendingRegistration?.name?.trim() || email.split('@')[0] || 'User';
      const response = await register({ email, name, password: pendingRegistration?.password ?? '' });
      setPendingRegistration(null);
      setAuthUser(response.user);
      // The account is created and a verification link was emailed. Let the user
      // in and route them to their role home; they confirm via the inbox link.
      router.replace(homeHrefForRole(response.user.role));
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Registration failed', message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      Alert.alert('No email', 'Go back and enter your email again.');
      return;
    }
    try {
      await resendVerification(email);
    } catch {
      // Server always returns 200; ignore network noise.
    }
    setResent(true);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <Text style={styles.kicker}>VERIFY YOUR EMAIL</Text>
      <Text style={styles.title}>Check your inbox</Text>
      <Text style={styles.sub}>
        We sent a verification link to <Text style={styles.email}>{email}</Text>. Tap it to confirm
        your account — then continue below.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Didn&apos;t get it? Check spam, or resend the link.
        </Text>
        <Pressable
          onPress={handleResend}
          disabled={resent}
          style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed, resent && styles.resentBtn]}
          accessibilityRole="button"
          accessibilityLabel="Resend verification link"
        >
          <Text style={styles.outlineBtnText}>{resent ? 'Link sent' : 'Resend link'}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleContinue}
        disabled={loading}
        style={({ pressed }) => [styles.inkBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Continue"
      >
        {loading ? <ActivityIndicator color={T.colors.bookedText} /> : <Text style={styles.inkBtnText}>Continue</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper, paddingHorizontal: 24 },
  kicker: {
    fontFamily: T.font.label,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    color: T.colors.muted,
    marginBottom: 8,
  },
  title: {
    fontFamily: T.font.headline,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: T.colors.ink,
  },
  sub: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.muted,
    marginTop: 12,
    marginBottom: 32,
  },
  email: { fontFamily: T.font.medium, color: T.colors.ink },
  card: {
    backgroundColor: T.colors.surface,
    borderWidth: 1,
    borderColor: T.colors.rule,
    borderRadius: T.radius.card,
    padding: 20,
    marginBottom: 32,
  },
  cardText: {
    fontFamily: T.font.body,
    fontSize: 14,
    lineHeight: 20,
    color: T.colors.muted,
    marginBottom: 16,
  },
  inkBtn: {
    height: 52,
    backgroundColor: T.colors.ink,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inkBtnText: {
    fontFamily: T.font.label,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7,
    fontWeight: '600',
    color: T.colors.bookedText,
  },
  outlineBtn: {
    height: 44,
    borderWidth: 1,
    borderColor: T.colors.rule,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  outlineBtnText: {
    fontFamily: T.font.label,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    fontWeight: '600',
    color: T.colors.ink,
  },
  resentBtn: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
});
