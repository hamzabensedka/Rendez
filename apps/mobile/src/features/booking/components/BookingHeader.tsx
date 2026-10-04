import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface BookingHeaderProps {
  title: string;
  paddingTop?: number;
}

export function BookingHeader({ title, paddingTop = 0 }: BookingHeaderProps) {
  const router = useRouter();
  return (
    <View style={[styles.header, paddingTop > 0 ? { paddingTop } : undefined]}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.headerBack}
        accessibilityLabel="Back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={22} color={T.colors.ink} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: T.colors.paper,
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: T.font.display,
    fontSize: 24,
    lineHeight: 32,
    color: T.colors.ink,
  },
});
