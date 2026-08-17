import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../api/userApi';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(['userProfile'], () => getUserProfile(user.id));

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: data.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.email}>{data.email}</Text>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#666',
  },
});

export default ProfileScreen;