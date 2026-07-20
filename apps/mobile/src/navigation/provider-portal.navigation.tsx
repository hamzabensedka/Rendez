import { createNavigationContainerRef } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DashboardSummary from '../pages/provider-portal/dashboard-summary';
import TodaysAppointments from '../pages/provider-portal/todays-appointments';
import QuickServiceEdit from '../pages/provider-portal/quick-service-edit';

export type ProviderPortalParamList = {
  DashboardSummary: undefined;
  TodaysAppointments: undefined;
  QuickServiceEdit: undefined;
};

const Stack = createStackNavigator<ProviderPortalParamList>();

const ProviderPortalNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='DashboardSummary' component={DashboardSummary} />
      <Stack.Screen name='TodaysAppointments' component={TodaysAppointments} />
      <Stack.Screen name='QuickServiceEdit' component={QuickServiceEdit} />
    </Stack.Navigator>
  );
};

export default ProviderPortalNavigation;
