import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { getProviderDashboard } from '../../services/provider.service';
import { getProviderAppointments } from '../../services/appointments.service';
import { DashboardCard } from '../../components/provider/DashboardCard';
import { AppointmentListItem } from '../../components/provider/AppointmentListItem';
import { QuickServiceEditor } from '../../components/provider/QuickServiceEditor';
import { Ionicons } from '@expo/vector-icons';

export default function ProviderDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['provider-dashboard'],
    queryFn: getProviderDashboard,
    refetchInterval: 30000,
  });

  const {
    data: todayAppointments,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ['provider-appointments', 'today'],
    queryFn: () => getProviderAppointments({ date: new Date().toISOString() }),
    refetchInterval: 30000,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchDashboard(), refetchAppointments()]);
    setRefreshing(false);
  }, [refetchDashboard, refetchAppointments]);

  const upcomingAppointments = useMemo(() => {
    if (!todayAppointments) return [];
    return todayAppointments
      .filter((apt: any) => apt.status === 'confirmed' || apt.status === 'pending')
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  }, [todayAppointments]);

  const nextAppointment = upcomingAppointments[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome back, {user?.name?.split(' ')[0] || 'Provider'}
            </Text>
            <Text style={styles.date}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(dashboard)/profile')}
          >
            <Ionicons name="person-circle-outline" size={36} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <DashboardCard
            title="Today's Appointments"
            value={dashboard?.todayCount || 0}
            icon="calendar-outline"
            color="#4F46E5"
            onPress={() => router.push('/(dashboard)/appointments')}
          />
          <DashboardCard
            title="Pending"
            value={dashboard?.pendingCount || 0}
            icon="time-outline"
            color="#F59E0B"
            onPress={() => router.push('/(dashboard)/appointments?filter=pending')}
          />
        </View>

        <View style={styles.cardsRow}>
          <DashboardCard
            title="Total Revenue"
            value={`$${dashboard?.monthlyRevenue || 0}`}
            icon="cash-outline"
            color="#10B981"
            onPress={() => {}}
            isCurrency
          />
          <DashboardCard
            title="Rating"
            value={dashboard?.rating || 'N/A'}
            icon="star-outline"
            color="#8B5CF6"
            onPress={() => {}}
          />
        </View>

        {/* Next Appointment Highlight */}
        {nextAppointment && (
          <View style={styles.nextAppointmentCard}>
            <View style={styles.nextAppointmentHeader}>
              <Ionicons name="alarm-outline" size={20} color="#4F46E5" />
              <Text style={styles.nextAppointmentTitle}>Next Appointment</Text>
            </View>
            <View style={styles.nextAppointmentDetails}>
              <Text style={styles.nextAppointmentTime}>
                {format(parseISO(nextAppointment.startTime), 'h:mm a')}
              </Text>
              <Text style={styles.nextAppointmentClient}>
                {nextAppointment.clientName}
              </Text>
              <Text style={styles.nextAppointmentService}>
                {nextAppointment.serviceName}
              </Text>
            </View>
            <Button
              title="View Details"
              variant="outline"
              size="small"
              onPress={() => router.push(`/(dashboard)/appointments/${nextAppointment.id}`)}
            />
          </View>
        )}

        {/* Today's Appointments List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/(dashboard)/appointments')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {appointmentsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : upcomingAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No appointments scheduled for today</Text>
            </View>
          ) : (
            upcomingAppointments.map((appointment: any) => (
              <AppointmentListItem
                key={appointment.id}
                appointment={appointment}
                onPress={() => router.push(`/(dashboard)/appointments/${appointment.id}`)}
              />
            ))
          )}
        </View>

        {/* Quick Service Edit */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Service Edit</Text>
            <TouchableOpacity onPress={() => router.push('/(dashboard)/services')}>
              <Text style={styles.seeAll}>Manage All</Text>
            </TouchableOpacity>
          </View>
          <QuickServiceEditor />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  nextAppointmentCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  nextAppointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  nextAppointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  nextAppointmentDetails: {
    marginBottom: 16,
  },
  nextAppointmentTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  nextAppointmentClient: {
    fontSize: 16,
    color: '#374151',
    marginTop: 4,
  },
  nextAppointmentService: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
