import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  rating: number;
  text: string;
  date: string;
  response?: {
    author: string;
    text: string;
  };
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5.0,
    text: "Magnifique j'ai fais une Barbie j'adore ! Grazie Mille 💅🏼💗",
    date: '08/11/2025',
    response: {
      author: 'Sophia B',
      text: 'Merci',
    },
  },
  {
    id: '2',
    rating: 5.0,
    text: "Je suis très contente des extensions très douce malgré qu'il me restait de la colle dans les cils à cause des faux cils , patiente et très gentille !",
    date: '15/09/2025',
    response: {
      author: 'Sophia B',
      text: 'Merci a vous faut eviter de venir avec des faux cils ❤️ merci de votre retour',
    },
  },
  {
    id: '3',
    rating: 5.0,
    text: "Des ongles parfaits et un personnel au top je recommande +++",
    date: '06/01/2026',
    response: {
      author: 'Sophia B',
      text: 'Merci',
    },
  },
  {
    id: '4',
    rating: 5.0,
    text: "Parfait comme d'habitude !",
    date: '04/01/2026',
    response: {
      author: 'Sophia B',
      text: 'Merci',
    },
  },
];

export const SalonReviews = React.memo(function SalonReviews() {
  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingBig}>4,9</Text>
        </View>
        <View style={styles.ratingRight}>
          <View style={styles.criteriaRow}>
            <Text style={styles.criteriaLabel}>Accueil</Text>
            <View style={styles.criteriaValueContainer}>
              <Text style={styles.criteriaValue}>4,9</Text>
              <Ionicons name="star" size={12} color="#000" />
            </View>
          </View>
          <View style={styles.criteriaRow}>
            <Text style={styles.criteriaLabel}>Propreté</Text>
            <View style={styles.criteriaValueContainer}>
              <Text style={styles.criteriaValue}>4,9</Text>
              <Ionicons name="star" size={12} color="#000" />
            </View>
          </View>
          <View style={styles.criteriaRow}>
            <Text style={styles.criteriaLabel}>Cadre & Ambiance</Text>
            <View style={styles.criteriaValueContainer}>
              <Text style={styles.criteriaValue}>4,9</Text>
              <Ionicons name="star" size={12} color="#000" />
            </View>
          </View>
          <View style={styles.criteriaRow}>
            <Text style={styles.criteriaLabel}>Service quality</Text>
            <View style={styles.criteriaValueContainer}>
              <Text style={styles.criteriaValue}>4,9</Text>
              <Ionicons name="star" size={12} color="#000" />
            </View>
          </View>
          <Text style={styles.reviewCount}>315 reviews</Text>
        </View>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsList}>
        {MOCK_REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewRating}>{review.rating.toString().replace('.', ',')}</Text>
              <Ionicons name="star" size={14} color="#000" />
            </View>
            
            <Text style={styles.reviewText}>{review.text}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>

            {review.response && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseAuthor}>Réponse de {review.response.author}</Text>
                <Text style={styles.responseText}>{review.response.text}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity style={styles.pageButton} disabled>
          <Ionicons name="arrow-back" size={16} color="#E5E5EA" />
          <Text style={[styles.pageButtonText, styles.pageButtonDisabled]}>Page précédente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pageButton}>
          <Text style={styles.pageButtonText}>Page suivante</Text>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </TouchableOpacity>
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
  },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  criteriaLabel: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  criteriaValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criteriaValue: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  reviewsList: {
    marginBottom: 16,
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
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  responseAuthor: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginHorizontal: 8,
  },
  pageButtonDisabled: {
    color: '#E5E5EA',
  },
});
