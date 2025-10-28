import { createSlice } from "@reduxjs/toolkit";

// Function to safely parse a localStorage item
const safelyParseJSON = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === 'undefined') { // Check for null/missing AND the literal string "undefined"
    return null; 
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing localStorage item "${key}":`, e);
    return null;
  }
};

// Get user data from localStorage if it exists
// const user = JSON.parse(localStorage.getItem("user")); // <--- OLD, BUGGY LINE
const user = safelyParseJSON("user"); // <--- NEW, SAFE LINE
const token = localStorage.getItem("token"); // Token is safe since it's not JSON


const initialState = {
  isLoggedIn: user ? true : false,
  user: user ? user : null, // Store user info like { id, email, role }
  token: token ? token : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call this reducer when login is successful
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    // Call this when login fails
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = action.payload; // e.g., "Invalid credentials"
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    // Call this on logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  // You will add 'extraReducers' here to handle async thunks
  // (e.g., for login, signup, etc.)
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;