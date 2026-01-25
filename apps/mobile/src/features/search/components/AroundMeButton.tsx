import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AroundMeButtonProps {
  onPress: () => void;
}

export const AroundMeButton = React.memo<AroundMeButtonProps>(function AroundMeButton({
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.6}
      onPress={onPress}
      accessibilityLabel="Rechercher autour de moi"
      accessibilityRole="button"
    >
      <Ionicons
        name="location-outline"
        size={20}
        color="#000"
        style={styles.icon}
      />
      <Text style={styles.text}>Autour de moi</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
});
