import { fetch } from '../../utils/fetch';

export const getSalonReviews = async () => {
  const response = await fetch('https://example.com/api/reviews');
  return response.json();
};

export const submitReview = async (data: { rating: number; comment: string }) => {
  const response = await fetch('https://example.com/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};