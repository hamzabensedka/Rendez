import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BusinessesService } from '../api/businesses';

const BusinessesTable = () => {
  const [businesses, setBusinesses] = React.useState([]);

  const fetchBusinesses = async () => {
    const businessesService = new BusinessesService();
    const data = await businessesService.getAllBusinesses();
    setBusinesses(data);
  };

  React.useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Businesses Table</Text>
      <FlatList
        data={businesses}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Text>{item.name}</Text>
            <Text>{item.categoryId}</Text>
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

export default BusinessesTable;