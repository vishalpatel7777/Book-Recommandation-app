import React, { useState } from "react";
import CustomAlert from "../../common/Alert/CustomAlert"; // <-- Corrected path
import api from "../../../services/axios"; // <-- Corrected path
import Rating from "../../common/Rating/Rating"; // <-- Import reusable component

const FavoriteBookCard = ({ data, setFavorite }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data?._id,
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleRemoveBook = async () => {
    try {
      const response = await api.put("/remove-book-from-wishlist", {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      if (setFavorite && typeof setFavorite === "function") {
        setFavorite((prevFavorite) => prevFavorite.filter((item) => item._id !== data._id));
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to remove book from wishlist");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  // The renderStars function is no longer needed

  if (!data) {
    return <div>Error: Book data not provided</div>;
  }

  return (
    <div className="hover:shadow-2xl p-2 rounded w-[270px] h-[420px] flex flex-col">
      <div className="rounded flex items-center justify-center">
        <img
          src={data.image || "placeholder.jpg"}
          alt={data.title || "Unknown Title"}
          className="p-3 h-[212px] w-[137px]"
        />
      </div>
      <h2 className="text-black text-xl font-semibold flex justify-center overflow-hidden" title={data.title}>
        {data.title || "Untitled"}
      </h2>
      <p className="text-black text-xl font-semibold flex justify-center">by {data.author || "Unknown Author"}</p>
      <p className="text-black text-xl font-semibold relative left-[90px] justify-center mb-2">₹ {data.price || "N/A"}</p>
      <p className="text-black text-xl flex mb-3">
        Rating: &nbsp; <Rating rating={data.ratings} /> {/* <-- Use component */}
      </p>
      <button
        className="bg-[#f8ca58] text-2xl px-7 py-2 rounded border mt-2"
        onClick={handleRemoveBook}
      >
        Remove from Favorite
      </button>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default FavoriteBookCard;