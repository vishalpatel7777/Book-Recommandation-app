import "./App.css"; // Correct path
import { Outlet, useNavigate } from "react-router-dom";
// Navbar, AdminNavbar, Footer are no longer imported/rendered here
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// Import the correct action from your auth slice
import { loginSuccess } from "./store/slices/auth.slice"; 

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // We might still need role or isLoggedIn for global checks if any remain
  const role = useSelector((state) => state.auth.user?.role); 
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Removed admin redirect useEffect - handle in routing/protected routes

  useEffect(() => {
    // Check localStorage on initial load to potentially log the user back in
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && !isLoggedIn) { // Check !isLoggedIn to avoid re-dispatching
      try {
        const user = JSON.parse(storedUser);
        // Dispatch loginSuccess with the stored user and token
        dispatch(loginSuccess({ user, token: storedToken })); 
      } catch (e) {
         console.error("Failed to parse stored user:", e);
         localStorage.clear(); // Clear invalid stored data
      }
    }

    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, isLoggedIn]); // Added isLoggedIn dependency

  // Conditional rendering for mobile incompatibility
  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-center p-5">
        <h2 className="text-2xl font-bold text-red-700">
          🚫 Mobile Not Supported! <br />
          Please open this website on a Desktop or Laptop.
        </h2>
      </div>
    );
  }

  // App component now just renders the Outlet. Layouts handle Navbar/Footer.
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;