import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const queryClient = useQueryClient();

  const fetchStaff = async () => {
    const response = await fetch('https://example.com/api/staff');
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useQuery('staff', fetchStaff);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.staff}>
            <Text>{item.name}</Text>
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
    alignItems: 'center',
  },
  staff: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default StaffManagement;