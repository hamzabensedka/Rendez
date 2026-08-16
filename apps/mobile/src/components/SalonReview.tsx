import React from 'react';
import { View, Text } from 'react-native';

const SalonReview = ({ review }) => {
  return (
    <View>
      <Text>{review.text}</Text>
      <Text>Rating: {review.rating}/5</Text>
    </View>
  );
};

export default SalonReview;