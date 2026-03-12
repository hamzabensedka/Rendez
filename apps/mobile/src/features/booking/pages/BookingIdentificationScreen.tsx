import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatSummaryDate(isoDate: string): string {
  const d = new Date(isoDate);
  const dayName = DAY_NAMES[d.getDay()];
  const month = MONTH_NAMES[d.getMonth()];
  const date = d.getDate();
  const suffix = date === 1 || date === 21 || date === 31 ? 'st' : date === 2 || date === 22 ? 'nd' : date === 3 || date === 23 ? 'rd' : 'th';
  return `${dayName}, ${month} ${date}${suffix}`;
}

function formatSummaryTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function BookingIdentificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    selectedSlot,
    existingServices,
    businessId,
    businessName,
  } = useLocalSearchParams<{
    selectedSlot: string;
    existingServices: string;
    businessId: string;
    businessName?: string;
  }>();

  const servicesLabel = React.useMemo(() => {
    if (!existingServices) return '';
    try {
      const arr = JSON.parse(existingServices) as Array<{ name: string }>;
      return Array.isArray(arr) ? arr.map((s) => s.name).join(', ') : '';
    } catch {
      return '';
    }
  }, [existingServices]);

  const dateLabel = selectedSlot ? formatSummaryDate(selectedSlot) : '';
  const timeLabel = selectedSlot ? formatSummaryTime(selectedSlot) : '';

  function handleModify() {
    router.back();
  }

  function handleLogIn() {
    router.replace('/(auth)/login');
  }

  function handleCreateAccount() {
    router.push('/(tabs)/booking/register');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PLANITY</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>AUTHENTICATION</Text>

        {/* Summary card - unchanged */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionLabel}>SUMMARY</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <View style={styles.calendarIconWrap}>
                <Ionicons name="calendar-outline" size={22} color={colors.light.text} />
              </View>
              <View style={styles.summaryText}>
                <Text style={styles.summaryDate}>{dateLabel}</Text>
                <Text style={styles.summaryTime}>{timeLabel}</Text>
                {servicesLabel ? (
                  <Text style={styles.summaryServices}>{servicesLabel}</Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity onPress={handleModify} style={styles.modifyButton}>
              <Text style={styles.modifyText}>MODIFY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.authSection}>
          <Text style={styles.authHeading}>New to the app?</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAccount} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>CREATE MY ACCOUNT</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.authHeading}>Already have an account?</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogIn} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 0.5,
    color: colors.light.text,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  summarySection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: 0,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  calendarIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    flex: 1,
  },
  summaryDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 2,
  },
  summaryTime: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  summaryServices: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  modifyButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  modifyText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
    textDecorationLine: 'underline',
  },
  authSection: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  authHeading: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 0.5,
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.text,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    width: '100%',
    borderRadius: 999,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#FFF',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.border,
  },
  orText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.text,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    width: '100%',
    borderRadius: 999,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
});
