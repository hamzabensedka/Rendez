import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Alert,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import api from '../../../shared/lib/api';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface Appointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  business: { id: string; name: string };
  staff: { id: string; name: string } | null;
  serviceName?: string;
  location?: { address?: string; address1?: string; city?: string } | null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    if (id) loadAppointment();
  }, [id, user]);

  async function loadAppointment() {
    if (!id) return;
    setError(null);
    try {
      const response = await api.get(`/appointments/${id}`);
      setAppointment(response.data);
    } catch {
      setError('Could not load appointment.');
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!appointment) return;
    Alert.alert('Cancel this visit?', 'This cannot be undone.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post(`/appointments/${appointment.id}/cancel`);
            router.replace('/(main)/bookings');
          } catch {
            Alert.alert('Could not cancel', 'Try again in a moment.');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={T.colors.ink} />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.empty}>{error || 'Appointment not found'}</Text>
      </SafeAreaView>
    );
  }

  const start = new Date(appointment.startAtUtc);
  const time = start.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const address =
    appointment.location?.address ||
    [appointment.location?.address1, appointment.location?.city].filter(Boolean).join(', ') ||
    '—';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomInset + 32 }}>
          <Text style={styles.title}>Appointment</Text>
          <Field label="Salon" value={appointment.business.name} />
          <Field label="Service" value={appointment.serviceName ?? 'Visit'} />
          <Field label="Staff" value={appointment.staff?.name ?? 'Any'} />
          <Field label="Time" value={time} />
          <Field label="Location" value={address} />

          {appointment.status !== 'cancelled' && appointment.status !== 'completed' ? (
            <View style={styles.actions}>
              <Pressable
                style={styles.inkBtn}
                onPress={() => router.push(`/(main)/business/${appointment.business.id}`)}
              >
                <Text style={styles.inkBtnText}>Reschedule</Text>
              </Pressable>
              <Pressable style={styles.ghostBtn} onPress={handleCancel}>
                <Text style={styles.ghostText}>Cancel</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  safe: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: { fontFamily: T.font.body, fontSize: 16, color: T.colors.ink },
  title: {
    fontFamily: T.font.display,
    fontSize: T.type.display.fontSize,
    lineHeight: T.type.display.lineHeight,
    color: T.colors.ink,
    marginBottom: 20,
  },
  field: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  fieldLabel: { fontFamily: T.font.label, fontSize: 11, letterSpacing: 1.4, color: T.colors.muted },
  fieldValue: { fontFamily: T.font.body, fontSize: 16, color: T.colors.ink, marginTop: 4 },
  actions: { marginTop: 28, gap: 10 },
  inkBtn: {
    height: 52,
    backgroundColor: T.colors.ink,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inkBtnText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.bookedText },
  ghostBtn: {
    height: 52,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.ink },
  empty: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted, padding: 16 },
});
