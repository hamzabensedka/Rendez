import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../shared/lib/api';

interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  clientName: string;
}

interface ReviewsResponse {
  data: ApiReview[];
  total: number;
  page: number;
  limit: number;
  ratingAvg: number;
  ratingCount: number;
}

interface SalonReviewsProps {
  businessId: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

export const SalonReviews = React.memo(function SalonReviews({ businessId }: SalonReviewsProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!businessId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<ReviewsResponse>(`/businesses/${businessId}/reviews`, {
          params: { page: 1, limit: 20 },
        });
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load reviews');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#1C1C1E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const reviews = data?.data ?? [];
  const ratingAvg = data?.ratingAvg ?? 0;
  const ratingCount = data?.ratingCount ?? 0;
  const ratingStr = ratingAvg.toFixed(1).replace('.', ',');

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingBig}>{ratingStr}</Text>
        </View>
        <View style={styles.ratingRight}>
          <Text style={styles.reviewCount}>
            {ratingCount === 0 ? 'No reviews yet' : `${ratingCount} review${ratingCount === 1 ? '' : 's'}`}
          </Text>
        </View>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsList}>
        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>No reviews yet</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewRating}>{review.rating}</Text>
                <Ionicons name="star" size={14} color="#000" />
                {review.clientName ? (
                  <Text style={styles.reviewAuthor}> · {review.clientName}</Text>
                ) : null}
              </View>
              {review.comment ? (
                <Text style={styles.reviewText}>{review.comment}</Text>
              ) : null}
              <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingLeft: {
    backgroundColor: '#1C1C1E',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBig: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  ratingRight: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  reviewCount: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  reviewsList: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  reviewAuthor: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
});
