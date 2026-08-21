import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/cms/branding`;

/**
 * Fetch current branding settings
 */
export const getBranding = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Update branding text fields (site title and tagline)
 */
export const updateBrandingText = async (data) => {
  const response = await axios.put(API_URL, data);
  return response.data;
};

/**
 * Upload logo file
 */
export const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Upload favicon file
 */
export const uploadFavicon = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/favicon`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};