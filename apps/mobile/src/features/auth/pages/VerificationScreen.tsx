import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { register } from '../../../shared/lib/auth';
import { useAuth } from '../../../application/providers';

export default function VerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login: setAuthUser, pendingRegistration, setPendingRegistration } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const email = pendingRegistration?.email ?? '';
  const password = pendingRegistration?.password ?? '';

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pendingRegistration?.email || !pendingRegistration?.password) {
      router.back();
    }
  }, [pendingRegistration, router]);

  async function handleCreateAccount() {
    setLoading(true);
    try {
      const name = (email || '').split('@')[0] || 'User';
      const response = await register({ email: email || '', name, password: password || '' });
      setPendingRegistration(null);
      setAuthUser(response.user);
      router.replace('/(main)');
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      Alert.alert('Registration Failed', message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  }

  const displayPhone = phone || 'your number';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBack}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIRM DETAILS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="person-outline" size={32} color="#FFF" />
        </View>

        <Text style={styles.title}>Confirm your details</Text>
        <Text style={styles.instruction}>
          Review and create your account. We'll use this information for your booking.
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {email || '—'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {displayPhone}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateAccount}
          disabled={loading}
          accessibilityLabel="Create my account"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.createButtonText}>CREATE MY ACCOUNT</Text>
          )}
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
  detailsCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: colors.light.text,
  },
  createButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#FFF',
  },
});
