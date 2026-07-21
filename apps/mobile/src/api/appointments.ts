import axios from 'axios';

const getUserAppointments = async () => {
  const response = await axios.get('/api/appointments');
  return response.data;
};

export { getUserAppointments };