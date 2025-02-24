import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { IoIosHeart } from "react-icons/io";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Book, setBook] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `http://localhost:1000/api/v1/get-book-by-id/${id}`
      );

      setBook(response.data.data);
    };
    fetch();
  }, []);
  return (
    <>
      {Book && (
        <div className=" relative   pt-[148px] px-12 py-8 flex gap-8 overflow-x-hidden">
          <div className=" rounded p-4 h-[80vh] w-2/6 flex items-center justify-center ">
            <img src={Book.image} alt="/" className="h-[530px]" />
          </div>
          <div className="p-4  w-4/6 ">
            <div className="flex flex-row relative left-20 gap-2 ">
              <h1 className="text-[34px] text-black font-semibold ">
                {Book.title}
              </h1>
              <p className="text-black  text-[34px] font-semibold">
                By {Book.author}
              </p>
            </div>
            <div className="border-b-[3px] border-gray-300 top-2 relative w-[870px]"></div>
            <p className="text-black mt-10 text-2xl">
              <span className="font-semibold">Genre :</span> {Book.genre}
            </p>
            <p className="text-black mt-3 text-2xl ">
              <span className="font-semibold">Subject : </span>
              {Book.subject}
            </p>
            <p className="text-black mt-4 text-2xl "> {Book.desc}</p>

            <a
              href={Book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black mt-6 text-2xl flex  flex-row items-center justify-start gap-2 text-blue-700 hover:text-blue-600"
            >
              {" "}
              <GrLanguage className="flex" />
              Get more Info
            </a>

            <div className="gap-10 flex top-50 relative left-80">
              <button className="text-5xl cursor-pointer text-red-500 hover:text-red-700 transition duration-300">
                <IoIosHeart />
              </button>
              <button className="w-[165px] h-[59px] bg-[#edb953] rounded-4xl">
                Buy
              </button>
              <button className="w-[165px] h-[59px] bg-[#c15c54] rounded-4xl">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {!Book && (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
