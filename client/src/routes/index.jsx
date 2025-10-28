import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Your main App component

// Import your new layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import the modular route arrays
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';

// Import a 404 page if you have one
// import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // <App /> is the root, it can hold global context (like Redux)
    // errorElement: <NotFoundPage />,
    children: [
      // --- USER & AUTH ROUTES ---
      // All routes inside here will have the MainLayout (Navbar + Footer)
      {
        element: <MainLayout />,
        children: [
          ...userRoutes,
          ...authRoutes,
          ...bookRoutes,
        ],
      },

      // --- ADMIN ROUTES ---
      // All routes inside here will have the AdminLayout (AdminNav)
      {
        element: <AdminLayout />,
        children: [
          ...adminRoutes,
        ],
      },
      
      // --- CATCH-ALL 404 ---
      {
        path: '/*',
        element: <div>404 Page Not Found</div>,
        // Or better: element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;