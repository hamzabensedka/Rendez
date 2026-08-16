import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OwnerDashboard from './OwnerDashboard';
import StaffManagement from './StaffManagement';

const Stack = createNativeStackNavigator();

const ProviderPortal = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Owner Dashboard" component={OwnerDashboard} />
        <Stack.Screen name="Staff Management" component={StaffManagement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProviderPortal;