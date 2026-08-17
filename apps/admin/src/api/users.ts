import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:3000/api/users'
});

export const getUsers = async () => {
  const response = await usersApi.get('/');
  return response.data;
};