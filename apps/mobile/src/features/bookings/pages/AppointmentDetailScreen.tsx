import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { AppointmentStatus, getAppointmentStatusLabel } from '@planity/shared';
import { useAuth } from '../../../application/providers';
import api from '../../../shared/lib/api';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: { id: string; name: string };
  staff: { id: string; name: string } | null;
  location?: { address?: string } | null;
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

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    if (id) loadAppointment();
  }, [id, user]);

  async function loadAppointment() {
    if (!id) return;
    setError(null);
    try {
      const response = await api.get(`/appointments/${id}`);
      setAppointment(response.data);
    } catch {
      setError('Could not load appointment.');
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.light.accent} />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text variant="body" color={colors.light.accent}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text variant="body" color={colors.light.textSecondary}>
            {error || 'Appointment not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const startDate = new Date(appointment.startAtUtc);
  const endDate = new Date(appointment.endAtUtc);
  const statusColor = getStatusColor(appointment.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="body" color={colors.light.accent}>Back</Text>
        </TouchableOpacity>
        <Text variant="title3" style={styles.headerTitle}>Appointment</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text variant="footnote" weight="600" style={{ color: statusColor }}>
            {getAppointmentStatusLabel(appointment.status)}
          </Text>
        </View>
        <Text variant="title1" style={styles.businessName}>{appointment.business.name}</Text>
        {appointment.staff && (
          <Text variant="body" color={colors.light.textSecondary} style={styles.staff}>
            with {appointment.staff.name}
          </Text>
        )}
        <View style={styles.card}>
          <Text variant="footnote" color={colors.light.textSecondary}>Date</Text>
          <Text variant="headline" style={styles.cardValue}>
            {startDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.card}>
          <Text variant="footnote" color={colors.light.textSecondary}>Time</Text>
          <Text variant="headline" style={styles.cardValue}>
            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
            {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {appointment.location?.address && (
          <View style={styles.card}>
            <Text variant="footnote" color={colors.light.textSecondary}>Address</Text>
            <Text variant="body" style={styles.cardValue}>{appointment.location.address}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backBtn: {
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  businessName: {
    marginBottom: spacing.xs,
  },
  staff: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardValue: {
    marginTop: spacing.xs,
  },
});
