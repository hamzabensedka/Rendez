import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';

const OwnerDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const queryClient = useQueryClient();

  const fetchBusinesses = async () => {
    const response = await fetch('https://example.com/api/businesses');
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useQuery('businesses', fetchBusinesses);

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
          <View style={styles.business}>
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
  business: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default OwnerDashboard;