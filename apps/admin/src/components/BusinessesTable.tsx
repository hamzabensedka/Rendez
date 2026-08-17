import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { api } from '../api/businesses';

const BusinessesTable = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const response = await api.getBusinesses();
      setBusinesses(response.data);
    };
    fetchBusinesses();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Businesses Table</Text>
      <FlatList
        data={businesses}
        renderItem={({ item }) => (
          <View style={styles.business}>
            <Text>{item.name}</Text>
            <Text>{item.address}</Text>
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
  business: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default BusinessesTable;