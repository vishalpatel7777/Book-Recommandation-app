import React from 'react'
import { useEffect } from 'react';
import "../assets/profile-page/profile.css"

function Profile() {
    useEffect(() => {
        // Prevent scrolling when the Profile page is mounted
        document.body.style.overflow = "hidden";

        // Cleanup: Re-enable scrolling when the component is unmounted
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    useEffect(() => {
        // Apply styles directly to the body
        document.body.style.fontFamily = "'Caveat', sans-serif";
        document.body.style.fontSize = "23px";
        document.body.style.backgroundColor = "#ffffff";

        // Cleanup styles (optional, in case you want to revert on unmount)
        // return () => {
        //     document.body.style.fontFamily = "";
        //     document.body.style.fontSize = "";
        //     document.body.style.backgroundColor = "";
        // };
    }, []);


  return (
    <div className="profile-page">
    <img src="../src/assets/profile-page/profile.png" alt="profile-pic" className="profile-pic" />
    <button className="profile-username">Username07</button>
    <div className="wishlist">
        <span className="material-symbols-outlined" id="profile-heart">favorite</span>
        <a href="/wishlist">
            <button className="profile-wishlist">Your Wishlist</button>
        </a>
    </div>

    <div className="cart">
        <span className="material-symbols-outlined" id="cart">shopping_cart</span>
        <a href="cart"><button className="profile-cart">Your cart</button></a>
    </div>

    <div className="profile-box">
        <img src="../src/assets/profile-page/book-top.png" alt="profile-1" className="profile-1" />
        <img src="../src/assets/profile-page/book-down.png" alt="profile-book-box-2" className="profile-2" />
        <img src="../src/assets/profile-page/book-profile.png" alt="profile-book-box-3" className="profile-3" />
        <label htmlFor="name" className="profile-name">Name: </label>
        <input type="text" name="name" id="name" className="profile-name-input" />
        <label htmlFor="age" className="profile-age">Age:</label>
        <input type="text" name="age" id="age" className="profile-age-input" />
        <label htmlFor="email" className="profile-email">Email: </label>
        <input type="email" name="email" id="email" className="profile-email-input" />
        <label htmlFor="favorite-genre" className="profile-genre">Favorite book genre: </label>
        <input type="text" name="profile-genre" id="profile-genre" className="profile-genre-input" />
        <a href="contact-us"><button type="submit" className="profile-suggestion">Give suggestion</button></a>
    </div>
</div>
  )
}

export default Profile