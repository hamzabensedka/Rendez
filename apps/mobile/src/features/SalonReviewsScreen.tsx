import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { SalonReview } from '../../models/SalonReview';
import { getSalonReviews, submitReview } from '../../api/reviews';

const SalonReviewsScreen = () => {
  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data, error, isLoading } = useQuery(['salonReviews'], getSalonReviews);
  const { mutate, isLoading: isSubmitting } = useMutation(['submitReview'], submitReview);

  useEffect(() => {
    if (data) {
      setReviews(data);
    }
  }, [data]);

  const handleSubmission = () => {
    mutate({ rating, comment });
  };

  return (
    <View>
      <Text>Salon Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View>
            <Text>{item.comment}</Text>
            <Text>Rating: {item.rating}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleSubmission}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <TextInput
        value={comment}
        onChangeText={(text) => setComment(text)}
        placeholder='Comment'
      />
      <Rating
        value={rating}
        onChange={(value) => setRating(value)}
      />
    </View>
  );
};

export default SalonReviewsScreen;