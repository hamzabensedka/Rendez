import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from '../types';

interface SalonCardProps {
  salon: Salon;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
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
    <TouchableOpacity 
      style={styles.container} 
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
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{salon.name}</Text>
        
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#666" style={styles.icon} />
          <Text style={styles.address} numberOfLines={1}>
            {salon.address} ({salon.distance})
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="star" size={16} color="#000" style={styles.icon} />
          <Text style={styles.rating}>
            {salon.rating.toString().replace('.', ',')} ({salon.reviewCount} avis)
          </Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.priceLevel}>{salon.priceLevel}</Text>
        </View>

        {/* Availability Section */}
        <View style={styles.availabilityContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>MATIN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
              {salon.availability.morning.map((slot, index) => (
                <TouchableOpacity key={`m-${index}`} style={styles.slotButton}>
                  <Text style={styles.slotText}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>APRÈS-MIDI</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
              {salon.availability.afternoon.map((slot, index) => (
                <TouchableOpacity key={`a-${index}`} style={styles.slotButton}>
                  <Text style={styles.slotText}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Expandable Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Avis Clients Snippet */}
            <Text style={styles.sectionTitle}>Avis clients</Text>
            <View style={styles.reviewSnippet}>
              <View style={styles.starsRow}>
                <Text style={styles.reviewRating}>5</Text>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#000" />
                ))}
              </View>
              <Text style={styles.reviewAuthor}>Réponse de Carlos - 05.61.14.01.21</Text>
              <Text style={styles.reviewText}>Merci pour l'avis déposé. Carlos</Text>
            </View>

            {/* Description */}
            <Text style={styles.aboutTitle}>En savoir plus sur {salon.name}</Text>
            <Text style={styles.aboutText}>
              {salon.description || "Description non disponible."}
            </Text>
          </View>
        )}

        {/* Gift Button */}
        <TouchableOpacity style={styles.giftButton}>
          <Ionicons name="gift-outline" size={20} color="#000" style={styles.giftIcon} />
          <Text style={styles.giftText}>Offrir</Text>
        </TouchableOpacity>

        {/* Toggle Button */}
        <TouchableOpacity onPress={toggleExpanded} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isExpanded ? "Moins d'informations" : "Plus d'informations"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    bottom: 12,
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
    backgroundColor: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
  address: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  rating: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#666666',
  },
  priceLevel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  availabilityContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 11,
    color: '#666666',
    width: 80,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  slotsScroll: {
    flex: 1,
  },
  slotButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5856D6',
    marginRight: 8,
  },
  slotText: {
    fontSize: 13,
    color: '#5856D6',
    fontFamily: 'Inter-Medium',
  },
  giftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    marginBottom: 16,
  },
  giftIcon: {
    marginRight: 8,
  },
  giftText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
  // Expandable Styles
  expandedContent: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    marginBottom: 12,
  },
  reviewSnippet: {
    marginBottom: 24,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  reviewAuthor: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  aboutTitle: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
});
