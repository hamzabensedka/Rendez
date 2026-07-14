import React from 'react';
import { View, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { MapBusiness } from '../map/mapSearchGeo';

interface MapSearchBottomCardProps {
  cardWidth: number;
  stripAnimatedStyle: AnimatedStyle<ViewStyle>;
  selectedBusiness: MapBusiness;
  previousBusiness: MapBusiness | null;
  onCardPress: () => void;
  renderCard: (b: MapBusiness) => React.ReactNode;
}

export function MapSearchBottomCard({
  cardWidth,
  stripAnimatedStyle,
  selectedBusiness,
  previousBusiness,
  onCardPress,
  renderCard,
}: MapSearchBottomCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onCardPress}
      style={styles.bottomCard}
      accessibilityRole="button"
      accessibilityLabel={`${selectedBusiness.name}, open business details`}
    >
      <View style={[styles.cardSlideContainer, { width: cardWidth }]}>
        <Animated.View
          style={[styles.carouselStrip, { width: cardWidth * 3 }, stripAnimatedStyle]}
        >
          <View style={[styles.carouselCard, { width: cardWidth }]}>
            <View style={styles.cardSlideSlotSingle}>
              <View style={styles.bottomCardInner}>{renderCard(selectedBusiness)}</View>
            </View>
          </View>
          <View style={[styles.carouselCard, { width: cardWidth }]}>
            <View style={styles.cardSlideSlotSingle}>
              <View style={styles.bottomCardInner}>
                {renderCard(previousBusiness ?? selectedBusiness)}
              </View>
            </View>
          </View>
          <View style={[styles.carouselCard, { width: cardWidth }]}>
            <View style={styles.cardSlideSlotSingle}>
              <View style={styles.bottomCardInner}>
                <>
                  <View style={styles.emptyCardPlaceholder} />
                  <View style={styles.emptyCardPlaceholderContent} />
                </>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const bw = {
  surface: '#F4F4F4',
  white: '#FFFFFF',
  border: '#E5E5E5',
};

const styles = StyleSheet.create({
  bottomCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  cardSlideContainer: {
    overflow: 'hidden',
  },
  carouselStrip: {
    flexDirection: 'row',
  },
  carouselCard: {
    flexShrink: 0,
  },
  cardSlideSlotSingle: {
    borderRadius: 16,
    backgroundColor: bw.white,
    borderWidth: 1,
    borderColor: bw.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyCardPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: bw.surface,
  },
  emptyCardPlaceholderContent: {
    flex: 1,
    minHeight: 96,
  },
  bottomCardInner: { flexDirection: 'row', padding: 12, gap: 16 },
});
