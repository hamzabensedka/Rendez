import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFloatingBarOffset } from '../../../application/components/BottomNav';
import { useAuth } from '../../../application/providers';
import { homeHrefForRole } from '../../../shared/lib/auth';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export type BookingSuccessParams = {
  businessName?: string;
  serviceLabel?: string;
  durationMinutes?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  address?: string;
  appointmentId?: string;
  staffName?: string;
};

export default function BookingSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<BookingSuccessParams>();
  const { user } = useAuth();
  const bar = useFloatingBarOffset();

  const businessName = params.businessName ?? 'Salon';
  const serviceLabel = params.serviceLabel ?? 'Visit';
  const dateFormatted = params.dateFormatted ?? '';
  const timeFormatted = params.timeFormatted ?? '';

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bar + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>You’re booked</Text>
        <Text style={styles.when}>
          {[dateFormatted, timeFormatted].filter(Boolean).join('  ·  ') || 'Confirmed'}
        </Text>
        <Text style={styles.salon}>{businessName}</Text>
        <Text style={styles.service}>{serviceLabel}</Text>

        <Pressable
          style={({ pressed }) => [styles.inkBtn, pressed && styles.pressed]}
          onPress={() =>
            Linking.openURL(
              `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `${serviceLabel} at ${businessName}`
              )}`
            )
          }
        >
          <Text style={styles.inkBtnText}>Add to calendar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
          onPress={() => {
            if (params.appointmentId) {
              router.replace(`/(main)/bookings/${params.appointmentId}`);
            } else {
              router.replace('/(main)/bookings');
            }
          }}
        >
          <Text style={styles.ghostText}>View appointment</Text>
        </Pressable>
        <Pressable
          style={styles.textLink}
          onPress={() => router.replace(homeHrefForRole(user?.role))}
        >
          <Text style={styles.quiet}>Back to home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.colors.paper },
  title: {
    fontFamily: T.font.display,
    fontSize: T.type.display.fontSize,
    lineHeight: T.type.display.lineHeight,
    letterSpacing: T.type.display.letterSpacing,
    color: T.colors.ink,
    marginBottom: 16,
  },
  when: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink, marginBottom: 20 },
  salon: { fontFamily: T.font.display, fontSize: 20, color: T.colors.ink },
  service: { fontFamily: T.font.body, fontSize: 16, color: T.colors.muted, marginTop: 4, marginBottom: 32 },
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
    marginTop: 10,
  },
  ghostText: { fontFamily: T.font.medium, fontSize: 15, color: T.colors.ink },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  textLink: { paddingVertical: 20 },
  quiet: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
});
