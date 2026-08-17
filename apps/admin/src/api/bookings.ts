import axios from 'axios';

const bookingsApi = axios.create({
  baseURL: 'http://localhost:3000/api/bookings'
});

export const getBookings = async () => {
  const response = await bookingsApi.get('/');
  return response.data;
};