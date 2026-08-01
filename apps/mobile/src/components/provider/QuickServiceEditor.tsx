import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { getProviderServices, updateService } from '../../api/provider.service';

export function QuickServiceEditor() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');

  const { data: services, isLoading } = useQuery({
    queryKey: ['provider-services'],
    queryFn: getProviderServices,
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-services'] });
      setEditingId(null);
      Alert.alert('Success', 'Service updated successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update service. Please try again.');
    },
  });

  const startEditing = (service: any) => {
    setEditingId(service.id);
    setEditName(service.name);
    setEditPrice(service.price?.toString() || '');
    setEditDuration(service.duration?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
    setEditDuration('');
  };

  const saveEditing = () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Service name is required');
      return;
    }

    updateMutation.mutate({
      id: editingId!,
      name: editName.trim(),
      price: parseFloat(editPrice) || 0,
      duration: parseInt(editDuration, 10) || 30,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4F46E5" />
      </View>
    );
  }

  const services = data || [];

  return (
    <View style={styles.container}>
      {services.slice(0, 5).map((service: any) => (
        <View key={service.id} style={styles.serviceItem}>
          {editingId === service.id ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Service name"
                placeholderTextColor="#9CA3AF"
                autoFocus
              />
              <View style={styles.editRow}>
                <View style={styles.editField}>
                  <Text style={styles.editLabel}>Price ($)</Text>
                  <TextInput
                    style={styles.inputSmall}
                    value={editPrice}
                    onChangeText={setEditPrice}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.editField}>
                  <Text style={styles.editLabel}>Duration (min)</Text>
                  <TextInput
                    style={styles.inputSmall}
                    value={editDuration}
                    onChangeText={setEditDuration}
                    keyboardType="number-pad"
                    placeholder="30"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEditing}
                  disabled={updateMutation.isPending}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, updateMutation.isPending && styles.buttonDisabled]}
                  onPress={saveEditing}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceMeta}>
                  ${service.price} · {service.duration} min
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(service)}
              >
                <Ionicons name="pencil" size={18} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {services.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No services added yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  serviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  serviceMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editForm: {
    padding: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },
  editRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  editField: {
    flex: 1,
  },
  editLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  inputSmall: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
