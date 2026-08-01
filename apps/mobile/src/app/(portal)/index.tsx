import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { formatDate, formatTime } from '@/lib/date-utils';
import type { Appointment, Business, Service } from '@planity/shared/types';

type DashboardData = {
  business: Business;
  todayAppointments: Appointment[];
  totalAppointmentsToday: number;
  totalRevenueToday: number;
  upcomingAppointments: number;
};

export default function ProviderDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: dashboard,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ['provider-dashboard', user?.id],
    queryFn: async () => {
      const { data } = await apiClient.get('/provider/dashboard');
      return data;
    },
    enabled: !!user && user.role === 'provider',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const navigateToServiceEdit = (serviceId?: string) => {
    router.push({
      pathname: '/(portal)/service-edit',
      params: serviceId ? { serviceId } : {},
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Animated.Text entering={FadeInDown} style={styles.loadingText}>
          Loading your dashboard...
        </Animated.Text>
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load dashboard.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.businessName}>{dashboard.business.name}</Text>
      </Animated.View>

      {/* Summary Cards */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.cardPrimary]}>
          <Text style={styles.summaryValue}>{dashboard.totalAppointmentsToday}</Text>
          <Text style={styles.summaryLabel}>Today's Appointments</Text>
        </View>
        <View style={[styles.summaryCard, styles.cardSecondary]}>
          <Text style={styles.summaryValue}>
            ${(dashboard.totalRevenueToday / 100).toFixed(0)}
          </Text>
          <Text style={styles.summaryLabel}>Today's Revenue</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.cardTertiary]}>
          <Text style={styles.summaryValue}>{dashboard.upcomingAppointments}</Text>
          <Text style={styles.summaryLabel}>Upcoming</Text>
        </View>
        <TouchableOpacity
          style={[styles.summaryCard, styles.cardAction]}
          onPress={() => navigateToServiceEdit()}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <Text style={styles.summaryLabel}>Edit Services</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Today's Appointments */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/appointments')}>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {dashboard.todayAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No appointments scheduled for today.</Text>
          </View>
        ) : (
          dashboard.todayAppointments.map((appointment, index) => (
            <Animated.View
              key={appointment.id}
              entering={FadeInUp.delay(500 + index * 100)}
              style={styles.appointmentCard}
            >
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>
                  {formatTime(appointment.startTime)}
                </Text>
                <Text style={styles.dateText}>
                  {formatDate(appointment.startTime)}
                </Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.clientName}>
                  {appointment.client?.name || 'Client'}
                </Text>
                <Text style={styles.serviceName}>
                  {appointment.service?.name || 'Service'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  appointment.status === 'confirmed'
                    ? styles.statusConfirmed
                    : appointment.status === 'pending'
                    ? styles.statusPending
                    : styles.statusCancelled,
                ]}
              >
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </Animated.View>
          ))
        )}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(600)} style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(portal)/availability')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(portal)/business-profile')}
          >
            <Text style={styles.actionIcon}>🏪</Text>
            <Text style={styles.actionLabel}>Business Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(portal)/analytics')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#C7D2FE',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -12,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  cardSecondary: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardTertiary: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardAction: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F293B',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentTime: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 12,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F293B',
  },
  timeRange: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F293B',
  },
  serviceName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  quickActions: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginTop: 4,
  },
});
