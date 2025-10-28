import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// We import the specific 'logout' action from your auth.slice.js
import { logout } from "../../store/slices/auth.slice"; 
import BookMosaicLogo from "../../assets/images/l.png";
import api from "../../services/axios"; // <-- Corrected path

const AdminNav = () => { // <-- Renamed component to AdminNav
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Unused search state and logic have been removed.
  // Obsolete routesSlice logic has been removed.

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      dispatch(logout()); // <-- Use the correct logout action
      // The 'changeRole' dispatch is not needed; 'logout' handles it.
      navigate("/");
      window.location.reload(); // This is fine if you want a hard reset
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white z-50 p-4 flex justify-between items-center">
      <div className="logo-container">
        <img
          src={BookMosaicLogo}
          alt="BookMosaic Logo"
          className="w-20"
          onClick={() => {
            navigate("/admin/home");
          }}
        />
      </div>
      <ul className="nav-links flex gap-4">
        <li className="hover:text-blue-500">
          <Link to="/admin/home">Home</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/admin/users">Manage Users</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/admin/books">Manage Books</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/admin/settings">Settings</Link>
        </li>
      </ul>
      {isLoggedIn && (
        <div className="flex gap-3">
          <Link to="/admin/profile" className="hover:text-gray-300">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
          <button onClick={handleLogout} className="hover:text-red-400">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNav; // <-- Renamed export