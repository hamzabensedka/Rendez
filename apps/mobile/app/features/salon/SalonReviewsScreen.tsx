import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { SalonReview } from '../../../models/SalonReview';
import { getSalonReviews, createSalonReview } from '../../../api/salonReviews';
import { useAuth } from '../../../hooks/useAuth';
import { Rating } from '../../../components/Rating';
import { styles } from './styles';

interface SalonReviewsScreenProps {
  salonId: number;
}

const SalonReviewsScreen = ({ salonId }: SalonReviewsScreenProps) => {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useQuery([
    'salon-reviews',
    salonId,
  ], () => getSalonReviews(salonId));
  const { mutate: createReview } = useMutation(
    [
      'create-salon-review',
      salonId,
    ],
    (review: SalonReview) => createSalonReview(salonId, review)
  );

  const handleCreateReview = (review: SalonReview) => {
    createReview(review);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <Text>{item.user.name}</Text>
            <Rating rating={item.rating} />
            <Text>{item.comment}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={() => handleCreateReview({ rating: 5, comment: 'Great service!' })}>
        <Text>Create Review</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SalonReviewsScreen;