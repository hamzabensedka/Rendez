import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  useServiceCategoriesQuery,
  type ServiceCategoryDto,
} from '../../../application/query/hooks';
import { AtelierButton } from '../../../shared/ui/atelier/AtelierButton';
import { providerTheme as T } from '../../../application/theme/providerTheme';

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.topBar}>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityRole="button">
              <Ionicons name="close" size={22} color={T.colors.ink} />
            </Pressable>
            <Pressable onPress={handleReset} accessibilityRole="button">
              <Text style={styles.resetButton}>Reset</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.mainTitle}>Services</Text>

            {isPending ? (
              <ActivityIndicator style={styles.loader} color={T.colors.ink} />
            ) : isError ? (
              <Text style={styles.errorText}>Unable to load categories.</Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.chipsContainer}>
                  {categories.map((c: ServiceCategoryDto) => {
                    const isSelected = selectedSlugs.includes(c.slug);
                    return (
                      <Pressable
                        key={c.slug}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleSlug(c.slug)}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {c.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          <View style={styles.footer}>
            <AtelierButton label="Save" onPress={handleApply} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.paper,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  resetButton: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontFamily: T.font.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: T.colors.ink,
    marginBottom: 24,
    marginTop: 8,
  },
  loader: {
    marginTop: 24,
  },
  errorText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    marginTop: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 24,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    backgroundColor: T.colors.paper,
  },
  chipSelected: {
    backgroundColor: T.colors.ink,
    borderColor: T.colors.ink,
  },
  chipText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.ink,
  },
  chipTextSelected: {
    color: T.colors.bookedText,
    fontFamily: T.font.medium,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.colors.rule,
  },
});
