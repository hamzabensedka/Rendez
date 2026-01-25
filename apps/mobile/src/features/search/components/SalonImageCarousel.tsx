import React, { useState, useCallback, useRef } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SalonImageCarouselProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 250;

export const SalonImageCarousel = React.memo<SalonImageCarouselProps>(function SalonImageCarousel({
  images,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: activeIndex - 1 });
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < images.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, images.length]);

  const renderItem = useCallback(({ item }: { item: string }) => (
    <View style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </View>
  ), []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `carousel-${index}`}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        decelerationRate="fast"
        bounces={false}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={false}
      />
      
      {/* Navigation Arrows */}
      {activeIndex > 0 && (
        <TouchableOpacity 
          style={[styles.arrowButton, styles.leftArrow]} 
          onPress={handlePrev}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {activeIndex < images.length - 1 && (
        <TouchableOpacity 
          style={[styles.arrowButton, styles.rightArrow]} 
          onPress={handleNext}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: IMAGE_HEIGHT,
    backgroundColor: '#E5E5EA',
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 16,
  },
  rightArrow: {
    right: 16,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
