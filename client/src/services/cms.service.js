import api from "./axios";

const unwrap = (res) => res.data?.data ?? res.data;
const unwrapPaginated = (res) => {
  const d = res.data;
  // supports {success,data,total,page,limit,totalPages} and {success,data:{items}}
  return d;
};

// ── Site settings (seo/theme/features/integrations) ───────
export const getSiteSetting = (group) => api.get(`/cms/settings/${group}`).then(unwrap);
export const putSiteSetting = (group, value) => api.put(`/cms/settings/${group}`, value).then(unwrap);
export const getSeoPublic = () => api.get("/seo").then(unwrap);
export const putSeo = (value) => api.put("/cms/seo", value).then(unwrap);
export const uploadSeoOgImage = (file) => {
  const fd = new FormData(); fd.append("file", file);
  return api.post("/cms/seo/og-image", fd, { headers: { "Content-Type": "multipart/form-data" } }).then(unwrap);
};
export const getThemePublic = () => api.get("/theme").then(unwrap);
export const putTheme = (value) => api.put("/cms/theme", value).then(unwrap);
export const getFeatureFlags = () => api.get("/cms/features").then(unwrap);
export const getFeatureFlagsPublic = () => api.get("/feature-flags").then(unwrap);
export const putFeatureFlags = (value) => api.put("/cms/features", value).then(unwrap);

// ── Homepage blocks ────────────────────────────────────────
export const getHomepageBlocksAdmin = () => api.get("/cms/homepage-blocks").then(unwrap);
export const putHomepageBlocks = (blocks, page = "home") => api.put("/cms/homepage-blocks", { blocks, page }).then(unwrap);
export const getHomepageBlocksPublic = () => api.get("/homepage-blocks").then(unwrap);

// ── Authors / Categories / Promotions / Coupons ────────────
export const getAuthorsAdmin = (params) => api.get("/cms/authors", { params }).then(unwrapPaginated);
export const createAuthor = (payload) => api.post("/cms/authors", payload).then(unwrap);
export const updateAuthor = (id, payload) => api.put(`/cms/authors/${id}`, payload).then(unwrap);
export const deleteAuthor = (id) => api.delete(`/cms/authors/${id}`).then(unwrap);
export const getAuthorsPublic = () => api.get("/authors").then(unwrap);

export const getCategoriesAdmin = (params) => api.get("/cms/categories", { params }).then(unwrapPaginated);
export const createCategory = (payload) => api.post("/cms/categories", payload).then(unwrap);
export const updateCategory = (id, payload) => api.put(`/cms/categories/${id}`, payload).then(unwrap);
export const deleteCategory = (id) => api.delete(`/cms/categories/${id}`).then(unwrap);
export const getCategoriesPublic = () => api.get("/categories").then(unwrap);

export const getPromotionsAdmin = (params) => api.get("/cms/promotions", { params }).then(unwrapPaginated);
export const createPromotion = (payload) => api.post("/cms/promotions", payload).then(unwrap);
export const updatePromotion = (id, payload) => api.put(`/cms/promotions/${id}`, payload).then(unwrap);
export const deletePromotion = (id) => api.delete(`/cms/promotions/${id}`).then(unwrap);
export const getPromotionsPublic = () => api.get("/promotions/active").then(unwrap);

export const getCouponsAdmin = (params) => api.get("/cms/coupons", { params }).then(unwrapPaginated);
export const createCoupon = (payload) => api.post("/cms/coupons", payload).then(unwrap);
export const updateCoupon = (id, payload) => api.put(`/cms/coupons/${id}`, payload).then(unwrap);
export const deleteCoupon = (id) => api.delete(`/cms/coupons/${id}`).then(unwrap);
export const validateCoupon = (code, cartTotal) => api.post("/coupons/validate", { code, cartTotal }).then(unwrap);

// ── Reviews moderation / Media / Notifications ─────────────
export const getReviewsAdmin = (params) => api.get("/cms/reviews", { params }).then(unwrapPaginated);
export const moderateReview = (id, status) => api.patch(`/cms/reviews/${id}/status`, { status }).then(unwrap);
export const deleteReview = (id) => api.delete(`/cms/reviews/${id}`).then(unwrap);

export const getMedia = (params) => api.get("/cms/media", { params }).then(unwrapPaginated);
export const uploadMedia = (file, type) => {
  const fd = new FormData(); fd.append("file", file); if (type) fd.append("type", type);
  return api.post("/cms/media/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then(unwrap);
};
export const deleteMedia = (id) => api.delete(`/cms/media/${id}`).then(unwrap);

export const getNotificationTemplates = (params) => api.get("/cms/notifications", { params }).then(unwrapPaginated);
export const createNotificationTemplate = (payload) => api.post("/cms/notifications", payload).then(unwrap);
export const updateNotificationTemplate = (id, payload) => api.put(`/cms/notifications/${id}`, payload).then(unwrap);
export const duplicateNotificationTemplate = (id) => api.post(`/cms/notifications/${id}/duplicate`).then(unwrap);

// ── Support / Audit / Analytics ────────────────────────────
export const getSupportTicketsAdmin = (params) => api.get("/cms/support/tickets", { params }).then(unwrapPaginated);
export const getAuditLogs = (params) => api.get("/cms/audit-logs", { params }).then(unwrapPaginated);
export const getUserAnalytics = () => api.get("/cms/analytics/users").then(unwrap);
export const getBookAnalytics = (params) => api.get("/cms/analytics/books", { params }).then(unwrap);
export const getSearchAnalytics = () => api.get("/cms/analytics/search").then(unwrap);
