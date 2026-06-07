import { createSlice } from "@reduxjs/toolkit";

// Server response no longer includes token — user metadata only
const safelyParseJSON = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

const user = safelyParseJSON("user");

const initialState = {
  isLoggedIn: user ? true : false,
  user: user ?? null,
  isLoading: false,
  error: null,
  // ← token is GONE. It lives in the HttpOnly cookie, not here.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = action.payload;
      localStorage.removeItem("user");
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("bm_cart");
      localStorage.removeItem("bm_wishlist");
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;