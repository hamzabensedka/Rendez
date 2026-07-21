import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { patchProfile } from '../api/profile';
import { ExpoRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const { data, isLoading, isError } = useQuery('profile', async () => {
    const response = await fetch('/api/users/me');
    return response.json();
  });
  const { mutate, isLoading: isMutating } = useMutation('updateProfile', async (newData) => {
    await patchProfile(newData);
  });

  const handleUpdate = () => {
    mutate({ name, phone, avatar });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: data.avatar }} style={styles.avatar} />
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder='Name'
        style={styles.input}
      />
      <TextInput
        value={phone}
        onChangeText={(text) => setPhone(text)}
        placeholder='Phone'
        style={styles.input}
      />
      <TouchableOpacity onPress={handleUpdate}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
});

export default ProfileScreen;