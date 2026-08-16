import { Route } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { ProviderPortalLayout } from '../../features/providerPortal/components/ProviderPortalLayout';

const ProviderPortalScreen = () => {
  return (
    <View>
      <ProviderPortalLayout />
    </View>
  );
};

export const ProviderPortalRoute = () => {
  return (
    <Route
      path='/provider-portal'
      component={ProviderPortalScreen}
    />
  );
};