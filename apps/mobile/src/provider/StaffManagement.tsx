import React from 'react';
import api from '../../api';

const StaffManagement = () => {
  const [staff, setStaff] = React.useState([]);

  const getStaff = async () => {
    const response = await api.get('/staff');
    setStaff(response.data);
  };

  React.useEffect(() => {
    getStaff();
  }, []);

  return (
    <div>
      {staff.map((staffMember) => (
        <div key={staffMember.id}>{staffMember.name}</div>
      ))}
    </div>
  );
};

export default StaffManagement;