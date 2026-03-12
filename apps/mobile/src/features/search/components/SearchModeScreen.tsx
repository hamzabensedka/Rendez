import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from './AppLogo';
import { ProfileButton } from './ProfileButton';
import { Text, Button } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';

interface SearchModeScreenProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  address: string;
  time: string;
  onCategoryPress: () => void;
  onAddressPress: () => void;
  onTimePress: () => void;
  onFiltersPress: () => void;
  onMapPress: () => void;
}

export const SearchModeScreen = React.memo<SearchModeScreenProps>(function SearchModeScreen({
  visible,
  onClose,
  category,
  address,
  time,
  onCategoryPress,
  onAddressPress,
  onTimePress,
  onFiltersPress,
  onMapPress,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>
          <AppLogo />
          <ProfileButton />
        </View>

        {/* Search Inputs Section */}
        <View style={styles.inputsContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close" size={24} color={colors.light.text} />
          </TouchableOpacity>

          {/* Category Input */}
          <TouchableOpacity style={styles.inputRow} onPress={onCategoryPress} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color={colors.light.textSecondary} style={styles.icon} />
            <Text variant="body">{category}</Text>
          </TouchableOpacity>

          {/* Address Input */}
          <TouchableOpacity style={styles.inputRow} onPress={onAddressPress} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
            <Text variant="body">{address}</Text>
          </TouchableOpacity>

          {/* Time Input */}
          <TouchableOpacity style={styles.inputRow} onPress={onTimePress} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
            <Text variant="body">{time}</Text>
          </TouchableOpacity>

          {/* Action Chips */}
          <View style={styles.chipsRow}>
            <Button
              title="Services"
              onPress={onCategoryPress}
              variant="secondary"
              size="sm"
              leftIcon={<Ionicons name="pricetag-outline" size={18} color={colors.light.accent} />}
              style={styles.chip}
            />

            <Button
              title="Map"
              onPress={onMapPress}
              variant="secondary"
              size="sm"
              leftIcon={<Ionicons name="map-outline" size={18} color={colors.light.accent} />}
              style={styles.chip}
            />

            <Button
              title="Filters"
              onPress={onFiltersPress}
              variant="secondary"
              size="sm"
              leftIcon={<Ionicons name="options-outline" size={18} color={colors.light.accent} />}
              style={styles.chip}
            />
          </View>
        </View>

        {/* Content Overlay - Dimmed Background */}
        <View style={styles.overlay}>
          <Text variant="title3" style={styles.overlayTitle}>Results</Text>
          <Text variant="body" color={colors.light.textSecondary} style={styles.overlaySubtitle}>
            Providers near you — book online
          </Text>
          
          {/* Example of dimmed content below */}
          <View style={styles.dimmedCard} />
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
  },
  backButton: {
    padding: 4,
  },
  inputsContainer: {
    backgroundColor: colors.light.background,
    padding: spacing.lg,
    paddingTop: spacing.sm,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    zIndex: 10,
  },
  closeIcon: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    flex: 1,
    ...shadows.sm,
    borderWidth: 0,
    backgroundColor: colors.light.surface,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.lg,
  },
  overlayTitle: {
    marginBottom: spacing.sm,
  },
  overlaySubtitle: {
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  dimmedCard: {
    height: 200,
    backgroundColor: colors.light.border,
    borderRadius: radius.lg,
  },
});
