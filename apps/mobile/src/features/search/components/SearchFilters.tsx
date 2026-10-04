import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
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

const FilterSection = React.memo<FilterSectionProps>(
  ({ title, isExpanded, onToggle, children }) => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
      </TouchableOpacity>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  )
);

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
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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

  const renderRadioButton = (label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.radioCircle}>{selected && <View style={styles.radioDot} />}</View>
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
            {renderRadioButton('Tomorrow', availability === 'tomorrow', () =>
              setAvailability('tomorrow')
            )}
            {renderRadioButton('Choose a date', availability === 'date', () =>
              setAvailability('date')
            )}
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
            {renderRadioButton('Price: high to low', sortBy === 'price_desc', () =>
              setSortBy('price_desc')
            )}
            {renderRadioButton('Price: low to high', sortBy === 'price_asc', () =>
              setSortBy('price_asc')
            )}
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
    backgroundColor: '#F3F0E8',
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
    fontSize: 14,
    color: '#6B6560',
    textDecorationLine: 'underline',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#161412',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#161412',
    fontFamily: 'PlusJakartaSans-Bold',
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
    color: '#161412',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D9D4CC',
    marginVertical: 16,
  },
  section: {},
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
    width: 18,
    height: 18,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#161412',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 6,
    height: 6,
    backgroundColor: '#161412',
  },
  radioLabel: {
    fontSize: 16,
    color: '#161412',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D9D4CC',
  },
  applyButton: {
    backgroundColor: '#161412',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FAF8F3',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});
