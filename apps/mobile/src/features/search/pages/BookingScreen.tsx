import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Button } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';
import { SalonDetailsHeader, ServiceSelection, StaffSelection, StaffMember } from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';
import { useAuth } from '../../../application/providers';

// Mock availability data for the booking screen
const MOCK_DATES = [
  { date: 'Thursday 8 Jan', slots: ['10:00', '11:00', '13:30', '16:00'] },
  { date: 'Friday 9 Jan', slots: ['09:00', '10:00', '14:00', '15:30'] },
  { date: 'Tuesday 13 Jan', slots: ['11:00', '16:30'] },
];

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Julie' },
  { id: '3', name: 'Sandrine' },
  { id: '4', name: 'Serjio' },
];

export default function BookingScreen() {
  const router = useRouter();
  const { salonId, serviceId } = useLocalSearchParams<{ salonId: string; serviceId: string }>();
  const { user } = useAuth();
  
  // Find salon
  const salon = MOCK_SALONS.find((s) => s.id === salonId);
  
  // Helper to find service across categories
  const findService = useCallback((id: string): ServiceItem | undefined => {
    if (!salon?.services) return undefined;
    for (const category of salon.services) {
      const found = category.items.find(item => item.id === id);
      if (found) return found;
    }
    return undefined;
  }, [salon]);

  // State for selected services
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  
  // Date/Time Selection State
  const [expandedDate, setExpandedDate] = useState<string>('Thursday 8 Jan');

  // Modals
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [isStaffModalVisible, setStaffModalVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Initialize with the passed serviceId
  useEffect(() => {
    if (serviceId && selectedServices.length === 0) {
      const initialService = findService(serviceId);
      if (initialService) {
        setSelectedServices([initialService]);
      }
    }
  }, [serviceId, findService, selectedServices.length]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const toggleDate = (date: string) => {
    if (expandedDate === date) {
      setExpandedDate('');
    } else {
      setExpandedDate(date);
    }
  };

  const handleTimeSlotSelect = (date: string, slot: string) => {
    if (!salon) return;
    
    // Navigate to validation screen
    // We pass IDs instead of complex objects to be safe with router params
    const serviceIds = selectedServices.map(s => s.id).join(',');
    
    router.push({
      pathname: '/booking-validation',
      params: {
        salonId: salon.id,
        serviceIds,
        staffId: selectedStaffId || undefined,
        date,
        time: slot
      }
    });
  };

  const handleAddService = () => {
    setServiceModalVisible(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServices(prev => [...prev, service]);
    setServiceModalVisible(false);
  };

  const handleRemoveService = (index: number) => {
    setSelectedServices(prev => {
      const newServices = [...prev];
      newServices.splice(index, 1);
      return newServices;
    });
    if (selectedServices.length === 1) {
       router.back();
    }
  };

  const handleStaffSelect = (staffId: string | null) => {
    setSelectedStaffId(staffId);
    setStaffModalVisible(false);
  };

  const getSelectedStaffName = () => {
    if (!selectedStaffId) return 'Select staff';
    const staff = MOCK_STAFF.find(s => s.id === selectedStaffId);
    return staff ? staff.name : 'Select staff';
  };

  if (!salon) {
    return null; // Handle loading/error
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <SalonDetailsHeader onBack={handleBack} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text variant="title2">{salon.name}</Text>
          <Text variant="footnote" color={colors.light.textSecondary}>Book an appointment</Text>
        </View>

        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>1. Selected services</Text>
          <Card padding="md" style={styles.card}>
            {selectedServices.map((service, index) => (
              <View key={`${service.id}-${index}`}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text variant="body">{service.name}</Text>
                    <Text variant="footnote" color={colors.light.textSecondary}>{service.duration} • {service.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveService(index)}>
                    <Text variant="footnote" color={colors.light.accent} style={{ textDecorationLine: 'underline' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
                
                {index < selectedServices.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.staffSelector}
              onPress={() => setStaffModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text variant="body">{getSelectedStaffName()}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.light.text} />
            </TouchableOpacity>
          </Card>

          <Button 
            title="Add another service" 
            onPress={handleAddService} 
            variant="primary"
            style={{ marginBottom: spacing.xl }}
          />
        </View>

        {/* Step 2: Date & Time */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            2. Date and time
          </Text>
          
          <Card padding="none" style={styles.datesContainer}>
            {MOCK_DATES.map((item, index) => {
              const isExpanded = expandedDate === item.date;
              return (
                <View key={index} style={styles.dateGroup}>
                  <TouchableOpacity 
                    style={styles.dateHeader} 
                    onPress={() => toggleDate(item.date)}
                    activeOpacity={0.7}
                  >
                    <Text variant="body">{item.date}</Text>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={colors.light.text} 
                    />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.slotsGrid}>
                      {item.slots.map((slot, sIndex) => (
                        <TouchableOpacity 
                          key={sIndex} 
                          style={styles.timeSlot}
                          onPress={() => handleTimeSlotSelect(item.date, slot)}
                        >
                          <Text variant="body">{slot}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* Service Selection Modal */}
      <Modal
        visible={isServiceModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.light.text} />
            </TouchableOpacity>
            <Text variant="headline">Add a service</Text>
            <View style={styles.placeholderButton} />
          </View>
          <ScrollView style={styles.modalContent}>
             {salon.services && (
                <ServiceSelection 
                  categories={salon.services} 
                  onSelect={handleSelectService} 
                  hideTitle
                />
             )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Staff Selection Modal */}
      <Modal
        visible={isStaffModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setStaffModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setStaffModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.light.text} />
            </TouchableOpacity>
            <View style={styles.placeholderButton} />
          </View>
          <StaffSelection
            staff={MOCK_STAFF}
            selectedStaffId={selectedStaffId}
            onSelect={handleStaffSelect}
          />
        </SafeAreaView>
      </Modal>
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
    backgroundColor: colors.light.surface,
    marginBottom: spacing.lg,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginBottom: spacing.lg,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginBottom: spacing.lg,
  },
  staffSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.md,
  },
  datesContainer: {
    backgroundColor: colors.light.surface,
    overflow: 'hidden',
  },
  dateGroup: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.light.surface,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  timeSlot: {
    backgroundColor: colors.light.background,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    minWidth: '28%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 0,
  },
  closeButton: {
    padding: 4,
  },
  placeholderButton: {
    width: 36,
  },
  modalContent: {
    flex: 1,
  },
});
