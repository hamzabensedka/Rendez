import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { patchProfile } from '../api/profile';
import { ExpoRouter } from 'expo-router';
import { Auth } from '../auth';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const { data, error, isLoading } = useQuery('profile', async () => {
    const response = await fetch('/api/users/me');
    return response.json();
  });
  const { mutate } = useMutation('patchProfile', async (profile) => {
    await patchProfile(profile);
  });

  const handleEditProfile = async () => {
    try {
      await mutate({ name, phone, avatar });
      Alert.alert('Profile updated successfully');
    } catch (error) {
      Alert.alert('Error updating profile');
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder='Name'
      />
      <TextInput
        value={phone}
        onChangeText={(text) => setPhone(text)}
        placeholder='Phone'
      />
      <TouchableOpacity onPress={handleEditProfile}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      {avatar && (
        <Image source={{ uri: avatar }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
};

export default ProfileScreen;