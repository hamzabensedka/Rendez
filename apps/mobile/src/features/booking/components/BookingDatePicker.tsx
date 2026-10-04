import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { getDatePickerDayLabel } from '@planity/shared';
import { providerTheme as T } from '../../../application/theme/providerTheme';

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
    <View style={styles.section}>
      <Text style={styles.heading}>Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {availableDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <Pressable
              key={index}
              style={[styles.chip, isSelected && styles.chipOn]}
              onPress={() => onSelectDate(date)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${getDatePickerDayLabel(date, today)} ${date.getDate()}`}
            >
              <Text style={[styles.day, isSelected && styles.onText]}>
                {getDatePickerDayLabel(date, today)}
              </Text>
              <Text style={[styles.num, isSelected && styles.onText]}>{date.getDate()}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingTop: 16 },
  heading: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 8, paddingBottom: 8 },
  chip: {
    minWidth: 56,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    alignItems: 'center',
  },
  chipOn: { backgroundColor: T.colors.ink, borderColor: T.colors.ink },
  day: { fontFamily: T.font.label, fontSize: 11, letterSpacing: 0.6, color: T.colors.muted },
  num: { fontFamily: T.font.display, fontSize: 18, color: T.colors.ink, marginTop: 2 },
  onText: { color: T.colors.bookedText },
});
