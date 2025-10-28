import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Rating component handles this
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios"; // <-- Corrected path
import Rating from "../../common/Rating/Rating"; // <-- Import reusable component

const CartBookCard = ({ data, cart }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleRemoveBook = async () => {
    try {
      const response = await api.put("/remove-book-from-cart", {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      if (cart && typeof cart === "function") {
        cart((prevCart) => prevCart.filter((item) => item._id !== data._id));
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to remove book from cart");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  // The renderStars function is no longer needed here

  return (
    <div className="hover:shadow-2xl p-2 rounded w-[250px] h-[400px] flex flex-col">
      <div className="rounded flex items-center justify-center">
        <img src={data.image} alt={data.title} className="p-3 h-[212px] w-[137px]" />
      </div>
      <h2 className="text-black text-xl font-semibold flex justify-center overflow-hidden" title={data.title}>
        {data.title || "Untitled"}
      </h2>
      <p className="text-black text-xl font-semibold flex justify-center">by {data.author}</p>
      <p className="text-black text-xl font-semibold relative left-[90px] justify-center">₹ {data.price}</p>
      <p className="text-black text-xl flex">
        Rating: &nbsp; <Rating rating={data.ratings} /> {/* <-- Use component */}
      </p>
      <button
        className="bg-[#f8ca58] text-2xl px-8 py-2 rounded border mt-2"
        onClick={handleRemoveBook}
      >
        Remove from Cart
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

export default CartBookCard;