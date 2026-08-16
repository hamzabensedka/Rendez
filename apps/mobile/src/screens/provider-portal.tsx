import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { auth } from '../auth';
import { business } from '../business';
import { staff } from '../staff';

const ProviderPortal = () => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery('user', () => auth.getCurrentUser());
  const { data: businesses } = useQuery('businesses', () => business.getBusinesses(user.id));
  const { data: staffMembers } = useQuery('staff', () => staff.getStaffMembers(user.id));

  return (
    <View style={styles.container}>
      <Text>Provider Business Owner Portal</Text>
      <Text>Welcome, {user.name}!</Text>
      <Text>Businesses:</Text>
      {businesses.map((business) => (
        <View key={business.id}>
          <Text>{business.name}</Text>
        </View>
      ))}
      <Text>Staff Members:</Text>
      {staffMembers.map((staffMember) => (
        <View key={staffMember.id}>
          <Text>{staffMember.name}</Text>
        </View>
      ))}
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

export default ProviderPortal;