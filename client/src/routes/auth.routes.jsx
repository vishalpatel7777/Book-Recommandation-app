import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ResetPassword from '../pages/auth/ResetPassword';

const authRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
];

export default authRoutes;