import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { api } from '../../api';
import { styles } from './styles';

interface Review {
  id: number;
  rating: number;
  comment: string;
}

const SalonReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { data, error, isLoading } = useQuery('reviews', api.getReviews);
  const { mutate } = useMutation(api.submitReview);

  useEffect(() => {
    if (data) {
      setReviews(data);
    }
  }, [data]);

  const handleRating = (rating: number) => {
    setRating(rating);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmitReview = () => {
    mutate({ rating, comment });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <Rating
              rating={item.rating}
              type='custom'
              fractions={1}
              startingValue={item.rating}
            />
            <Text>{item.comment}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <Rating
          rating={rating}
          type='custom'
          fractions={1}
          startingValue={rating}
          onFinishRating={handleRating}
        />
        <TextInput
          style={styles.input}
          placeholder='Write a comment...'
          value={comment}
          onChangeText={handleCommentChange}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
          <Feather name='send' size={20} color='#fff' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SalonReviews;
