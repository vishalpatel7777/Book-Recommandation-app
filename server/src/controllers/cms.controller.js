const asyncHandler = require("../utils/asyncHandler");
const siteSettingService = require("../services/siteSetting.service");
const cmsService = require("../services/cms.service");
const auditService = require("../services/audit.service");
const fs = require("fs");

function ipOf(req) { return req.ip || req.headers["x-forwarded-for"] || ""; }

// ── Site Settings (branding/seo/theme/features/integrations) ───────
const getSiteSetting = asyncHandler(async (req, res) => {
  const { group } = req.params;
  const doc = await siteSettingService.getGroup(group);
  if (!doc) return res.status(404).json({ success: false, message: "Group not found" });
  res.json({ success: true, data: doc });
});

const updateSiteSetting = asyncHandler(async (req, res) => {
  const { group } = req.params;
  const doc = await siteSettingService.updateGroup(group, req.body, req.user?.id || null);
  await auditService.log({ actor: req.user?.id, source: "admin", action: "SETTINGS_CHANGED", target: group, severity: "info", ip: ipOf(req) });
  res.json({ success: true, data: doc });
});

const getFeatureFlags = asyncHandler(async (req, res) => {
  const flags = await siteSettingService.getFeatureFlags();
  res.json({ success: true, data: flags });
});

const updateFeatureFlags = asyncHandler(async (req, res) => {
  const flags = await siteSettingService.updateFeatureFlags(req.body);
  await auditService.log({ actor: req.user?.id, source: "admin", action: "SETTINGS_CHANGED", target: "features", severity: "info", ip: ipOf(req) });
  res.json({ success: true, data: flags });
});

const getPublicFeatureFlags = asyncHandler(async (req, res) => {
  const flags = await siteSettingService.getFeatureFlags();
  res.json({ success: true, data: flags });
});

// ── Public branding/theme/seo (unwrap value) ──────────────────
const getPublicBranding = asyncHandler(async (req, res) => {
  const doc = await siteSettingService.getGroup("branding");
  if (doc && doc.value && (doc.value.siteTitle || doc.value.logoUrl)) {
    return res.json({ success: true, data: doc.value });
  }
  // Fallback to legacy Branding collection (pre-sync data)
  try {
    const brandingService = require("../services/branding.service");
    const b = await brandingService.getBranding();
    if (b) return res.json({ success: true, data: { siteTitle: b.siteTitle, tagline: b.tagline, logoUrl: b.logoUrl||"", faviconUrl: b.faviconUrl||"" } });
  } catch (_) {}
  res.json({ success: true, data: doc ? doc.value : siteSettingService.DEFAULTS.branding });
});
const getPublicTheme = asyncHandler(async (req, res) => {
  const doc = await siteSettingService.getGroup("theme");
  res.json({ success: true, data: doc ? doc.value : siteSettingService.DEFAULTS.theme });
});
const getPublicSeo = asyncHandler(async (req, res) => {
  const doc = await siteSettingService.getGroup("seo");
  res.json({ success: true, data: doc ? doc.value : siteSettingService.DEFAULTS.seo });
});
const uploadSeoOgImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  const doc = await siteSettingService.getGroup("seo");
  const current = doc ? doc.value : siteSettingService.DEFAULTS.seo;
  const updated = await siteSettingService.updateGroup("seo", { ...current, ogImage: url }, req.user?.id || null);
  res.json({ success: true, data: updated.value });
});

// ── Homepage Blocks ───────────────────────────────────────────
const getHomepageBlocks = asyncHandler(async (req, res) => {
  const doc = await cmsService.getHomepageBlocks(req.query.page || "home");
  res.json({ success: true, data: doc });
});

const putHomepageBlocks = asyncHandler(async (req, res) => {
  const { blocks, page } = req.body;
  const doc = await cmsService.updateHomepageBlocks(page || "home", blocks);
  await auditService.log({ actor: req.user?.id, source: "admin", action: "HOMEPAGE_UPDATED", target: page || "home", severity: "info", ip: ipOf(req) });
  res.json({ success: true, data: doc });
});

const getPublicHomepageBlocks = asyncHandler(async (req, res) => {
  const blocks = await cmsService.getPublicHomepageBlocks(req.query.page || "home");
  res.json({ success: true, data: { blocks } });
});

