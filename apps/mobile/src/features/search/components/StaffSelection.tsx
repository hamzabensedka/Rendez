import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface StaffMember {
  id: string;
  name: string;
}

interface StaffSelectionProps {
  staff: StaffMember[];
  selectedStaffId: string | null;
  onSelect: (staffId: string | null) => void;
}

export const StaffSelection = React.memo<StaffSelectionProps>(function StaffSelection({
  staff,
  selectedStaffId,
  onSelect,
}) {
  const isNoPreferenceSelected = selectedStaffId === null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who with?</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* No Preference Option */}
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => onSelect(null)}
          activeOpacity={0.7}
        >
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>No preference</Text>
          </View>
          <View style={[styles.radio, isNoPreferenceSelected && styles.radioSelected]}>
            {isNoPreferenceSelected && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Staff Members */}
        {staff.map((member) => {
          const isSelected = selectedStaffId === member.id;
          const initial = member.name.charAt(0).toUpperCase();

          return (
            <TouchableOpacity 
              key={member.id} 
              style={styles.row} 
              onPress={() => onSelect(member.id)}
              activeOpacity={0.7}
            >
              <View style={styles.staffInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <Text style={styles.staffName}>{member.name}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,

  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  staffName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#000000',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 7,
    backgroundColor: '#000000',
  },
});
