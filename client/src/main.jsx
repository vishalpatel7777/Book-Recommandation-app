import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'; // Correct path
import { RouterProvider } from "react-router-dom";
// --- Corrected Router Import Path ---
import router from "./routes/index.jsx"; 
// import { BrowserRouter as Router } from "react-router-dom"; // <-- Unused import removed
import { Provider } from "react-redux";
import store from "./store/index.js"; // Correct path

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider wraps the RouterProvider */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);