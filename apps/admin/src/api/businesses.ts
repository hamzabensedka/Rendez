import { axios } from 'axios';

const getBusinesses = async () => {
  const response = await axios.get('http://localhost:3000/api/businesses');
  return response.data;
};

export { getBusinesses };