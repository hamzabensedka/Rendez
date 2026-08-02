import axios from 'axios';

export const fetchReviews = async (salonId: number) => {
  const response = await axios.get(`https://example.com/reviews?salonId=${salonId}`);
  return response.data;
};

export const submitReview = async (review: { salonId: number; rating: number; review: string }) => {
  const response = await axios.post('https://example.com/reviews', review);
  return response.data;
};