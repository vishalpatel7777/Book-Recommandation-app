import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  wishlist: [],
  notifications: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Example reducer
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    // Add reducers for wishlist, profile, etc.
  },
  extraReducers: (builder) => {
    // Add async thunk handling here
    // e.g., builder.addCase(fetchCart.pending, (state) => { ... })
  },
});

export const { setCart } = userSlice.actions;
export default userSlice.reducer;