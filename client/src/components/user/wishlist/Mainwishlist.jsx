import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- Unused import removed
import { MdFavorite } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import CustomAlert from "../../common/Alert/CustomAlert"; // <-- Corrected path
import api from "../../../services/axios"; // <-- Corrected path

const MainWishlist = () => { // <-- Capitalized component name
  const { id } = useParams();
  const navigate = useNavigate();
  const [Book, setBook] = useState(null); // Keep null initially

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get(`/get-book-by-id/${id}`);
        setBook(response.data.data);
      } catch (error) {
         console.error("Error fetching book details:", error);
         setBook(null); // Set to null on error
      }
    };
    fetch();
  }, [id]);

  const handleRemoveBook = async () => {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
      bookid: Book?._id, // Use optional chaining
    };
    try {
      const response = await api.put(`/remove-book-from-wishlist`, {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => {
         setShowAlert(false);
         // Navigate back to the main wishlist view after successful removal
         navigate("/profile/wishlist"); 
      }, 2000);
    } catch (error) {
      console.error("Error removing book:", error);
      setAlertMessage("Failed to remove book from wishlist");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  // Optional: Add loading state
  // if (Book === undefined) {
  //   return <div>Loading...</div>; // Or use Loader component
  // }

  return (
    <div className="relative pt-[151px] overflow-x-hidden mt-8 px-4">
      <div className="border-b-4 border-gray-400 flex items-center gap-4 px-4 pb-2">
        <MdFavorite className="text-3xl" />
        <h2 className="text-3xl font-semibold font-caveat">Wishlist Details</h2>
      </div>
      {Book ? ( // Check if Book is not null
        <div className="relative px-12 py-8 flex gap-8 overflow-x-hidden">
          <div className="rounded p-4 h-[80vh] w-2/6 flex items-center justify-center">
            <img
              src={Book.image}
              alt={Book.title || "Book cover"}
              className="h-[430px] shadow-[5px_20px_50px_rgba(0,0,0,0.4)] transform transition-all duration-500 hover:rotate-0 hover:scale-105"
            />
          </div>
          <div className="p-4 w-4/6">
            <div className="flex flex-row relative left-20 gap-2">
              <h1 className="text-[34px] text-black font-semibold">{Book.title}</h1>
              <p className="text-black text-[34px] font-semibold">By {Book.author}</p>
            </div>
            <div className="border-b-[3px] border-gray-300 top-2 relative w-[870px]"></div>
            <p className="text-black mt-10 text-2xl"><span className="font-semibold">Genre :</span> {Book.genre}</p>
            <p className="text-black mt-3 text-2xl"><span className="font-semibold">Subject : </span>{Book.subject}</p>
            <p className="text-black mt-4 text-2xl"><span className="font-semibold">Description : </span>{Book.desc}</p>
            <a
              href={Book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black mt-6 text-2xl flex flex-row items-center justify-start gap-2 text-blue-700 hover:text-blue-600"
            >
              <GrLanguage className="flex" /> Get more Info
            </a>
            <div className="gap-10 flex top-50 relative left-40 mt-6"> {/* Added margin-top */}
              <div className="w-[195px] p-2 h-[49px] bg-[#edb953] rounded-4xl text-xl">
                 {/* Link should go back to the main wishlist page */}
                <Link to="/wishlist"><button className="pl-6.5 justify-center items-center">Back to Wishlist</button></Link>
              </div>
              <div className="relative left-[24px] w-[195px] p-2 h-[49px] bg-[#c15c54] rounded-4xl text-xl">
                <button className="pl-2.5 justify-center items-center" onClick={handleRemoveBook}>Remove from wishlist</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
         // Handle case where book couldn't be fetched
         <p className="text-center text-red-500 mt-10">Could not load book details.</p> 
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default MainWishlist;