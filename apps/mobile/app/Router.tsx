import { Router, Route } from 'expo-router';
import React from 'react';
import ProfileScreen from '../features/profile/pages/ProfileScreen';

const RouterComponent = () => {
  return (
    <Router>
      <Route path='/profile' component={ProfileScreen} />
    </Router>
  );
};

export default RouterComponent;