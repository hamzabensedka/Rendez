import axios from 'axios';

const getBusinessServices = async () => {
  const response = await axios.get('/api/services');
  return response.data;
};

export { getBusinessServices };