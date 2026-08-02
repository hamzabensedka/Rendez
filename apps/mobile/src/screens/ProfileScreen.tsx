import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchProfile } from '../api/profile';
import { ExpoRouter } from 'expo-router';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (profileData) => {
      const response = await patchProfile(profileData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      },
    }
  );

  const handleUpdateProfile = () => {
    mutate({ name, phone, avatar });
  };

  return (
    <View>
      <Text>Profile Screen</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        placeholder="Avatar"
        value={avatar}
        onChangeText={(text) => setAvatar(text)}
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

export default ProfileScreen;