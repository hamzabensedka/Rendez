import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';

/** Minimal business shape from API GET /businesses */
export interface ApiBusinessListItem {
  id: string;
  name: string;
  category?: string | null;
  ratingAvg: number;
  ratingCount: number;
  locations?: Array<{
    address1: string;
    address2?: string | null;
    postalCode: string;
    city: string;
    country?: string;
  }>;
}

function formatAddress(
  loc: NonNullable<ApiBusinessListItem['locations']>[number]
): string {
  const parts = [loc.address1, loc.address2, loc.postalCode, loc.city, loc.country].filter(Boolean);
  return parts.join(', ');
}

interface BusinessCardProps {
  business: ApiBusinessListItem;
  onPress: () => void;
}

export const BusinessCard = React.memo<BusinessCardProps>(function BusinessCard({ business, onPress }) {
  const address =
    business.locations && business.locations.length > 0
      ? formatAddress(business.locations[0])
      : null;

  return (
    <Card variant="elevated" padding="lg" style={styles.card}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={`Business ${business.name}`}
        accessibilityRole="button"
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="title3" numberOfLines={1}>
              {business.name}
            </Text>
            {business.category && (
              <Text variant="footnote" color={colors.light.textSecondary} style={styles.category}>
                {business.category}
              </Text>
            )}
          </View>
          {business.ratingCount > 0 && (
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color={colors.light.text} />
              <Text variant="footnote" weight="600">
                {business.ratingAvg.toFixed(1)}
              </Text>
              <Text variant="caption" color={colors.light.textSecondary}>
                ({business.ratingCount})
              </Text>
            </View>
          )}
        </View>
        {address && (
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.light.textSecondary} />
            <Text variant="body" color={colors.light.textSecondary} numberOfLines={1} style={styles.addressText}>
              {address}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  category: {
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  addressText: {
    flex: 1,
  },
});
