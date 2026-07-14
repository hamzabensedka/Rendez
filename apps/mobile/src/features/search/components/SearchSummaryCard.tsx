import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@planity/ui';
import { colors, spacing } from '@planity/ui';

interface SearchSummaryCardProps {
  category: string;
  address: string;
  time?: string;
  onPress?: () => void;
}

export const SearchSummaryCard = React.memo<SearchSummaryCardProps>(function SearchSummaryCard({
  category,
  address,
  time = 'Any time',
  onPress,
}) {
  return (
    <View style={styles.container}>
      <Card 
        variant="elevated" 
        padding="md"
        style={styles.card}
      >
        <TouchableOpacity 
          style={styles.touchable} 
          onPress={onPress}
          activeOpacity={0.7}
        >
          {/* Search Icon */}
          <Ionicons name="search-outline" size={22} color={colors.light.accent} style={styles.icon} />
          
          {/* Text Content */}
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text variant="headline" style={styles.categoryText}>{category}</Text>
              <Text variant="body" color={colors.light.border} style={styles.separator}> • </Text>
              <Text variant="body" numberOfLines={1} style={styles.addressText}>
                {address}
              </Text>
            </View>
            <Text variant="footnote" color={colors.light.textSecondary}>{time}</Text>
          </View>

          {/* Edit/Pencil Icon */}
          <Ionicons name="pencil-outline" size={20} color={colors.light.textSecondary} style={styles.pencilIcon} />
        </TouchableOpacity>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.light.background,
  },
  card: {
    // Card handles bg and shadow
    // We might need to ensure Card accepts onPress if we want the ripple on the whole card, 
    // but here we use inner TouchableOpacity
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 15,
  },
  separator: {
    fontSize: 15,
    marginHorizontal: spacing.xs,
  },
  addressText: {
    fontSize: 15,
    flexShrink: 1,
  },
  pencilIcon: {
    marginLeft: spacing.lg,
  },
});
