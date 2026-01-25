import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory, ServiceItem } from '../types';

interface ServiceSelectionProps {
  categories: ServiceCategory[];
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
      {!hideTitle && <Text style={styles.title}>Choix de la prestation</Text>}
      
      {categories.map((category) => {
        const isExpanded = expandedCategories[category.id];
        return (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity 
              style={styles.categoryHeader} 
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#000000" 
              />
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.itemsContainer}>
                {category.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.itemMetaContainer}>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                        <Text style={styles.itemDot}>•</Text>
                        <Text style={styles.itemDuration}>{item.duration}</Text>
                      </View>
                      {item.description && (
                        <Text style={styles.itemDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.chooseButton}
                      activeOpacity={0.8}
                      accessibilityLabel={`Choisir ${item.name}`}
                      accessibilityRole="button"
                      onPress={() => onSelect?.(item)}
                    >
                      <Text style={styles.chooseButtonText}>Choisir</Text>
                    </TouchableOpacity>
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
    paddingTop: 8,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 2,
  },
  categoryTitle: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 16,
  },
  itemName: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  itemMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  itemDot: {
    marginHorizontal: 6,
    color: '#666666',
    fontSize: 14,
  },
  itemDuration: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    lineHeight: 18,
  },
  chooseButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
