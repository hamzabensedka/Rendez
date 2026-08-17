import axios from 'axios';

const getUserProfile = async (userId: number) => {
  const response = await axios.get(`https://example.com/api/users/${userId}`);
  return response.data;
};

export { getUserProfile };