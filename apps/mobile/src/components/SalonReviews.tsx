import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSalonReviews, submitReview } from '../api/reviews';
import StarRating from 'react-native-star-rating';

const SalonReviews = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { data, error, isLoading } = useQuery(['salonReviews'], getSalonReviews);
  const { mutate } = useMutation(['submitReview'], submitReview);

  const handleReviewSubmit = () => {
    mutate({ rating, review });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.review}</Text>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={item.rating}
              fullStarColor='#ffd700'
            />
          </View>
        )}
      />
      <TouchableOpacity onPress={handleReviewSubmit}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
      <StarRating
        maxStars={5}
        rating={rating}
        selectedStar={(rating) => setRating(rating)}
        fullStarColor='#ffd700'
      />
      <TextInput
        placeholder='Write your review...'
        value={review}
        onChangeText={(text) => setReview(text)}
      />
    </View>
  );
};

export default SalonReviews;
