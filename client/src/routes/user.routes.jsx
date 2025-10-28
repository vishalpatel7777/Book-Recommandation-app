import Home from '../components/books/Home/Home';
import About from '../pages/user/About';
import Thankyou from '../pages/user/Thankyou';
import Mainwishlist from '../components/user/wishlist/Mainwishlist';
import Favorite from '../pages/user/Favorite'; // Assumed path
import ContactUs from '../pages/user/Contact';
import Notification from '../pages/user/Notification';
import Cart from '../pages/user/Cart';
import Welcome from '../pages/user/Welcome';
import Buy from '../pages/user/Buy';
import Checkout from '../pages/user/Payment/Checkout';
import PaymentSuccess from '../pages/user/payment/PaymentSuccess';

// Profile page and its nested components
import Profile from '../pages/user/Profile';
import Wishlist from '../components/user/wishlist/Wishlist';
import Terms from '../components/user/profile/Terms';
import Privacy from '../components/user/profile/Privacy';
import Blog from '../components/user/profile/Blog';
import BestAuthor from '../components/user/profile/BestAuthor';
import Faq from '../components/user/profile/Faq';
import EditProfile from '../components/user/profile/EditProfile';

const userRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/thankyou',
    element: <Thankyou />,
  },
  {
    path: '/wishlist/:id',
    element: <Mainwishlist />,
  },
  {
    path: '/wishlist',
    element: <Favorite />,
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
  },
  {
    path: '/notification',
    element: <Notification />,
  },
  {
    path: '/addtocart',
    element: <Cart />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/buy/:id',
    element: <Buy />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/payment-success',
    element: <PaymentSuccess />,
  },
  {
    path: '/profile',
    element: <Profile />,
    children: [
      {
        index: true, // This makes <Wishlist /> the default child
        element: <Wishlist />,
      },
      {
        path: 'wishlist', // Note: relative path
        element: <Wishlist />,
      },
      {
        path: 'terms', // e.g., /profile/terms
        element: <Terms />,
      },
      {
        path: 'privacy-policy', // e.g., /profile/privacy-policy
        element: <Privacy />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'best-author',
        element: <BestAuthor />,
      },
      {
        path: 'faq',
        element: <Faq />,
      },
      {
        path: 'edit-profile',
        element: <EditProfile />,
      },
    ],
  },
];

export default userRoutes;