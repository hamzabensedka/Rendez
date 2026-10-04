import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { AtelierButton } from '../../../shared/ui/atelier/AtelierButton';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export type TimeFilterPreset = 'any' | 'today' | 'tomorrow' | 'custom';

export interface TimeFilterApplyPayload {
  preset: TimeFilterPreset;
  availDate?: string;
  summary: string;
}

interface TimeFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (payload: TimeFilterApplyPayload) => void;
  initialAvailDate?: string;
  initialSummary?: string;
}

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseInitial(
  avail?: string,
  summary?: string
): {
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
      payload = { preset: 'any', summary: 'Any time' };
    } else if (preset === 'today') {
      payload = { preset: 'today', availDate: today, summary: 'Today' };
    } else if (preset === 'tomorrow') {
      payload = { preset: 'tomorrow', availDate: tomorrow, summary: 'Tomorrow' };
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
      <Pressable
        style={styles.radioRow}
        onPress={() => setState((s) => ({ ...s, preset: value }))}
      >
        <View style={[styles.radioCircle, isSelected && styles.radioCircleOn]}>
          {isSelected ? <View style={styles.radioDot} /> : null}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button">
              <Ionicons name="close" size={22} color={T.colors.ink} />
            </Pressable>
            <Text style={styles.headerTitle}>When</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.optionsSection}>
              {renderRadio('Any time', 'any')}
              {renderRadio('Today', 'today')}
              {renderRadio('Tomorrow', 'tomorrow')}
              {renderRadio('Choose a date', 'custom')}
            </View>

            {preset === 'custom' ? (
              <View style={styles.calendarWrap}>
                <Calendar
                  current={selectedDay}
                  onDayPress={(day) => setState((s) => ({ ...s, selectedDay: day.dateString }))}
                  markedDates={{
                    [selectedDay]: {
                      selected: true,
                      selectedColor: T.colors.ink,
                    },
                  }}
                  theme={{
                    calendarBackground: T.colors.paper,
                    todayTextColor: T.colors.now,
                    arrowColor: T.colors.ink,
                    monthTextColor: T.colors.ink,
                    dayTextColor: T.colors.ink,
                    textDisabledColor: T.colors.muted,
                    textDayFontFamily: T.font.body,
                    textMonthFontFamily: T.font.display,
                    textDayHeaderFontFamily: T.font.label,
                    selectedDayBackgroundColor: T.colors.ink,
                    selectedDayTextColor: T.colors.bookedText,
                  }}
                  style={styles.calendar}
                />
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <AtelierButton label="Save" onPress={handleApply} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: T.font.display,
    fontSize: 20,
    color: T.colors.ink,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  optionsSection: {
    gap: 8,
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleOn: {
    backgroundColor: T.colors.ink,
  },
  radioDot: {
    width: 6,
    height: 6,
    backgroundColor: T.colors.bookedText,
  },
  radioLabel: {
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.ink,
  },
  calendarWrap: {
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: T.colors.paper,
  },
  calendar: {
    paddingBottom: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.colors.rule,
  },
});
