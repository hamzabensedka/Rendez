import api from './api';

const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

const createReview = async (review: any) => {
  const response = await api.post('/reviews', review);
  return response.data;
};

export { getReviews, createReview };