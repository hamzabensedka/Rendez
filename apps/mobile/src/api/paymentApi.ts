import axios from 'axios';

const paymentApi = axios.create({
  baseURL: 'https://payment-api.com'
});

const makePayment = async () => {
  try {
    const response = await paymentApi.post('/payment');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { makePayment };
