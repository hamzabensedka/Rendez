import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERVICE_CATEGORIES } from '../constants';

interface ServiceFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedServices: string[]) => void;
}

export const ServiceFilters = React.memo<ServiceFiltersProps>(function ServiceFilters({
  visible,
  onClose,
  onApply,
}) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleReset = useCallback(() => {
    setSelectedServices([]);
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedServices);
    onClose();
  }, [selectedServices, onApply, onClose]);

  const toggleService = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Bar: Close (Left) & Reset (Right) */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>Services</Text>

          {/* Service Chips */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.chipsContainer}>
              {SERVICE_CATEGORIES.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <TouchableOpacity
                    key={service}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleService(service)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {service}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  resetButton: {
    fontSize: 15,
    color: '#000000',
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  chipText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  applyButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
