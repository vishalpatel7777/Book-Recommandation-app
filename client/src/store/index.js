import { configureStore } from "@reduxjs/toolkit";

// Import your reducers from the new 'slices' directory
import authReducer from "./slices/auth.slice.js";
import adminReducer from "./slices/admin.slice.js";
import bookReducer from "./slices/book.slice.js";
import userReducer from "./slices/user.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    book: bookReducer,
    user: userReducer,
    // Note: We have removed the 'routes' reducer.
    // Auth state is managed in the 'auth' slice.
  },
});

export default store;