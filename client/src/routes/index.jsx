import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import RequireAdmin from '../components/common/Guards/RequireAdmin';
import NotFound from '../pages/user/NotFound';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import AuthorLogin from '../pages/author/AuthorLogin';
import AuthorRegister from '../pages/author/AuthorRegister';
import AuthorDashboard from '../pages/author/AuthorDashboard';
import RequireAuthor from '../components/common/Guards/RequireAuthor';

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
        path: '/author/login',
        element: <AuthorLogin />,
      },
      {
        path: '/author/register',
        element: <AuthorRegister />,
      },
      {
        path: '/author/dashboard',
        element: <RequireAuthor><AuthorDashboard /></RequireAuthor>,
      },
      {
        path: '/*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;