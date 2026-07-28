import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/hooks/useAuth';
import { Appointment } from '../../src/types/appointment';
import { Business } from '../../src/types/business';
import { Service } from '../../src/types/service';

// Icons using simple text/emoji for cross-platform compatibility
const icons = {
  calendar: '📅',
  clock: '🕐',
  scissor: '✂️',
  user: '👤',
  arrow: '→',
  refresh: '🔄',
  logout: '🚪',
};

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fetch provider's business
  const {
    data: business,
    isLoading: businessLoading,
    refetch: refetchBusiness,
  } = useQuery<Business>({
    queryKey: ['provider-business'],
    queryFn: async () => {
      const res = await api.get('/businesses/my-business');
      return res.data;
    },
  });

  // Fetch today's appointments
  const today = format(new Date(), 'yyyy-MM-dd');
  const {
    data: todayAppointments,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useQuery<Appointment[]>({
    queryKey: ['appointments', 'today', today],
    queryFn: async () => {
      const res = await api.get(`/appointments/provider?date=${today}`);
      return res.data;
    },
    enabled: !!business,
  });

  // Fetch services for quick edit
  const {
    data: services,
    refetch: refetchServices,
  } = useQuery<Service[]>({
    queryKey: ['services', business?.id],
    queryFn: async () => {
      const res = await api.get(`/services/business/${business?.id}`);
      return res.data;
    },
    enabled: !!business?.id,
  });

  const isRefreshing = businessLoading || appointmentsLoading;

  const onRefresh = () => {
    refetchBusiness();
    refetchAppointments();
    refetchServices();
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  // Summary stats
  const totalAppointmentsToday = todayAppointments?.length || 0;
  const confirmedAppointments = todayAppointments?.filter((a) => a.status === 'confirmed').length || 0;
  const pendingAppointments = todayAppointments?.filter((a) => a.status === 'pending').length || 0;
  const totalServices = services?.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.businessName}>{business?.name || 'Your Business'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>{icons.logout}</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.cardPrimary]}>
            <Text style={styles.summaryIcon}>{icons.calendar}</Text>
            <Text style={styles.summaryValue}>{totalAppointmentsToday}</Text>
            <Text style={styles.summaryLabel}>Total Appointments</Text>
          </View>
          <View style={[styles.summaryCard, styles.cardSuccess]}>
            <Text style={styles.summaryIcon}>{icons.clock}</Text>
            <Text style={styles.summaryValue}>{confirmedAppointments}</Text>
            <Text style={styles.summaryLabel}>Confirmed</Text>
          </View>
          <View style={[styles.summaryCard, styles.cardWarning]}>
            <Text style={styles.summaryIcon}>{icons.refresh}</Text>
            <Text style={styles.summaryValue}>{pendingAppointments}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={[styles.summaryCard, styles.cardInfo]}>
            <Text style={styles.summaryIcon}>{icons.service}</Text>
            <Text style={styles.summaryValue}>{totalServices}</Text>
            <Text style={styles.summaryLabel}>Services</Text>
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/appointments')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {todayAppointments?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{icons.calendar}</Text>
            <Text style={styles.emptyText}>No appointments scheduled for today</Text>
          </View>
        ) : (
          todayAppointments?.slice(0, 5).map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.appointmentCard}
              onPress={() => router.push(`/(dashboard)/appointment/${appointment.id}`)}
            >
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>{format(new Date(appointment.startTime), 'HH:mm')}</Text>
                <Text style={styles.amPm}>{format(new Date(appointment.startTime), 'a')}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.clientName}>
                  {icons.user} {appointment.clientName || 'Client'}
                </Text>
                <Text style={styles.serviceName}>{appointment.serviceName}</Text>
              </View>
              <View style={[styles.statusBadge, styles[`status${appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}`]]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Quick Service Edit */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Service Edit</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/services')}>
            <Text style={styles.seeAll}>Manage All</Text>
          </TouchableOpacity>
        </View>

        {services?.slice(0, 5).map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => router.push(`/(dashboard)/service/${service.id}`)}
          >
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceMeta}>
                {service.duration} min • ${service.price}
              </Text>
            </View>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 24,
  },
  seeAll: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  summaryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardBg: { backgroundColor: '#EEF2FF' },
  cardSuccess: { backgroundColor: '#ECFDF5' },
  cardWarning: { backgroundColor: '#FFFBEB' },
  cardInfo: { backgroundColor: '#F0F9FF' },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentTime: {
    alignItems: 'center',
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 12,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  timeAmPm: {
    fontSize: 12,
    color: '#6B7280',
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  'status-confirmed': {
    backgroundColor: '#D1FAE5',
  },
  'status-pending': {
    backgroundColor: '#FEF3C7',
  },
  'status-cancelled': {
    backgroundColor: '#FEE2E2',
  },
  'status-completed': {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  editIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
});
