import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from './styles';
import axios from 'axios';

const BusinessesTable = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get('/api/businesses').then(response => {
      setBusinesses(response.data);
    });
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Latitude</TableCell>
          <TableCell>Longitude</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {businesses.map(business => (
          <TableRow key={business.id}>
            <TableCell>{business.id}</TableCell>
            <TableCell>{business.name}</TableCell>
            <TableCell>{business.category}</TableCell>
            <TableCell>{business.lat}</TableCell>
            <TableCell>{business.lng}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BusinessesTable;