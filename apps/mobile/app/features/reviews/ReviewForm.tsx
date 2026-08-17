import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './ReviewForm.styles';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, review });
  };

  return (
    <View style={styles.container}>
      <Text>Rating:</Text>
      <TextInput
        style={styles.ratingInput}
        keyboardType="numeric"
        value={rating.toString()}
        onChangeText={(text) => setRating(parseInt(text))}
      />
      <Text>Review:</Text>
      <TextInput
        style={styles.reviewInput}
        multiline
        value={review}
        onChangeText={(text) => setReview(text)}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewForm;