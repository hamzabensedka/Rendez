import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRatingInput from '@/features/salary/components/StarRatingInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface SubmitReviewSheetProps {
  businessId: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubmitReviewSheet: React.FC<SubmitReviewSheetProps> = ({
  businessId,
  appointmentId,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const submitReviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment: string; businessId: string; appointmentId?: string }) => {
      const response = await apiClient.post('/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      onSuccess();
      Alert.alert('Succès', 'Votre avis a été publié avec succès !');
    },
    onError: (error: any) => {
      Alert.alert(
        'Erreur',
        error?.response?.data?.message || 'Une erreur est survenue lors de la soumission de votre avis.'
      );
    },
  });

  const handleSubmit = useCallback(() => {
    if (rating === 0) {
      Alert.alert('Note requise', 'Veuillez sélectionner une note avant de soumettre votre avis.');
      return;
    }

    submitReviewMutation.mutate({
      rating,
      comment: comment.trim(),
      businessId,
      appointmentId,
    });
  }, [rating, comment, businessId, appointmentId, submitReviewMutation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.title}>Donner mon avis</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Votre note</Text>
        <View style={styles.starContainer}>
          <StarRatingInput
            value={rating}
            onRatingChange={setRating}
            size={40}
            disabled={submitReviewMutation.isPending}
          />
        </View>

        <Text style={styles.label}>Votre commentaire (optionnel)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Partagez votre expérience..."
          placeholderTextColor="#9CA3AF"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          editable={!submitReviewMutation.isPending}
        />
        <Text style={styles.charCount}>{comment.length}/500</Text>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || submitReviewMutation.isPending) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || submitReviewMutation.isPending}
          activeOpacity={0.8}
        >
          {submitReviewMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Publier mon avis</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  starContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SubmitReviewSheet;
