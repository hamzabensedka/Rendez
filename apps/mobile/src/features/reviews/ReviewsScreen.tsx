import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { expoRouter } from 'expo-router';
import { SalonReview } from '../../components/SalonReview';
import { getReviews, postReview } from '../../api/reviews';

const ReviewsScreen = () => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const { data: reviews, isLoading } = useQuery(['reviews'], getReviews);
  const { mutate: postReviewMutate } = useMutation(postReview);

  const handlePostReview = async () => {
    if (reviewText && rating) {
      await postReviewMutate({ review: reviewText, rating });
      setReviewText('');
      setRating(0);
    }
  };

  return (
    <View>
      <Text>Reviews</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <SalonReview review={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity onPress={handlePostReview}>
        <Text>Post Review</Text>
      </TouchableOpacity>
      <Text>Rating: {rating}/5</Text>
      <Text>Review: {reviewText}</Text>
      <View>
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
        <TextInput
          value={reviewText}
          onChangeText={(text) => setReviewText(text)}
          placeholder='Write your review...'
        />
      </View>
    </View>
  );
};

export default ReviewsScreen;