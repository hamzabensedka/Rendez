import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';

export interface RendezSalonCardData {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceLevel: '€' | '€€' | '€€€';
  categories: string;
  imageUri: string;
  slots: readonly string[];
  verified?: boolean;
}

interface RendezSalonCardProps {
  data: RendezSalonCardData;
  onPress: () => void;
  onBookNow?: (slotLabel: string) => void;
  onSlotPress?: (slotLabel: string) => void;
  onFavorite?: () => void;
}

const SLOTS_PER_ROW = 3;
const MAX_ROWS = 2;

export const RendezSalonCard = React.memo<RendezSalonCardProps>(function RendezSalonCard({
  data,
  onPress,
  onBookNow,
  onSlotPress,
  onFavorite,
}) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const isFirstSlot = (label: string) => label.includes('Book Now');

  const handleSlotPress = (label: string) => {
    setSelectedSlot(label);
    if (isFirstSlot(label)) {
      onBookNow?.(label);
    } else {
      onSlotPress?.(label);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`Salon ${data.name}`}
    >
      {/* Image with overlays */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: data.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Favorite heart - top left */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            onFavorite?.();
          }}
          accessibilityLabel="Favorite"
        >
          <Ionicons name="heart-outline" size={20} color={colors.light.surface} />
        </TouchableOpacity>
        {/* Rating badge - top right */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={colors.light.text} />
          <Text variant="caption" weight="700" style={styles.ratingText}>
            {data.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text variant="title1" weight="700" numberOfLines={1} style={styles.name}>
            {data.name}
          </Text>
          {data.verified !== false && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color="#2563eb" />
              <Text variant="caption" weight="700" style={styles.verifiedText}>
                VERIFIED
              </Text>
            </View>
          )}
        </View>
        <Text variant="caption" color={colors.light.textSecondary} style={styles.meta}>
          {data.address} • {data.reviewCount} avis • {data.priceLevel} • {data.categories}
        </Text>

        {/* Booking chips: 3 per row, 2 rows max */}
        <View style={styles.slotsContainer}>
          {(() => {
            const slotsToShow = data.slots.slice(0, SLOTS_PER_ROW * MAX_ROWS);
            const rows: string[][] = [];
            for (let i = 0; i < slotsToShow.length; i += SLOTS_PER_ROW) {
              rows.push(slotsToShow.slice(i, i + SLOTS_PER_ROW));
            }
            return rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.slotRow}>
                {row.map((label) => {
                  const primary = isFirstSlot(label);
                  return (
                    <TouchableOpacity
                      key={label}
                      style={[styles.slotChip, primary && styles.slotChipPrimary]}
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        handleSlotPress(label);
                      }}
                    >
                      <Text
                        variant="caption"
                        weight={primary ? '700' : '600'}
                        numberOfLines={1}
                        style={[styles.slotText, primary && styles.slotTextPrimary]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ));
          })()}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  imageWrapper: {
    height: 256,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  ratingText: {
    color: colors.light.text,
  },
  details: {
    padding: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 22,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#2563eb',
    marginLeft: 4,
    fontSize: 10,
    letterSpacing: 1,
  },
  meta: {
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  slotsContainer: {
    gap: 8,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotChip: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotChipPrimary: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  slotText: {
    color: colors.light.text,
    fontSize: 11,
  },
  slotTextPrimary: {
    color: colors.light.surface,
  },
});
