import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import RequireAdmin from '../components/common/Guards/RequireAdmin';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          ...userRoutes,
          ...authRoutes,
          ...bookRoutes,
        ],
      },
      {
        element: <RequireAdmin><AdminLayout /></RequireAdmin>,
        children: adminRoutes,
      },
      {
        path: '/*',
        element: <div>404 Page Not Found</div>,
      },
    ],
  },
]);

export default router;