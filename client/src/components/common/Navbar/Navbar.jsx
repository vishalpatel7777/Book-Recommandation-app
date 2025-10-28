import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { updateRoutes } from "../../../store/routesSlice"; // <-- REMOVED
import BookCard from "../../books/card/BookCard"; // <-- Corrected path
import BookMosaicLogo from "../../../assets/images/l.png"; // <-- Corrected path
import api from "../../../services/axios"; // <-- Corrected path
// import axios from "axios"; // <-- REMOVED (unused)

// Define navigation links
const navLinksLoggedOut = [
  { path: "/home", text: "Home" },
  { path: "/category", text: "Category" },
  { path: "/about", text: "About" },
  { path: "/login", text: "Login" },
  { path: "/signup", text: "Signup" },
];

const navLinksLoggedIn = [
  { path: "/home", text: "Home" },
  { path: "/category", text: "Category" },
  { path: "/about", text: "About" },
  { path: "/profile", text: "Profile" },
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const routes = useSelector((state) => state.routes); // <-- REMOVED
  const location = useLocation();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // This useEffect was for the old routesSlice, it's no longer needed.
  // useEffect(() => {
  //   dispatch(updateRoutes({ isLoggedIn }));
  // }, [isLoggedIn, dispatch]);

  useEffect(() => {
    setQuery("");
    setBooks([]);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setBooks([]);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.trim() === "") {
      setBooks([]);
      return;
    }

    try {
      const response = await api.get(`/get-all-books-search`, {
        params: { search: searchValue },
      });
      // Use response.data.data directly
      if (response.data && response.data.data) {
        setBooks(response.data.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  // Determine which links to show
  const linksToShow = isLoggedIn ? navLinksLoggedIn : navLinksLoggedOut;

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white z-50 p-4 flex justify-between items-center">
      <div className="logo-container">
        <img
          src={BookMosaicLogo}
          alt="BookMosaic Logo"
          className="w-20 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <ul className="nav-links flex gap-4">
        {/* Render the correct links based on auth state */}
        {linksToShow.map((route) => (
          <li key={route.path} className="hover:text-blue-500">
            <Link to={route.path}>{route.text}</Link>
          </li>
        ))}
      </ul>
      {isLoggedIn && (
        <div className="icons flex gap-3">
          <Link to="/wishlist" className="hover:text-red-500">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link to="/addtocart" className="hover:text-blue-500">
            <span className="material-symbols-outlined">shopping_cart</span>
          </Link>
          <Link to="/notification" className="hover:text-blue-500">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
        </div>
      )}
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          placeholder="Find your Book"
          value={query}
          onChange={handleSearch}
          className="border p-2 rounded-md"
        />
        <i className="search-icon absolute right-3 top-2">🔍</i>
        {books.length > 0 && (
          <div className="absolute top-16 left-[calc(50%-300px)] transform -translate-x-1/2 bg-white shadow-2xl w-[760px] max-h-[500px] overflow-auto mt-2 p-4 rounded-lg z-50 overflow-x-hidden">
            <div className="grid grid-cols-2 gap-3">
              {books.map((book) => (
                <Link to={`/view-book-details/${book._id}`} key={book._id}>
                  <div
                    onClick={() => {
                      setBooks([]);
                      setQuery("");
                    }}
                  >
                    <BookCard data={book} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
