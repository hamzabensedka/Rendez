import React from 'react';
import { Box, Text } from 'packages/ui';
import BookingsTable from './BookingsTable';
import BusinessesTable from './BusinessesTable';
import UsersTable from './UsersTable';

const AdminDashboard = () => {
  return (
    <Box>
      <Text variant="h1">Admin Dashboard</Text>
      <BookingsTable />
      <BusinessesTable />
      <UsersTable />
    </Box>
  );
};

export default AdminDashboard;