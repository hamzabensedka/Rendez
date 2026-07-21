import axios from 'axios';

const getReviews = async () => {
  const response = await axios.get('/api/reviews');
  return response.data;
};

const submitReview = async (data) => {
  const response = await axios.post('/api/reviews', data);
  return response.data;
};

export { getReviews, submitReview };