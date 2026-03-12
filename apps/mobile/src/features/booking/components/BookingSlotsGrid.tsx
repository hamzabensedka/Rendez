import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import type { Slot } from '../hooks/useBookingData';

const INITIAL_SLOTS_VISIBLE = 6;

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
  const slotWidth = (width - spacing.lg * 2 - spacing.md * 2) / 3;
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const displaySlots = showMoreSlots ? slots : slots.slice(0, INITIAL_SLOTS_VISIBLE);
  const hasMoreSlots = slots.length > INITIAL_SLOTS_VISIBLE;

  if (loading) {
    return (
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>AVAILABLE TIME</Text>
        <View style={styles.slotsLoading}>
          <ActivityIndicator size="small" color={colors.light.text} />
        </View>
      </View>
    );
  }

  if (slotsError) {
    return (
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>AVAILABLE TIME</Text>
        <View style={styles.slotsErrorWrap}>
          <Text style={styles.slotsEmpty}>Unable to load times. Please try again.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            accessibilityLabel="Retry loading times"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>AVAILABLE TIME</Text>
        <Text style={styles.slotsEmpty}>No slots available for this date</Text>
      </View>
    );
  }

  return (
    <View style={styles.timeSection}>
      <Text style={styles.sectionTitle}>AVAILABLE TIME</Text>
      <View style={styles.slotsGrid}>
        {displaySlots.map((slot, index) => {
          const date = new Date(slot.startAt);
          const timeStr = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const isSelected = selectedSlot === slot.startAt;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.slotChip,
                { width: slotWidth },
                isSelected && styles.slotChipSelected,
              ]}
              onPress={() => onSelectSlot(slot.startAt)}
              activeOpacity={0.7}
              accessibilityLabel={`Select time ${timeStr}`}
              accessibilityRole="button"
            >
              <Text
                style={[styles.slotChipText, isSelected && styles.slotChipTextSelected]}
              >
                {timeStr}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {hasMoreSlots && (
        <TouchableOpacity
          style={styles.seeMoreSlots}
          onPress={() => setShowMoreSlots((v) => !v)}
          accessibilityLabel={showMoreSlots ? 'See fewer slots' : 'See more slots'}
          accessibilityRole="button"
        >
          <Text style={styles.seeMoreSlotsText}>
            {showMoreSlots ? 'SEE FEWER SLOTS' : 'SEE MORE SLOTS'}
          </Text>
          <Ionicons
            name={showMoreSlots ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.light.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timeSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slotChip: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotChipSelected: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  slotChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  slotChipTextSelected: { color: '#FFF' },
  slotsLoading: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  slotsEmpty: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  slotsErrorWrap: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  seeMoreSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    paddingVertical: 12,
  },
  seeMoreSlotsText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
});
