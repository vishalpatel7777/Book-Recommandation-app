import { lazy } from 'react';
import PATHS from '../config/paths';

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
  { path: '/home', element: <Home /> },
  { path: PATHS.ABOUT, element: <About /> },
  { path: PATHS.THANKYOU, element: <Thankyou /> },
  { path: '/wishlist/:id', element: <Mainwishlist /> },
  { path: PATHS.WISHLIST, element: <Favorite /> },
  { path: PATHS.CONTACT, element: <ContactUs /> },
  { path: PATHS.NOTIFICATION, element: <Notification /> },
  { path: PATHS.CART, element: <Cart /> },
  { path: PATHS.WELCOME, element: <Welcome /> },
  { path: '/buy/:id', element: <Buy /> },
  { path: PATHS.CHECKOUT, element: <Checkout /> },
  { path: PATHS.PAYMENT_SUCCESS, element: <PaymentSuccess /> },
  {
    path: PATHS.PROFILE,
    element: <Profile />,
    children: [
      { index: true, element: <Wishlist /> },
      { path: 'wishlist', element: <Wishlist /> },
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
