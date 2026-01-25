import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  SalonDetailsHeader, 
  SalonTabs, 
  SalonImageCarousel, 
  SalonInfo, 
  ServiceSelection,
  SalonReviews,
  SalonAbout
} from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';

const TABS = ['Prendre RDV', 'Avis', 'À-propos'];

export default function SalonDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Prendre RDV');

  // Find salon by ID (in a real app, this would be an API call)
  const salon = MOCK_SALONS.find((s) => s.id === id);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleServiceSelect = useCallback((service: ServiceItem) => {
    if (salon) {
      router.push({
        pathname: '/booking',
        params: {
          salonId: salon.id,
          serviceId: service.id,
        },
      });
    }
  }, [router, salon]);

  if (!salon) {
    return null; // Or a loading/error state
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SalonDetailsHeader onBack={handleBack} />
      
      <SalonTabs 
        tabs={TABS} 
        activeTab={activeTab} 
        onTabPress={setActiveTab} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Prendre RDV' ? (
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
        ) : activeTab === 'Avis' ? (
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  servicesSection: {
    marginTop: 8,
  },
});
