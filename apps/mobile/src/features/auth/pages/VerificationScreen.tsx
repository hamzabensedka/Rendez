import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeHrefForRole, register, resendVerification } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';
import { providerTheme as T } from '../../../application/theme/providerTheme';

const DIGITS = 6;

export default function VerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login: setAuthUser, pendingRegistration, setPendingRegistration } = useAuth();
  const email = pendingRegistration?.email ?? '';
  const password = pendingRegistration?.password ?? '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!pendingRegistration?.email || !pendingRegistration?.password) {
      router.back();
    }
  }, [pendingRegistration, router]);

  async function handleVerify() {
    if (code.replace(/\D/g, '').length < DIGITS) {
      Alert.alert('Enter the code', 'Check your email for the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const name =
        pendingRegistration?.name?.trim() || (email || '').split('@')[0] || 'User';
      const response = await register({ email: email || '', name, password: password || '' });
      setPendingRegistration(null);
      setAuthUser(response.user);
      // The account is created; a verification link was emailed. Let the user in,
      // and tell them to confirm via the link in their inbox.
      Alert.alert(
        'Verify your email',
        `We sent a verification link to ${email}. Tap it to confirm your account.`,
        [{ text: 'OK', onPress: () => router.replace(homeHrefForRole(response.user.role)) }]
      );
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
    Alert.alert('Email sent', `If your account is pending verification, we emailed ${email}.`);
  }

  const digits = Array.from({ length: DIGITS }, (_, i) => code[i] ?? '');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <Text style={styles.title}>We sent a code</Text>
      <Text style={styles.sub}>Check your email.</Text>

      <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
        {digits.map((d, i) => (
          <View key={i} style={[styles.slot, i === code.length && styles.slotFocus]}>
            <Text style={styles.digit}>{d}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, DIGITS))}
        keyboardType="number-pad"
        maxLength={DIGITS}
        style={styles.hidden}
        autoFocus
      />

      <Pressable
        onPress={handleVerify}
        disabled={loading}
        style={({ pressed }) => [styles.inkBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Verify"
      >
        {loading ? (
          <ActivityIndicator color={T.colors.bookedText} />
        ) : (
          <Text style={styles.inkBtnText}>Verify</Text>
        )}
      </Pressable>
      <Pressable
        onPress={handleResend}
        style={styles.resend}
        accessibilityRole="button"
      >
        <Text style={styles.resendText}>Resend code</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper, paddingHorizontal: 24 },
  title: {
    fontFamily: T.font.headline,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: T.colors.ink,
  },
  sub: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.muted,
    marginTop: 8,
    marginBottom: 48,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'flex-start', gap: 8, marginBottom: 40 },
  slot: {
    width: 40,
    borderBottomWidth: 2,
    borderBottomColor: T.colors.rule,
    alignItems: 'center',
    paddingBottom: 4,
  },
  slotFocus: { borderBottomColor: T.colors.ink },
  digit: {
    fontFamily: T.font.display,
    fontSize: 32,
    lineHeight: 40,
    color: T.colors.ink,
  },
  hidden: { position: 'absolute', opacity: 0, height: 0, width: 0 },
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
  pressed: { opacity: 0.8 },
  resend: { paddingVertical: 24 },
  resendText: { fontFamily: T.font.body, fontSize: 16, lineHeight: 24, color: T.colors.muted },
});
