import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get(`https://example.com/api/users/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }).then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('https://example.com/api/login', {
      email,
      password,
    });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };