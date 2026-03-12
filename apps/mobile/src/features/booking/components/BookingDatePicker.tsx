import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getDatePickerDayLabel } from '@planity/shared';
import { colors, spacing } from '@planity/ui';

/** English month names for display. Locale: en-only until i18n is added. */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface BookingDatePickerProps {
  availableDates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function BookingDatePicker({
  availableDates,
  selectedDate,
  onSelectDate,
}: BookingDatePickerProps) {
  const today = new Date();
  return (
    <View style={styles.dateSection}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>SELECT DATE</Text>
        <Text style={styles.sectionMonth}>
          {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateChipsContent}
      >
        {availableDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateChip, isSelected && styles.dateChipSelected]}
              onPress={() => onSelectDate(date)}
              accessibilityLabel={`Select ${getDatePickerDayLabel(date, today)} ${date.getDate()}`}
              accessibilityRole="button"
            >
              <Text style={[styles.dateChipDay, isSelected && styles.dateChipDaySelected]}>
                {getDatePickerDayLabel(date, today)}
              </Text>
              <Text style={[styles.dateChipNum, isSelected && styles.dateChipNumSelected]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dateSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  sectionMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  dateChipsContent: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: spacing.sm,
  },
  dateChip: {
    minWidth: 64,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipSelected: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  dateChipDay: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  dateChipDaySelected: { color: 'rgba(255,255,255,0.9)' },
  dateChipNum: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  dateChipNumSelected: { color: '#FFF' },
});
