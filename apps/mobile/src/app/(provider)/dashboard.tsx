import { View, ScrollView, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import type { DashboardSummary, Appointment } from '@/types';

export default function ProviderDashboardScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: summary,
    isLoading,
    refetch,
  } = useQuery<DashboardSummary>({
    queryKey: ['provider', 'dashboard', user?.id],
    queryFn: () => api.get('/provider/dashboard').then((r) => r.data),
    enabled: !!user,
  });

  const { data: todayAppointments } = useQuery<AppointmentSummary[]>({
    queryKey: ['provider', 'appointments', 'today', user?.id],
    queryFn: () => api.get('/provider/appointments/today').then((r) => r.data),
    enabled: !!user,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold text-primary">
              {user?.name}
            </Text>
          </View>
          <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
            <Text className="text-lg font-bold text-primary">
              {user?.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Summary Cards */}
        <Text className="text-lg font-semibold text-foreground mb-4">
          Today's Overview
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-8">
          <Animated.View
            entering={FadeIn.delay(100)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="p-4 bg-primary/5 border-primary/20">
              <Text className="text-3xl font-bold text-primary">
                {summary?.todayAppointments ?? 0}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Appointments
              </Text>
            </Card>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(700)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="p-4 bg-green-500/5 border-green-500/20">
              <Text className="text-3xl font-bold text-green-600">
                {summary?.completedToday ?? 0}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Completed
              </Text>
            </Card>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(900)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="p-4 bg-amber-500/5 border-amber-500/20">
              <Text className="text-3xl font-bold text-amber-600">
                {summary?.pendingToday ?? 0}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Pending
              </Text>
            </Card>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(1100)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="p-4 bg-purple-500/5 border-purple-500/20">
              <Text className="text-3xl font-bold text-purple-600">
                {summary?.totalRevenue ?? '$0'}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Revenue
              </Text>
            </Card>
          </Animated.View>
        </View>

        {/* Today's Appointments */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-foreground">
            Today's Appointments
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(provider)/appointments')}
          >
            View All
          </Button>
        </View>

        {todayAppointments && todayAppointments.length > 0 ? (
          todayAppointments.map((appointment, index) => (
            <Animated.View
              key={appointment.id}
              entering={FadeIn.delay(1300 + index * 200)}
            >
              <Card className="p-4 mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {appointment.customerName}
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      {appointment.serviceName} • {appointment.duration}min
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-primary">
                      {appointment.time}
                    </Text>
                    <View
                      className={`mt-1 px-2 py-0.5 rounded-full ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100'
                          : appointment.status === 'pending'
                          ? 'bg-amber-100'
                          : 'bg-muted'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'text-green-700'
                            : appointment.status === 'pending'
                            ? 'text-amber-700'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {appointment.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))
        ) : (
          <Card className="p-8 items-center">
            <Ionicons
              name="calendar-outline"
              size={48}
              className="text-muted-foreground"
            />
            <Text className="text-muted-foreground mt-2">
              No appointments today
            </Text>
          </Card>
        )}

        {/* Quick Actions */}
        <Text className="text-lg font-semibold text-foreground mb-4 mt-8">
          Quick Actions
        </Text>
        <View className="flex-row gap-3">
          <Button
            className="flex-1"
            onPress={() => router.push('/(provider)/services')}
          >
            <Ionicons
              name="cut-outline"
              size={18}
              className="text-primary-foreground mr-2"
            />
            Edit Services
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => router.push('/(provider)/availability')}
          >
            <Ionicons
              name="time-outline"
              size={18}
              className="text-primary mr-2"
            />
            Set Hours
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
