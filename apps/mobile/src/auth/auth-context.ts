import api from '../api';
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (credentials: any) => {
    const response = await api.post('/login', credentials);
    setUser(response.data);
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    setUser(response.data);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return { user, login, logout };
};

export default useAuth;