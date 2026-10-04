import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { useAppointmentsUpcomingQuery } from '../../../application/query/hooks';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import api from '../../../shared/lib/api';
import { useQuery } from '@tanstack/react-query';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: { id: string; name: string };
  staff: { id: string; name: string } | null;
  serviceName?: string;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day}  ${time}`;
}

function Row({ item, onPress }: { item: Appointment; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.86 }]}>
      <View style={styles.rowBody}>
        <Text style={styles.when}>{formatWhen(item.startAtUtc)}</Text>
        <Text style={styles.salon}>
          {item.business.name}  {item.serviceName ?? ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={T.colors.muted} />
    </Pressable>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const upcoming = useAppointmentsUpcomingQuery<Appointment>(user?.id);
  const past = useQuery({
    queryKey: ['appointments', 'past', user?.id],
    queryFn: async () => {
      const response = await api.get<{ data: Appointment[] }>('/appointments/me?upcoming=false');
      return response.data.data ?? [];
    },
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (!user) router.replace('/(auth)/login');
  }, [user, router]);

  const loading = upcoming.isLoading || past.isLoading;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset + 24 }}
          refreshControl={
            <RefreshControl
              refreshing={upcoming.isFetching}
              onRefresh={() => {
                upcoming.refetch();
                past.refetch();
              }}
              tintColor={T.colors.ink}
            />
          }
        >
          <Text style={styles.title}>Appointments</Text>
          {loading ? <ActivityIndicator color={T.colors.ink} style={{ marginTop: 24 }} /> : null}

          <Text style={styles.section}>Upcoming</Text>
          {(upcoming.data ?? []).map((item) => (
            <Row
              key={item.id}
              item={item}
              onPress={() => router.push(`/(main)/bookings/${item.id}`)}
            />
          ))}
          {!loading && (upcoming.data ?? []).length === 0 ? (
            <Text style={styles.empty}>Nothing scheduled.</Text>
          ) : null}

          <Text style={[styles.section, { marginTop: 28 }]}>Past</Text>
          {(past.data ?? []).map((item) => (
            <Row
              key={item.id}
              item={item}
              onPress={() => router.push(`/(main)/bookings/${item.id}`)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  safe: { flex: 1 },
  title: {
    fontFamily: T.font.display,
    fontSize: T.type.display.fontSize,
    lineHeight: T.type.display.lineHeight,
    letterSpacing: T.type.display.letterSpacing,
    color: T.colors.ink,
    marginBottom: 20,
    marginTop: 8,
  },
  section: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  rowBody: { flex: 1 },
  when: { fontFamily: T.font.medium, fontSize: 14, color: T.colors.ink },
  salon: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, marginTop: 2 },
  empty: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, paddingVertical: 8 },
});
