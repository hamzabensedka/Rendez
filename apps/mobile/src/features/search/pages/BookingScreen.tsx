import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SalonDetailsHeader, ServiceSelection, StaffSelection, StaffMember } from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';
import { useAuth } from '../../../application/providers';

// Mock availability data for the booking screen
const MOCK_DATES = [
  {
    date: 'Jeudi 8 janvier',
    slots: ['10:00', '11:00', '13:30', '16:00'],
  },
  {
    date: 'Vendredi 9 janvier',
    slots: ['09:00', '10:00', '14:00', '15:30'], // Populated for demo
  },
  {
    date: 'Mardi 13 janvier',
    slots: ['11:00', '16:30'],
  },
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
  const [expandedDate, setExpandedDate] = useState<string>('Jeudi 8 janvier');

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
    if (!selectedStaffId) return 'Avec qui ?';
    const staff = MOCK_STAFF.find(s => s.id === selectedStaffId);
    return staff ? staff.name : 'Avec qui ?';
  };

  if (!salon) {
    return null; // Handle loading/error
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SalonDetailsHeader onBack={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Salon Name Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.salonName}>{salon.name}</Text>
        </View>

        {/* Step 1: Selected Service */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>1. Prestation sélectionnée</Text>
          
          <View style={styles.card}>
            {selectedServices.map((service, index) => (
              <View key={`${service.id}-${index}`}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceMeta}>{service.duration} • {service.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveService(index)}>
                    <Text style={styles.deleteLink}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
                
                {index < selectedServices.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.staffSelector}
              onPress={() => setStaffModalVisible(true)}
            >
              <Text style={styles.staffPlaceholder}>{getSelectedStaffName()}</Text>
              <Ionicons name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
            <Text style={styles.addButtonText}>Ajouter une prestation à la suite</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2: Date & Time */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>
            2. Choix de la date & heure
          </Text>
          
          <View style={styles.datesContainer}>
            {MOCK_DATES.map((item, index) => {
              const isExpanded = expandedDate === item.date;
              return (
                <View key={index} style={styles.dateGroup}>
                  <TouchableOpacity 
                    style={styles.dateHeader} 
                    onPress={() => toggleDate(item.date)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#000" 
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
                          <Text style={styles.timeSlotText}>{slot}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Service Selection Modal */}
      <Modal
        visible={isServiceModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ajouter une prestation</Text>
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
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setStaffModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#000" />
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
    paddingBottom: 40,
  },
  titleContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  salonName: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 32,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 18,
    color: '#5856D6', // Planity blue/purple
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  serviceMeta: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  deleteLink: {
    fontSize: 14,
    color: '#5856D6',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  staffSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  staffPlaceholder: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  datesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingBottom: 16,
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: '28%',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  placeholderButton: {
    width: 36,
  },
  modalContent: {
    flex: 1,
  },
});
