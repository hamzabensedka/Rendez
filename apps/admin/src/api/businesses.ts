import axios from 'axios';

const businessesApi = axios.create({
  baseURL: 'http://localhost:3000/api/businesses'
});

export const getBusinesses = async () => {
  const response = await businessesApi.get('/');
  return response.data;
};