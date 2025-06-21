import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:1000/api/v1"
    : "https://book-mosaic.onrender.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
