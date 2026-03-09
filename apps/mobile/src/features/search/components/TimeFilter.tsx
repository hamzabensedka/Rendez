import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimeFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (time: string) => void;
  currentTime: string;
}

export const TimeFilter = React.memo<TimeFilterProps>(function TimeFilter({
  visible,
  onClose,
  onApply,
  currentTime,
}) {
  const [giftCard, setGiftCard] = useState(false);
  const [selectedTime, setSelectedTime] = useState(currentTime || 'Any time');

  const handleApply = useCallback(() => {
    onApply(selectedTime);
    onClose();
  }, [selectedTime, onApply, onClose]);

  const renderRadioButton = (
    label: string, 
    value: string
  ) => {
    const isSelected = selectedTime === value;
    return (
      <TouchableOpacity 
        style={styles.radioRow} 
        onPress={() => setSelectedTime(value)} 
        activeOpacity={0.7}
      >
        <View style={styles.radioCircle}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>When</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Gift card */}
          <View style={styles.giftCardSection}>
            <Text style={styles.sectionTitle}>Gift card</Text>
            <View style={styles.toggleRow}>
              <View style={styles.giftCardLabelContainer}>
                <Ionicons name="gift-outline" size={20} color="#000" style={styles.giftIcon} />
                <Text style={styles.optionLabel}>Gift card available</Text>
              </View>
              <Switch
                value={giftCard}
                onValueChange={setGiftCard}
                trackColor={{ false: '#E5E5EA', true: '#000000' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time options */}
          <View style={styles.optionsSection}>
            {renderRadioButton('Any time', 'Any time')}
            {renderRadioButton('Today', 'Today')}
            {renderRadioButton('Tomorrow', 'Tomorrow')}
            {renderRadioButton('Choose a date', 'Choose a date')}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Save</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  giftCardSection: {
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  giftCardLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 16,
  },
  optionsSection: {
    gap: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
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
