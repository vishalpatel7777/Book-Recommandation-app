const express = require("express");
const router = express.Router();

const brandingController = require("../controllers/branding.controller");
const cmsController = require("../controllers/cms.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const { validate, validateParams, validateQuery } = require("../middleware/validate.middleware");
const { upload, uploadAny } = require("../middleware/upload.middleware");
const v = require("../validators/cms.validator");

// ── Branding (existing, now protected + validated) ──────────────
router.get("/cms/branding", authenticateToken, isAdmin, brandingController.getBranding);
router.put("/cms/branding", authenticateToken, isAdmin, validate(v.brandingUpdateSchema), brandingController.updateBranding);
router.post("/cms/branding/logo", authenticateToken, isAdmin, upload, brandingController.uploadLogo);
router.post("/cms/branding/favicon", authenticateToken, isAdmin, upload, brandingController.uploadFavicon);

// ── Site Settings (generic group) ───────────────────────────────
router.get("/cms/settings/:group", authenticateToken, isAdmin, cmsController.getSiteSetting);
router.put("/cms/settings/:group", authenticateToken, isAdmin, cmsController.updateSiteSetting);

// ── SEO ─────────────────────────────────────────────────────────
router.get("/cms/seo", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "seo"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/seo", authenticateToken, isAdmin, validate(v.seoUpdateSchema), (req, res, next) => { req.params.group = "seo"; return cmsController.updateSiteSetting(req, res, next); });

// ── Theme ───────────────────────────────────────────────────────
router.get("/cms/theme", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "theme"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/theme", authenticateToken, isAdmin, validate(v.themeUpdateSchema), (req, res, next) => { req.params.group = "theme"; return cmsController.updateSiteSetting(req, res, next); });

// ── Feature Flags ───────────────────────────────────────────────
router.get("/cms/features", authenticateToken, isAdmin, cmsController.getFeatureFlags);
router.put("/cms/features", authenticateToken, isAdmin, validate(v.featureFlagsSchema), cmsController.updateFeatureFlags);
router.get("/feature-flags", cmsController.getPublicFeatureFlags); // public
router.get("/branding", cmsController.getPublicBranding); // public
router.get("/theme", cmsController.getPublicTheme); // public
router.get("/seo", cmsController.getPublicSeo); // public
router.post("/cms/seo/og-image", authenticateToken, isAdmin, upload, cmsController.uploadSeoOgImage);

// ── Integrations ────────────────────────────────────────────────
router.get("/cms/integrations", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "integrations"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/integrations", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "integrations"; return cmsController.updateSiteSetting(req, res, next); });

// ── Blog / FAQ / SocialProof (CMS editable, public read) ─────
router.get("/cms/blog", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "blog"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/blog", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "blog"; return cmsController.updateSiteSetting(req, res, next); });
router.get("/cms/faq", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "faq"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/faq", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "faq"; return cmsController.updateSiteSetting(req, res, next); });
router.get("/cms/social-proof", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "socialProof"; return cmsController.getSiteSetting(req, res, next); });
router.put("/cms/social-proof", authenticateToken, isAdmin, (req, res, next) => { req.params.group = "socialProof"; return cmsController.updateSiteSetting(req, res, next); });
router.get("/blog", async (req, res, next) => { req.params.group = "blog"; return cmsController.getSiteSetting(req, res, next); }); // public feed — falls back to DEFAULTS.blog if empty
router.get("/faq", async (req, res, next) => { req.params.group = "faq"; return cmsController.getSiteSetting(req, res, next); });
router.get("/social-proof", async (req, res, next) => { req.params.group = "socialProof"; return cmsController.getSiteSetting(req, res, next); });

// ── Homepage Blocks ─────────────────────────────────────────────
router.get("/cms/homepage-blocks", authenticateToken, isAdmin, cmsController.getHomepageBlocks);
router.put("/cms/homepage-blocks", authenticateToken, isAdmin, validate(v.homepageBlocksUpdateSchema), cmsController.putHomepageBlocks);
router.get("/homepage-blocks", cmsController.getPublicHomepageBlocks); // public

// ── Authors ─────────────────────────────────────────────────────
router.get("/cms/authors", authenticateToken, isAdmin, cmsController.listAuthors);
router.post("/cms/authors", authenticateToken, isAdmin, validate(v.authorCreateSchema), cmsController.createAuthor);
router.get("/cms/authors/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getAuthor);
router.put("/cms/authors/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.authorUpdateSchema), cmsController.updateAuthor);
router.delete("/cms/authors/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteAuthor);
router.delete("/cms/authors/:id/hard", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.hardDeleteAuthor);
router.get("/authors", cmsController.listPublicAuthors); // public

// ── Categories ──────────────────────────────────────────────────
router.get("/cms/categories", authenticateToken, isAdmin, cmsController.listCategories);
router.post("/cms/categories", authenticateToken, isAdmin, validate(v.categoryCreateSchema), cmsController.createCategory);
router.get("/cms/categories/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getCategory);
router.put("/cms/categories/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.categoryUpdateSchema), cmsController.updateCategory);
router.delete("/cms/categories/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteCategory);
router.get("/categories", cmsController.listPublicCategories); // public
router.get("/promotions/active", cmsController.listPublicPromotions); // public alias

// ── Promotions ──────────────────────────────────────────────────
router.get("/cms/promotions", authenticateToken, isAdmin, cmsController.listPromotions);
router.post("/cms/promotions", authenticateToken, isAdmin, validate(v.promotionCreateSchema), cmsController.createPromotion);
router.get("/cms/promotions/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getPromotion);
router.put("/cms/promotions/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.updatePromotion);
router.delete("/cms/promotions/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deletePromotion);

// ── Coupons ─────────────────────────────────────────────────────
router.get("/cms/coupons", authenticateToken, isAdmin, cmsController.listCoupons);
router.post("/cms/coupons", authenticateToken, isAdmin, validate(v.couponCreateSchema), cmsController.createCoupon);
router.get("/cms/coupons/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getCoupon);
router.put("/cms/coupons/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.couponUpdateSchema), cmsController.updateCoupon);
router.delete("/cms/coupons/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteCoupon);
router.post("/coupons/validate", authenticateToken, cmsController.validateCoupon); // any authenticated user

// ── Reviews moderation ──────────────────────────────────────────
router.get("/cms/reviews", authenticateToken, isAdmin, cmsController.listCmsReviews);
router.patch("/cms/reviews/:id/status", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.reviewStatusSchema), cmsController.moderateReview);
router.delete("/cms/reviews/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteCmsReview);

// ── Media ───────────────────────────────────────────────────────
router.get("/cms/media", authenticateToken, isAdmin, cmsController.listMedia);
router.post("/cms/media/upload", authenticateToken, isAdmin, uploadAny, cmsController.uploadMedia);
router.put("/cms/media/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.mediaUpdateSchema), cmsController.updateMedia);
router.delete("/cms/media/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteMedia);
router.delete("/cms/media/by-public/:publicId", authenticateToken, isAdmin, cmsController.deleteMedia);

// ── Admin Orders (cms aliases — primary handlers live in commerce.routes; these are secondary CMS views) ──
router.get("/cms/orders", authenticateToken, isAdmin, cmsController.listAdminOrders);
router.get("/cms/orders/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getAdminOrder);

// ── Admin Refunds (cms aliases) ─────────────────────────────────
router.get("/cms/refunds", authenticateToken, isAdmin, cmsController.listAdminRefunds);
router.get("/cms/refunds/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getAdminRefund);
router.put("/cms/refunds/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.refundActionSchema), cmsController.processRefund);

// ── Notification templates ──────────────────────────────────────
router.get("/cms/notifications", authenticateToken, isAdmin, cmsController.listNotificationTemplates);
router.post("/cms/notifications", authenticateToken, isAdmin, validate(v.notificationTemplateCreateSchema), cmsController.createNotificationTemplate);
router.get("/cms/notifications/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getNotificationTemplate);
router.put("/cms/notifications/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.notificationTemplateUpdateSchema), cmsController.updateNotificationTemplate);
router.delete("/cms/notifications/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteNotificationTemplate);
router.post("/cms/notifications/:id/duplicate", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.duplicateNotificationTemplate);

// ── Notification settings ───────────────────────────────────────
router.get("/cms/notification-settings", authenticateToken, isAdmin, cmsController.getNotificationSettings);
router.put("/cms/notification-settings", authenticateToken, isAdmin, validate(v.notificationSettingsSchema), cmsController.putNotificationSettings);

// ── Scheduler ───────────────────────────────────────────────────
router.get("/cms/scheduled-tasks", authenticateToken, isAdmin, cmsController.listScheduledTasks);
router.get("/cms/scheduler", authenticateToken, isAdmin, cmsController.listScheduledTasks);
router.post("/cms/scheduled-tasks", authenticateToken, isAdmin, validate(v.scheduledTaskCreateSchema), cmsController.createScheduledTask);
router.post("/cms/scheduler", authenticateToken, isAdmin, validate(v.scheduledTaskCreateSchema), cmsController.createScheduledTask);
router.get("/cms/scheduled-tasks/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getScheduledTask);
router.put("/cms/scheduled-tasks/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.updateScheduledTask);
router.delete("/cms/scheduled-tasks/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteScheduledTask);
router.delete("/cms/scheduler/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.deleteScheduledTask);

// ── Support (admin) ─────────────────────────────────────────────
router.get("/cms/support/tickets", authenticateToken, isAdmin, cmsController.listSupportTicketsAdmin);
router.get("/cms/support-tickets", authenticateToken, isAdmin, cmsController.listSupportTicketsAdmin);
router.get("/cms/support/tickets/:id", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.getSupportTicketAdmin);
router.patch("/cms/support/tickets/:id/reply", authenticateToken, isAdmin, validateParams(v.idParamSchema), validate(v.supportReplySchema), cmsController.replySupportTicket);
router.patch("/cms/support/tickets/:id/close", authenticateToken, isAdmin, validateParams(v.idParamSchema), cmsController.closeSupportTicket);

// ── Support (user) ──────────────────────────────────────────────
router.get("/support/tickets", authenticateToken, cmsController.listUserTickets);
router.post("/support/tickets", authenticateToken, validate(v.supportTicketCreateSchema), cmsController.createUserTicket);
router.patch("/support/tickets/:id/close", authenticateToken, validateParams(v.idParamSchema), cmsController.closeUserTicket);

// ── Analytics (admin) ───────────────────────────────────────────
router.get("/cms/analytics/users", authenticateToken, isAdmin, cmsController.getUserAnalytics);
router.get("/cms/analytics/books", authenticateToken, isAdmin, cmsController.getBookAnalyticsCms);
router.get("/cms/analytics/search", authenticateToken, isAdmin, cmsController.getSearchAnalytics);
router.get("/cms/analytics/user-analytics", authenticateToken, isAdmin, cmsController.getUserAnalytics);
router.get("/cms/analytics/book-analytics", authenticateToken, isAdmin, cmsController.getBookAnalyticsCms);
router.get("/cms/analytics/search-analytics", authenticateToken, isAdmin, cmsController.getSearchAnalytics);

// ── Events ──────────────────────────────────────────────────────
router.post("/events", cmsController.postEvent); // public fire-and-forget
router.get("/cms/events", authenticateToken, isAdmin, cmsController.getEvents);
router.get("/cms/analytics/events", authenticateToken, isAdmin, cmsController.getEventAnalytics);

// ── Audit logs ──────────────────────────────────────────────────
router.get("/cms/audit-logs", authenticateToken, isAdmin, cmsController.listAuditLogs);
router.get("/cms/audit-logs/export", authenticateToken, isAdmin, cmsController.exportAuditLogs);
router.get("/admin/audit-logs", authenticateToken, isAdmin, cmsController.listAuditLogs);
router.get("/admin/audit-logs/export", authenticateToken, isAdmin, cmsController.exportAuditLogs);

// ── Health ──────────────────────────────────────────────────────
router.get("/admin/health", authenticateToken, isAdmin, cmsController.getHealth);

module.exports = router;
