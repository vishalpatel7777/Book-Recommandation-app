import React, { useEffect, useState } from "react";
// Import the correct action from your new auth slice
import { loginSuccess } from "../../store/slices/auth.slice"; 
import { useDispatch } from "react-redux";
import "../../assets/styles/pages/login.css"; // This path is correct
// import axios from "axios"; // <-- Unused import removed
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../components/common/Alert/CustomAlert"; // <-- Corrected path
import Loginbg from "../../assets/images/login-bg.png"; // This path is correct
import LoginBook from "../../assets/images/loginbook.png"; // This path is correct
import LoginBoxBook from "../../assets/images/login-book-box.png"; // This path is correct
import LoginSitting from "../../assets/images/personsitting.png"; // This path is correct
import api from "../../services/axios"; // <-- Corrected path

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPrompt, setShowResetPrompt] = useState(false);

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
        setAlertMessage("Please fill all the fields");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      } else {
        const response = await api.post(`/login`, Values);
        
        // --- THIS IS THE UPDATED REDUX LOGIC ---
        // We dispatch loginSuccess with the user object and token
        dispatch(loginSuccess({
          user: response.data.user, // Send the user object
          token: response.data.token, // Send the token
        }));
        
        // No need to set localStorage here, the reducer handles it!
        navigate("/welcome");
      }
    } catch (error) {
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  
  const handleResetPassword = async () => {
    if (!resetEmail) {
      setAlertMessage("Please enter your email to reset your password");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await api.post(`/forgot-password`, { email: resetEmail });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setShowResetPrompt(false);
        setResetEmail("");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to send reset link");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div className="background-img relative min-h-screen pt-[121px]">
      <img src={Loginbg} alt="background-img" />
      <div className="login-header">
        <img src={LoginBook} alt="login1" className="left" />
        <h1 className="login">Login</h1>
        <img src={LoginBook} alt="login2" className="right" />
      </div>
      <div className="login-box">
        <label htmlFor="email" className="email">Email: </label>
        <input
          type="email"
          name="email"
          id="email"
          className="input-email"
          placeholder="User07@gmail.com"
          value={Values.email}
          onChange={change}
        />
        <label htmlFor="password" className="password">Password: </label>
        <input
          type="password" // <-- Fixed: Start as password
          name="password"
          id="password"
          className="input-pass"
          placeholder="User07"
          value={Values.password}
          onChange={change}
          onFocus={(e) => (e.target.type = "text")}
          onBlur={(e) => (e.target.type = "password")}
        />
        <button type="submit" className="loginbtn" onClick={submit}>Login</button>
        <button className="resetpassword" onClick={() => setShowResetPrompt(true)}>Reset Password</button>
        <button className="Registration-btn" onClick={() => navigate("/signup")}>New Registration?</button>
        <img src={LoginBoxBook} alt="book" className="book" />
      </div>
      {showResetPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center transform scale-100 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleResetPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowResetPrompt(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="login-right">
        <img src={LoginSitting} alt="sitting" className="sitting" />
      </div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Login;