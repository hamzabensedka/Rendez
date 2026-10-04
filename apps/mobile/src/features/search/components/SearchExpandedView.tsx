import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../../../application/theme/providerTheme';
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
      <Pressable
        onPress={onClose}
        style={styles.closeIcon}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={22} color={T.colors.ink} />
      </Pressable>

      <Pressable style={styles.inputRow} onPress={onCategoryPress}>
        <Text style={styles.rowText} numberOfLines={1}>
          {serviceSummaryLabel}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={T.colors.muted} />
      </Pressable>

      <View style={styles.addressBlock}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Address, city"
            placeholderTextColor={T.colors.muted}
            value={locationDraft}
            onChangeText={onLocationDraftChange}
            onFocus={() => setShowSuggestions(locationDraft.trim().length > 0)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {locationLoading ? <ActivityIndicator size="small" color={T.colors.ink} /> : null}
        </View>

        {showSuggestions ? (
          <View style={styles.suggestionsBox}>
            <Pressable
              style={styles.suggestionRow}
              onPress={() => {
                Keyboard.dismiss();
                onSelectNearMe();
                setShowSuggestions(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Near me"
            >
              <Text style={styles.nearMe}>Near me</Text>
            </Pressable>
            <FlatList
              data={[...locationSuggestions]}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.suggestionRow}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelectSuggestion(item);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.rowText} numberOfLines={2}>
                    {item.address}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                !locationLoading && locationDraft.trim().length > 0 ? (
                  <Text style={styles.emptySuggest}>No suggestions</Text>
                ) : null
              }
            />
          </View>
        ) : null}
      </View>

      <Pressable style={styles.inputRow} onPress={onTimePress}>
        <Text style={styles.rowText} numberOfLines={1}>
          {timeDisplay}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={T.colors.muted} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    backgroundColor: T.colors.paper,
    zIndex: 10,
  },
  closeIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  addressBlock: {
    marginBottom: 0,
  },
  rowText: {
    flex: 1,
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.ink,
  },
  textInput: {
    flex: 1,
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.ink,
    paddingVertical: 0,
  },
  suggestionsBox: {
    maxHeight: 220,
  },
  suggestionRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  nearMe: {
    fontFamily: T.font.medium,
    fontSize: 16,
    color: T.colors.ink,
  },
  emptySuggest: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    paddingVertical: 14,
  },
});
