import { useState, useEffect } from 'react';
import { useRoute } from 'expo-router';
import { Auth } from '../auth';

const useUser = () => {
  const [user, setUser] = useState(null);
  const route = useRoute();

  useEffect(() => {
    const fetchUser = async () => {
      const token = route.params.token;
      if (token) {
        const response = await Auth.getUser(token);
        setUser(response.data);
      }
    };
    fetchUser();
  }, [route.params.token]);

  return { data: user };
};

export default useUser;