// ── Authors ───────────────────────────────────────────────────
const listAuthors = asyncHandler(async (req, res) => {
  const result = await cmsService.listAuthors(req.query);
  res.json({ success: true, ...result });
});
const createAuthor = asyncHandler(async (req, res) => {
  const author = await cmsService.createAuthor(req.body);
  await auditService.log({ actor: req.user?.id, source: "admin", action: "AUTHOR_CREATED", target: author.name, severity: "info", ip: ipOf(req) });
  res.status(201).json({ success: true, data: author });
});
const getAuthor = asyncHandler(async (req, res) => {
  const author = await cmsService.getAuthorById(req.params.id);
  if (!author) return res.status(404).json({ success: false, message: "Author not found" });
  res.json({ success: true, data: author });
});
const updateAuthor = asyncHandler(async (req, res) => {
  const author = await cmsService.updateAuthor(req.params.id, req.body);
  if (!author) return res.status(404).json({ success: false, message: "Author not found" });
  res.json({ success: true, data: author });
});
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await cmsService.deleteAuthor(req.params.id);
  if (!author) return res.status(404).json({ success: false, message: "Author not found" });
  await auditService.log({ actor: req.user?.id, source: "admin", action: "AUTHOR_ARCHIVED", target: req.params.id, severity: "info", ip: ipOf(req) });
  res.json({ success: true, message: "Author archived", data: author });
});
const hardDeleteAuthor = asyncHandler(async (req, res) => {
  await cmsService.hardDeleteAuthor(req.params.id);
  res.json({ success: true, message: "Author deleted" });
});
const listPublicAuthors = asyncHandler(async (req, res) => {
  const result = await cmsService.listAuthors({ status: "active", limit: 100 });
  res.json({ success: true, data: result.data });
});

// ── Categories ────────────────────────────────────────────────
const listCategories = asyncHandler(async (req, res) => {
  const result = await cmsService.listCategories(req.query);
  res.json({ success: true, ...result });
});
const createCategory = asyncHandler(async (req, res) => {
  const cat = await cmsService.createCategory(req.body);
  res.status(201).json({ success: true, data: cat });
});
const getCategory = asyncHandler(async (req, res) => {
  const cat = await cmsService.getCategoryById(req.params.id);
  if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
  res.json({ success: true, data: cat });
});
const updateCategory = asyncHandler(async (req, res) => {
  const cat = await cmsService.updateCategory(req.params.id, req.body);
  if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
  res.json({ success: true, data: cat });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await cmsService.deleteCategory(req.params.id);
  if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
  res.json({ success: true, message: "Category archived", data: cat });
});
const listPublicCategories = asyncHandler(async (req, res) => {
  const result = await cmsService.listCategories({ status: "active", limit: 100 });
  res.json({ success: true, data: result.data });
});

// ── Promotions ────────────────────────────────────────────────
const listPromotions = asyncHandler(async (req, res) => {
  const result = await cmsService.listPromotions(req.query);
  res.json({ success: true, ...result });
});
const createPromotion = asyncHandler(async (req, res) => {
  const promo = await cmsService.createPromotion(req.body);
  res.status(201).json({ success: true, data: promo });
});
const getPromotion = asyncHandler(async (req, res) => {
  const promo = await cmsService.getPromotionById(req.params.id);
  if (!promo) return res.status(404).json({ success: false, message: "Promotion not found" });
  res.json({ success: true, data: promo });
});
const updatePromotion = asyncHandler(async (req, res) => {
  const promo = await cmsService.updatePromotion(req.params.id, req.body);
  if (!promo) return res.status(404).json({ success: false, message: "Promotion not found" });
  res.json({ success: true, data: promo });
});
const deletePromotion = asyncHandler(async (req, res) => {
  await cmsService.deletePromotion(req.params.id);
  res.json({ success: true, message: "Promotion deleted" });
});
const listPublicPromotions = asyncHandler(async (req, res) => {
  const promos = await cmsService.getActivePromotions();
  res.json({ success: true, data: promos });
});

