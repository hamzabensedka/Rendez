import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { queryClient } from '../queryClient';
import { getReviews, submitReview } from '../api/reviews';
import { Review } from '../types/Review';
import { Rating } from '../components/Rating';
import { Input } from '../components/Input';

const ReviewsScreen = () => {
  const { data: reviews, isLoading } = useQuery('reviews', getReviews);
  const { mutate: submitReviewMutation } = useMutation(submitReview);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <ScrollView>
      {reviews.map((review: Review) => (
        <View key={review.id}>
          <Text>{review.text}</Text>
          <Rating rating={review.rating} />
        </View>
      ))}
      <TouchableOpacity onPress={() => submitReviewMutation({ text: 'New review', rating: 5 })}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <Input placeholder="Write a review..." />
    </ScrollView>
  );
};

export default ReviewsScreen;