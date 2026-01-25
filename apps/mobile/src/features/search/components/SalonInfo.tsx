import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from '../types';

interface SalonInfoProps {
  salon: Salon;
}

export const SalonInfo = React.memo<SalonInfoProps>(function SalonInfo({ salon }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{salon.name}</Text>
      
      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#666" style={styles.icon} />
        <Text style={styles.address}>{salon.address}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="star-outline" size={18} color="#666" style={styles.icon} />
        <Text style={styles.rating}>
          {salon.rating.toString().replace('.', ',')} ({salon.reviewCount} avis)
        </Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.priceLevel}>{salon.priceLevel}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  name: {
    fontSize: 22,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  address: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  rating: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  dotSeparator: {
    marginHorizontal: 8,
    color: '#666666',
  },
  priceLevel: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
});
