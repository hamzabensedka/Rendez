import { Route } from 'expo-router';
import DashboardSummary from './pages/provider/dashboard-summary';
import TodaysAppointments from './pages/provider/todays-appointments';
import QuickServiceEdit from './pages/provider/quick-service-edit';

export const ProviderRoutes = (
  <Route path='provider' element={<DashboardSummary />}> 
    <Route path='dashboard' element={<DashboardSummary />} />
    <Route path='todays-appointments' element={<TodaysAppointments />} />
    <Route path='quick-service-edit' element={<QuickServiceEdit />} />
  </Route>
);