import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  giftCard: boolean;
  availability: 'any' | 'today' | 'tomorrow' | 'date';
  sortBy: 'none' | 'rating' | 'price_desc' | 'price_asc';
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = React.memo<FilterSectionProps>(({ title, isExpanded, onToggle, children }) => (
  <View style={styles.section}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Ionicons 
        name={isExpanded ? "chevron-up" : "chevron-down"} 
        size={20} 
        color="#000" 
      />
    </TouchableOpacity>
    {isExpanded && <View style={styles.sectionContent}>{children}</View>}
  </View>
));

export const SearchFilters = React.memo<SearchFiltersProps>(function SearchFilters({
  visible,
  onClose,
  onApply,
}) {
  const [giftCard, setGiftCard] = useState(false);
  const [availability, setAvailability] = useState<FilterState['availability']>('any');
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('none');
  
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    sortBy: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = useCallback(() => {
    setGiftCard(false);
    setAvailability('any');
    setSortBy('none');
  }, []);

  const handleApply = useCallback(() => {
    onApply({ giftCard, availability, sortBy });
    onClose();
  }, [giftCard, availability, sortBy, onApply, onClose]);

  const renderRadioButton = (
    label: string, 
    selected: boolean, 
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.radioCircle}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

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
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>Filters</Text>

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

          {/* Availability */}
          <FilterSection
            title="Availability"
            isExpanded={expandedSections.availability}
            onToggle={() => toggleSection('availability')}
          >
            {renderRadioButton('Any time', availability === 'any', () => setAvailability('any'))}
            {renderRadioButton('Today', availability === 'today', () => setAvailability('today'))}
            {renderRadioButton('Tomorrow', availability === 'tomorrow', () => setAvailability('tomorrow'))}
            {renderRadioButton('Choose a date', availability === 'date', () => setAvailability('date'))}
          </FilterSection>

          <View style={styles.divider} />

          {/* Sort by */}
          <FilterSection
            title="Sort by"
            isExpanded={expandedSections.sortBy}
            onToggle={() => toggleSection('sortBy')}
          >
            {renderRadioButton('No preference', sortBy === 'none', () => setSortBy('none'))}
            {renderRadioButton('Top rated', sortBy === 'rating', () => setSortBy('rating'))}
            {renderRadioButton('Price: high to low', sortBy === 'price_desc', () => setSortBy('price_desc'))}
            {renderRadioButton('Price: low to high', sortBy === 'price_asc', () => setSortBy('price_asc'))}
          </FilterSection>
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
  section: {
    // 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionContent: {
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
