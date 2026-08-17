import api from '../../../api';

const getUser = async (userId: number) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export default getUser;