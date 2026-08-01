import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface AppointmentListItemProps {
  appointment: {
    id: string;
    clientName: string;
    serviceName: string;
    startTime: string;
    endTime: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  };
  onPress: () => void;
}

const statusConfig = {
  confirmed: { color: '#10B981', icon: 'checkmark-circle', label: 'Confirmed' },
  pending: { color: '#F59E0B', icon: 'time', label: 'Pending' },
  cancelled: { color: '#EF4444', icon: 'close-circle', label: 'Cancelled' },
  completed: { color: '#6B7280', icon: 'checkmark-done-circle', label: 'Completed' },
};

export function AppointmentListItem({ appointment, onPress }: AppointmentListItemProps) {
  const status = statusConfig[appointment.status] || statusConfig.pending;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Appointment with ${appointment.clientName} at ${format(parseISO(appointment.startTime), 'h:mm a')}`}
    >
      <View style={styles.timeColumn}>
        <Text style={styles.time}>{format(parseISO(appointment.startTime), 'h:mm')}</Text>
        <Text style={styles.period}>{format(parseISO(appointment.startTime), 'a')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsColumn}>
        <Text style={styles.clientName} numberOfLines={1}>
          {appointment.clientName}
        </Text>
        <Text style={styles.serviceName} numberOfLines={1}>
          {appointment.serviceName}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons name={status.icon} size={14} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  timeColumn: {
    alignItems: 'center',
    width: 50,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  period: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  detailsColumn: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  serviceName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
