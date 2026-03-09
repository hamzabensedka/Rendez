import React, { useState, useEffect } from 'react';
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
import { getDatePickerDayLabel, buildCreateAppointmentPayload } from '@planity/shared';
import { colors, spacing, typography, radius, shadows } from '@planity/ui';
import api from '../../../shared/lib/api';
import { useAuth } from '../../../application/providers';
import { useBookingData } from '../hooks/useBookingData';

export default function BookingScreen() {
  const { businessId, serviceVariantId } = useLocalSearchParams<{
    businessId: string;
    serviceVariantId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const {
    business,
    serviceVariant,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingSlots,
  } = useBookingData(businessId, serviceVariantId);

  async function handleBook() {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book an appointment', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') },
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
      if (!locationId) throw new Error('Business has no locations');
      const payload = buildCreateAppointmentPayload({
        businessId,
        locationId,
        serviceVariantId,
        startAt: selectedSlot,
      });
      await api.post('/appointments', payload);
      Alert.alert('Success', 'Appointment booked!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/bookings') },
      ]);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Something went wrong. Please try again or choose another slot.';
      Alert.alert('Booking failed', message);
    } finally {
      setBooking(false);
    }
  }

  useEffect(() => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book an appointment', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') },
        { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
      ]);
    }
  }, [user, router]);

  const today = new Date();

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      {serviceVariant && (
        <View style={styles.section}>
          <Text style={styles.sectionNumber}>1.</Text>
          <Text style={styles.sectionTitle}>Selected Service</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{serviceVariant.name}</Text>
              <Text style={styles.serviceDetails}>
                {serviceVariant.durationMin} min
                {serviceVariant.priceCents != null && ` • €${(serviceVariant.priceCents / 100).toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>
      )}

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
                  {getDatePickerDayLabel(date, today)}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loadingSlots ? (
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
  container: { flex: 1, backgroundColor: colors.light.background },
  header: { padding: spacing.xl, paddingTop: spacing['3xl'], backgroundColor: colors.light.surface },
  title: { ...typography.largeTitle, color: colors.light.text },
  section: { padding: spacing.xl, backgroundColor: colors.light.surface, marginTop: spacing.md },
  sectionNumber: { ...typography.largeTitle, color: colors.light.accent, fontSize: 28, marginBottom: spacing.xs },
  sectionTitle: { ...typography.title2, color: colors.light.text, marginBottom: spacing.lg },
  serviceCard: { backgroundColor: colors.light.background, borderRadius: radius.lg, padding: spacing.lg, ...shadows.sm },
  serviceInfo: { flex: 1 },
  serviceName: { ...typography.title3, color: colors.light.text, marginBottom: spacing.xs },
  serviceDetails: { ...typography.body, color: colors.light.textSecondary },
  dateScroll: { marginBottom: spacing.lg },
  dateContainer: { paddingRight: spacing.xl, gap: spacing.md },
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
  dateButtonSelected: { backgroundColor: colors.light.accent, borderColor: colors.light.accent },
  dateDay: { ...typography.footnote, color: colors.light.textSecondary, marginBottom: spacing.xs },
  dateDaySelected: { color: '#FFFFFF' },
  dateNumber: { ...typography.title2, color: colors.light.text },
  dateNumberSelected: { color: '#FFFFFF' },
  loadingContainer: { padding: spacing['2xl'], alignItems: 'center' },
  emptyContainer: { padding: spacing['2xl'], alignItems: 'center' },
  emptyText: { ...typography.body, color: colors.light.textSecondary },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
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
  slotButtonSelected: { backgroundColor: colors.light.accent, borderColor: colors.light.accent },
  slotText: { ...typography.headline, color: colors.light.text },
  slotTextSelected: { color: '#FFFFFF' },
  footer: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  bookButton: { backgroundColor: colors.light.accent, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', ...shadows.md },
  bookButtonDisabled: { opacity: 0.6 },
  bookButtonText: { ...typography.headline, color: '#FFFFFF', fontWeight: '600' },
});
