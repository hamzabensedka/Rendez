import axios from 'axios';

const api = axios.create({
  baseURL: 'https://example.com/api',
});

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const submitReview = async (data: { rating: number; comment: string }) => {
  const response = await api.post('/reviews', data);
  return response.data;
};
