import axios from "axios";
import appConfig from "../config/app.config";

// Change API_BASE_URL in config/app.config.js → updates every API call
const api = axios.create({
  baseURL: appConfig.API_BASE_URL,
  withCredentials: true, // Sends HttpOnly cookies automatically
});

export default api;
