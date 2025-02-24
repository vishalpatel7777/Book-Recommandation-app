import React, { useState } from "react";
import { useEffect } from "react";
import "../../assets/profile-page/profile.css";

import axios from "axios";
import Loader from "../Loader/Loader";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Recentlyaddedbook from "../Category/Recentlyaddedbook";
import ProfileWishlist from "../Profile/ProfileWishlist";
import { IoIosLogOut } from "react-icons/io";

const Profile = () => {
  useEffect(() => {
    document.body.style.fontFamily = "'Caveat', sans-serif";
    document.body.style.fontSize = "23px";
    document.body.style.backgroundColor = "#ffffff";
  }, []);

  const [Profile, setProfile] = useState();
  const navigate = useNavigate();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/user-information/",
        { headers }
      );

      setProfile(response.data);
    };
    fetch();
  }, []);

  return (
    <div className="profile-page relative   pt-[121px]">
      {!Profile && (
        <>
          <div className="h-screen flex items-center justify-center">
            <Loader />
          </div>
        </>
      )}
      {Profile && (
        <>
          <div className="gap-3 flex w-full p-4">
            {/* Left Column */}
            <div className="w-full md:w-1/6 flex flex-col bg-[#e2e3e4] p-4">
              <ul className="space-y-4 pt-24 pb-24">
                {[
                  { name: "User Terms & Conditions", path: "/profile/terms" },
                  { name: "Privacy Policy", path: "/profile/privacy-policy" },
                  { name: "Blog", path: "/profile/blog" },
                  { name: "Best Author", path: "/profile/best-author" },
                  { name: "FAQ", path: "/profile/faq" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-black  hover:text-blue-500 transition duration-300 bg-white p-2 block rounded-md"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle Column */}
            <div className="w-full md:w-3/10 bg-[#e2e3e4] p-4  ">
              <div className="flex flex-col items-center">
                <img
                  src={Profile.image}
                  alt="profile-pic"
                  className="w-[131px] h-[131px] rounded-full object-cover"
                />
                <p className="profile-suggestion mt-3  text-[24px] pl-4 pt-1 font-medium">
                  @{Profile.username}
                </p>
                <div className="box bg-white mt-5 p-7">
                  <p className=" text-[24px] text-black font-semibold">
                    Name :{" "}
                    <span className="text-[24px] font-normal">
                      {Profile.fullname}
                    </span>{" "}
                  </p>
                  <p className=" text-[24px] text-black  font-semibold">
                    Email :{" "}
                    <span className="text-[24px] font-normal">
                      {Profile.email}
                    </span>{" "}
                  </p>
                  <p className=" text-[24px] text-black font-semibold">
                    Age :{" "}
                    <span className="text-[24px] font-normal">
                      {Profile.age}
                    </span>{" "}
                  </p>
                  <p className=" text-[24px] text-black  font-semibold">
                    Favorite Book Genre :{" "}
                    <span className="text-[24px] font-normal">
                      {Profile.genre}
                    </span>{" "}
                  </p>
                  <p className=" text-[24px] text-black font-semibold">
                    Phone Number :{" "}
                    <span className="text-[24px] font-normal">
                      +91 {Profile.phone}
                    </span>{" "}
                  </p>
                </div>
                <div className="button mt-4 flex gap-10">
                  <button
                    className="flex p-10 text-[24px] bg-[#2e86a7] hover:bg-[#22609b] text-black h-[45px] w-[130px] rounded-full  pt-1 font-medium"
                    onClick={() => navigate("/profile/edit-profile")}
                  >
                    Edit
                  </button>
                  <button className=" flex p-4  text-[24px] bg-[#a64675] hover:bg-[#bb4e71] text-black h-[45px] w-[130px] rounded-full  pt-1 font-medium">
                    Logout <IoIosLogOut className="ms-4 mt-2 " />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-7/10 bg-[#e2e3e4] p-4">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
