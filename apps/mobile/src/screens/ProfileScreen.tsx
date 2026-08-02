import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchProfile } from '../api';
import { ExpoRouter } from '../navigation';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
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

  const handleUpdateProfile = async () => {
    try {
      await mutate({ name, phone, avatar });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <Image source={{ uri: avatar }} />
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Name"
      />
      <TextInput
        value={phone}
        onChangeText={(text) => setPhone(text)}
        placeholder="Phone"
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

export default ProfileScreen;