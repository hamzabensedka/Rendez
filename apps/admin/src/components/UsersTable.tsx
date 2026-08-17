import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { api } from '../api/users';

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Users Table</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.user}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  user: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default UsersTable;