import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { patchProfile } from '../api/profile';
import { ExpoRouter } from 'expo-router';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const queryClient = useQueryClient();

  const handleUpdateProfile = async () => {
    try {
      await patchProfile({ name, phone, avatar });
      await queryClient.invalidateQueries('profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder='Name'
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder='Phone'
      />
      <TextInput
        value={avatar}
        onChangeText={setAvatar}
        placeholder='Avatar'
      />
      <Button title='Update Profile' onPress={handleUpdateProfile} />
    </View>
  );
};

export default ProfileScreen;