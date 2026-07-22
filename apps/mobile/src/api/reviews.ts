import { fetchAPI } from '../utils/fetchAPI';

export const fetchSalonReviews = async () => {
  const response = await fetchAPI('reviews');
  return response.json();
};

export const submitReview = async (data: { rating: number; comment: string }) => {
  const response = await fetchAPI('reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};