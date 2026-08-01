import axios from 'axios';

const paymentApi = {
  makePayment: async () => {
    try {
      const response = await axios.post('https://example.com/payment');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentApi;