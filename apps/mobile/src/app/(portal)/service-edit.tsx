import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@planity/shared/types';

type ServiceFormData = {
  name: string;
  description: string;
  duration: string;
  price: string;
};

export default function ServiceEditScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!serviceId;

  const [form, setForm] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: '30',
    price: '',
  });

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/provider/services/${serviceId}`);
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        description: service.description || '',
        duration: String(service.duration),
        price: String(service.price / 100),
      });
    }
  }, [service]);

  const saveMutation = useMutation({
    mutationFn: async (formData: ServiceFormData) => {
      const payload = {
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration, 10),
        price: Math.round(parseFloat(formData.price) * 100),
      };

      if (isEditing) {
        const { data } = await apiClient.patch(
          `/provider/services/${serviceId}`,
          payload
        );
        return data;
      } else {
        const { data } = await apiClient.post('/provider/services', payload);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['provider-services'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save service.'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/provider/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['provider-services'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to delete service.'
      );
    },
  });

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Service name is required.');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      Alert.alert('Validation', 'Please enter a valid price.');
      return;
    }
    saveMutation.mutate(form);
  }, [form, saveMutation]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  }, [deleteMutation]);

  if (isEditing && isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <Animated.View entering={SlideInRight} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Service' : 'New Service'}
        </Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100)} style={styles.fieldGroup}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            placeholder="e.g., Haircut & Styling"
            placeholderTextColor="#9CA3AF"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown(200)} style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, description: text }))
            }
            placeholder="Describe the service..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown(300)} style={styles.row}>
          <View style={[styles.fieldGroup, styles.flex1]}>
            <Text style={styles.label}>Duration (min)</Text>
            <TextInput
              style={styles.input}
              value={form.duration}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, duration: text }))
              }
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={[styles.fieldGroup, styles.flex1]}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, price: text }))
              }
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown(400)} style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.saveButton, saveMutation.isPending && styles.disabledButton]}
            onPress={handleSave}
            disabled={saveMutation.isPending}
            activeOpacity={0.8}
          >
            {saveMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Service' : 'Create Service'}
              </Text>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={deleteMutation.isPending}
              activeOpacity={0.8}
            >
              {deleteMutation.isPending ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <Text style={styles.deleteButtonText}>Delete Service</Text>
              )}
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F293B',
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  formContent: {
    padding: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F293B',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  buttonGroup: {
    marginTop: 12,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
