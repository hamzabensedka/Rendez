import axios from 'axios';

const getReviews = async () => {
  try {
    const response = await axios.get('https://example.com/reviews');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const postReview = async (reviewData) => {
  try {
    const response = await axios.post('https://example.com/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getReviews, postReview };