import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchSummaryCardProps {
  category: string;
  address: string;
  onEdit?: () => void;
}

export const SearchSummaryCard = React.memo<SearchSummaryCardProps>(function SearchSummaryCard({
  category,
  address,
  onEdit,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onEdit}
        activeOpacity={0.7}
        accessibilityLabel="Modifier la recherche"
        accessibilityRole="button"
      >
        <View style={styles.content}>
          <Ionicons name="search" size={24} color="#5856D6" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.mainText} numberOfLines={1}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.separator}> • </Text>
              <Text style={styles.address}>{address}</Text>
            </Text>
            <Text style={styles.subtext}>À tout moment</Text>
          </View>
        </View>
        <Ionicons name="pencil" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  category: {
    fontFamily: 'Inter-Regular',
  },
  separator: {
    color: '#999',
  },
  address: {
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
});
