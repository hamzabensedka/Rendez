import axios from 'axios';

const getProviderAppointments = async (providerId: number) => {
  const response = await axios.get(`https://example.com/api/appointments?providerId=${providerId}`);
  return response.data;
};

export { getProviderAppointments };