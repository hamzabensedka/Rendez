import { axios } from 'axios';

const getBookings = async () => {
  const response = await axios.get('http://localhost:3000/api/bookings');
  return response.data;
};

export { getBookings };