// ── Coupons ───────────────────────────────────────────────────
const listCoupons = asyncHandler(async (req, res) => {
  const result = await cmsService.listCoupons(req.query);
  res.json({ success: true, ...result });
});
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await cmsService.createCoupon(req.body);
  res.status(201).json({ success: true, data: coupon });
});
const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await cmsService.getCouponById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
  res.json({ success: true, data: coupon });
});
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await cmsService.updateCoupon(req.params.id, req.body);
  if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
  res.json({ success: true, data: coupon });
});
const deleteCoupon = asyncHandler(async (req, res) => {
  await cmsService.deleteCoupon(req.params.id);
  res.json({ success: true, message: "Coupon deleted" });
});
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "code is required" });
  const result = await cmsService.validateCoupon(code, Number(cartTotal) || 0);
  res.json({ success: true, ...result });
});

// ── Reviews moderation ────────────────────────────────────────
const listCmsReviews = asyncHandler(async (req, res) => {
  const result = await cmsService.listReviews(req.query);
  res.json({ success: true, ...result });
});
const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const review = await cmsService.updateReviewStatus(req.params.id, status);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  await auditService.log({ actor: req.user?.id, source: "admin", action: `REVIEW_${String(status).toUpperCase()}`, target: req.params.id, severity: "info", ip: ipOf(req) });
  res.json({ success: true, data: review });
});
const deleteCmsReview = asyncHandler(async (req, res) => {
  await cmsService.deleteReview(req.params.id);
  res.json({ success: true, message: "Review deleted" });
});

// ── Media ─────────────────────────────────────────────────────
const listMedia = asyncHandler(async (req, res) => {
  const result = await cmsService.listMedia(req.query);
  res.json({ success: true, ...result });
});
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const mime = req.file.mimetype || "";
  let type = "other";
  if (mime.startsWith("image/")) type = "image";
  else if (mime === "application/pdf") type = "pdf";
  else if (mime.startsWith("video/")) type = "video";
  const doc = await cmsService.createMedia({
    publicId: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname,
    type: req.body.type || type,
    mimeType: mime,
    sizeBytes: req.file.size,
    size: `${Math.round(req.file.size / 1024)} KB`,
    uploadedBy: req.user?.id || null,
    folder: req.body.folder || "",
  });
  res.status(201).json({ success: true, data: doc });
});
const updateMedia = asyncHandler(async (req, res) => {
  const doc = await cmsService.updateMedia(req.params.id, req.body);
  if (!doc) return res.status(404).json({ success: false, message: "Media not found" });
  res.json({ success: true, data: doc });
});
const deleteMedia = asyncHandler(async (req, res) => {
  const id = req.params.id || req.params.publicId;
  let doc = await cmsService.deleteMedia(id);
  if (!doc) doc = await cmsService.deleteMediaByPublicId(id);
  if (!doc) return res.status(404).json({ success: false, message: "Media not found" });
  // try to remove file from disk if local
  const publicId = doc.publicId || id;
  const filePath = `uploads/${publicId}`;
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}
  try { const { UPLOAD_DIR } = require("../config/paths"); const p = require("path").join(UPLOAD_DIR, publicId); if (fs.existsSync(p)) fs.unlinkSync(p); } catch (_) {}
  res.json({ success: true, message: "Media deleted" });
});

// ── Admin Orders ──────────────────────────────────────────────
const listAdminOrders = asyncHandler(async (req, res) => {
  const result = await cmsService.listOrders(req.query);
  res.json({ success: true, ...result });
});
const getAdminOrder = asyncHandler(async (req, res) => {
  const order = await cmsService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
});
const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const order = await cmsService.updateOrderStatus(req.params.id, req.body.status);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
});

// ── Admin Refunds ─────────────────────────────────────────────
const listAdminRefunds = asyncHandler(async (req, res) => {
  const result = await cmsService.listRefunds(req.query);
  res.json({ success: true, ...result });
});
const getAdminRefund = asyncHandler(async (req, res) => {
  const refund = await cmsService.getRefundById(req.params.id);
  if (!refund) return res.status(404).json({ success: false, message: "Refund not found" });
  res.json({ success: true, data: refund });
});
const processRefund = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const refund = await cmsService.updateRefundStatus(req.params.id, action, req.user?.id || null);
  if (!refund) return res.status(404).json({ success: false, message: "Refund not found" });
  await auditService.log({ actor: req.user?.id, source: "admin", action: `REFUND_${String(action).toUpperCase()}`, target: req.params.id, severity: "info", ip: ipOf(req) });
  res.json({ success: true, data: refund });
});

