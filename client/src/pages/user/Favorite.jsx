import React, { useState, useEffect } from "react";
import Loader from "../../components/common/Loader/Loader"; // <-- Corrected path
// import axios from "axios"; // <-- Unused import removed
import FavoriteBookCard from "../../components/books/card/FavoriteBookCard"; // <-- Corrected path
import { FaHeart } from "react-icons/fa";
import "../../assets/styles/pages/favorite.css"; // Path relative to src/pages/user/
import api from "../../services/axios"; // <-- Corrected path

const Favorite = () => { // <-- Renamed component
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/get-all-wishlist`, { headers });
        setFavorite(response.data.data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setFavorite([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // Empty dependency array is correct

  return (
    <>
      {loading && <Loader />}
      {favorite.length === 0 && !loading && ( // Show only when not loading and empty
        <div className="h-screen flex items-center justify-center flex-col">
          <h1 className="text-4xl font-semibold text-zinc-700">Empty Wishlist</h1>
          <FaHeart
            className="favorite-pulse" // Ensure this class exists in favorite.css
            style={{
              fontSize: "2.5rem",
              color: "#ff5555",
              marginBottom: "10px",
            }}
          />
        </div>
      )}
      {favorite.length > 0 && (
        <div className="relative pt-[129px] overflow-x-hidden p-10">
          <div className="border-b-4 border-[#bdbdbd] flex items-center pb-2"> {/* Added items-center and pb-2 */}
            <FaHeart
              className="favorite-icon" // Ensure this class exists
              style={{
                fontSize: "2rem",
                color: "#ff5555",
                marginRight: "10px",
              }}
            />
            <h2 className="Favorite-Us text-3xl">Your Favorite</h2> {/* Ensure this class exists */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"> {/* Responsive grid */}
            {favorite.map((book) => (
              <div key={book._id}>
                {/* Pass setFavorite function down */}
                <FavoriteBookCard data={book} setFavorite={setFavorite} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Favorite; // <-- Renamed export