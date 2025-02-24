import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateRoutes } from "../../store/routesSlice";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const routes = useSelector((state) => state.routes);

  useEffect(() => {
    dispatch(updateRoutes({ isLoggedIn }));
  }, [isLoggedIn, dispatch]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.trim() === "") {
      setBooks([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1000/all-books?search=${searchValue}`
      );
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white z-50">
      <div className="logo-container">
        <img
          src="../src/assets/home-page/l.png"
          alt="BookMosaic Logo"
          className="logo"
        />
      </div>

      <div>
        <ul className="nav-links">
          {routes.map((route) => (
            <li key={route.path} className="hover:text-blue-500">
              <Link to={route.path}>{route.component}</Link>
            </li>
          ))}
        </ul>
      </div>

      {isLoggedIn && (
        <div className="icons">
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

      <div className="search-bar">
        <input
          type="text"
          placeholder="Find your Book"
          value={query}
          onChange={handleSearch}
        />
        <i className="search-icon">🔍</i>

        {books.length > 0 && (
          <ul className="search-results">
            {books.map((book) => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
