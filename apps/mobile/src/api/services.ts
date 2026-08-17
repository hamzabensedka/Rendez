import api from './api';

const getServices = async (providerId: number) => {
  const response = await api.get(`/services?providerId=${providerId}`);
  return response.data;
};

export default getServices;