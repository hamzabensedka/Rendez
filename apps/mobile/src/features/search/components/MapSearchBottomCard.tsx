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
        <Animated.View style={[styles.carouselStrip, { width: cardWidth * 3 }, stripAnimatedStyle]}>
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
  surface: '#FAF8F3',
  white: '#FAF8F3',
  border: '#D9D4CC',
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
    borderRadius: 4,
    backgroundColor: bw.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: bw.border,
  },
  emptyCardPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 4,
    backgroundColor: bw.surface,
  },
  emptyCardPlaceholderContent: {
    flex: 1,
    minHeight: 96,
  },
  bottomCardInner: { flexDirection: 'row', padding: 12, gap: 16 },
});
