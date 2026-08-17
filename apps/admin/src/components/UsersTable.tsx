import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { UsersService } from '../api/users';

const UsersTable = () => {
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async () => {
    const usersService = new UsersService();
    const data = await usersService.getAllUsers();
    setUsers(data);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Users Table</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
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

export default UsersTable;