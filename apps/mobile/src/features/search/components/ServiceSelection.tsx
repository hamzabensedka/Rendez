import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import { ServiceCategory, ServiceItem } from '../types';

interface ServiceSelectionProps {
  categories: readonly ServiceCategory[]; // Allow readonly arrays
  onSelect?: (service: ServiceItem) => void;
  hideTitle?: boolean;
}

export const ServiceSelection = React.memo<ServiceSelectionProps>(function ServiceSelection({
  categories,
  onSelect,
  hideTitle = false,
}) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <View style={styles.container}>
      {!hideTitle && (
        <Text variant="title2" style={styles.title}>Choose service</Text>
      )}
      
      {categories.map((category) => {
        const isExpanded = expandedCategories[category.id];
        return (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity 
              style={styles.categoryHeader} 
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text variant="body" weight="500">{category.title}</Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.light.text} 
              />
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.itemsContainer}>
                {category.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text variant="body" style={styles.itemName}>{item.name}</Text>
                      <View style={styles.itemMetaContainer}>
                        <Text variant="footnote" weight="600" color={colors.light.textSecondary}>{item.price}</Text>
                        <Text variant="footnote" color={colors.light.textSecondary} style={styles.itemDot}>•</Text>
                        <Text variant="footnote" color={colors.light.textSecondary}>{item.duration}</Text>
                      </View>
                      {item.description && (
                        <Text variant="caption" color={colors.light.textSecondary} style={styles.itemDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    
                    <Button 
                      title="Choisir" 
                      onPress={() => onSelect?.(item)} 
                      size="sm"
                      variant="primary" // Dark
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    backgroundColor: colors.light.background,
  },
  title: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.light.surface,
    ...shadows.sm,
    zIndex: 2,
  },
  itemsContainer: {
    backgroundColor: colors.light.surface,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemInfo: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  itemName: {
    marginBottom: 6,
  },
  itemMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDot: {
    marginHorizontal: 6,
  },
  itemDescription: {
    marginTop: 6,
    lineHeight: 18,
  },
});
