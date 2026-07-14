import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius, shadows } from '@planity/ui';
import type { AddressSuggestion } from '../types';

interface SearchExpandedViewProps {
  serviceSummaryLabel: string;
  locationDraft: string;
  onLocationDraftChange: (text: string) => void;
  locationSuggestions: readonly AddressSuggestion[];
  locationLoading: boolean;
  onSelectSuggestion: (item: AddressSuggestion) => void;
  onSelectNearMe: () => void;
  timeDisplay: string;
  onClose: () => void;
  onCategoryPress: () => void;
  onTimePress: () => void;
}

export const SearchExpandedView = React.memo<SearchExpandedViewProps>(function SearchExpandedView({
  serviceSummaryLabel,
  locationDraft,
  onLocationDraftChange,
  locationSuggestions,
  locationLoading,
  onSelectSuggestion,
  onSelectNearMe,
  timeDisplay,
  onClose,
  onCategoryPress,
  onTimePress,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setShowSuggestions(locationDraft.trim().length > 0);
  }, [locationDraft]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeIcon} accessibilityRole="button" accessibilityLabel="Fermer">
        <Ionicons name="close" size={24} color={colors.light.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputRow} onPress={onCategoryPress} activeOpacity={0.7}>
        <Ionicons name="pricetag-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
        <Text variant="body" color={colors.light.text} numberOfLines={1} style={styles.flexText}>
          {serviceSummaryLabel}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
      </TouchableOpacity>

      <View style={styles.addressBlock}>
        <View style={[styles.inputRow, styles.addressInputRow]}>
          <Ionicons name="location-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Adresses, ville"
            placeholderTextColor={colors.light.textSecondary}
            value={locationDraft}
            onChangeText={onLocationDraftChange}
            onFocus={() => setShowSuggestions(locationDraft.trim().length > 0)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {locationLoading ? <ActivityIndicator size="small" color={colors.light.accent} /> : null}
        </View>

        {showSuggestions ? (
          <View style={styles.suggestionsBox}>
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => {
                Keyboard.dismiss();
                onSelectNearMe();
                setShowSuggestions(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Près de moi"
            >
              <Ionicons name="navigate-outline" size={20} color={colors.light.accent} style={styles.suggestionIcon} />
              <Text variant="body" weight="600" color={colors.light.text}>
                Près de moi
              </Text>
            </TouchableOpacity>
            <FlatList
              data={[...locationSuggestions]}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionRow}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelectSuggestion(item);
                    setShowSuggestions(false);
                  }}
                >
                  <Ionicons name="location-outline" size={18} color={colors.light.textSecondary} style={styles.suggestionIcon} />
                  <Text variant="body" color={colors.light.text} numberOfLines={2}>
                    {item.address}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !locationLoading && locationDraft.trim().length > 0 ? (
                  <Text variant="footnote" color={colors.light.textSecondary} style={styles.emptySuggest}>
                    Aucune suggestion
                  </Text>
                ) : null
              }
            />
          </View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.inputRow} onPress={onTimePress} activeOpacity={0.7}>
        <Ionicons name="time-outline" size={20} color={colors.light.textSecondary} style={styles.icon} />
        <Text variant="body" color={colors.light.text} numberOfLines={1} style={styles.flexText}>
          {timeDisplay}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.light.background,
    zIndex: 10,
  },
  closeIcon: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    marginLeft: 4,
    padding: 4,
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
  addressInputRow: {
    marginBottom: 0,
  },
  addressBlock: {
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  flexText: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
    paddingVertical: 0,
  },
  suggestionsBox: {
    marginTop: spacing.xs,
    maxHeight: 220,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.border,
  },
  suggestionIcon: {
    marginRight: spacing.sm,
  },
  emptySuggest: {
    padding: spacing.md,
  },
});
