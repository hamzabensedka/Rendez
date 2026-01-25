import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { generateIdempotencyKey } from '@planity/shared';
import { colors, spacing, typography, radius, shadows } from '@planity/ui';
import api from '../../../shared/lib/api';
import { useAuth } from '../../../application/providers';

interface Slot {
  startAt: string;
  staffId: string | null;
}

interface ServiceVariant {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number | null;
  service: {
    id: string;
    name: string;
  };
}

export default function BookingScreen() {
  const { businessId, serviceVariantId } = useLocalSearchParams<{
    businessId: string;
    serviceVariantId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [serviceVariant, setServiceVariant] = useState<ServiceVariant | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    // Require authentication to book
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book an appointment', [
        {
          text: 'Sign In',
          onPress: () => router.replace('/(auth)/login'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    if (businessId && serviceVariantId) {
      loadBusiness();
      loadServiceVariant();
      generateAvailableDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, serviceVariantId, user]);

  useEffect(() => {
    if (selectedDate && businessId && serviceVariantId) {
      loadAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, businessId, serviceVariantId]);

  async function loadBusiness() {
    try {
      const response = await api.get(`/businesses/${businessId}`);
      setBusiness(response.data);
    } catch (error) {
      console.error('Failed to load business:', error);
    }
  }

  async function loadServiceVariant() {
    try {
      const response = await api.get(`/businesses/${businessId}`);
      const businessData = response.data;
      for (const service of businessData.services || []) {
        const variant = service.serviceVariants?.find((v: any) => v.id === serviceVariantId);
        if (variant) {
          setServiceVariant({
            ...variant,
            service: { id: service.id, name: service.name },
          });
          break;
        }
      }
    } catch (error) {
      console.error('Failed to load service variant:', error);
    }
  }

  function generateAvailableDates() {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
  }

  async function loadAvailability() {
    if (!businessId || !serviceVariantId) return;

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/businesses/${businessId}/availability`, {
        params: {
          serviceVariantId,
          date: dateStr,
        },
      });
      setSlots(response.data.slots);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Failed to load availability:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book an appointment', [
        {
          text: 'Sign In',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
      return;
    }

    if (!selectedSlot || !businessId || !serviceVariantId || !business) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    setBooking(true);
    try {
      const locationId = business.locations?.[0]?.id;
      if (!locationId) {
        throw new Error('Business has no locations');
      }

      await api.post('/appointments', {
        businessId,
        locationId,
        items: [{ serviceVariantId, quantity: 1 }],
        startAt: selectedSlot,
        idempotencyKey: generateIdempotencyKey(),
      });

      Alert.alert('Success', 'Appointment booked!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/bookings'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Booking Failed', error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  }

  function formatDate(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      {/* Selected Service */}
      {serviceVariant && (
        <View style={styles.section}>
          <Text style={styles.sectionNumber}>1.</Text>
          <Text style={styles.sectionTitle}>Selected Service</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{serviceVariant.name}</Text>
              <Text style={styles.serviceDetails}>
                {serviceVariant.durationMin} min
                {serviceVariant.priceCents &&
                  ` • €${(serviceVariant.priceCents / 100).toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionNumber}>2.</Text>
        <Text style={styles.sectionTitle}>Choose Date & Time</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateContainer}
        >
          {availableDates.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                  {isToday(date) ? 'Today' : formatDate(date).split(' ')[0]}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.light.accent} />
          </View>
        ) : slots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No available slots</Text>
          </View>
        ) : (
          <View style={styles.slotsGrid}>
            {slots.map((slot, index) => {
              const date = new Date(slot.startAt);
              const isSelected = selectedSlot === slot.startAt;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.slotButton, isSelected && styles.slotButtonSelected]}
                  onPress={() => setSelectedSlot(slot.startAt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, (!selectedSlot || booking) && styles.bookButtonDisabled]}
          onPress={handleBook}
          disabled={!selectedSlot || booking}
        >
          {booking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing['3xl'],
    backgroundColor: colors.light.surface,
  },
  title: {
    ...typography.largeTitle,
    color: colors.light.text,
  },
  section: {
    padding: spacing.xl,
    backgroundColor: colors.light.surface,
    marginTop: spacing.md,
  },
  sectionNumber: {
    ...typography.largeTitle,
    color: colors.light.accent,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.title2,
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  serviceCard: {
    backgroundColor: colors.light.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.title3,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  serviceDetails: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  dateScroll: {
    marginBottom: spacing.lg,
  },
  dateContainer: {
    paddingRight: spacing.xl,
    gap: spacing.md,
  },
  dateButton: {
    width: 70,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dateButtonSelected: {
    backgroundColor: colors.light.accent,
    borderColor: colors.light.accent,
  },
  dateDay: {
    ...typography.footnote,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  dateDaySelected: {
    color: '#FFFFFF',
  },
  dateNumber: {
    ...typography.title2,
    color: colors.light.text,
  },
  dateNumberSelected: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slotButton: {
    backgroundColor: colors.light.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  slotButtonSelected: {
    backgroundColor: colors.light.accent,
    borderColor: colors.light.accent,
  },
  slotText: {
    ...typography.headline,
    color: colors.light.text,
  },
  slotTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  bookButton: {
    backgroundColor: colors.light.accent,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});