// ── Notification templates ────────────────────────────────────
const listNotificationTemplates = asyncHandler(async (req, res) => {
  const result = await cmsService.listNotificationTemplates(req.query);
  res.json({ success: true, ...result });
});
const createNotificationTemplate = asyncHandler(async (req, res) => {
  const tpl = await cmsService.createNotificationTemplate(req.body);
  res.status(201).json({ success: true, data: tpl });
});
const getNotificationTemplate = asyncHandler(async (req, res) => {
  const tpl = await cmsService.getNotificationTemplateById(req.params.id);
  if (!tpl) return res.status(404).json({ success: false, message: "Template not found" });
  res.json({ success: true, data: tpl });
});
const updateNotificationTemplate = asyncHandler(async (req, res) => {
  const tpl = await cmsService.updateNotificationTemplate(req.params.id, req.body);
  if (!tpl) return res.status(404).json({ success: false, message: "Template not found" });
  res.json({ success: true, data: tpl });
});
const deleteNotificationTemplate = asyncHandler(async (req, res) => {
  await cmsService.deleteNotificationTemplate(req.params.id);
  res.json({ success: true, message: "Template deleted" });
});
const duplicateNotificationTemplate = asyncHandler(async (req, res) => {
  const dup = await cmsService.duplicateNotificationTemplate(req.params.id);
  if (!dup) return res.status(404).json({ success: false, message: "Template not found" });
  res.status(201).json({ success: true, data: dup });
});

// ── Notification settings (stored in SiteSetting) ─────────────
const getNotificationSettings = asyncHandler(async (req, res) => {
  const doc = await siteSettingService.getGroup("notifications");
  res.json({ success: true, data: doc.value });
});
const putNotificationSettings = asyncHandler(async (req, res) => {
  const doc = await siteSettingService.updateGroup("notifications", req.body, req.user?.id || null);
  res.json({ success: true, data: doc.value });
});

// ── Support (admin) ───────────────────────────────────────────
const listSupportTicketsAdmin = asyncHandler(async (req, res) => {
  const result = await cmsService.listSupportTickets(req.query);
  res.json({ success: true, ...result });
});
const getSupportTicketAdmin = asyncHandler(async (req, res) => {
  const ticket = await cmsService.getSupportTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  res.json({ success: true, data: ticket });
});
const replySupportTicket = asyncHandler(async (req, res) => {
  const message = req.body.adminReply || req.body.message;
  const ticket = await cmsService.replySupportTicket(req.params.id, message);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  res.json({ success: true, data: ticket });
});
const closeSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await cmsService.closeSupportTicket(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  res.json({ success: true, data: ticket });
});

// ── Support (user) ────────────────────────────────────────────
const listUserTickets = asyncHandler(async (req, res) => {
  const tickets = await cmsService.listUserSupportTickets(req.user.id);
  res.json({ success: true, data: tickets });
});
const createUserTicket = asyncHandler(async (req, res) => {
  const ticket = await cmsService.createSupportTicket(req.user.id, req.body);
  res.status(201).json({ success: true, data: ticket });
});
const closeUserTicket = asyncHandler(async (req, res) => {
  const ticket = await cmsService.getSupportTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  if (String(ticket.userId) !== String(req.user.id) && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const closed = await cmsService.closeSupportTicket(req.params.id);
  res.json({ success: true, data: closed });
});

// ── Scheduler ─────────────────────────────────────────────────
const listScheduledTasks = asyncHandler(async (req, res) => {
  const result = await cmsService.listScheduledTasks(req.query);
  res.json({ success: true, ...result });
});
const createScheduledTask = asyncHandler(async (req, res) => {
  const task = await cmsService.createScheduledTask({ ...req.body, createdBy: req.user?.id || null });
  res.status(201).json({ success: true, data: task });
});
const getScheduledTask = asyncHandler(async (req, res) => {
  const task = await cmsService.getScheduledTaskById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, data: task });
});
const updateScheduledTask = asyncHandler(async (req, res) => {
  const task = await cmsService.updateScheduledTask(req.params.id, req.body);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, data: task });
});
const deleteScheduledTask = asyncHandler(async (req, res) => {
  await cmsService.deleteScheduledTask(req.params.id);
  res.json({ success: true, message: "Task deleted" });
});

// ── Analytics ─────────────────────────────────────────────────
const getUserAnalytics = asyncHandler(async (req, res) => {
  const data = await cmsService.getUserAnalytics();
  res.json({ success: true, data });
});
const getBookAnalyticsCms = asyncHandler(async (req, res) => {
  const data = await cmsService.getBookAnalytics({ limit: Number(req.query.limit) || 5 });
  res.json({ success: true, data });
});
const getSearchAnalytics = asyncHandler(async (req, res) => {
  const data = await cmsService.listSearchAnalytics();
  res.json({ success: true, data });
});

