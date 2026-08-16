import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com',
});

const paymentApi = {
  createPaymentMethod: async (paymentMethod) => {
    try {
      const response = await api.post('/payments', paymentMethod);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { paymentApi };