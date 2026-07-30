import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ReviewCard from './ReviewCard';
import EmptyState from '@/components/ui/EmptyState';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  business?: {
    id: string;
    name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRefresh: () => void;
  isRefreshing: boolean;
  emptyMessage?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  isError,
  error,
  onRefresh,
  isRefreshing,
  emptyMessage = 'Aucun avis pour le moment',
}) => {
  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Chargement des avis...</Text>
      </View>
    );
  }

  if (isError && reviews.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="alert-circle-outline"
          title="Erreur de chargement"
          message={error?.message || 'Impossible de charger les avis. Veuillez réessayer.'}
          actionLabel="Réessayer"
          onAction={onRefresh}
        />
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon="star-outline"
          title="Aucun avis"
          message={emptyMessage}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ReviewCard review={item} />}
      contentContainerStyle={styles.listContent}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default ReviewList;
