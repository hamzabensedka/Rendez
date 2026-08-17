import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from './components/AdminDashboard';
import BookingsTable from './components/BookingsTable';
import BusinessesTable from './components/BusinessesTable';
import UsersTable from './components/UsersTable';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Admin Dashboard" component={AdminDashboard} />
        <Stack.Screen name="Bookings Table" component={BookingsTable} />
        <Stack.Screen name="Businesses Table" component={BusinessesTable} />
        <Stack.Screen name="Users Table" component={UsersTable} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;