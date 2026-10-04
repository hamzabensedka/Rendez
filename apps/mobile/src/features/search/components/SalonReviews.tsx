import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../shared/lib/api';
import { providerTheme as T } from '../../../application/theme/providerTheme';

export interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  clientName: string;
}

export interface ReviewsResponse {
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

export const REVIEW_PREVIEW_LIMIT = 3;
export const REVIEWS_PAGE_SIZE = 20;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

export function ReviewCard({ review }: { review: ApiReview }) {
  const who = [review.clientName, formatDate(review.createdAt)].filter(Boolean).join(' · ');
  return (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewWho}>{who}</Text>
      {review.comment ? <Text style={styles.reviewText}>“{review.comment}”</Text> : null}
    </View>
  );
}

export const SalonReviews = React.memo(function SalonReviews({ businessId }: SalonReviewsProps) {
  const router = useRouter();
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
          params: { page: 1, limit: REVIEW_PREVIEW_LIMIT },
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
        <ActivityIndicator size="small" color={T.colors.ink} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>{error}</Text>
      </View>
    );
  }

  const reviews = data?.data ?? [];
  const first = reviews[0];
  const total = data?.total ?? data?.ratingCount ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews</Text>
      {first?.comment ? (
        <>
          <Text style={styles.quote}>“{first.comment}”</Text>
          {first.clientName ? <Text style={styles.by}>— {first.clientName}</Text> : null}
        </>
      ) : (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
      {total > 0 ? (
        <Pressable
          style={styles.all}
          onPress={() => router.push(`/(main)/business/${businessId}/reviews`)}
          accessibilityRole="button"
          accessibilityLabel="All reviews"
        >
          <Text style={styles.allText}>All reviews</Text>
        </Pressable>
      ) : (
        <Text style={styles.muted}>No reviews yet</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: T.colors.paper,
  },
  heading: {
    fontFamily: T.font.display,
    fontSize: 16,
    color: T.colors.ink,
    marginBottom: 12,
  },
  quote: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 22,
    color: T.colors.ink,
  },
  by: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    marginTop: 8,
  },
  all: { paddingVertical: 16 },
  allText: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    textDecorationLine: 'underline',
  },
  reviewItem: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  reviewWho: { fontFamily: T.font.medium, fontSize: 13, color: T.colors.muted, marginBottom: 6 },
  reviewText: { fontFamily: T.font.body, fontSize: 16, lineHeight: 22, color: T.colors.ink },
  muted: { fontFamily: T.font.body, fontSize: 14, color: T.colors.muted },
});
