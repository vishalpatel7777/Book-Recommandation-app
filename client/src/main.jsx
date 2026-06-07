import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { injectThemeVariables } from "./utils/injectTheme.js";

// Inject all theme.config.js tokens as CSS custom properties before first render
injectThemeVariables();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider wraps the RouterProvider */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);