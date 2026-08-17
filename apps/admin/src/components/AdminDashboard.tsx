import React from 'react';
import { UsersTable } from './UsersTable';
import { BusinessesTable } from './BusinessesTable';
import { BookingsTable } from './BookingsTable';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UsersTable />
      <BusinessesTable />
      <BookingsTable />
    </div>
  );
};

export default AdminDashboard;