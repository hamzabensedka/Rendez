import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import type { DashboardSummary as DashboardSummaryType } from '@/types/provider';

interface Props {
  data?: DashboardSummaryType;
}

export function DashboardSummary({ data }: Props) {
  const summaryItems = [
    {
      label: "Today's Appointments",
      value: data?.todayAppointments ?? 0,
      icon: 'calendar-outline' as const,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      label: 'Total Revenue',
      value: data?.totalRevenue ? `$${data.totalRevenue.toFixed(0)}` : '$0',
      icon: 'cash-outline' as const,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      label: 'New Clients',
      value: data?.newClients ?? 0,
      icon: 'people-outline' as const,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      label: 'Rating',
      value: data?.rating ? `${data.rating.toFixed(1)} ★` : '—',
      icon: 'star-outline' as const,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
  ];

  return (
    <View style={styles.container}>
      {summaryItems.map((item, index) => (
        <Card key={index} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
