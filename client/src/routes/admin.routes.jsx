import { Outlet } from 'react-router-dom';
import AdminHome from '../components/admin/AdminHome';
import AdminDashboard from '../components/admin/AdminDashboard';
import DailyStats from '../components/admin/dashboard/DailyStats';
import UserActivity from '../components/admin/dashboard/UserActivity';
import BookAnalytics from '../components/admin/dashboard/BookAnalytics';
import MonthlyAnalytics from '../components/admin/dashboard/MonthlyStats';
import AddBook from '../components/admin/books/AddBook';
import EditBook from '../components/admin/books/EditBook';
import DeleteBook from '../components/admin/books/DeleteBook';
import AdminUser from '../components/admin/EditUser';
import AdminProfile from '../components/admin/AdminProfile';
import AdminSettings from '../components/admin/AdminSetting';

// --- IMPORT THE NEW LAYOUT ---
import AdminBooks from '../components/admin/AdminBooks'; 

const adminRoutes = [
  {
    path: '/admin/home',
    element: <AdminHome />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    children: [
      { path: 'daily-stats', element: <DailyStats /> },
      { path: 'user-activity', element: <UserActivity /> },
      { path: 'book-analytics', element: <BookAnalytics /> },
      { path: 'Monthly-analytics', element: <MonthlyAnalytics /> },
    ],
  },
  {
    path: '/admin/books',
    // --- USE THE NEW LAYOUT HERE ---
    element: <AdminBooks />, // Was previously <Outlet />
    children: [
      {
        path: 'add-book', // Relative path: /admin/books/add-book
        element: <AddBook />,
      },
      {
        path: 'edit-books',
        element: <EditBook />,
      },
      {
        path: 'delete-book',
        element: <DeleteBook />,
      },
    ],
  },
  {
    path: '/admin/users',
    element: <AdminUser />,
  },
  {
    path: '/admin/profile',
    element: <AdminProfile />,
  },
  {
    path: '/admin/settings',
    element: <AdminSettings />,
  },
];

export default adminRoutes;