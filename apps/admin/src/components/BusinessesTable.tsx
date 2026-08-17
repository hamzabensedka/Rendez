import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessesTable = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get('/api/businesses')
      .then(response => {
        setBusinesses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {businesses.map(business => (
          <tr key={business.id}>
            <td>{business.id}</td>
            <td>{business.name}</td>
            <td>{business.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BusinessesTable;