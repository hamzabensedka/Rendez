import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { patchProfile } from '../api';
import { ExpoRouter } from 'expo-router';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const { data, error, isLoading } = useQuery('profile', async () => {
    const response = await fetch('/api/users/me');
    return response.json();
  });
  const { mutate } = useMutation('updateProfile', async (newData) => {
    const response = await patchProfile(newData);
    return response.json();
  });

  const handleUpdateProfile = () => {
    mutate({ name, phone, avatar });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Image source={{ uri: data.avatar }} />
      <TextInput value={name} onChangeText={(text) => setName(text)} />
      <TextInput value={phone} onChangeText={(text) => setPhone(text)} />
      <Button title='Update Profile' onPress={handleUpdateProfile} />
    </View>
  );
};

export default ProfileScreen;