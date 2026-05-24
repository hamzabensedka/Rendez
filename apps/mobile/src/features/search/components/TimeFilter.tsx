import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, radius } from '@planity/ui';

export type TimeFilterPreset = 'any' | 'today' | 'tomorrow' | 'custom';

export interface TimeFilterApplyPayload {
  preset: TimeFilterPreset;
  /** YYYY-MM-DD when preset is today, tomorrow, or custom */
  availDate?: string;
  /** Row label in search UI */
  summary: string;
}

interface TimeFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (payload: TimeFilterApplyPayload) => void;
  /** ISO date when a concrete day is selected */
  initialAvailDate?: string;
  initialSummary?: string;
}

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseInitial(avail?: string, summary?: string): {
  preset: TimeFilterPreset;
  selectedDay: string;
} {
  if (!avail?.trim()) {
    return { preset: 'any', selectedDay: formatYmd(new Date()) };
  }
  const s = summary?.toLowerCase() ?? '';
  if (s.includes("aujourd'hui") || s.includes('today')) {
    return { preset: 'today', selectedDay: avail.trim() };
  }
  if (s.includes('demain') || s.includes('tomorrow')) {
    return { preset: 'tomorrow', selectedDay: avail.trim() };
  }
  return { preset: 'custom', selectedDay: avail.trim() };
}

export const TimeFilter = React.memo<TimeFilterProps>(function TimeFilter({
  visible,
  onClose,
  onApply,
  initialAvailDate,
  initialSummary,
}) {
  const [{ preset, selectedDay }, setState] = useState(() =>
    parseInitial(initialAvailDate, initialSummary)
  );

  useEffect(() => {
    if (visible) {
      setState(parseInitial(initialAvailDate, initialSummary));
    }
  }, [visible, initialAvailDate, initialSummary]);

  const handleApply = useCallback(() => {
    const today = formatYmd(new Date());
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = formatYmd(tomorrowDate);

    let payload: TimeFilterApplyPayload;
    if (preset === 'any') {
      payload = { preset: 'any', summary: 'N’importe quand' };
    } else if (preset === 'today') {
      payload = { preset: 'today', availDate: today, summary: "Aujourd'hui" };
    } else if (preset === 'tomorrow') {
      payload = { preset: 'tomorrow', availDate: tomorrow, summary: 'Demain' };
    } else {
      payload = {
        preset: 'custom',
        availDate: selectedDay,
        summary: selectedDay,
      };
    }
    onApply(payload);
    onClose();
  }, [preset, selectedDay, onApply, onClose]);

  const renderRadio = (label: string, value: TimeFilterPreset) => {
    const isSelected = preset === value;
    return (
      <TouchableOpacity style={styles.radioRow} onPress={() => setState((s) => ({ ...s, preset: value }))} activeOpacity={0.7}>
        <View style={styles.radioCircle}>{isSelected ? <View style={styles.radioDot} /> : null}</View>
        <Text style={styles.radioLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button">
            <Ionicons name="close" size={28} color={colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quand</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.optionsSection}>
            {renderRadio('N’importe quand', 'any')}
            {renderRadio("Aujourd'hui", 'today')}
            {renderRadio('Demain', 'tomorrow')}
            {renderRadio('Choisir une date', 'custom')}
          </View>

          {preset === 'custom' ? (
            <View style={styles.calendarWrap}>
              <Calendar
                current={selectedDay}
                onDayPress={(day) => setState((s) => ({ ...s, selectedDay: day.dateString }))}
                markedDates={{
                  [selectedDay]: {
                    selected: true,
                    selectedColor: colors.light.text,
                  },
                }}
                theme={{
                  todayTextColor: colors.light.accent,
                  arrowColor: colors.light.text,
                  monthTextColor: colors.light.text,
                  textDayFontFamily: 'System',
                  textMonthFontFamily: 'System',
                  textDayHeaderFontFamily: 'System',
                  selectedDayBackgroundColor: colors.light.text,
                  selectedDayTextColor: colors.light.background,
                }}
                style={styles.calendar}
              />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply} accessibilityRole="button">
            <Text style={styles.applyButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  optionsSection: {
    gap: 16,
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.text,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.light.text,
  },
  calendarWrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.light.surface,
  },
  calendar: {
    paddingBottom: spacing.sm,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  applyButton: {
    backgroundColor: colors.light.text,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
