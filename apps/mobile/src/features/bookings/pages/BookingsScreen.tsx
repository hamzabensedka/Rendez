import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { AppointmentStatus, getAppointmentStatusLabel } from '@planity/shared';
import { useAuth } from '../../../application/providers';
import { ProfileButton } from '../../search/components/ProfileButton';
import api from '../../../shared/lib/api';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: { id: string; name: string };
  staff: { id: string; name: string } | null;
}

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadAppointments() {
    setLoadError(null);
    try {
      const response = await api.get('/appointments/me?upcoming=true');
      setAppointments(response.data);
    } catch {
      setLoadError('Could not load bookings. Pull to try again.');
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadAppointments();
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case AppointmentStatus.BOOKED:
        return colors.light.success;
      case AppointmentStatus.CANCELLED:
        return colors.light.error;
      case AppointmentStatus.COMPLETED:
        return colors.light.textSecondary;
      case AppointmentStatus.NO_SHOW:
        return colors.light.error;
      default:
        return colors.light.textSecondary;
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="title2" style={styles.headerTitle}>
            My bookings
          </Text>
          <ProfileButton />
        </View>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.light.accent}
            />
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text variant="headline" style={styles.sectionTitle}>
                Upcoming
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const startDate = new Date(item.startAtUtc);
            const statusColor = getStatusColor(item.status);

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/(tabs)/bookings/[id]', params: { id: item.id } })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text variant="title3" style={styles.cardTitle}>
                      {item.business.name}
                    </Text>
                    {item.staff && (
                      <Text variant="body" color={colors.light.textSecondary}>
                        with {item.staff.name}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text variant="footnote" weight="600" style={[styles.cardStatus, { color: statusColor }]}>
                      {getAppointmentStatusLabel(item.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardTimeContainer}>
                  <View style={styles.timeInfo}>
                    <Text variant="headline">
                      {startDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text variant="body" color={colors.light.textSecondary}>
                      {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="title1" style={styles.emptyIcon}>
                📅
              </Text>
              <Text variant="title3" style={styles.emptyText}>
                {loadError || 'No upcoming bookings'}
              </Text>
              <Text variant="body" color={colors.light.textSecondary} style={styles.emptySubtext}>
                {loadError ? 'Pull down to refresh' : 'Book an appointment to see it here'}
              </Text>
            </View>
          }
        />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    marginBottom: 0,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  cardStatus: {
    textTransform: 'capitalize',
  },
  cardTimeContainer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  timeInfo: {
    flex: 1,
  },
  empty: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    textAlign: 'center',
  },
});
