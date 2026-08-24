import React, { useEffect, useState } from 'react';
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
import { Text, Button, Input } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';
import {
  useAvailabilityRules,
  useReplaceAvailabilityRules,
  useTimeOffs,
  useCreateTimeOff,
  useDeleteTimeOff,
} from '../../../application/query/hooks';

const DAYS = [
  { key: 1, label: 'MON' },
  { key: 2, label: 'TUE' },
  { key: 3, label: 'WED' },
  { key: 4, label: 'THU' },
  { key: 5, label: 'FRI' },
  { key: 6, label: 'SAT' },
  { key: 0, label: 'SUN' },
];

interface RuleDraft {
  dayOfWeek: number;
  startTimeLocal: string;
  endTimeLocal: string;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduleEditorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const businessId = user?.providerProfile?.businessId ?? undefined;

  const rulesQuery = useAvailabilityRules(businessId);
  const replaceRules = useReplaceAvailabilityRules(businessId);
  const timeOffsQuery = useTimeOffs(businessId);
  const createOff = useCreateTimeOff(businessId);
  const deleteOff = useDeleteTimeOff(businessId);

  const [drafts, setDrafts] = useState<RuleDraft[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (rulesQuery.data) {
      setDrafts(
        rulesQuery.data.map((rule) => ({
          dayOfWeek: rule.dayOfWeek,
          startTimeLocal: rule.startTimeLocal,
          endTimeLocal: rule.endTimeLocal,
        }))
      );
    }
  }, [rulesQuery.data]);

  const updateDraft = (index: number, patch: Partial<RuleDraft>) => {
    setDrafts((current) =>
      current.map((draft, i) => (i === index ? { ...draft, ...patch } : draft))
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SCHEDULE</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly rules */}
        <Text style={styles.sectionLabel}>WEEKLY HOURS</Text>
        {rulesQuery.isPending ? (
          <ActivityIndicator color={THEME.colors.primary} />
        ) : (
          <View style={styles.rulesList}>
            {drafts.length === 0 && (
              <Text style={styles.hint}>No weekly hours yet. Add your first window.</Text>
            )}
            {drafts.map((draft, index) => (
              <View key={index} style={styles.ruleRow}>
                <TouchableOpacity
                  onPress={() => updateDraft(index, { dayOfWeek: (draft.dayOfWeek + 1) % 7 })}
                  accessibilityRole="button"
                  accessibilityLabel={`Day ${DAYS.find((day) => day.key === draft.dayOfWeek)?.label}, tap to change`}
                >
                  <Text style={styles.dayBadge}>
                    {DAYS.find((day) => day.key === draft.dayOfWeek)?.label}
                  </Text>
                </TouchableOpacity>
                <Input
                  style={styles.timeInput}
                  value={draft.startTimeLocal}
                  onChangeText={(text) => updateDraft(index, { startTimeLocal: text })}
                  placeholder="09:00"
                />
                <Text style={styles.dash}>–</Text>
                <Input
                  style={styles.timeInput}
                  value={draft.endTimeLocal}
                  onChangeText={(text) => updateDraft(index, { endTimeLocal: text })}
                  placeholder="17:00"
                />
                <TouchableOpacity
                  onPress={() => setDrafts((current) => current.filter((_, i) => i !== index))}
                  accessibilityRole="button"
                  accessibilityLabel="Remove this time window"
                >
                  <Ionicons name="trash-outline" size={20} color={THEME.colors.outline} />
                </TouchableOpacity>
              </View>
            ))}
            <Button
              title="+ ADD WINDOW"
              variant="ghost"
              size="sm"
              onPress={() =>
                setDrafts((current) => [
                  ...current,
                  { dayOfWeek: 1, startTimeLocal: '09:00', endTimeLocal: '17:00' },
                ])
              }
            />
            <Button
              title={replaceRules.isPending ? 'SAVING…' : saved ? 'SAVED ✓' : 'SAVE WEEKLY HOURS'}
              loading={replaceRules.isPending}
              disabled={replaceRules.isPending}
              onPress={() => {
                setSaved(false);
                replaceRules.mutate(drafts, { onSuccess: () => setSaved(true) });
              }}
            />
          </View>
        )}

        {/* Time off */}
        <Text style={[styles.sectionLabel, styles.gapTop]}>TIME OFF</Text>
        {(timeOffsQuery.data ?? []).length === 0 ? (
          <Text style={styles.hint}>No upcoming time off.</Text>
        ) : (
          (timeOffsQuery.data ?? []).map((off) => (
            <View key={off.id} style={styles.offRow}>
              <View style={styles.offInfo}>
                <Text style={styles.offDates}>
                  {toLocalInput(off.startAtUtc).replace('T', ' ')} →{' '}
                  {toLocalInput(off.endAtUtc).replace('T', ' ')}
                </Text>
                {off.reason ? <Text style={styles.hint}>{off.reason}</Text> : null}
              </View>
              <TouchableOpacity
                onPress={() => deleteOff.mutate(off.id)}
                accessibilityRole="button"
                accessibilityLabel="Delete this time off"
              >
                <Ionicons name="close-circle-outline" size={22} color={THEME.colors.outline} />
              </TouchableOpacity>
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
    <View style={[styles.offForm]}>
      <Text style={styles.sectionLabel}>ADD TIME OFF</Text>
      <Input
        label="FROM (date + time)"
        value={start}
        onChangeText={setStart}
        placeholder="2026-09-01T09:00"
      />
      <Input label="TO" value={end} onChangeText={setEnd} placeholder="2026-09-01T17:00" />
      <Input
        label="REASON (OPTIONAL)"
        value={reason}
        onChangeText={setReason}
        placeholder="holiday"
      />
      <Button
        title="ADD"
        variant="secondary"
        loading={submitting}
        onPress={() => {
          if (!start || !end) return;
          onSubmit({
            startAtUtc: new Date(start).toISOString(),
            endAtUtc: new Date(end).toISOString(),
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
    marginBottom: THEME.spacing.sm,
  },
  gapTop: { marginTop: THEME.spacing['2xl'] },
  rulesList: { gap: THEME.spacing.sm },
  hint: { color: THEME.colors.onSurfaceVariant, fontSize: THEME.typography.caption.fontSize },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  dayBadge: {
    width: 44,
    color: THEME.colors.primary,
    fontWeight: '700',
    fontSize: THEME.typography.caption.fontSize,
  },
  timeInput: { flex: 1 },
  dash: { color: THEME.colors.outline },
  offRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceContainerHighest,
  },
  offInfo: { flex: 1, paddingRight: THEME.spacing.sm },
  offDates: { color: THEME.colors.onSurface, fontSize: THEME.typography.body.fontSize - 2 },
  offForm: { marginTop: THEME.spacing.md, gap: THEME.spacing.sm },
});
