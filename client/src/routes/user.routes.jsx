import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PATHS from '../config/paths';
import RequireAuth from '../components/common/Guards/RequireAuth';

const Home = lazy(() => import('../components/books/Home/Home'));
const About = lazy(() => import('../pages/user/About'));
const Thankyou = lazy(() => import('../pages/user/Thankyou'));
const Mainwishlist = lazy(() => import('../components/user/wishlist/Mainwishlist'));
const Favorite = lazy(() => import('../pages/user/Favorite'));
const ContactUs = lazy(() => import('../pages/user/Contact'));
const Notification = lazy(() => import('../pages/user/Notification'));
const Cart = lazy(() => import('../pages/user/Cart'));
const Welcome = lazy(() => import('../pages/user/Welcome'));
const Buy = lazy(() => import('../pages/user/Buy'));
const Checkout = lazy(() => import('../pages/user/payment/Checkout'));
const PaymentSuccess = lazy(() => import('../pages/user/payment/PaymentSuccess'));
const Profile = lazy(() => import('../pages/user/Profile'));
const Wishlist = lazy(() => import('../components/user/wishlist/Wishlist'));
const Terms = lazy(() => import('../components/user/Profile/Terms'));
const Privacy = lazy(() => import('../components/user/Profile/Privacy'));
const Blog = lazy(() => import('../components/user/Profile/Blog'));
const BestAuthor = lazy(() => import('../components/user/Profile/BestAuthor'));
const Faq = lazy(() => import('../components/user/Profile/Faq'));
const EditProfile = lazy(() => import('../components/user/Profile/EditProfile'));

const userRoutes = [
  { path: PATHS.HOME, element: <Home /> },
  { path: '/home', element: <Navigate to="/" replace /> },
  { path: PATHS.ABOUT, element: <About /> },
  { path: PATHS.THANKYOU, element: <RequireAuth><Thankyou /></RequireAuth> },
  { path: '/wishlist/:id', element: <RequireAuth><Mainwishlist /></RequireAuth> },
  { path: PATHS.WISHLIST, element: <RequireAuth><Favorite /></RequireAuth> },
  { path: PATHS.CONTACT, element: <ContactUs /> },
  { path: PATHS.NOTIFICATION, element: <RequireAuth><Notification /></RequireAuth> },
  { path: PATHS.CART, element: <RequireAuth><Cart /></RequireAuth> },
  { path: PATHS.WELCOME, element: <RequireAuth><Welcome /></RequireAuth> },
  { path: '/buy/:id', element: <RequireAuth><Buy /></RequireAuth> },
  { path: PATHS.CHECKOUT, element: <RequireAuth><Checkout /></RequireAuth> },
  { path: PATHS.PAYMENT_SUCCESS, element: <RequireAuth><PaymentSuccess /></RequireAuth> },
  { path: '/authors', element: <BestAuthor /> },
  { path: '/blog', element: <Blog /> },
  {
    path: PATHS.PROFILE,
    element: <RequireAuth><Profile /></RequireAuth>,
    children: [
      { index: true, element: <Wishlist /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'reading-activity', element: <></> },
      { path: 'notifications', element: <></> },
      { path: 'about', element: <></> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy-policy', element: <Privacy /> },
      { path: 'blog', element: <Blog /> },
      { path: 'best-author', element: <BestAuthor /> },
      { path: 'faq', element: <Faq /> },
      { path: 'edit-profile', element: <EditProfile /> },
    ],
  },
];

export default userRoutes;
