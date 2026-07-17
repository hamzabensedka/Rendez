import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/apiClient';
import { UserProfile } from '../../types/user';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/profile');
      return response.data;
    },
    onSuccess: (data: UserProfile) => {
      setName(data.name || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatarUrl || '');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      const response = await apiClient.patch('/profile', profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile';
      Alert.alert('Error', message);
    },
  });

  const handleEdit = useCallback(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatarUrl || '');
    }
    setIsEditing(true);
  }, [profile]);

  const handleCancel = useCallback(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatarUrl || '');
    }
    setIsEditing(false);
  }, [profile]);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    const updatedFields: Partial<UserProfile> = {};

    if (name.trim() !== (profile?.name || '')) {
      updatedFields.name = name.trim();
    }
    if (phone.trim() !== (profile?.phone || '')) {
      updatedFields.phone = phone.trim();
    }
    if (avatarUrl.trim() !== (profile?.avatarUrl || '')) {
      updatedFields.avatarUrl = avatarUrl.trim();
    }

    if (Object.keys(updatedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    updateProfileMutation.mutate(updatedFields);
  }, [name, phone, avatarUrl, profile, updateProfileMutation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90D9" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorTitle}>Failed to load profile</Text>
        <Text style={styles.errorMessage}>
          {(error as any)?.message || 'An unexpected error occurred'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Ionicons name="create-outline" size={22} color="#4A90D9" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {(name || user?.email || '?').charAt(0).toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#999" />
                </View>
              )}
            </View>
            {isEditing && (
              <View style={styles.avatarUrlInput}>
                <Text style={styles.fieldLabel}>Avatar URL</Text>
                <TextInput
                  style={styles.textInput}
                  value={avatarUrl}
                  onChangeText={setAvatarUrl}
                  placeholder="https://example.com/avatar.jpg"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>
            )}
          </View>

          {/* Profile Fields */}
          <View style={styles.fieldsContainer}>
            {/* Email (read-only) */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyValue}>{user?.email || 'N/A'}</Text>
                <Ionicons name="lock-closed-outline" size={16} color="#999" />
              </View>
            </View>

            {/* Name */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  autoCapitalize="words"
                  maxLength={100}
                />
              ) : (
                <View style={styles.readOnlyField}>
                  <Text style={styles.readOnlyValue}>{name || 'Not set'}</Text>
                </View>
              )}
            </View>

            {/* Phone */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 (555) 000-0000"
                  keyboardType="phone-pad"
                  maxLength={20}
                />
              ) : (
                <View style={styles.readOnlyField}>
                  <Text style={styles.readOnlyValue}>{phone || 'Not set'}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Save Button (editing mode) */}
          {isEditing && (
            <TouchableOpacity
              style={[
                styles.saveButton,
                updateProfileMutation.isPending && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Sign Out */}
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 32,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#4A90D9',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EBF2FD',
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90D9',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8ECF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90D9',
  },
  avatarUrlInput: {
    width: '100%',
  },
  fieldsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldRow: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#FF3B30',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD4D2',
    backgroundColor: '#FFF',
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
