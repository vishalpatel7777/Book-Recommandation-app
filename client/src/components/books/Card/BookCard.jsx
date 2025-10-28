import React from "react";
import { Link } from "react-router-dom";
import Rating from "../../common/Rating/Rating"; // <-- 1. Import your new component

const BookCard = ({ data }) => {
  
  return (
    <Link to={`/view-book-details/${data._id}`}>
      <div className="hover:shadow-2xl p-2 rounded w-[350px] h-[450px] flex flex-col">
        <div className="rounded flex items-center justify-center">
          <img src={data.image} alt="/" className="p-5 h-[312px] w-[197px]" />
        </div>
        <div>
          <h2
            className="text-black text-xl font-semibold flex justify-center overflow-hidden"
            title={data.title}
          >
            {data.title || "Untitled"}
          </h2>
          <p className="text-black mt-1 text-xl font-semibold flex justify-center">
            by {data.author}
          </p>
        </div>
        <p className="text-black text-xl mt-1 font-semibold relative left-[130px] justify-center">
          ₹ {data.price}
        </p>
        <p className="text-black text-xl mt-1 flex font-semibold relative bottom-3">
          &nbsp; &nbsp; Rating: &nbsp; <Rating rating={data.ratings} /> {/* <-- 2. Use it here */}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;