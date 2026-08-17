import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api';
import { useAuth } from '../auth';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery(['userProfile', user.id], () => getUserProfile(user.id));

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text>{data.name}</Text>
      <Text>{data.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
