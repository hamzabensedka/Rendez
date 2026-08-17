import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './SalonReviewItem.styles';
import { SalonReview } from '../../../shared/types/SalonReview';

const SalonReviewItem = ({ review }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{review.username}</Text>
      <Text style={styles.rating}>{review.rating}/5</Text>
      <Text style={styles.review}>{review.review}</Text>
    </View>
  );
};

export default SalonReviewItem;