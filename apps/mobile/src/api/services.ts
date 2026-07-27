import axios from 'axios';

const getProviderServices = async (providerId: number) => {
  const response = await axios.get(`https://example.com/api/services?providerId=${providerId}`);
  return response.data;
};

export { getProviderServices };