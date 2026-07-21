import axios from 'axios';

const getReviews = async () => {
  try {
    const response = await axios.get('/api/reviews');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const submitReview = async (review) => {
  try {
    const response = await axios.post('/api/reviews', review);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getReviews, submitReview };