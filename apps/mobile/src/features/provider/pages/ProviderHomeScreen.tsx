import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Badge } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';
import {
  useProviderAppointments,
  useTransitionAppointment,
} from '../../../application/query/hooks';

const STATUS_FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'BOOKED', label: 'BOOKED' },
  { key: 'COMPLETED', label: 'DONE' },
  { key: 'CANCELLED', label: 'CANCELLED' },
] as const;

function formatSlot(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProviderHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const businessId = user?.providerProfile?.businessId ?? undefined;
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    data: appointments = [],
    isPending,
    isError,
  } = useProviderAppointments(businessId, statusFilter);
  const transition = useTransitionAppointment(businessId);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PROVIDER</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>YOUR SCHEDULE</Text>
        <Text style={styles.headline}>Appointments</Text>

        <View style={styles.quickLinks}>
          <Button
            title="SCHEDULE"
            variant="outline"
            size="sm"
            onPress={() => router.push('/(main)/provider-portal/schedule')}
          />
          <Button
            title="STAFF"
            variant="outline"
            size="sm"
            onPress={() => router.push('/(main)/provider-portal/staff')}
          />
        </View>

        {/* Status filter pills */}
        <View style={styles.filters}>
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterPill, statusFilter === filter.key && styles.filterPillActive]}
              onPress={() => setStatusFilter(filter.key)}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${filter.label}`}
            >
              <Text
                style={
                  statusFilter === filter.key ? styles.filterPillActiveText : styles.filterPillText
                }
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isPending ? (
          <ActivityIndicator size="large" color={THEME.colors.primary} style={styles.center} />
        ) : isError ? (
          <Text style={styles.emptyText}>Could not load appointments.</Text>
        ) : appointments.length === 0 ? (
          <Text style={styles.emptyText}>No appointments for this filter.</Text>
        ) : (
          <View style={styles.list}>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Badge label={(appointment.status ?? '').toUpperCase()} />
                  <Text style={styles.slotTime}>{formatSlot(appointment.startAtUtc)}</Text>
                </View>
                <Text style={styles.clientName}>{appointment.clientUser?.name ?? 'Walk-in'}</Text>
                <Text style={styles.serviceLine}>
                  {(appointment.appointmentItems ?? [])
                    .map((item) => item.serviceVariant?.name)
                    .filter(Boolean)
                    .join(' · ') || 'Service details at check-in'}
                </Text>

                {appointment.status === 'BOOKED' && (
                  <View style={styles.actions}>
                    <Button
                      title="COMPLETE"
                      size="sm"
                      loading={transition.isPending}
                      onPress={() =>
                        transition.mutate({ appointmentId: appointment.id, status: 'COMPLETED' })
                      }
                    />
                    <Button
                      title="NO-SHOW"
                      size="sm"
                      variant="secondary"
                      onPress={() =>
                        transition.mutate({ appointmentId: appointment.id, status: 'NO_SHOW' })
                      }
                    />
                    <Button
                      title="CANCEL"
                      size="sm"
                      variant="outline"
                      onPress={() =>
                        transition.mutate({
                          appointmentId: appointment.id,
                          status: 'CANCELLED',
                          reason: 'cancelled_by_provider',
                        })
                      }
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.surface },
  headerContainer: { backgroundColor: `${THEME.colors.surface}CC` },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onSurface,
  },
  content: { padding: THEME.spacing.lg, paddingBottom: THEME.spacing['3xl'] },
  sectionLabel: {
    fontSize: THEME.typography.caption.fontSize,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.outline,
    marginBottom: THEME.spacing.xs,
  },
  headline: {
    fontSize: THEME.typography.display.fontSize,
    fontWeight: THEME.typography.display.fontWeight,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
  },
  quickLinks: { flexDirection: 'row', gap: THEME.spacing.sm, marginBottom: THEME.spacing.lg },
  filters: { flexDirection: 'row', gap: THEME.spacing.sm, marginBottom: THEME.spacing.lg },
  filterPill: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs + 2,
    borderRadius: 9999,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  filterPillActive: { backgroundColor: THEME.colors.primary },
  filterPillText: { color: THEME.colors.onSurface, fontSize: THEME.typography.caption.fontSize },
  filterPillActiveText: {
    color: THEME.colors.onPrimary,
    fontSize: THEME.typography.caption.fontSize,
  },
  list: { gap: THEME.spacing.md },
  card: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: THEME.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  slotTime: { color: THEME.colors.onSurfaceVariant, fontSize: THEME.typography.caption.fontSize },
  clientName: {
    fontSize: THEME.typography.title.fontSize,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  serviceLine: { color: THEME.colors.onSurfaceVariant, marginBottom: THEME.spacing.md },
  actions: { flexDirection: 'row', gap: THEME.spacing.sm },
  center: { marginTop: THEME.spacing['2xl'] },
  emptyText: {
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: THEME.spacing.xl,
  },
});
