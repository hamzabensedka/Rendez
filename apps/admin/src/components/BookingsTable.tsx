import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { api } from '../api/bookings';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await api.getBookings();
      setBookings(response.data);
    };
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bookings Table</Text>
      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <View style={styles.booking}>
            <Text>{item.id}</Text>
            <Text>{item.date}</Text>
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
  booking: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default BookingsTable;