import React from 'react';
import { View, Text, FlatList } from 'react-native';

const SalonReviews = ({ reviews }) => {
  return (
    <View>
      <Text>Salon Reviews:</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.rating}/5</Text>
            <Text>{item.review}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SalonReviews;
