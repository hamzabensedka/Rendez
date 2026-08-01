import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardSummary } from '@/components/provider/DashboardSummary';
import { TodayAppointments } from '@/components/provider/TodayAppointments';
import { QuickActions } from '@/components/provider/QuickActions';
import { apiClient } from '@/lib/api-client';
import type { ProviderDashboardData } from '@/types/provider';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';

export default function ProviderDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<ProviderDashboardData>({
    queryKey: ['provider-dashboard', user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/provider/dashboard');
      return response.data;
    },
    enabled: !!user && user.role === 'provider',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load dashboard</Text>
          <Button onPress={() => refetch()} variant="outline">
            Retry
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome back, {user?.name?.split(' ')[0] || 'Provider'}
          </Text>
          <Text style={styles.subtitle}>Here's your business overview</Text>
        </View>
        <Button
          variant="ghost"
          onPress={() => router.push('/(dashboard)/settings')}
          icon={<Ionicons name="settings-outline" size={24} color="#374151" />}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <DashboardSummary data={dashboardData?.summary} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(dashboard)/appointments')}
            >
              View All
            </Button>
          </View>
          <TodayAppointments appointments={dashboardData?.todayAppointments ?? []} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <QuickActions />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Management</Text>
          </View>
          <Card style={styles.serviceCard}>
            <View style={styles.serviceRow}>
              <Ionicons name="cut-outline" size={20} color="#6B7280" />
              <Text style={styles.serviceText}>Quick Service Edit</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.serviceDescription}>
              Modify service names, durations, and prices on the go
            </Text>
            <Button
              onPress={() => router.push('/(dashboard)/services')}
              style={styles.serviceButton}
              icon={<Ionicons name="create-outline" size={18} color="#FFFFFF" />}
            >
              Edit Services
            </Button>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
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
  serviceCard: {
    padding: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 18,
  },
  menuButton: {
    alignSelf: 'flex-start',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
});
