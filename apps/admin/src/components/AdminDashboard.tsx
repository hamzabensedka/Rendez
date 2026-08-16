import React from 'react';
import { Container, Header, Title, Content } from './styles';
import BookingsTable from '../../components/BookingsTable';
import BusinessesTable from '../../components/BusinessesTable';
import UsersTable from '../../components/UsersTable';

const AdminDashboard = () => {
  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
      </Header>
      <Content>
        <BookingsTable />
        <BusinessesTable />
        <UsersTable />
      </Content>
    </Container>
  );
};

export default AdminDashboard;