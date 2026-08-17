import { queryClient } from '../queryClient';
import { api } from '../api';

export const getReviews = async () => {
  const response = await api.get('reviews');
  return response.data;
};

export const submitReview = async (data: { text: string; rating: number }) => {
  const response = await api.post('reviews', data);
  queryClient.invalidateQueries('reviews');
  return response.data;
};