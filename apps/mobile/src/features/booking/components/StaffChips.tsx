import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export interface BookingStaffMember {
  id: string;
  name: string;
}

interface StaffChipsProps {
  staff: BookingStaffMember[];
  selectedStaffId: string | null;
  onSelect: (staffId: string | null) => void;
}

export function StaffChips({ staff, selectedStaffId, onSelect }: StaffChipsProps) {
  if (staff.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Staff</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <TouchableOpacity
          style={[styles.chip, selectedStaffId === null && styles.chipSelected]}
          onPress={() => onSelect(null)}
          accessibilityRole="button"
          accessibilityLabel="Any"
          accessibilityState={{ selected: selectedStaffId === null }}
        >
          <Text style={[styles.chipText, selectedStaffId === null && styles.chipTextSelected]}>
            Any
          </Text>
        </TouchableOpacity>
        {staff.map((member) => {
          const selected = selectedStaffId === member.id;
          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onSelect(member.id)}
              accessibilityRole="button"
              accessibilityLabel={member.name}
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {member.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    backgroundColor: T.colors.paper,
  },
  chipSelected: {
    backgroundColor: T.colors.ink,
    borderColor: T.colors.ink,
  },
  chipText: {
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
  },
  chipTextSelected: {
    color: T.colors.bookedText,
  },
});
