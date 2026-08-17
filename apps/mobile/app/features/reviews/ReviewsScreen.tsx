import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { styles } from './ReviewsScreen.styles';
import { Review } from '../../../shared/types/Review';
import { SalonReview } from '../../../shared/types/SalonReview';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSalonReviews } from '../../../shared/hooks/useSalonReviews';
import { SalonReviewItem } from './SalonReviewItem';
import { ReviewForm } from './ReviewForm';

const ReviewsScreen = () => {
  const { user } = useAuth();
  const { salonReviews, isLoading, isError } = useSalonReviews();
  const { mutate: createReview } = useMutation(
    async (review: Review) => {
      // Implement create review logic here
    },
    {
      onSuccess: () => {
        // Implement success logic here
      },
    }
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error occurred</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={salonReviews}
        renderItem={({ item }) => <SalonReviewItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      {user && (
        <TouchableOpacity style={styles.writeReviewButton} onPress={() => {}}>
          <Feather name="edit" size={24} color="#fff" />
          <Text style={styles.writeReviewButtonText}>Write a review</Text>
        </TouchableOpacity>
      )}
      {user && (
        <ReviewForm onSubmit={(review) => createReview(review)} />
      )}
    </View>
  );
};

export default ReviewsScreen;