import React, { useEffect } from 'react';
import "../assets/login-page/login.css";

function Login() {
  useEffect(() => {
    // Prevent scrolling when the Login page is mounted
    document.body.style.overflow = "hidden";

    // Cleanup: Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="background-img">
      <img src="../src/assets/login-page/login-bg.png" alt="background-img" />

      <div className="login-header">
        <img src="../src/assets/login-page/loginbook.png" alt="login1" className="left" />
        <h1 className="login">Login</h1>
        <img src="../src/assets/login-page/loginbook.png" alt="login2" className="right" />
      </div>

      <div className="login-box">
        <label htmlFor="email" className="email">Email: </label>
        <input type="email" name="email" id="email" className="input-email" placeholder='User07@gmail.com' />
        <label htmlFor="password" className="password">Password: </label>
        <input type="password" name="password" id="password" className="input-pass" placeholder='User07' />
        <button type="submit" className="loginbtn">Login</button>
        <a href="signup"><button className="Registration-btn">New Registration?</button></a>
        <img src="../src/assets/login-page/book-box.png" alt="book" className="book" />
      </div>

      <div className="login-right">
        <img src="../src/assets/login-page/personsitting.png" alt="sitting" className="sitting" />
      </div>
    </div>
  );
}

export default Login;
