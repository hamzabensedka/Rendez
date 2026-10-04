import React, { useEffect, useMemo, useState } from 'react';
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
  useAvailabilityRules,
  useReplaceAvailabilityRules,
  useTimeOffs,
  useCreateTimeOff,
  useDeleteTimeOff,
} from '../../../application/query/hooks';
import { ProviderChrome } from '../components/ProviderChrome';
import { AtelierButton } from '../components/AtelierButton';
import { AtelierInput } from '../components/AtelierInput';
import { formatHumanRange } from '../providerFormat';
import { providerTheme as T } from '../providerTheme';

const DAYS = [
  { key: 1, label: 'Monday' },
  { key: 2, label: 'Tuesday' },
  { key: 3, label: 'Wednesday' },
  { key: 4, label: 'Thursday' },
  { key: 5, label: 'Friday' },
  { key: 6, label: 'Saturday' },
  { key: 0, label: 'Sunday' },
];

interface DayHours {
  dayOfWeek: number;
  startTimeLocal: string;
  endTimeLocal: string;
  closed: boolean;
}

function toWeek(rules: { dayOfWeek: number; startTimeLocal: string; endTimeLocal: string }[]): DayHours[] {
  return DAYS.map((day) => {
    const match = rules.find((rule) => rule.dayOfWeek === day.key);
    if (!match) {
      return { dayOfWeek: day.key, startTimeLocal: '09:00', endTimeLocal: '18:00', closed: true };
    }
    return {
      dayOfWeek: day.key,
      startTimeLocal: match.startTimeLocal,
      endTimeLocal: match.endTimeLocal,
      closed: false,
    };
  });
}

export default function ScheduleEditorScreen() {
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const businessId = user?.providerProfile?.businessId ?? undefined;

  const rulesQuery = useAvailabilityRules(businessId);
  const replaceRules = useReplaceAvailabilityRules(businessId);
  const timeOffsQuery = useTimeOffs(businessId);
  const createOff = useCreateTimeOff(businessId);
  const deleteOff = useDeleteTimeOff(businessId);

  const [week, setWeek] = useState<DayHours[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (rulesQuery.data) setWeek(toWeek(rulesQuery.data));
  }, [rulesQuery.data]);

  const updateDay = (dayOfWeek: number, patch: Partial<DayHours>) => {
    setSaved(false);
    setWeek((current) =>
      current.map((row) => (row.dayOfWeek === dayOfWeek ? { ...row, ...patch } : row))
    );
  };

  const payload = useMemo(
    () =>
      week
        .filter((row) => !row.closed)
        .map((row) => ({
          dayOfWeek: row.dayOfWeek,
          startTimeLocal: row.startTimeLocal,
          endTimeLocal: row.endTimeLocal,
        })),
    [week]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView edges={['top', 'left', 'right']}>
        <ProviderChrome title="Hours" subtitle="When the floor is open" />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {rulesQuery.isPending ? (
          <ActivityIndicator color={T.colors.ink} />
        ) : (
          <View>
            {week.map((row) => {
              const label = DAYS.find((d) => d.key === row.dayOfWeek)?.label ?? '';
              return (
                <View key={row.dayOfWeek} style={styles.dayRow}>
                  <Pressable
                    onPress={() => updateDay(row.dayOfWeek, { closed: !row.closed })}
                    style={styles.dayNameHit}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}, ${row.closed ? 'closed' : 'open'}`}
                  >
                    <Text style={styles.dayName}>{label}</Text>
                  </Pressable>
                  {row.closed ? (
                    <Text style={styles.closed}>Closed</Text>
                  ) : (
                    <View style={styles.times}>
                      <AtelierInput
                        value={row.startTimeLocal}
                        onChangeText={(text) => updateDay(row.dayOfWeek, { startTimeLocal: text })}
                      />
                      <Text style={styles.dash}>–</Text>
                      <AtelierInput
                        value={row.endTimeLocal}
                        onChangeText={(text) => updateDay(row.dayOfWeek, { endTimeLocal: text })}
                      />
                    </View>
                  )}
                </View>
              );
            })}
            <AtelierButton
              title={replaceRules.isPending ? 'Saving' : saved ? 'Saved' : 'Save week'}
              loading={replaceRules.isPending}
              onPress={() => {
                replaceRules.mutate(payload, { onSuccess: () => setSaved(true) });
              }}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        <Text style={[styles.sectionLabel, styles.gapTop]}>Time away</Text>
        {(timeOffsQuery.data ?? []).length === 0 ? (
          <Text style={styles.hint}>Nothing booked off.</Text>
        ) : (
          (timeOffsQuery.data ?? []).map((off) => (
            <View key={off.id} style={styles.offCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.offDates}>{formatHumanRange(off.startAtUtc, off.endAtUtc)}</Text>
                {off.reason ? <Text style={styles.hint}>{off.reason}</Text> : null}
              </View>
              <Pressable
                onPress={() => deleteOff.mutate(off.id)}
                accessibilityRole="button"
                accessibilityLabel="Remove this time away"
              >
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}

        <TimeOffForm onSubmit={(dto) => createOff.mutate(dto)} submitting={createOff.isPending} />
      </ScrollView>
    </View>
  );
}

function TimeOffForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (dto: { startAtUtc: string; endAtUtc: string; reason?: string }) => void;
  submitting: boolean;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  return (
    <View style={styles.offForm}>
      <Text style={styles.sectionLabel}>Add time away</Text>
      <View style={styles.fromTo}>
        <View style={styles.fromToCol}>
          <AtelierInput value={start} onChangeText={setStart} placeholder="From (e.g. 12 Oct)" />
        </View>
        <View style={styles.fromToCol}>
          <AtelierInput value={end} onChangeText={setEnd} placeholder="To (e.g. 15 Oct)" />
        </View>
      </View>
      <AtelierInput value={reason} onChangeText={setReason} placeholder="Reason" />
      <AtelierButton
        title="Add"
        loading={submitting}
        onPress={() => {
          if (!start || !end) return;
          const startAt = new Date(start.replace(' ', 'T'));
          const endAt = new Date(end.replace(' ', 'T'));
          if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return;
          onSubmit({
            startAtUtc: startAt.toISOString(),
            endAtUtc: endAt.toISOString(),
            ...(reason ? { reason } : {}),
          });
          setStart('');
          setEnd('');
          setReason('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.paper },
  content: { paddingHorizontal: 16, paddingTop: 32 },
  sectionLabel: {
    fontFamily: T.font.label,
    fontSize: T.type.label.fontSize,
    letterSpacing: T.type.label.letterSpacing,
    color: T.colors.muted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  gapTop: { marginTop: 40 },
  hint: { color: T.colors.muted, fontSize: 14, fontFamily: T.font.body },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  dayNameHit: { width: 110 },
  dayName: { fontFamily: T.font.medium, fontSize: 16, lineHeight: 24, color: T.colors.ink },
  closed: { fontFamily: T.font.medium, fontSize: 13, lineHeight: 16, color: T.colors.muted, marginLeft: 'auto' },
  times: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  dash: { color: T.colors.ink, fontFamily: T.font.medium, fontSize: 13 },
  offCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.card,
    padding: 16,
    marginBottom: 12,
  },
  offDates: { fontFamily: T.font.display, fontSize: 16, lineHeight: 24, color: T.colors.ink },
  remove: { fontFamily: T.font.body, fontSize: 14, lineHeight: 20, color: T.colors.muted },
  offForm: {
    marginTop: 24,
    gap: 24,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.card,
    padding: 24,
  },
  fromTo: { flexDirection: 'row', gap: 16 },
  fromToCol: { flex: 1 },
});
