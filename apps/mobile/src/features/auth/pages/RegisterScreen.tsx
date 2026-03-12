import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../application/providers';

const COUNTRY_OPTIONS = [
  { code: 'US', label: 'US' },
  { code: 'UK', label: 'UK' },
  { code: 'FR', label: 'FR' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { setPendingRegistration } = useAuth();
  const isBookingFlow = Array.isArray(segments) && segments[0] === '(tabs)' && segments[1] === 'booking';
  const [country, setCountry] = useState('US');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmitForVerification() {
    const trimmedEmail = email.trim();
    const trimmedMobile = mobile.trim().replace(/\s/g, '');
    if (!trimmedEmail || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (!trimmedMobile || trimmedMobile.length < 8) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }
    const displayPhone = trimmedMobile.startsWith('+') ? trimmedMobile : `+33 ${trimmedMobile.replace(/(\d{2})(?=\d)/g, '$1 ')}`;
    setPendingRegistration({ email: trimmedEmail, password });
    if (isBookingFlow) {
      router.push({ pathname: '/(tabs)/booking/verification', params: { phone: displayPhone } });
    } else {
      router.replace({ pathname: '/(auth)/verification', params: { phone: displayPhone } });
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IDENTIFICATION</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Booking Progress</Text>
          <Text style={styles.progressStep}>3 of 4</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>Create your account</Text>
          <Text style={styles.formSubtitle}>
            Enter your details to finalize your beauty appointment.
          </Text>

          <View style={styles.formRow}>
            <View style={[styles.fieldWrap, styles.countryField]}>
              <Text style={styles.label}>COUNTRY</Text>
              <View style={styles.selectWrap}>
                <TouchableOpacity
                  style={styles.selectTouch}
                  onPress={() => {
                    const idx = COUNTRY_OPTIONS.findIndex((o) => o.code === country);
                    const next = COUNTRY_OPTIONS[(idx + 1) % COUNTRY_OPTIONS.length];
                    setCountry(next.code);
                  }}
                >
                  <Text style={styles.selectText}>{country}</Text>
                  <Ionicons name="chevron-down" size={20} color={colors.light.text} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.fieldWrap, styles.fieldFlex]}>
              <Text style={styles.label}>MOBILE NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="000-000-0000"
                placeholderTextColor={colors.light.textTertiary}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={14}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.light.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.inputPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.light.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.light.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitForVerification}
          >
            <Text style={styles.submitButtonText}>CREATE MY ACCOUNT</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>LOG IN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
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
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  headerSpacer: { width: 40 },
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },
  progressStep: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.light.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.light.text,
  },
  keyboardView: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.xl,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  fieldWrap: {
    marginBottom: spacing.lg,
  },
  countryField: { width: 96 },
  fieldFlex: { flex: 1 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  selectWrap: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceSecondary,
    justifyContent: 'center',
  },
  selectTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.text,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceSecondary,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.light.text,
  },
  passwordWrap: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#FFF',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  loginPrompt: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
    letterSpacing: 1,
    color: colors.light.text,
  },
});
