import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- Unused import removed
import Loader from "../../components/common/Loader/Loader"; // <-- Corrected path
import { GrLanguage } from "react-icons/gr";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa6";
import Rating from "../../components/common/Rating/Rating"; // <-- Import reusable component
import api from "../../services/axios"; // <-- Corrected path

const Buy = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // Get role from state.auth.user.role (add ? for safety)
  const role = useSelector((state) => state.auth.user?.role); 
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        console.error("No book ID provided in URL");
        setBook(null);
        return;
      }

      try {
        const response = await api.get(`/get-book-by-id/${id}`);
        setBook(response.data.data || null);
      } catch (error) {
        console.error("Error fetching book:", error.response?.data || error);
        setBook(null);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        setUserError("Please log in to proceed.");
        return;
      }

      try {
        const response = await api.get(`/user-information/`, { headers });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error);
        setUserError("Failed to load user data. Please log in again.");
      }
    };
    fetchUser();
  }, [isLoggedIn]); // Dependencies are correct

  const handleBuy = () => {
    if (!book || !isLoggedIn || !user) {
      console.error("Cannot proceed: Book or user data missing");
      return;
    }
    navigate("/checkout", {
      state: {
        book: book,
        bookId: id,
        amount: book.price,
        customer_id: user._id,
        customer_email: user.email,
        customer_phone: user.phone,
      },
    });
  };

  // renderStars function removed

  return (
    <>
      {book === null && (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      {book && (
        <div className="relative pt-[148px] px-12 py-8 flex gap-8 overflow-x-hidden">
          <FaArrowLeft className="text-2xl cursor-pointer" onClick={() => navigate(-1)} />
          <div className="rounded p-4 h-[80vh] w-5/12 flex items-center justify-center">
            <img
              src={book.image || "placeholder.jpg"}
              alt={book.title || "Book"}
              className="h-[450px] shadow-[5px_20px_50px_rgba(0,0,0,0.4)] transform transition-all duration-500 hover:rotate-0 hover:scale-105"
            />
          </div>
          <div className="p-4 w-3/6">
            <div>
              <div className="flex flex-row mt-30 gap-2">
                <span className="font-semibold text-2xl mt-3 text-black">Book Name :</span>
                <div className="flex border-2 p-3 px-7 bg-[#63918b] border-[#63918b] rounded-xl ml-5">
                  <h1 className="text-2xl text-black">{book.title || "Untitled"}</h1>
                  <p className="text-black text-2xl">By {book.author || "Unknown"}</p>
                </div>
              </div>
              <div className="flex">
                <span className="text-black font-semibold mt-7 ml-3 text-2xl w-18">Genre :</span>
                <p className="text-black mt-3 text-2xl border-2 p-3 px-7 bg-[#63918b] border-[#63918b] rounded-xl ml-12">
                  {book.genre || "N/A"}
                </p>
              </div>
              <div className="flex">
                <span className="font-semibold text-black mt-7 text-2xl">Subject :</span>
                <p className="text-black mt-3 text-2xl border-2 p-3 px-7 bg-[#63918b] border-[#63918b] rounded-xl ml-14">
                  {book.subject || "N/A"}
                </p>
              </div>
              <div className="flex">
                <span className="font-semibold text-black mt-7 ml-2 text-2xl">Price :</span>
                <p className="text-black mt-3 text-2xl border-2 p-3 px-12 bg-[#63918b] border-[#63918b] rounded-xl ml-17">
                  ₹{book.price || "N/A"}
                </p>
              </div>
              <div className="flex">
                <span className="font-semibold text-black mt-7 ml-2 text-2xl">Rating :</span>
                <p className="text-black mt-7 text-2xl flex ml-12">
                  <Rating rating={book.ratings} /> {/* <-- Use component */}
                </p>
              </div>
            </div>
            {isLoggedIn && role === "user" && (
              <div className="flex gap-10 mt-16 justify-center">
                {userError && <p className="text-red-500">{userError}</p>}
                <button
                  className="w-[165px] h-[59px] bg-[#edb953] rounded-full text-2xl disabled:opacity-50"
                  onClick={handleBuy}
                  disabled={!user || !!userError} // Disable if user fetch failed
                >
                  Buy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Buy;