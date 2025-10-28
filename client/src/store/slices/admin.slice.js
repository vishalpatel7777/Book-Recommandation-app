import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  dashboardStats: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Example reducer
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    // Add reducers for managing users, books, etc.
  },
  extraReducers: (builder) => {
    // Add async thunk handling here
    // e.g., builder.addCase(fetchAdminStats.pending, (state) => { ... })
  },
});

export const { setDashboardStats } = adminSlice.actions;
export default adminSlice.reducer;