// ── Audit logs ────────────────────────────────────────────────
const listAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditService.getLogs(req.query);
  res.json({ success: true, ...result });
});
const exportAuditLogs = asyncHandler(async (req, res) => {
  const { logs } = await auditService.getLogs({ ...req.query, page: 1, limit: 10000 });
  const header = "actor,action,target,time,ip,severity\n";
  const rows = logs.map((l) => `${l.actor || "system"},${l.action},${(l.target || "").replace(/,/g, " ")},${new Date(l.createdAt).toISOString()},${l.ip || ""},${l.severity}`).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=audit-logs.csv");
  res.send(header + rows);
});

// ── Events ────────────────────────────────────────────────────
const postEvent = asyncHandler(async (req, res) => {
  const { type, meta } = req.body;
  if (!type) return res.status(400).json({ success:false, message:"type required" });
  await cmsService.logEvent({ type, userId: req.user?.id||null, user: req.user?.email||"", meta: meta||"", ip: req.ip||"" });
  res.json({ success:true });
});
const getEvents = asyncHandler(async (req, res) => {
  const Event = require("../models/event.model");
  const { type, page=1, limit=20 } = req.query;
  const filter={}; if(type && type!=="all") filter.type=new RegExp(type,"i");
  const skip=(Number(page)-1)*Number(limit);
  const [data, total]=await Promise.all([Event.find(filter).sort({createdAt:-1}).skip(skip).limit(Number(limit)).lean(), Event.countDocuments(filter)]);
  res.json({ success:true, data, total, page:Number(page), limit:Number(limit), totalPages: Math.ceil(total/Number(limit)) });
});
const getEventAnalytics = asyncHandler(async (req, res) => {
  const data = await cmsService.getEventAnalytics();
  res.json({ success:true, data });
});

// ── Health ────────────────────────────────────────────────────
const getHealth = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      cashfree: process.env.CASHFREE_APP_ID ? "configured" : "missing",
      email: process.env.EMAIL_USER ? "configured" : "missing",
      storage: process.env.GOOGLE_CREDENTIALS ? "configured" : "missing",
      analytics: "configured",
    },
  });
});

module.exports = {
  // site settings
  getSiteSetting, updateSiteSetting, getFeatureFlags, updateFeatureFlags, getPublicFeatureFlags,
  getPublicBranding, getPublicTheme, getPublicSeo, uploadSeoOgImage,
  postEvent, getEvents, getEventAnalytics,
  // homepage
  getHomepageBlocks, putHomepageBlocks, getPublicHomepageBlocks,
  // authors
  listAuthors, createAuthor, getAuthor, updateAuthor, deleteAuthor, hardDeleteAuthor, listPublicAuthors,
  // categories
  listCategories, createCategory, getCategory, updateCategory, deleteCategory, listPublicCategories,
  // promotions
  listPromotions, createPromotion, getPromotion, updatePromotion, deletePromotion, listPublicPromotions,
  // coupons
  listCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon, validateCoupon,
  // reviews
  listCmsReviews, moderateReview, deleteCmsReview,
  // media
  listMedia, uploadMedia, updateMedia, deleteMedia,
  // orders
  listAdminOrders, getAdminOrder, updateAdminOrderStatus,
  // refunds
  listAdminRefunds, getAdminRefund, processRefund,
  // notification templates
  listNotificationTemplates, createNotificationTemplate, getNotificationTemplate, updateNotificationTemplate, deleteNotificationTemplate, duplicateNotificationTemplate,
  // notification settings
  getNotificationSettings, putNotificationSettings,
  // support admin
  listSupportTicketsAdmin, getSupportTicketAdmin, replySupportTicket, closeSupportTicket,
  // support user
  listUserTickets, createUserTicket, closeUserTicket,
  // scheduler
  listScheduledTasks, createScheduledTask, getScheduledTask, updateScheduledTask, deleteScheduledTask,
  // analytics
  getUserAnalytics, getBookAnalyticsCms, getSearchAnalytics,
  // audit
  listAuditLogs, exportAuditLogs,
  // health
  getHealth,
};
