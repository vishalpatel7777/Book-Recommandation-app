import React, { useState, useEffect } from "react";
import "../../assets/styles/pages/profile.css"; // Path relative to src/pages/user/
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios"; // <-- Unused import removed
import Loader from "../../components/common/Loader/Loader"; // <-- Corrected path
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
// Import the correct logout action from your new auth slice
import { logout } from "../../store/slices/auth.slice";
import api from "../../services/axios"; // <-- Corrected path

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Profile, setProfile] = useState(undefined); // Start as undefined to differentiate from null error

  // Removed useEffect for body styles - apply globally or via CSS if needed

  // In src/pages/user/Profile.jsx
  useEffect(() => {
    const fetch = async () => {
      try {
        // 1. Check token/ID are present
        const headers = {
         authorization: `Bearer ${localStorage.getItem("token")}`, // CRITICAL for server verification
        };

        // 2. Make API call
        const response = await api.get(`/user-information`, { headers });
        setProfile(response.data);
      } catch (error) {
        // 3. This is where the 401/404 error is caught
        console.error("Error fetching user profile:", error);
        setProfile(null);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login"); // This redirects the user if the token is bad
        }
      }
    };
    fetch();
  }, []);
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logout()); // <-- Use the correct logout action
      // No need to remove localStorage items manually, the reducer does it
      navigate("/");
      // Optional: window.location.reload() if you need a hard refresh, but usually not necessary
    }
  };

  // Loading state
  if (Profile === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // Error state
  if (Profile === null) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading profile. Please try logging in again.
      </div>
    );
  }

  return (
    <div className="profile-page relative pt-[121px] overflow-x-hidden">
      {/* Profile content renders only if Profile is successfully fetched */}
      <div className="gap-3 flex w-full p-4 h-auto min-h-[calc(100vh-121px)]">
        {" "}
        {/* Ensure minimum height */}
        <div className="w-full md:w-1/6 flex flex-col bg-[#e2e3e4] p-4 rounded-l-lg">
          {" "}
          {/* Added rounding */}
          <ul className="space-y-4 pt-24 pb-24">
            {[
              { name: "Wishlist", path: "/profile/wishlist" },
              { name: "Terms & Conditions", path: "/profile/terms" },
              { name: "Privacy Policy", path: "/profile/privacy-policy" },
              { name: "Blog", path: "/profile/blog" },
              { name: "Best Author", path: "/profile/best-author" },
              { name: "FAQ", path: "/profile/faq" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="text-black hover:text-blue-500 transition duration-300 bg-white p-2 block rounded-md"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/10 bg-[#e2e3e4] p-4 h-auto rounded-r-lg md:rounded-l-none">
          {" "}
          {/* Added rounding */}
          <div className="flex flex-col items-center">
            <img
              src={Profile.image || "default-avatar.png"}
              alt="profile-pic"
              className="w-[131px] h-[131px] rounded-full object-cover border-2 border-gray-300 shadow-md"
            />{" "}
            {/* Added fallback and styling */}
            <p className="profile-suggestion mt-3 text-[24px] pl-4 pt-1 font-medium">
              @{Profile.username}
            </p>
            <div className="box bg-white mt-5 p-7 rounded-md shadow-inner">
              {" "}
              {/* Added rounding and shadow */}
              <p className="text-[24px] text-black font-semibold">
                Name:{" "}
                <span className="text-[24px] font-normal">
                  {Profile.fullname || "N/A"}
                </span>
                
              </p>
              <p className="text-[24px] text-black font-semibold">
                Email:{" "}
                <span className="text-[24px] font-normal">
                  {Profile.email || "N/A"}
                </span>
              </p>
              <p className="text-[24px] text-black font-semibold">
                Age:{" "}
                <span className="text-[24px] font-normal">
                  {Profile.age || "N/A"}
                </span>
              </p>
              <p className="text-[24px] text-black font-semibold">
                Favorite Book Genre:{" "}
                <span className="text-[24px] font-normal">
                  {Profile.genre || "N/A"}
                </span>
              </p>
              <p className="text-[24px] text-black font-semibold">
                Phone Number:{" "}
                <span className="text-[24px] font-normal">
                  +91 {Profile.phone || "N/A"}
                </span>
              </p>
            </div>
            <div className="button mt-4 flex gap-10">
              <button
                className="flex items-center justify-center p-10 text-[24px] bg-[#2e86a7] hover:bg-[#22609b] text-white h-[45px] w-[130px] rounded-full pt-1 font-medium shadow-md" // Added text-white
                onClick={() => navigate("/profile/edit-profile")}
              >
                Setting
              </button>
              <button
                className="flex items-center justify-center p-4 text-[24px] bg-[#a64675] hover:bg-[#bb4e71] text-white h-[45px] w-[130px] rounded-full pt-1 font-medium shadow-md" // Added text-white
                onClick={handleLogout}
              >
                Logout <IoIosLogOut className="ms-2" /> {/* Adjusted margin */}
              </button>
            </div>
          </div>
        </div>
        {/* Render nested profile routes (Wishlist, Terms, etc.) */}
        <div className="w-full md:w-6/10 bg-[#e2e3e4] p-4 h-auto rounded-r-lg">
          {" "}
          {/* Adjusted width, Added rounding */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
