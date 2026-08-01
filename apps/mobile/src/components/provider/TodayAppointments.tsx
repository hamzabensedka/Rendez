import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { formatTime } from '@/lib/date-utils';
import type { Appointment } from '@/types/appointment';

interface Props {
  appointments: Appointment[];
}

const statusConfig = {
  confirmed: { color: '#10B981', label: 'Confirmed', icon: 'checkmark-circle' as const },
  pending: { color: '#F59E0B', label: 'Pending', icon: 'time' as const },
  cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'close-circle' as const },
  completed: { color: '#6B7280', label: 'Done', icon: 'checkmark-done' as const },
};

export function TodayAppointments({ appointments }: Props) {
  if (appointments.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Ionicons name="calendar-outline" size={32} color="#D1D5DB" />
        <Text style={styles.emptyText}>No appointments scheduled for today</Text>
      </Card>
    );
  }

  return (
    <FlatList
      data={appointments}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const status = statusMap[item.status] ?? statusMap.pending;
        return (
          <Card
            style={styles.appointmentCard}
            onPress={() => router.push(`/(dashboard)/appointment/${item.id}`)}
          >
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.time}>{formatTime(item.startTime)}</Text>
            </View>
            <Text style={styles.clientName} numberOfLines={1}>
              {item.clientName}
            </Text>
            <Text style={styles.service} numberOfLines={1}>
              {item.serviceName}
            </Text>
            <View style={styles.statusBadge}>
              <Ionicons name={status.icon} size={12} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingRight: 16,
  },
  appointmentCard: {
    width: 200,
    padding: 14,
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  service: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
