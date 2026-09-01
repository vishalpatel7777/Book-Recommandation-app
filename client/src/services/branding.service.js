import api from "./axios";

const BASE = "/cms/branding";
const PUBLIC_BASE = "/branding";

export const getBranding = async () => {
  const { data } = await api.get(PUBLIC_BASE);
  return data?.data ?? data;
};
export const getBrandingAdmin = async () => {
  const { data } = await api.get(BASE);
  return data?.data?.value ?? data?.data ?? data;
};
export const updateBrandingText = async (payload) => {
  const { data } = await api.put(BASE, payload);
  return data?.data?.value ?? data?.data ?? data;
};
export const uploadLogo = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post(`${BASE}/logo`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return data?.data?.value ?? data?.data ?? data;
};
export const uploadFavicon = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post(`${BASE}/favicon`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return data?.data?.value ?? data?.data ?? data;
};