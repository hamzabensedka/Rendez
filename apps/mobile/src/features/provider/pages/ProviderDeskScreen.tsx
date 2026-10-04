import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import {
  useProviderAppointments,
  useTransitionAppointment,
  type ProviderAppointment,
} from '../../../application/query/hooks';
import { AppointmentTicket } from '../components/AppointmentTicket';
import { ProviderChrome, StatusPill } from '../components/ProviderChrome';
import { AtelierButton } from '../components/AtelierButton';
import { endOfLocalDay, startOfLocalDay } from '../calendarLayout';
import { formatClock, formatHeadlineDate, serviceLine, statusLabel } from '../providerFormat';
import { deskStats, nextUp, queueWithout } from '../deskModel';
import { providerTheme as T } from '../providerTheme';

export default function ProviderDeskScreen() {
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const businessId = user?.providerProfile?.businessId ?? undefined;
  const day = useMemo(() => startOfLocalDay(new Date()), []);
  const range = useMemo(
    () => ({ from: day.toISOString(), to: endOfLocalDay(day).toISOString(), limit: 100 }),
    [day]
  );

  const { data: appointments = [], isPending, isError } = useProviderAppointments(
    businessId,
    'all',
    range
  );
  const transition = useTransitionAppointment(businessId);
  const [selected, setSelected] = useState<ProviderAppointment | null>(null);

  const stats = useMemo(() => deskStats(appointments), [appointments]);
  const upcoming = useMemo(() => nextUp(appointments), [appointments]);
  const queue = useMemo(
    () => queueWithout(appointments, upcoming?.id),
    [appointments, upcoming]
  );

  function complete(apt: ProviderAppointment) {
    transition.mutate({ appointmentId: apt.id, status: 'COMPLETED' });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView edges={['top', 'left', 'right']}>
        <ProviderChrome
          title="Desk"
          subtitle={`${formatHeadlineDate(day).split(',')[0]} · ${stats.remaining} remaining`}
        />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: selected ? 12 : bottomInset + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.counters}>
          <Counter label="Remaining" value={stats.remaining} />
          <View style={styles.counterRule} />
          <Counter label="Done" value={stats.done} />
          <View style={styles.counterRule} />
          <Counter label="Late" value={stats.late} alert />
        </View>

        {isPending ? (
          <ActivityIndicator color={T.colors.ink} style={{ marginTop: 32 }} />
        ) : isError ? (
          <Text style={styles.empty}>Could not load the desk.</Text>
        ) : !upcoming && queue.length === 0 ? (
          <Text style={styles.empty}>The floor is quiet.</Text>
        ) : (
          <>
            {upcoming ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Up next</Text>
                <View style={styles.hero}>
                  <Text style={styles.heroTitle}>
                    {formatClock(upcoming.startAtUtc)} {upcoming.clientUser?.name ?? 'Walk-in'}
                  </Text>
                  <Text style={styles.heroMeta}>
                    {serviceLine(upcoming)}
                    {upcoming.staff?.name ? ` · ${upcoming.staff.name}` : ''}
                  </Text>
                  {upcoming.status === 'BOOKED' ? (
                    <AtelierButton
                      title="Complete"
                      loading={transition.isPending}
                      onPress={() => complete(upcoming)}
                      style={{ marginTop: 12 }}
                    />
                  ) : null}
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Queue</Text>
              {queue.map((apt) => {
                const late =
                  apt.status === 'BOOKED' && new Date(apt.startAtUtc).getTime() < Date.now();
                const tone = apt.status === 'COMPLETED' ? 'done' : late ? 'late' : 'neutral';
                return (
                  <Pressable
                    key={apt.id}
                    onPress={() => setSelected(apt)}
                    style={styles.row}
                    accessibilityRole="button"
                    accessibilityLabel={`${apt.clientUser?.name ?? 'Client'} at ${formatClock(apt.startAtUtc)}`}
                  >
                    <Text style={styles.rowTime}>{formatClock(apt.startAtUtc)}</Text>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowName}>{apt.clientUser?.name ?? 'Walk-in'}</Text>
                      <Text style={styles.rowMeta}>
                        {serviceLine(apt)}
                        {apt.staff?.name ? ` · ${apt.staff.name}` : ''}
                      </Text>
                    </View>
                    <StatusPill
                      label={late && apt.status === 'BOOKED' ? 'Late' : statusLabel(apt.status)}
                      tone={tone}
                    />
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {selected ? (
        <View style={{ paddingBottom: bottomInset }}>
          <AppointmentTicket
            appointment={selected}
            busy={transition.isPending}
            onClose={() => setSelected(null)}
            onComplete={() => {
              complete(selected);
              setSelected(null);
            }}
            onNoShow={() =>
              transition.mutate(
                { appointmentId: selected.id, status: 'NO_SHOW' },
                { onSuccess: () => setSelected(null) }
              )
            }
            onCancel={() =>
              transition.mutate(
                {
                  appointmentId: selected.id,
                  status: 'CANCELLED',
                  reason: 'cancelled_by_provider',
                },
                { onSuccess: () => setSelected(null) }
              )
            }
          />
        </View>
      ) : null}
    </View>
  );
}

function Counter({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>
      <Text style={[styles.counterValue, alert && styles.alert]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper },
  counters: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
  },
  counter: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  counterRule: { width: StyleSheet.hairlineWidth, backgroundColor: T.colors.rule },
  counterLabel: {
    fontFamily: T.font.label,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.colors.muted,
    textTransform: 'uppercase',
  },
  counterValue: {
    marginTop: 4,
    fontFamily: T.font.display,
    fontSize: 28,
    color: T.colors.ink,
  },
  alert: { color: T.colors.now },
  section: { paddingHorizontal: 16, paddingTop: 28 },
  sectionLabel: {
    fontFamily: T.font.label,
    fontSize: T.type.label.fontSize,
    letterSpacing: T.type.label.letterSpacing,
    color: T.colors.muted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  hero: {
    backgroundColor: T.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    borderRadius: T.radius.card,
    padding: 16,
  },
  heroTitle: {
    fontFamily: T.font.display,
    fontSize: 22,
    color: T.colors.ink,
  },
  heroMeta: {
    marginTop: 4,
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  rowTime: {
    width: 52,
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
    fontVariant: ['tabular-nums'],
  },
  rowBody: { flex: 1 },
  rowName: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  rowMeta: { fontFamily: T.font.body, fontSize: 13, color: T.colors.muted, marginTop: 2 },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    color: T.colors.muted,
    fontFamily: T.font.body,
    fontSize: 16,
  },
});
