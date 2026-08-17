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
          <th>Date</th>
          <th>Time</th>
          <th>Business</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(booking => (
          <tr key={booking.id}>
            <td>{booking.id}</td>
            <td>{booking.date}</td>
            <td>{booking.time}</td>
            <td>{booking.business.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingsTable;