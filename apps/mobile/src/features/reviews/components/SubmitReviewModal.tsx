import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StarRatingInput } from './StarRatingInput';
import { useSubmitReview } from '../hooks/useSubmitReview';

interface SubmitReviewModalProps {
  visible: boolean;
  onClose: () => void;
  businessId: number;
  appointmentId?: number;
  onSubmitted: () => void;
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

  const { mutate: submitReview, isPending } = useMutation(
    async () => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          appointmentId,
          rating,
          comment: comment.trim(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        Alert.alert('Success', 'Your review has been submitted.');
        setRating(0);
        setComment('');
        onSubmitted();
        onClose();
      },
      onError: (error: Error) => {
        Alert.alert('Error', error.message || 'Failed to submit review. Please try again.');
      },
    }
  );

  const handleSubmit = useCallback(() => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating before submitting.');
      return;
    }
    submitReview();
  }, [rating, submitReview]);

  const handleClose = useCallback(() => {
    if (!isPending) {
      onClose();
    }
  }, [isPending, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Write a Review</Text>
            <TouchableOpacity onPress={handleClose} disabled={isPending} accessibilityLabel="Close" accessibilityRole="button">
              <Ionicons name="close" size={28} color={colors.onSurfaceVariant || colors.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingSection}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Your Rating</Text>
            <StarRatingInput
              rating={rating}
              onRatingChange={setRating}
              size={40}
              disabled={isPending}
            />
          </View>

          <View style={styles.commentSection}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Your Review (optional)</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.outlineVariant || colors.border,
                },
              ]}
              placeholder="Share your experience..."
              placeholderTextColor={colors.onSurfaceVariant || colors.placeholder}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isPending}
              maxLength={500}
              accessibilityLabel="Review comment"
            />
            <Text style={[styles.charCount, { color: colors.onSurfaceVariant }]}>
              {comment.length}/500
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary, opacity: isPending || rating === 0 ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={isPending || rating === 0}
            accessibilityRole="button"
            accessibilityLabel="Submit review"
            accessibilityState={{ disabled: isPending || rating === 0 }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.onPrimary }]}>Submit Review</Text>
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
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentSection: {
    marginBottom: 24,
  },
  inputText: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
