import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BookingsService } from '../api/bookings';

const BookingsTable = () => {
  const [bookings, setBookings] = React.useState([]);

  const fetchBookings = async () => {
    const bookingsService = new BookingsService();
    const data = await bookingsService.getAllBookings();
    setBookings(data);
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bookings Table</Text>
      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Text>{item.userId}</Text>
            <Text>{item.businessId}</Text>
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

export default BookingsTable;