import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@planity/ui';
import { colors, spacing } from '@planity/ui';
import {
  SalonDetailsHeader,
  SalonTabs,
  SalonImageCarousel,
  SalonInfo,
  ServiceSelection,
  SalonReviews,
  SalonAbout,
  ScreenHeader,
} from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';

const TABS = ['Book', 'Reviews', 'About'];

export default function SalonDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Book');

  const salon = MOCK_SALONS.find((s) => s.id === id);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleServiceSelect = useCallback((service: ServiceItem) => {
    if (salon) {
      router.push('/(tabs)/booking');
    }
  }, [router, salon]);

  if (!salon) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader title="Provider" />
        <View style={styles.notFound}>
          <Text variant="body" color={colors.light.textSecondary}>
            Provider not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <SalonDetailsHeader onBack={handleBack} />
      
      <SalonTabs 
        tabs={TABS} 
        activeTab={activeTab} 
        onTabPress={setActiveTab} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Book' ? (
          <>
            <SalonImageCarousel images={salon.images} />
            <SalonInfo salon={salon} />
            {salon.services && (
              <View style={styles.servicesSection}>
                <ServiceSelection 
                  categories={salon.services} 
                  onSelect={handleServiceSelect}
                />
              </View>
            )}
          </>
        ) : activeTab === 'Reviews' ? (
          <SalonReviews />
        ) : (
          <SalonAbout />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    paddingBottom: spacing['3xl'],
  },
  servicesSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
