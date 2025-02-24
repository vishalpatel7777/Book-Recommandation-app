import { useLocation } from "react-router-dom";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions } from "./store/auth";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);

  const location = useLocation();

  const showNavbar = location.pathname !== "/welcome";
  const showFooter = location.pathname !== "/welcome";

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
}

export default App;
