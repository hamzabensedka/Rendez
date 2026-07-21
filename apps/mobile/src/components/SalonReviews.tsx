import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getReviews, submitReview } from '../api/reviews';
import { Rating } from '../components/Rating';
import { EmptyState } from '../components/EmptyState';

const SalonReviews = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { data: reviews, isLoading } = useQuery(['reviews'], getReviews);
  const { mutate: submitReviewMutation } = useMutation(submitReview);

  const handle Submit = () => {
    submitReviewMutation({ rating, review });
  };

  if (isLoading) return <Text>Loading...</Text>;

  if (!reviews || reviews.length === 0) {
    return <EmptyState message="No reviews yet" />;
  }

  return (
    <View>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View>
            <Text>{item.review}</Text>
            <Rating rating={item.rating} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <Rating
        rating={rating}
        onSelect={(rating) => setRating(rating)}
      />
      <TextInput
        value={review}
        onChangeText={(review) => setReview(review)}
        placeholder="Write your review..."
      />
    </View>
  );
};

export default SalonReviews;
