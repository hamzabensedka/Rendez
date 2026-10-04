import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import {
  useProviderAppointments,
  useTransitionAppointment,
  useStaffList,
  type ProviderAppointment,
} from '../../../application/query/hooks';
import { TeamDayGrid } from '../components/TeamDayGrid';
import { AppointmentTicket } from '../components/AppointmentTicket';
import { IconHit, ProviderChrome } from '../components/ProviderChrome';
import { addDays, endOfLocalDay, startOfLocalDay } from '../calendarLayout';
import { formatClock, formatHeadlineDate, serviceLine } from '../providerFormat';
import { nextUp } from '../deskModel';
import { providerTheme as T } from '../providerTheme';

export default function ProviderHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const businessId = user?.providerProfile?.businessId ?? undefined;

  const [day, setDay] = useState(() => startOfLocalDay(new Date()));
  const [selected, setSelected] = useState<ProviderAppointment | null>(null);

  const range = useMemo(
    () => ({
      from: startOfLocalDay(day).toISOString(),
      to: endOfLocalDay(day).toISOString(),
      limit: 100,
    }),
    [day]
  );

  const staffQuery = useStaffList(businessId, false);
  const {
    data: appointments = [],
    isPending,
    isError,
  } = useProviderAppointments(businessId, 'all', range);
  const transition = useTransitionAppointment(businessId);

  const staff = (staffQuery.data ?? []).filter((s) => s.isActive);
  const upcoming = useMemo(() => nextUp(appointments), [appointments]);

  function shiftDay(delta: number) {
    setSelected(null);
    setDay((current) => addDays(current, delta));
  }

  function mutateStatus(status: string, reason?: string) {
    if (!selected) return;
    transition.mutate(
      { appointmentId: selected.id, status, reason },
      { onSuccess: () => setSelected(null) }
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.dateNav}>
          <IconHit label="Previous day" onPress={() => shiftDay(-1)}>
            <Ionicons name="chevron-back" size={16} color={T.colors.muted} />
          </IconHit>
          <IconHit label="Next day" onPress={() => shiftDay(1)}>
            <Ionicons name="chevron-forward" size={16} color={T.colors.muted} />
          </IconHit>
        </View>
        <ProviderChrome
          title={formatHeadlineDate(day)}
          subtitle={
            upcoming
              ? `Next · ${formatClock(upcoming.startAtUtc)} ${upcoming.clientUser?.name ?? 'Walk-in'} · ${serviceLine(upcoming)}`
              : 'The floor is quiet'
          }
          actions={
            <>
              <IconHit
                label="Today"
                onPress={() => {
                  setSelected(null);
                  setDay(startOfLocalDay(new Date()));
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={T.colors.ink} />
              </IconHit>
              <IconHit label="Hours" onPress={() => router.push('/(main)/provider-portal/schedule')}>
                <Ionicons name="time-outline" size={18} color={T.colors.ink} />
              </IconHit>
            </>
          }
        />
      </SafeAreaView>

      <View style={styles.gridWrap}>
        {isPending || staffQuery.isPending ? (
          <ActivityIndicator size="large" color={T.colors.ink} style={styles.center} />
        ) : isError ? (
          <Text style={styles.emptyText}>Could not load the floor.</Text>
        ) : (
          <TeamDayGrid
            day={day}
            staff={staff}
            appointments={appointments}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        )}
      </View>

      {selected ? (
        <View style={{ paddingBottom: bottomInset }}>
          <AppointmentTicket
            appointment={selected}
            busy={transition.isPending}
            onClose={() => setSelected(null)}
            onComplete={() => mutateStatus('COMPLETED')}
            onNoShow={() => mutateStatus('NO_SHOW')}
            onCancel={() => mutateStatus('CANCELLED', 'cancelled_by_provider')}
          />
        </View>
      ) : (
        <View style={{ height: bottomInset }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper },
  headerContainer: { backgroundColor: T.colors.paper },
  dateNav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  gridWrap: { flex: 1 },
  center: { marginTop: 48 },
  emptyText: {
    color: T.colors.muted,
    textAlign: 'center',
    marginTop: 32,
    fontFamily: T.font.body,
  },
});
