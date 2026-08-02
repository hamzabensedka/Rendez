import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchReviews, submitReview } from '../api/reviews';
import { StarRating } from '../components/StarRating';
import { Review } from '../types/Review';

interface SalonReviewsProps {
  salonId: number;
}

const SalonReviews = ({ salonId }: SalonReviewsProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { data: reviews, isLoading } = useQuery(['reviews', salonId], () => fetchReviews(salonId));
  const { mutate: submitReviewMutate } = useMutation(['submitReview'], submitReview);

  const handleReviewSubmit = async () => {
    if (rating === 0 || review === '') return;
    await submitReviewMutate({ salonId, rating, review });
    setRating(0);
    setReview('');
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Reviews</Text>
      {reviews && (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.user.name}</Text>
              <StarRating rating={item.rating} />
              <Text>{item.review}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity onPress={handleReviewSubmit}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <StarRating rating={rating} onRatingChange={setRating} />
      <Text>Leave a review:</Text>
      <TextInput value={review} onChangeText={setReview} />
    </View>
  );
};

export default SalonReviews;