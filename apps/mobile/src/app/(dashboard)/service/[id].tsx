import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/lib/api-client';
import type { Service } from '@/types/service';
import { useState, useEffect } from 'react';

export default function QuickServiceEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await apiClient.get(`/provider/services/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDuration(String(service.durationMinutes));
      setPrice(String(service.price));
    }
  }, [service]);

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; durationMinutes: number; price: number }) => {
      return apiClient.put(`/provider/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      Alert.alert('Success', 'Service updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update service. Please try again.');
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Service name is required');
      return;
    }
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Validation', 'Please enter a valid duration in minutes');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Validation', 'Please enter a valid price');
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      durationMinutes: durationNum,
      price: priceNum,
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading service...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Quick Service Edit</Text>
      <Text style={styles.subtitle}>
        Update service details quickly
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Service Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Men's Haircut"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g. 30"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="e.g. 25.00"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.actions}>
        <Button
          variant="outline"
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onPress={handleSave}
          loading={updateMutation.isPending}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
