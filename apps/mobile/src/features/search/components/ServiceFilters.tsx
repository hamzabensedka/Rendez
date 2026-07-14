import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useServiceCategoriesQuery, type ServiceCategoryDto } from '../../../application/query/hooks';

interface ServiceFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedSlugs: string[]) => void;
  initialSlugs: string[];
}

export const ServiceFilters = React.memo<ServiceFiltersProps>(function ServiceFilters({
  visible,
  onClose,
  onApply,
  initialSlugs,
}) {
  const { data: categories = [], isPending, isError } = useServiceCategoriesQuery();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);

  useEffect(() => {
    if (visible) {
      setSelectedSlugs(initialSlugs);
    }
  }, [visible, initialSlugs]);

  const handleReset = useCallback(() => {
    setSelectedSlugs([]);
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedSlugs);
    onClose();
  }, [selectedSlugs, onApply, onClose]);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button">
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} accessibilityRole="button">
            <Text style={styles.resetButton}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Prestations</Text>

          {isPending ? (
            <ActivityIndicator style={styles.loader} />
          ) : isError ? (
            <Text style={styles.errorText}>Impossible de charger les catégories.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.chipsContainer}>
                {categories.map((c: ServiceCategoryDto) => {
                  const isSelected = selectedSlugs.includes(c.slug);
                  return (
                    <TouchableOpacity
                      key={c.slug}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleSlug(c.slug)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply} accessibilityRole="button">
            <Text style={styles.applyButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      </SafeAreaProvider>
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
  loader: {
    marginTop: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#666',
    marginTop: 16,
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
