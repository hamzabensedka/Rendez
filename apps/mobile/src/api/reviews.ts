import { fetchAPI } from '../../utils/fetchAPI';

const fetchReviews = async () => {
  const response = await fetchAPI('reviews');
  return response.json();
};

const submitReview = async (reviewData) => {
  await fetchAPI('reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

export { fetchReviews, submitReview };