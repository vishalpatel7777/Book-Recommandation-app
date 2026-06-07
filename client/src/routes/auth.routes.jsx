import theme from '../config/theme.config';
import PATHS from '../config/paths';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ResetPassword from '../pages/auth/ResetPassword';

const authRoutes = [
  { path: PATHS.LOGIN, element: <Login /> },
  { path: PATHS.SIGNUP, element: <Signup /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },
];

export default authRoutes;