import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { StarRatingInput } from './StarRatingInput';
import { useSubmitReview } from '../hooks/useSubmitReview';

interface SubmitReviewModalProps {
  visible: boolean;
  onClose: () => void;
  businessId: string;
  appointmentId?: string;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  visible,
  onClose,
  businessId,
  appointmentId,
}) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutate: submitReview, isLoading } = useSubmitReview();

  const handleSubmit = useCallback(() => {
    if (rating === 0) return;

    submitReview(
      {
        businessId,
        appointmentId,
        rating,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setRating(0);
          setComment('');
          onClose();
        },
      }
    );
  }, [rating, comment, businessId, appointmentId, submitReview, onClose]);

  const isSubmitDisabled = rating === 0 || isLoading;

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close review modal">
              <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Write a Review</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.content}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Your Rating</Text>
            <View style={styles.ratingWrapper}>
              <StarRatingInput rating={rating} onRatingChange={setRating} size={40} />
            </View>
            {rating > 0 && (
              <Text style={[styles.ratingHint, { color: theme.colors.warning }]}>
                {rating === 5 ? 'Excellent!' : rating >= 4 ? 'Very Good' : rating >= 3 ? 'Good' : rating >= 2 ? 'Fair' : 'Poor'}
              </Text>
            )}

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Your Review (optional)</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                },
              ]}
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
              {comment.length}/500
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isSubmitDisabled ? theme.colors.disabled : theme.colors.primary },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            accessibilityLabel="Submit review"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingHint: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
