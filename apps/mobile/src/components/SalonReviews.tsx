import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { fetchSalonReviews, submitReview } from '../api/reviews';
import StarRating from 'react-native-star-rating';

interface Review {
  id: number;
  rating: number;
  comment: string;
}

const SalonReviews = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { data: reviews, isLoading } = useQuery(['salonReviews'], fetchSalonReviews);
  const { mutate: submitReviewMutation } = useMutation(submitReview);

  const handleSubmitReview = async () => {
    try {
      await submitReviewMutation({ rating, comment });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Salon Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View>
            <Text>{item.comment}</Text>
            <StarRating
              rating={item.rating}
              disabled={true}
              starSize={20}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleSubmitReview}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <StarRating
        rating={rating}
        onSelectRating={setRating}
        starSize={20}
      />
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder='Comment'
      />
    </View>
  );
};

export default SalonReviews;