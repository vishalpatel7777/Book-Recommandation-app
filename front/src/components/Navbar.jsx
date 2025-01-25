import React from 'react';
// import './Navbar.css'; // Import your CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo-container">
        <img src="../src/assets/home-page/l.png" alt="BookMosaic Logo" className="logo" />
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><a href="home">Home</a></li>
        <li><a href="category">Categories</a></li>
        <li><a href="about">About</a></li>
        <li><a href="profile">Profile</a></li>
        <li><a href="login">Login</a></li>
      </ul>

      {/* Icons Section */}
      <div className="icons">
       <a href="favorite"><span className="material-symbols-outlined">favorite</span></a>
        <a href="addtocart"><span className="material-symbols-outlined">shopping_cart</span></a>
        <a href="notification"><span className="material-symbols-outlined">notifications</span></a>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Find your Book" />
        <i className="search-icon">🔍</i>
      </div>
    </nav>
  );
};

export default Navbar;


// import React, { useEffect, useState } from 'react'

// function Navbar() {
//   const [isMenuOpen , setIsMenuOpen] = useState(false);
//   const [isSticky , setIsSticky ] = useState(false);


//   //toggle menu 
//   const toggleMenu = () => {
//     setIsMenuOpen (!isMenuOpen);
//   }

//   useEffect(() =>  {    //annonymous function
//        const handleScroll =() =>{
//         if (window.scrollY > 100){
//           setIsSticky(true);
//         }

//         else{
//           setIsSticky(false);
//         }
//        }

//        window.
//   }, [])

//   return (
//     <div>Navbar</div>
//   )
// }

// export default Navbar