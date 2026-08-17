import axios from 'axios';

const getUserProfile = async (userId: number) => {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
};

export { getUserProfile };