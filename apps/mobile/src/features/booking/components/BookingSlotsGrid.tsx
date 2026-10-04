import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import type { Slot } from '../hooks/useBookingData';

const INITIAL_SLOTS_VISIBLE = 8;

interface BookingSlotsGridProps {
  slots: Slot[];
  selectedSlot: string | null;
  onSelectSlot: (startAt: string) => void;
  loading: boolean;
  slotsError: boolean;
  onRetry: () => void;
}

export function BookingSlotsGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  slotsError,
  onRetry,
}: BookingSlotsGridProps) {
  const { width } = useWindowDimensions();
  const slotWidth = (width - 32 - 24) / 4;
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const displaySlots = showMoreSlots ? slots : slots.slice(0, INITIAL_SLOTS_VISIBLE);
  const hasMoreSlots = slots.length > INITIAL_SLOTS_VISIBLE;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Time</Text>
      {loading ? (
        <ActivityIndicator size="small" color={T.colors.ink} style={{ marginVertical: 24 }} />
      ) : slotsError ? (
        <Pressable onPress={onRetry} style={styles.retry}>
          <Text style={styles.muted}>Unable to load times. Retry</Text>
        </Pressable>
      ) : slots.length === 0 ? (
        <Text style={styles.muted}>No slots for this date</Text>
      ) : (
        <>
          <View style={styles.grid}>
            {displaySlots.map((slot, index) => {
              const timeStr = new Date(slot.startAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
              const isSelected = selectedSlot === slot.startAt;
              return (
                <Pressable
                  key={index}
                  style={[styles.slot, { width: slotWidth }, isSelected && styles.slotOn]}
                  onPress={() => onSelectSlot(slot.startAt)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select time ${timeStr}`}
                >
                  <Text style={[styles.slotText, isSelected && styles.slotTextOn]}>{timeStr}</Text>
                </Pressable>
              );
            })}
          </View>
          {hasMoreSlots ? (
            <Pressable onPress={() => setShowMoreSlots((v) => !v)} style={styles.more}>
              <Text style={styles.muted}>{showMoreSlots ? 'Fewer times' : 'More times'}</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 16, paddingTop: 16 },
  heading: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingVertical: 10,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    alignItems: 'center',
  },
  slotOn: { backgroundColor: T.colors.ink, borderColor: T.colors.ink },
  slotText: { fontFamily: T.font.medium, fontSize: 14, color: T.colors.ink },
  slotTextOn: { color: T.colors.bookedText },
  muted: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
  retry: { paddingVertical: 16 },
  more: { paddingVertical: 16 },
});
