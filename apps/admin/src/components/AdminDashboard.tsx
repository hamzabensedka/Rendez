import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BookingsTable from './BookingsTable';
import BusinessesTable from './BusinessesTable';
import UsersTable from './UsersTable';

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text>Admin Dashboard</Text>
      <BookingsTable />
      <BusinessesTable />
      <UsersTable />
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

export default AdminDashboard;