import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// This component's only job is to render stars based on a rating prop
const Rating = ({ rating }) => {
  const maxStars = 5;
  const ratingValue = rating || 0;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="flex items-center">
      {Array(fullStars)
        .fill(<FaStar />)
        .map((star, index) => (
          <span key={`full-${index}`} className="text-yellow-400">
            {star}
          </span>
        ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {Array(emptyStars)
        .fill(<FaRegStar />)
        .map((star, index) => (
          <span key={`empty-${index}`} className="text-gray-300">
            {star}
          </span>
        ))}
    </span>
  );
};

export default Rating;