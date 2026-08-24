import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { getAppointmentStatusLabel } from '@planity/shared';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';
import { useAppointmentsUpcomingQuery } from '../../../application/query/hooks';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: { id: string; name: string };
  staff: { id: string; name: string } | null;
  serviceName?: string;
}

interface BookingCardProps {
  appointment: Appointment;
  variant?: 'default' | 'outlined';
  onPress: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ appointment, variant = 'default', onPress }) => {
  const startDate = new Date(appointment.startAtUtc);
  const day = startDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const statusLabel = getAppointmentStatusLabel(appointment.status);

  const isDefault = variant === 'default';

  return (
    <TouchableOpacity
      style={[styles.card, isDefault ? styles.cardDefault : styles.cardOutlined]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{statusLabel.toUpperCase()}</Text>
          </View>

          {/* Service Name */}
          <Text style={styles.serviceName}>
            {appointment.serviceName || appointment.business.name}
          </Text>

          {/* Business Name */}
          <Text style={styles.businessName}>{appointment.business.name}</Text>
        </View>

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateNumber}>{day}</Text>
          <Text style={styles.dateMeta}>
            {month} · {time}
          </Text>
        </View>
      </View>

      {/* Staff Section */}
      <View style={[styles.staffSection, isDefault && styles.staffSectionDefault]}>
        <View style={styles.staffImageContainer}>
          <View style={styles.staffImagePlaceholder}>
            <Ionicons name="person" size={22} color={THEME.colors.onSurfaceVariant} />
          </View>
        </View>
        <View style={styles.staffInfo}>
          <Text style={styles.staffRole}>YOUR STYLIST</Text>
          <Text style={styles.staffName}>{appointment.staff?.name || 'To be assigned'}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={20} color={THEME.colors.outline} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();

  const {
    data: appointments = [],
    isPending: loading,
    isError,
    refetch,
    isFetching,
  } = useAppointmentsUpcomingQuery<Appointment>(user?.id);

  const loadError = isError ? 'Could not load bookings' : null;
  const refreshing = isFetching && !loading;

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, router]);

  async function onRefresh() {
    await refetch();
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Top App Bar */}
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ATELIER</Text>
          <TouchableOpacity
            style={styles.headerAvatar}
            onPress={() => router.push('/(main)/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Ionicons name="person" size={18} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {/* Editorial Headline */}
        <View style={styles.editorialHeader}>
          <Text style={styles.sectionLabel}>ARCHIVE</Text>
          <Text style={styles.headline}>My bookings</Text>
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>UPCOMING APPOINTMENTS</Text>
            <Text style={styles.sectionHeaderCount}>
              {String(appointments.length).padStart(2, '0')} TOTAL
            </Text>
          </View>

          {appointments.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{loadError || 'No upcoming bookings'}</Text>
              <Text style={styles.emptySubtext}>
                {loadError ? 'Pull down to refresh' : 'Book an appointment to see it here'}
              </Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {appointments.map((appointment: Appointment, index: number) => (
                <BookingCard
                  key={appointment.id}
                  appointment={appointment}
                  variant={index === 1 ? 'outlined' : 'default'}
                  onPress={() =>
                    router.push({
                      pathname: '/(main)/bookings/[id]',
                      params: { id: appointment.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Past Visits Section */}
        <View style={[styles.section, styles.pastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>PAST VISITS</Text>
            <Text style={styles.sectionHeaderCount}>HISTORICAL</Text>
          </View>

          <View style={styles.empty}>
            <Text style={styles.emptySubtext}>Your visit history will appear here.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: `${THEME.colors.surface}CC`, // 80% opacity
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onSurface,
    textTransform: 'uppercase',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  editorialHeader: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  sectionLabel: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: THEME.typography.caption.fontWeight,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.outline,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing.sm,
  },
  headline: {
    fontSize: THEME.typography.display.fontSize,
    fontWeight: THEME.typography.display.fontWeight,
    letterSpacing: THEME.typography.display.letterSpacing,
    lineHeight: THEME.typography.display.lineHeight,
    color: THEME.colors.primary,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${THEME.colors.outlineVariant}33`, // 20% opacity
    marginBottom: THEME.spacing.lg,
  },
  sectionHeaderTitle: {
    fontSize: THEME.typography.label.fontSize - 1,
    fontWeight: '700',
    letterSpacing: 0.15,
    color: THEME.colors.primary,
    textTransform: 'uppercase',
  },
  sectionHeaderCount: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: THEME.typography.caption.fontWeight,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.outline,
    textTransform: 'uppercase',
  },
  cardsContainer: {
    gap: THEME.spacing.lg,
  },
  card: {
    padding: THEME.spacing.lg,
    borderRadius: 12,
  },
  cardDefault: {
    backgroundColor: THEME.colors.surfaceContainerLow,
  },
  cardOutlined: {
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: `${THEME.colors.outlineVariant}4D`, // 30% opacity
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.lg,
  },
  cardHeaderLeft: {
    flex: 1,
    paddingRight: THEME.spacing.md,
  },
  statusBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.sm + 4,
    paddingVertical: THEME.spacing.xs + 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  statusBadgeText: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: THEME.colors.onPrimary,
  },
  serviceName: {
    fontSize: THEME.typography.title.fontSize,
    fontWeight: '500',
    letterSpacing: -0.01,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  businessName: {
    fontSize: THEME.typography.body.fontSize - 2,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: THEME.colors.outline,
    textTransform: 'uppercase',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateNumber: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.02,
    color: THEME.colors.primary,
    lineHeight: 36,
  },
  dateMeta: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: THEME.colors.onSurface,
    textTransform: 'uppercase',
  },
  staffSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  staffSectionDefault: {
    borderTopWidth: 1,
    borderTopColor: `${THEME.colors.outlineVariant}1A`, // 10% opacity
  },
  staffImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  staffImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffInfo: {
    flex: 1,
  },
  staffRole: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: THEME.colors.outline,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  staffName: {
    fontSize: THEME.typography.body.fontSize - 2,
    fontWeight: '500',
    color: THEME.colors.onSurface,
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastSection: {
    opacity: 0.5,
    marginTop: THEME.spacing.xl,
  },
  empty: {
    padding: THEME.spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: THEME.typography.title.fontSize,
    fontWeight: '600',
    color: THEME.colors.onSurface,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtext: {
    fontSize: THEME.typography.body.fontSize,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
