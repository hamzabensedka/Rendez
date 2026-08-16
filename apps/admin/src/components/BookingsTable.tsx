import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from './styles';
import axios from 'axios';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/api/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>User ID</TableCell>
          <TableCell>Business ID</TableCell>
          <TableCell>Service ID</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {bookings.map(booking => (
          <TableRow key={booking.id}>
            <TableCell>{booking.id}</TableCell>
            <TableCell>{booking.userId}</TableCell>
            <TableCell>{booking.businessId}</TableCell>
            <TableCell>{booking.serviceId}</TableCell>
            <TableCell>{booking.start}</TableCell>
            <TableCell>{booking.end}</TableCell>
            <TableCell>{booking.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingsTable;