import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    // Example reducer
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    // Add reducers for fetching books, categories, etc.
  },
  extraReducers: (builder) => {
    // Add async thunk handling here
    // e.g., builder.addCase(fetchBooks.pending, (state) => { ... })
  },
});

export const { setBooks } = bookSlice.actions;
export default bookSlice.reducer;