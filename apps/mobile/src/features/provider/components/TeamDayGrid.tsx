import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@planity/ui';
import { providerTheme as THEME } from '../providerTheme';
import type { ProviderAppointment } from '../../../application/query/hooks';
import {
  PX_PER_HOUR,
  GUTTER_WIDTH,
  COLUMN_WIDTH,
  blockGeometry,
  isSameLocalDay,
  visibleHourRange,
} from '../calendarLayout';
import { formatClock, serviceLine } from '../providerFormat';

export interface CalendarStaff {
  id: string;
  name: string;
}

interface TeamDayGridProps {
  day: Date;
  staff: CalendarStaff[];
  appointments: ProviderAppointment[];
  selectedId: string | null;
  onSelect: (appointment: ProviderAppointment) => void;
}

const UNASSIGNED_ID = '__unassigned__';

function shortStaffName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name;
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function statusNote(status: string): string | null {
  if (status === 'COMPLETED') return 'Done';
  if (status === 'NO_SHOW') return 'No-show';
  return null;
}

export function TeamDayGrid({
  day,
  staff,
  appointments,
  selectedId,
  onSelect,
}: TeamDayGridProps) {
  const { width: screenWidth } = useWindowDimensions();

  const visible = useMemo(
    () => appointments.filter((a) => a.status !== 'CANCELLED'),
    [appointments]
  );

  const columns = useMemo(() => {
    const ids = new Set(staff.map((s) => s.id));
    const extra = visible.some((a) => !a.staff?.id || !ids.has(a.staff.id));
    return extra ? [...staff, { id: UNASSIGNED_ID, name: 'Open chair' }] : staff;
  }, [staff, visible]);

  const colWidth = useMemo(() => {
    if (columns.length === 0) return COLUMN_WIDTH;
    if (columns.length <= 3) {
      return Math.floor((screenWidth - GUTTER_WIDTH) / columns.length);
    }
    return Math.max(COLUMN_WIDTH, Math.floor((screenWidth - GUTTER_WIDTH) / 3));
  }, [columns.length, screenWidth]);

  const { startHour, endHour } = useMemo(() => {
    return visibleHourRange(
      visible.map((a) => new Date(a.startAtUtc)),
      visible.map((a) => new Date(a.endAtUtc))
    );
  }, [visible]);

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = startHour; h < endHour; h += 1) list.push(h);
    return list;
  }, [startHour, endHour]);

  const gridHeight = hours.length * PX_PER_HOUR;
  const now = new Date();
  const showNow = isSameLocalDay(day, now);
  const nowTop = showNow
    ? blockGeometry(now, new Date(now.getTime() + 60_000), day, startHour, endHour)?.top
    : undefined;
  const nowHour = showNow ? now.getHours() : null;

  const byStaff = useMemo(() => {
    const map = new Map<string, ProviderAppointment[]>();
    for (const col of columns) map.set(col.id, []);
    for (const apt of visible) {
      const key = apt.staff?.id && map.has(apt.staff.id) ? apt.staff.id : UNASSIGNED_ID;
      const list = map.get(key);
      if (list) list.push(apt);
    }
    return map;
  }, [columns, visible]);

  if (columns.length === 0) {
    return <Text style={styles.empty}>Add people to open the floor board.</Text>;
  }

  return (
    <ScrollView style={styles.scroller} nestedScrollEnabled>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
        <View>
          <View style={styles.headerRow}>
            <View style={styles.gutter} />
            {columns.map((col) => (
              <View key={col.id} style={[styles.headerCell, { width: colWidth }]}>
                <Text style={styles.headerName} numberOfLines={1}>
                  {shortStaffName(col.name)}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.bodyRow, { height: gridHeight }]}>
            <View style={[styles.gutter, { height: gridHeight }]}>
              {hours.map((hour) => (
                <View key={hour} style={styles.hourLabel}>
                  {nowHour === hour ? null : (
                    <Text style={styles.hourText}>{formatHour(hour)}</Text>
                  )}
                </View>
              ))}
              <Text style={[styles.hourText, styles.endHour]}>{formatHour(endHour)}</Text>
              {nowTop != null ? (
                <Text style={[styles.nowLabel, { top: nowTop - 8 }]}>Now</Text>
              ) : null}
            </View>

            {columns.map((col) => (
              <View key={col.id} style={[styles.column, { width: colWidth, height: gridHeight }]}>
                {hours.map((hour) => (
                  <View key={hour} style={styles.hourLine} />
                ))}
                {(byStaff.get(col.id) ?? []).map((apt) => {
                  const geo = blockGeometry(
                    new Date(apt.startAtUtc),
                    new Date(apt.endAtUtc),
                    day,
                    startHour,
                    endHour
                  );
                  if (!geo) return null;
                  const selected = apt.id === selectedId;
                  const booked = apt.status === 'BOOKED';
                  const note = statusNote(apt.status);
                  return (
                    <Pressable
                      key={apt.id}
                      style={[
                        styles.block,
                        { top: geo.top, height: geo.height },
                        booked ? styles.blockBooked : styles.blockPast,
                        selected && styles.blockSelected,
                      ]}
                      onPress={() => onSelect(apt)}
                      accessibilityRole="button"
                      accessibilityLabel={`${apt.clientUser?.name ?? 'Client'} at ${formatClock(apt.startAtUtc)}`}
                    >
                      <Text
                        style={[styles.blockTitle, booked ? styles.onInk : styles.onMuted]}
                        numberOfLines={2}
                      >
                        {apt.clientUser?.name ?? 'Walk-in'} · {serviceLine(apt)}
                      </Text>
                      {note ? (
                        <Text style={styles.blockNote} numberOfLines={1}>
                          {note}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            ))}

            {nowTop != null ? (
              <View
                pointerEvents="none"
                style={[
                  styles.nowLine,
                  {
                    top: nowTop,
                    left: GUTTER_WIDTH,
                    width: columns.length * colWidth,
                  },
                ]}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: { flex: 1, backgroundColor: THEME.colors.paper },
  empty: {
    color: THEME.colors.muted,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    fontFamily: THEME.font.body,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.paper,
    paddingBottom: 8,
    paddingTop: 4,
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
  },
  headerName: {
    fontSize: 13,
    fontFamily: THEME.font.medium,
    fontWeight: '500',
    color: THEME.colors.ink,
  },
  gutter: { width: GUTTER_WIDTH },
  bodyRow: { flexDirection: 'row' },
  hourLabel: {
    height: PX_PER_HOUR,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  hourText: {
    marginTop: -7,
    fontSize: 11,
    color: THEME.colors.muted,
    fontFamily: THEME.font.medium,
    fontVariant: ['tabular-nums'],
  },
  endHour: {
    position: 'absolute',
    right: 8,
    bottom: -7,
  },
  column: {
    backgroundColor: THEME.colors.paper,
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: THEME.colors.rule,
  },
  hourLine: {
    height: PX_PER_HOUR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.rule,
  },
  block: {
    position: 'absolute',
    left: 4,
    right: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: THEME.radius.block,
    overflow: 'hidden',
  },
  blockBooked: {
    backgroundColor: THEME.colors.booked,
  },
  blockPast: {
    backgroundColor: THEME.colors.past,
  },
  blockSelected: {
    opacity: 0.92,
  },
  blockTitle: {
    fontSize: 11,
    fontFamily: THEME.font.medium,
    lineHeight: 15,
  },
  blockNote: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: THEME.font.body,
    color: THEME.colors.muted,
  },
  onInk: { color: THEME.colors.bookedText },
  onMuted: { color: THEME.colors.ink },
  nowLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: THEME.colors.now,
    zIndex: 4,
  },
  nowLabel: {
    position: 'absolute',
    right: 6,
    fontSize: 10,
    fontFamily: THEME.font.display,
    color: THEME.colors.now,
  },
});
