import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
  testID?: string;
}

export const ScreenHeader = React.memo<ScreenHeaderProps>(function ScreenHeader({ 
  title, 
  onBack, 
  leftIcon = 'chevron-back',
  rightElement,
  testID,
}) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  return (
    <View style={styles.header} testID={testID}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
        accessibilityLabel="Retour"
        accessibilityRole="button"
        accessibilityHint="Retourne à l'écran précédent"
      >
        <Ionicons name={leftIcon} size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.placeholder} />}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    width: 45,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 44,
  },
});
