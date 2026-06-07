import "./App.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Removed admin redirect useEffect - handle in routing/protected routes

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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