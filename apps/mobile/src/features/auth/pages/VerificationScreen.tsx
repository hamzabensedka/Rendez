import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { register } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 59;

export default function VerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login: setAuthUser, pendingRegistration, setPendingRegistration } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const email = pendingRegistration?.email ?? '';
  const password = pendingRegistration?.password ?? '';

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleCodeChange(index: number, value: string) {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const next = [...code];
      digits.forEach((d, i) => {
        if (index + i < OTP_LENGTH) next[index + i] = d;
      });
      setCode(next);
      const focusIdx = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '');
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const fullCode = code.join('');
    if (fullCode.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const name = (email || '').split('@')[0] || 'User';
      const response = await register({ email: email || '', name, password: password || '' });
      setPendingRegistration(null);
      setAuthUser(response.user);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Verification Failed', message || 'Could not complete verification');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!pendingRegistration?.email || !pendingRegistration?.password) {
      router.back();
    }
  }, [pendingRegistration, router]);

  function handleResend() {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SEC);
    Alert.alert('Code sent', 'A new code has been sent to your number.');
  }

  const displayPhone = phone || 'your number';
  const fullCode = code.join('');

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VERIFICATION</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={32} color="#FFF" />
        </View>

        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.instruction}>
          We've sent a 6-digit code to <Text style={styles.phoneHighlight}>{displayPhone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(r) => { inputRefs.current[index] = r; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(v) => handleCodeChange(index, v)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={6}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, (fullCode.length !== OTP_LENGTH || loading) && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={fullCode.length !== OTP_LENGTH || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>VERIFY</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendWrap}>
          <Text style={styles.resendPrompt}>Didn't receive a code?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendCooldown > 0}
            style={styles.resendButton}
          >
            <Text style={[styles.resendText, resendCooldown > 0 && styles.resendTextDisabled]}>
              RESEND CODE
            </Text>
            {resendCooldown > 0 && (
              <Text style={styles.resendTimer}>
                ({String(Math.floor(resendCooldown / 60)).padStart(2, '0')}:
                {String(resendCooldown % 60).padStart(2, '0')})
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
  headerSpacer: { width: 40 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instruction: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: colors.light.text,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 64,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    padding: 0,
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  verifyButtonDisabled: { opacity: 0.5 },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#FFF',
  },
  resendWrap: {
    alignItems: 'center',
    gap: 8,
  },
  resendPrompt: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  resendTextDisabled: {
    color: colors.light.textTertiary,
  },
  resendTimer: {
    fontSize: 14,
    color: colors.light.textTertiary,
  },
});
