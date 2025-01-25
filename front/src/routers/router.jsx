import App from "../App";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Home from "../home/Home";
import Category from "../category/Category";
import About from "../components/About";
import Login from "../components/Login";
import Thankyou from "../components/Thankyou";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import ContactUs from "../components/Contactus";

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
            element: <Category /> ,
        },
        {
          path: "/about",
          element: <About />
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
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/contact-us",
          element: <ContactUs />,
        },
        {
          path: "/*",
          element: <div>404</div>,
        }
      ]
    },
  ]); 
  export default router ;