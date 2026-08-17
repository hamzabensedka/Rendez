import { Router, Route } from 'expo-router';
import ProfileScreen from './features/profile/ProfileScreen';

const router = new Router();

router.register(
  {
    path: 'profile',
    component: ProfileScreen,
  }
);

export default router;