import { createSlice } from "@reduxjs/toolkit";

const safeParseJSON = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
};

const initialState = {
  cart: safeParseJSON("bm_cart"),
  wishlist: safeParseJSON("bm_wishlist"),
  notifications: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      localStorage.setItem("bm_cart", JSON.stringify(action.payload));
    },
    addToCart: (state, action) => {
      const id = action.payload;
      if (!state.cart.includes(id)) {
        state.cart.push(id);
        localStorage.setItem("bm_cart", JSON.stringify(state.cart));
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((id) => id !== action.payload);
      localStorage.setItem("bm_cart", JSON.stringify(state.cart));
    },
    clearCartState: (state) => {
      state.cart = [];
      localStorage.removeItem("bm_cart");
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
      localStorage.setItem("bm_wishlist", JSON.stringify(action.payload));
    },
    addToWishlist: (state, action) => {
      const id = action.payload;
      if (!state.wishlist.includes(id)) {
        state.wishlist.push(id);
        localStorage.setItem("bm_wishlist", JSON.stringify(state.wishlist));
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
      localStorage.setItem("bm_wishlist", JSON.stringify(state.wishlist));
    },
    clearUserState: (state) => {
      state.cart = [];
      state.wishlist = [];
      localStorage.removeItem("bm_cart");
      localStorage.removeItem("bm_wishlist");
    },
  },
  extraReducers: () => {},
});

export const {
  setCart, addToCart, removeFromCart, clearCartState,
  setWishlist, addToWishlist, removeFromWishlist, clearUserState,
} = userSlice.actions;
export default userSlice.reducer;