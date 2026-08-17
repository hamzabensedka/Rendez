import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { ReanimatedView } from 'react-native-reanimated';
import { SalonReviews } from '../../components/SalonReviews';
import { fetchReviews, submitReview } from '../../api/reviews';

const ReviewsScreen = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { data: reviews, isLoading } = useQuery(['reviews'], fetchReviews);
  const { mutate: submitReviewMutation } = useMutation(submitReview);

  const handleReviewSubmission = async () => {
    await submitReviewMutation({ rating, review });
    setRating(0);
    setReview('');
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <ReanimatedView>
      <SalonReviews reviews={reviews} />
      <View>
        <Text>Rating:</Text>
        <TouchableOpacity onPress={() => setRating(1)}>
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(2)}>
          <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(3)}>
          <Text>3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(4)}>
          <Text>4</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(5)}>
          <Text>5</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>Review:</Text>
        <TextInput value={review} onChangeText={(text) => setReview(text)} />
      </View>
      <TouchableOpacity onPress={handleReviewSubmission}>
        <Text>Submit Review</Text>
      </TouchableOpacity>
    </ReanimatedView>
  );
};

export default ReviewsScreen;
