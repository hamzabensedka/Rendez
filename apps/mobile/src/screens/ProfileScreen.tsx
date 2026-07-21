import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { patchProfile } from '../api/profile';
import { ExpoRouter } from 'expo-router';
import { useAuthentication } from '../hooks/useAuthentication';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const { user, isLoading } = useAuthentication();
  const { mutate: updateProfile } = useMutation(patchProfile);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, phone, avatar });
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