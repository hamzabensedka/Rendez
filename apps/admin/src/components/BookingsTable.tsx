import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => {
        setBookings(response.data);
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
          <th>Business ID</th>
          <th>User ID</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(booking => (
          <tr key={booking.id}>
            <td>{booking.id}</td>
            <td>{booking.businessId}</td>
            <td>{booking.userId}</td>
            <td>{booking.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingsTable;