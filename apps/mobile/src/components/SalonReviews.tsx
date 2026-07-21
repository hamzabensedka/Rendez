import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getReviews, submitReview } from '../api/reviews';
import { Rating } from 'react-native-ratings';
import { ExpoRouter } from 'expo-router';

interface Review {
  id: number;
  rating: number;
  comment: string;
}

const SalonReviews = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { data: reviews, isLoading } = useQuery(['reviews'], getReviews);
  const { mutate: submitReviewMutation } = useMutation(submitReview);

  const handle_submit_review = async () => {
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
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View>
            <Rating rating={item.rating} />
            <Text>{item.comment}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handle_submit_review}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <Rating
        rating={rating}
        onSelect={(rating) => setRating(rating)}
      />
      <TextInput
        value={comment}
        onChangeText={(text) => setComment(text)}
        placeholder='Write a comment...'
      />
    </View>
  );
};

export default SalonReviews;
