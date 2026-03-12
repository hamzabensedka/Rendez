import React, { useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, Card, Button } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import { SalonDetailsHeader, StaffMember, AuthForm } from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';
import { useAuth } from '../../../application/providers';

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Julie' },
  { id: '3', name: 'Sandrine' },
  { id: '4', name: 'Serjio' },
];

export default function BookingValidationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    salonId: string;
    serviceIds: string;
    staffId?: string;
    date: string;
    time: string;
  }>();

  const { user, login } = useAuth();
  const { salonId, serviceIds, staffId, date, time } = params;

  const salon = useMemo(() => MOCK_SALONS.find((s) => s.id === salonId), [salonId]);

  const selectedServices = useMemo(() => {
    if (!salon || !serviceIds) return [];
    const ids = serviceIds.split(',');
    const services: ServiceItem[] = [];
    const findService = (id: string) => {
      for (const category of salon.services) {
        const found = category.items.find((item) => item.id === id);
        if (found) return found;
      }
      return undefined;
    };
    ids.forEach((id) => {
      const s = findService(id);
      if (s) services.push(s);
    });
    return services;
  }, [salon, serviceIds]);

  const staffMember = useMemo(() => {
    if (!staffId) return null;
    return MOCK_STAFF.find((s) => s.id === staffId);
  }, [staffId]);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleEditTime = () => router.back();
  const handleDeleteService = () => router.back();

  const handleAuthSubmit = (mode: string, data: { email?: string }) => {
    login({
      id: 'mock-user',
      email: data.email || 'user@example.com',
      name: 'Guest',
      role: 'client',
    });
  };

  if (!salon) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <SalonDetailsHeader onBack={handleBack} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text variant="title2">{salon.name}</Text>
          <Text variant="footnote" color={colors.light.textSecondary}>Confirm your booking</Text>
        </View>

        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            1. Selected services
          </Text>
          <Card padding="lg" style={styles.card}>
            {selectedServices.map((service, index) => (
              <View key={`${service.id}-${index}`}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text variant="body">{service.name}</Text>
                    <Text variant="footnote" color={colors.light.textSecondary}>
                      {service.duration} • {service.price}
                    </Text>
                    {staffMember && (
                      <Text variant="footnote" color={colors.light.textSecondary} style={styles.staffName}>
                        with {staffMember.name}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteService()}>
                    <Text variant="footnote" color={colors.light.accent} style={styles.link}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
                {index < selectedServices.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            2. Date and time
          </Text>
          <Card padding="lg" style={styles.card}>
            <View style={styles.selectedTimeContainer}>
              <View>
                <Text variant="body">{date}</Text>
                <Text variant="footnote" color={colors.light.textSecondary}>
                  at {time}
                </Text>
              </View>
              <TouchableOpacity onPress={handleEditTime}>
                <Text variant="footnote" color={colors.light.accent} style={styles.link}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            3. Sign in
          </Text>
          {user ? (
            <Card padding="lg" style={styles.card}>
              <Text variant="body" style={styles.loggedInText}>
                Signed in as {user.name}
              </Text>
              <Button title="Confirm booking" onPress={() => {}} variant="primary" />
            </Card>
          ) : (
            <Card padding="lg" style={styles.authCard}>
              <AuthForm onSubmit={handleAuthSubmit} />
            </Card>
          )}
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.light.accent,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  authCard: {
    marginBottom: spacing.lg,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  staffName: {
    marginTop: spacing.xs,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.lg,
  },
  link: {
    textDecorationLine: 'underline',
  },
  selectedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  loggedInText: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
