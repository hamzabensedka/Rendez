import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@planity/ui';

/** Params passed when navigating to booking success (all optional for safety). */
export type BookingSuccessParams = {
  businessName?: string;
  serviceLabel?: string;
  durationMinutes?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  address?: string;
  appointmentId?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerClose: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  successBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkCircle1: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: '#d4edda',
  },
  checkCircle2: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a8dfb2',
  },
  checkCircle3: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7dd48a',
  },
  checkCircle4: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52c962',
  },
  checkCircle5: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d9d3d',
  },
  checkCircle6: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a6b24',
  },
  bookedTitle: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  confirmedSubtitle: {
    marginTop: spacing.md,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceSecondary,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  cardValueLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  salonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  salonLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  gridHalf: {
    flex: 1,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    flex: 1,
  },
  locationArrow: {
    padding: spacing.sm,
  },
  actions: {
    marginTop: spacing.xl,
    gap: 12,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light.text,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#fff',
    textTransform: 'uppercase',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
    textTransform: 'uppercase',
  },
  backLink: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  backLinkText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
  },
});

export default function BookingSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<BookingSuccessParams>();

  const businessName = params.businessName ?? 'Salon';
  const serviceLabel = params.serviceLabel ?? 'Service';
  const durationMinutes = params.durationMinutes ?? '—';
  const dateFormatted = params.dateFormatted ?? '—';
  const timeFormatted = params.timeFormatted ?? '—';
  const address = params.address ?? '—';

  const handleClose = () => {
    router.replace('/(main)/bookings');
  };

  const handleAddToCalendar = () => {
    // Build a simple calendar intent or deep link; fallback to opening calendar app
    const start = params.dateFormatted && params.timeFormatted
      ? `${params.dateFormatted} ${params.timeFormatted}`
      : '';
    // Could use expo-calendar or a generic mailto/calendar URL
    if (start) {
      Linking.openURL(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment at ${encodeURIComponent(businessName)}&dates=`);
    }
  };

  const handleManageBooking = () => {
    if (params.appointmentId) {
      router.replace(`/(main)/bookings/${params.appointmentId}`);
    } else {
      router.replace('/(main)/bookings');
    }
  };

  const handleBackToHome = () => {
    router.replace('/(main)/explore');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerClose} accessibilityLabel="Close">
          <Ionicons name="close" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successBlock}>
          <View style={styles.checkCircle1}>
            <View style={styles.checkCircle2}>
              <View style={styles.checkCircle3}>
                <View style={styles.checkCircle4}>
                  <View style={styles.checkCircle5}>
                    <View style={styles.checkCircle6}>
                      <Ionicons name="checkmark" size={24} color="#fff" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.bookedTitle}>Booked</Text>
          <Text style={styles.confirmedSubtitle}>Appointment Confirmed</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.salonRow}>
            <View>
              <Text style={styles.cardLabel}>Salon</Text>
              <Text style={styles.cardValueLarge}>{businessName}</Text>
            </View>
            <View style={styles.salonLogo}>
              <Ionicons name="business" size={24} color={colors.light.textSecondary} />
            </View>
          </View>
          <View style={styles.cardDivider}>
            <View style={styles.gridRow}>
              <View style={styles.gridHalf}>
                <Text style={styles.cardLabel}>Service</Text>
                <Text style={styles.cardValue}>{serviceLabel}</Text>
              </View>
              <View style={styles.gridHalf}>
                <Text style={styles.cardLabel}>Duration</Text>
                <Text style={styles.cardValue}>{durationMinutes} Minutes</Text>
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridHalf}>
                <Text style={styles.cardLabel}>Date</Text>
                <Text style={styles.cardValue}>{dateFormatted}</Text>
              </View>
              <View style={styles.gridHalf}>
                <Text style={styles.cardLabel}>Time</Text>
                <Text style={styles.cardValue}>{timeFormatted}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.locationCard]}>
          <View style={styles.locationIcon}>
            <Ionicons name="map-outline" size={28} color={colors.light.textSecondary} />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.cardLabel}>Location</Text>
            <Text style={styles.cardValue}>{address}</Text>
          </View>
          <TouchableOpacity style={styles.locationArrow} onPress={() => {}} accessibilityLabel="Open in maps">
            <Ionicons name="paper-plane-outline" size={20} color={colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleAddToCalendar} activeOpacity={0.9}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.btnPrimaryText}>Add to Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleManageBooking} activeOpacity={0.9}>
            <Text style={styles.btnSecondaryText}>Manage Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={handleBackToHome}>
            <Text style={styles.backLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
