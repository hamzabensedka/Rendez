import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../application/providers';
import api from '../../../shared/lib/api';
import { colors, spacing, typography, radius, shadows } from '@planity/ui';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: {
    id: string;
    name: string;
  };
  staff: {
    id: string;
    name: string;
  } | null;
}

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadAppointments() {
    try {
      const response = await api.get('/appointments/me?upcoming=true');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
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
    switch (status.toLowerCase()) {
      case 'confirmed':
        return colors.light.success;
      case 'pending':
        return '#FF9500';
      case 'cancelled':
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
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
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
        renderItem={({ item }) => {
          const startDate = new Date(item.startAtUtc);
          const statusColor = getStatusColor(item.status);

          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.cardTitle}>{item.business.name}</Text>
                  {item.staff && (
                    <Text style={styles.cardStaff}>with {item.staff.name}</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <Text style={[styles.cardStatus, { color: statusColor }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardTimeContainer}>
                <Text style={styles.timeIcon}>🕐</Text>
                <View style={styles.timeInfo}>
                  <Text style={styles.cardDate}>
                    {startDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.cardTime}>
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No upcoming bookings</Text>
            <Text style={styles.emptySubtext}>Book an appointment to see it here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing['3xl'],
    backgroundColor: colors.light.surface,
    ...shadows.sm,
  },
  title: {
    ...typography.largeTitle,
    color: colors.light.text,
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
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
    ...typography.title3,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  cardStaff: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  cardStatus: {
    ...typography.footnote,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  timeIcon: {
    fontSize: 20,
  },
  timeInfo: {
    flex: 1,
  },
  cardDate: {
    ...typography.headline,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  cardTime: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  empty: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.title3,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
});


