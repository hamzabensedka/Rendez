import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Platform, type ViewStyle } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import { Text } from '@planity/ui';
import { AddressSuggestion } from '../types';

interface AddressSuggestionListProps {
  suggestions: readonly AddressSuggestion[];
  query: string;
  onSelect: (address: AddressSuggestion) => void;
  /** Set to false when list is inside a parent ScrollView */
  scrollEnabled?: boolean;
}

function getPrimaryLabel(item: AddressSuggestion): string {
  const parts = item.address.split(',').map((p) => p.trim());
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : item.address;
}

function getSecondaryLabel(item: AddressSuggestion): string {
  if (item.city && item.country) {
    return `${item.city.toUpperCase()}, ${item.country.toUpperCase()}`;
  }
  const parts = item.address.split(',').map((p) => p.trim());
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase();
  }
  return '';
}

export const AddressSuggestionList = React.memo<AddressSuggestionListProps>(
  function AddressSuggestionList({ suggestions, query, onSelect, scrollEnabled = true }) {
    const renderItem: ListRenderItem<AddressSuggestion> = useCallback(
      ({ item, index }) => {
        const primary = getPrimaryLabel(item);
        const secondary = getSecondaryLabel(item);
        const isFirst = index === 0;
        return (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onSelect(item)}
            accessibilityLabel={`${primary}${secondary ? `, ${secondary}` : ''}`}
            accessibilityRole="button"
          >
            <View style={[styles.iconWrap, isFirst && styles.iconWrapFilled]}>
              <Ionicons
                name="location"
                size={22}
                color={isFirst ? '#FFFFFF' : colors.light.text}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.primary}>{primary}</Text>
              {secondary ? (
                <Text style={styles.secondary}>{secondary}</Text>
              ) : null}
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.light.text}
            />
          </TouchableOpacity>
        );
      },
      [onSelect]
    );

    const keyExtractor = useCallback((item: AddressSuggestion) => item.id, []);

    return (
      <FlashList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        style={
          StyleSheet.flatten([
            styles.container,
            !scrollEnabled ? styles.containerNoScroll : undefined,
          ]) as ViewStyle
        }
        showsVerticalScrollIndicator={scrollEnabled}
        scrollEnabled={scrollEnabled}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerNoScroll: {
    flex: 0,
  },
  list: {
    paddingTop: 0,
    paddingBottom: spacing['2xl'],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    gap: spacing.xl,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.light.text,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapFilled: {
    backgroundColor: colors.light.text,
    borderWidth: 0,
  },
  textWrap: {
    flex: 1,
  },
  primary: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.light.text,
    lineHeight: 22,
  },
  secondary: {
    fontSize: 14,
    color: colors.light.textSecondary,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
