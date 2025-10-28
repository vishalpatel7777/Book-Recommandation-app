import React from "react"; // Removed unused useState
import { Link } from "react-router-dom";
import Rating from "../../common/Rating/Rating"; // <-- Import reusable component

const WishlistBookCard = ({ data, wishlist }) => { // <-- Renamed component
  // The renderStars function is no longer needed

  return (
    <Link to={`/wishlist/${data._id}`}>
      <div className="hover:shadow-2xl p-2 rounded w-[250px] h-[370px] flex flex-col hover:bg-white">
        <div className="rounded flex items-center justify-center">
          <img src={data.image} alt="/" className="p-3 h-[212px] w-[137px]" />
        </div>
        <h2
          className="text-black text-xl font-semibold flex justify-center overflow-hidden"
          title={data.title}
        >
          {data.title || "Untitled"}
        </h2>
        <p className="text-black text-xl font-semibold flex justify-center">
          by {data.author}
        </p>
        <p className="text-black text-xl font-semibold relative left-[90px] justify-center">
          ₹ {data.price}
        </p>
        <p className="text-black text-xl flex">
          Rating: &nbsp; <Rating rating={data.ratings} /> {/* <-- Use component */}
        </p>
      </div>
    </Link>
  );
};

export default WishlistBookCard; // <-- Renamed export