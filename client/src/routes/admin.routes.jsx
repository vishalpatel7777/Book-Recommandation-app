import { lazy } from 'react';
import PATHS from '../config/paths';

const AdminHome = lazy(() => import('../components/Admin/AdminHome'));
const AdminDashboard = lazy(() => import('../components/Admin/AdminDashboard'));
const DailyStats = lazy(() => import('../components/Admin/DashBoard/DailyStats'));
const UserActivity = lazy(() => import('../components/Admin/DashBoard/UserActivity'));
const BookAnalytics = lazy(() => import('../components/Admin/DashBoard/BookAnalytics'));
const MonthlyAnalytics = lazy(() => import('../components/Admin/DashBoard/MonthlyStats'));
const AddBook = lazy(() => import('../components/Admin/Books/AddBook'));
const EditBook = lazy(() => import('../components/Admin/Books/EditBook'));
const DeleteBook = lazy(() => import('../components/Admin/Books/DeleteBook'));
const AdminUser = lazy(() => import('../components/Admin/EditUser'));
const AdminProfile = lazy(() => import('../components/Admin/AdminProfile'));
const AdminSettings = lazy(() => import('../components/Admin/AdminSetting'));
const AdminBooks = lazy(() => import('../components/Admin/AdminBooks'));
const AdminCMS = lazy(() => import('../pages/admin/AdminCMS'));

const adminRoutes = [
  {
    path: PATHS.ADMIN_HOME,
    element: <AdminHome />,
  },
  {
    path: PATHS.ADMIN_DASHBOARD,
    element: <AdminDashboard />,
    children: [
      { path: 'daily-stats', element: <DailyStats /> },
      { path: 'user-activity', element: <UserActivity /> },
      { path: 'book-analytics', element: <BookAnalytics /> },
      { path: 'Monthly-analytics', element: <MonthlyAnalytics /> },
    ],
  },
  {
    path: PATHS.ADMIN_BOOKS,
    element: <AdminBooks />,
    children: [
      { path: 'add-book', element: <AddBook /> },
      { path: 'edit-books', element: <EditBook /> },
      { path: 'delete-book', element: <DeleteBook /> },
    ],
  },
  {
    path: PATHS.ADMIN_USERS,
    element: <AdminUser />,
  },
  {
    path: PATHS.ADMIN_PROFILE,
    element: <AdminProfile />,
  },
  {
    path: PATHS.ADMIN_SETTINGS,
    element: <AdminSettings />,
  },
  {
    path: PATHS.ADMIN_CMS,
    element: <AdminCMS />,
  },
];

export default adminRoutes;
