import React from 'react';
import api from '../../api';

const OwnerDashboard = () => {
  const [businesses, setBusinesses] = React.useState([]);

  const getBusinesses = async () => {
    const response = await api.get('/businesses');
    setBusinesses(response.data);
  };

  React.useEffect(() => {
    getBusinesses();
  }, []);

  return (
    <div>
      {businesses.map((business) => (
        <div key={business.id}>{business.name}</div>
      ))}
    </div>
  );
};

export default OwnerDashboard;