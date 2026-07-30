import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { patchProfile } from '../api';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const queryClient = useQueryClient();

  const handleEditProfile = async () => {
    try {
      await patchProfile({ name, phone, avatar });
      queryClient.invalidateQueries('profile');
    } catch (error) {
      console.error(error);
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
      <TextInput
        value={avatar}
        onChangeText={(text) => setAvatar(text)}
        placeholder='Avatar'
      />
      <Button title='Edit Profile' onPress={handleEditProfile} />
    </View>
  );
};

export default ProfileScreen;