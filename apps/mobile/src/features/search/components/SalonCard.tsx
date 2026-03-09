import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Button, Badge } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';
import { Salon } from '../types';

interface SalonCardProps {
  salon: Salon;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = spacing.lg;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

export const SalonCard = React.memo<SalonCardProps>(function SalonCard({
  salon,
  onPress,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  }, []);

  const renderImageItem = useCallback(({ item }: { item: string }) => (
    <View style={{ width: CARD_WIDTH, height: 200 }}>
      <Image 
        source={{ uri: item }} 
        style={styles.image} 
        resizeMode="cover" 
      />
    </View>
  ), []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  }), []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <Card 
      variant="elevated" 
      padding="none" 
      style={styles.container}
    >
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityLabel={`Salon ${salon.name}`}
      >
        {/* Image Slider Section */}
        <View style={styles.imageContainer}>
          <FlatList
            data={salon.images}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${salon.id}-img-${index}`}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            getItemLayout={getItemLayout}
            decelerationRate="fast"
            bounces={false}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            removeClippedSubviews={false}
            style={styles.slider}
          />
          
          {/* Pagination Dots */}
          <View style={styles.dotsContainer}>
            {salon.images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === activeIndex && styles.activeDot
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color={colors.light.surface} />
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
             <View style={{ flex: 1 }}>
                <Text variant="title3" numberOfLines={1}>{salon.name}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={14} color={colors.light.textSecondary} style={styles.icon} />
                    <Text variant="body" color={colors.light.textSecondary} style={{ fontSize: 14 }} numberOfLines={1}>
                        {salon.address} • {salon.distance}
                    </Text>
                </View>
             </View>
             <Badge 
               label={salon.rating.toString().replace('.', ',')} 
               icon={<Ionicons name="star" size={10} color={colors.light.surface} />}
               variant="default" // Customize badge later for rating style
               style={{ backgroundColor: colors.light.text, borderRadius: radius.sm }}
               // Override text color to white for black badge
             />
          </View>

          <View style={styles.reviewsRow}>
             <Text variant="caption" color={colors.light.textSecondary}>{salon.reviewCount} avis</Text>
             <Text variant="caption" color={colors.light.textSecondary}> • </Text>
             <Text variant="caption" color={colors.light.textSecondary}>{salon.priceLevel}</Text>
          </View>

          {/* Availability Section */}
          <View style={styles.availabilityContainer}>
            {salon.availability.morning.length > 0 && (
                <View style={styles.timeRow}>
                <Text variant="caption" weight="600" color={colors.light.textSecondary} style={styles.timeLabel}>AM</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
                    {salon.availability.morning.map((slot, index) => (
                    <TouchableOpacity key={`m-${index}`} style={styles.slotButton}>
                        <Text variant="caption" color={colors.light.accent} weight="600">{slot}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                </View>
            )}
            
            {salon.availability.afternoon.length > 0 && (
                <View style={styles.timeRow}>
                <Text variant="caption" weight="600" color={colors.light.textSecondary} style={styles.timeLabel}>PM</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
                    {salon.availability.afternoon.map((slot, index) => (
                    <TouchableOpacity key={`a-${index}`} style={styles.slotButton}>
                        <Text variant="caption" color={colors.light.accent} weight="600">{slot}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                </View>
            )}
          </View>

          {/* Expandable Content */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text variant="headline" style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.reviewSnippet}>
                <View style={styles.starsRow}>
                  <Text variant="headline" style={{ marginRight: 4 }}>5</Text>
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color={colors.light.text} />
                  ))}
                </View>
                <Text variant="caption" color={colors.light.textSecondary} style={{ marginBottom: 4 }}>Response from provider</Text>
                <Text variant="body" style={{ fontSize: 14 }}>Thank you for your review.</Text>
              </View>

              <Text variant="headline" style={styles.sectionTitle}>About {salon.name}</Text>
              <Text variant="body" color={colors.light.textSecondary} style={{ fontSize: 14, lineHeight: 20 }}>
                {salon.description || "No description available."}
              </Text>
            </View>
          )}

          <Button 
            title="Gift" 
            variant="outline" 
            size="md"
            onPress={() => {}} 
            leftIcon={<Ionicons name="gift-outline" size={16} color={colors.light.text} />}
            style={{ marginTop: spacing.md, marginBottom: spacing.md }}
          />

          <TouchableOpacity onPress={toggleExpanded} style={styles.toggleButton}>
            <Text variant="footnote" style={styles.toggleButtonText}>
              {isExpanded ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    backgroundColor: colors.light.surface,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  slider: {
    flex: 1,
  },
  image: {
    width: CARD_WIDTH,
    height: 200,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: colors.light.surface,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    marginRight: 4,
  },
  reviewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  availabilityContainer: {
    marginBottom: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeLabel: {
    width: 80,
  },
  slotsScroll: {
    flex: 1,
  },
  slotButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.light.accent,
    marginRight: spacing.sm,
    backgroundColor: colors.light.surface,
  },
  expandedContent: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  reviewSnippet: {
    marginBottom: spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleButtonText: {
    textDecorationLine: 'underline',
  },
});
