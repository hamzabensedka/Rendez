import api from './api';

const getAppointments = async (providerId: number) => {
  const response = await api.get(`/appointments?providerId=${providerId}`);
  return response.data;
};

export default getAppointments;