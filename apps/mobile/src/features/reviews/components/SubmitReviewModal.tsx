import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { StarRatingInput } from './StarRatingInput';
import { useSubmitReview } from '../hooks/useSubmitReview';

interface SubmitReviewModalProps {
  visible: boolean;
  onClose: () => void;
  businessId: string;
  appointmentId?: string;
  onSubmitted?: () => void;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  visible,
  onClose,
  businessId,
  appointmentId,
  onSubmitted,
}) => {
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { submitReview, isSubmitting } = useSubmitReview();

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating before submitting.');
      return;
    }

    try {
      await submitReview({
        businessId,
        appointmentId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment('');
      onSubmitted?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  }, [rating, comment, businessId, appointmentId, submitReview, onSubmitted, onClose]);

  const handleClose = useCallback(() => {
    setRating(0);
    setComment('');
    onClose();
  }, [onClose]);

  const isValid = rating > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} accessibilityRole="button" accessibilityLabel="Close review form">
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Write a Review</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.text }]}>Your Rating</Text>
          <View style={styles.starContainer}>
            <StarRatingInput rating={rating} onRatingChange={setRating} size={40} />
          </View>
          <Text style={[styles.ratingHint, { color: colors.textSecondary }]}>
            {rating === 0
              ? 'Tap a star to rate'
              : rating === 5
              ? 'Excellent!'
              : rating === 4
              ? 'Very good'
              : rating === 3
              ? 'Good'
              : rating === 2
              ? 'Fair'
              : 'Poor'}
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>
            Your Review (optional)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            placeholder="Share your experience..."
            placeholderTextColor={colors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
            accessibilityLabel="Review comment"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {comment.length}/1000
          </Text>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isValid ? colors.primary : colors.borderLight },
            ]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Submit review"
            accessibilityState={{ disabled: !isValid || isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  starContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ratingHint: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
