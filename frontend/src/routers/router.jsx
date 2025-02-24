import App from "../App";
import { createBrowserRouter, Link } from "react-router-dom";
import Home from "../components/Home/Home";
import Category from "..//components/Category/Category";
import About from "../components/pages/About";
import Login from "../components/pages/Login";
import Thankyou from "../components/pages/Thankyou";
import Signup from "../components/pages/Signup";
import Profile from "../components/pages/Profile";
import ContactUs from "../components/pages/Contactus";
import Notification from "../components/pages/Notification";
import Cart from "../components/pages/Cart";
import Welcome from "../components/pages/Welcome";
import Loader from "../components/Loader/Loader";
import Allbooks from "../components/Category/Allbooks";
import ViewBookDetails from "../components/ViewBookDetails/ViewBookDetails";
import Terms from "../components/Profile/Terms";
import Privacy from "../components/Profile/privacy";
import Blog from "../components/Profile/Blog";
import Faq from "../components/Profile/Faq";
import BestAuthor from "../components/Profile/BestAuthor";
import Wishlist from "../components/Profile/ProfileWishlist";
import EditProfile from "../components/Profile/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/thankyou",
        element: <Thankyou />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },

      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/addtocart",
        element: <Cart />,
      },
      {
        path: "/welcome",
        element: <Welcome />,
      },
      {
        path: "/book-info",
        element: <Link />,
      },

      {
        path: "/allbooks",
        element: <Allbooks />,
      },
      {
        path: "/view-book-details/:id",
        element: <ViewBookDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
        children: [
          {
            path: "/profile",
            element: <Wishlist />,
          },
          {
            path: "/profile/terms",
            element: <Terms />,
          },
          {
            path: "/profile/privacy-policy",
            element: <Privacy />,
          },
          {
            path: "/profile/blog",
            element: <Blog />,
          },
          {
            path: "/profile/best-author",
            element: <BestAuthor />,
          },
          {
            path: "/profile/faq",
            element: <Faq />,
          },
          {
            path: "/profile/edit-profile",
            element: <EditProfile />,
          },
        ],
      },
      {
        path: "/*",
        element: <div>404</div>,
      },
    ],
  },
]);
export default router;
