import React, { useEffect, useState } from "react";
import { authActions } from "../../store/auth";
import { useDispatch } from "react-redux";
import "../../assets/login-page/login.css";
import axios from "axios";
import { useNavigate, useNavigation } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [Values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (Values.email === "" || Values.password === "") {
        alert("Please fill all the fields");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/login",
          Values
        );
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        navigate("/welcome");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="background-img relative min-h-screen  pt-[121px]">
      <img src="../src/assets/login-page/login-bg.png" alt="background-img" />

      <div className="login-header">
        <img
          src="../src/assets/login-page/loginbook.png"
          alt="login1"
          className="left"
        />
        <h1 className="login">Login</h1>
        <img
          src="../src/assets/login-page/loginbook.png"
          alt="login2"
          className="right"
        />
      </div>

      <div className="login-box">
        <label htmlFor="email" className="email">
          Email:{" "}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="input-email"
          placeholder="User07@gmail.com"
          value={Values.email}
          onChange={change}
        />
        <label htmlFor="password" className="password">
          Password:{" "}
        </label>
        <input
          type="text"
          name="password"
          id="password"
          className="input-pass"
          placeholder="User07"
          value={Values.password}
          onChange={change}
          onFocus={(e) => (e.target.type = "text")}
          onBlur={(e) => (e.target.type = "password")}
        />
        <button type="submit" className="loginbtn" onClick={submit}>
          Login
        </button>
        <a href="signup">
          <button className="Registration-btn">New Registration?</button>
        </a>
        <img
          src="../src/assets/login-page/book-box.png"
          alt="book"
          className="book"
        />
      </div>

      <div className="login-right">
        <img
          src="../src/assets/login-page/personsitting.png"
          alt="sitting"
          className="sitting"
        />
      </div>
    </div>
  );
};

export default Login;
