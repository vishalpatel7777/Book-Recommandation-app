const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

// ── Site Settings ─────────────────────
const siteSettingGroupSchema = z.object({
  group: z.enum(["branding", "seo", "theme", "payments", "features", "notifications", "recommendations", "integrations"]),
});

const brandingUpdateSchema = z.object({
  siteTitle: z.string().min(1).max(200).optional(),
  tagline: z.string().max(500).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
});

const seoUpdateSchema = z.object({
  seoTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  keywords: z.string().max(500).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(500).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
});

const themeUpdateSchema = z.object({
  activePresetId: z.string().max(50).optional(),
  primary: z.string().max(20).optional(),
  accent: z.string().max(20).optional(),
  bg: z.string().max(20).optional(),
  textColor: z.string().max(20).optional(),
  secondary: z.string().max(20).optional(),
  radius: z.string().max(20).optional(),
  shadow: z.string().max(50).optional(),
  preset: z.object({
    id: z.string(),
    label: z.string(),
    primary: z.string(),
    accent: z.string(),
    bg: z.string(),
  }).optional(),
});

const featureFlagsSchema = z.object({
  reviews: z.boolean().optional(),
  ratings: z.boolean().optional(),
  wishlist: z.boolean().optional(),
  cart: z.boolean().optional(),
  recommendations: z.boolean().optional(),
  notifications: z.boolean().optional(),
  blog: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  coupons: z.boolean().optional(),
  giftCards: z.boolean().optional(),
  referrals: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  socialSharing: z.boolean().optional(),
  guestCheckout: z.boolean().optional(),
  readingStatus: z.boolean().optional(),
}).passthrough();

// ── Homepage Blocks ───────────────────
const homepageBlockItemSchema = z.object({
  blockId: z.string().min(1),
  type: z.string().min(1),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
  order: z.coerce.number().int().min(1),
  headline: z.string().optional().default(""),
  subtext: z.string().optional().default(""),
  bookId: objectId.optional().or(z.literal("")).or(z.null()),
  authorId: objectId.optional().or(z.literal("")).or(z.null()),
  imageUrl: z.string().optional().default(""),
  imagePublicId: z.string().optional().default(""),
  bgImage: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  discount: z.string().optional().default(""),
});

const homepageBlocksUpdateSchema = z.object({
  blocks: z.array(homepageBlockItemSchema).min(1),
  page: z.string().optional().default("home"),
});

// ── Authors ───────────────────────────
const authorCreateSchema = z.object({
  name: z.string().min(1).max(200),
  genre: z.string().max(100).optional().default(""),
  bio: z.string().max(5000).optional().default(""),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  website: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  followers: z.coerce.number().int().min(0).optional().default(0),
  verified: z.coerce.boolean().optional().default(false),
  featured: z.coerce.boolean().optional().default(false),
  status: z.enum(["active", "archived"]).optional().default("active"),
});

const authorUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  genre: z.string().max(100).optional(),
  bio: z.string().max(5000).optional(),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  website: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  followers: z.coerce.number().int().min(0).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

// ── Categories ────────────────────────
const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  icon: z.string().optional().default(""),
  color: z.string().optional().default(""),
  description: z.string().max(2000).optional().default(""),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  seoTitle: z.string().max(200).optional().default(""),
  seoDesc: z.string().max(500).optional().default(""),
  featured: z.coerce.boolean().optional().default(false),
  status: z.enum(["active", "archived"]).optional().default("active"),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().max(2000).optional(),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(500).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

// ── Promotions ────────────────────────
const promotionCreateSchema = z.object({
  title: z.string().min(1).max(200),
  name: z.string().max(200).optional(),
  description: z.string().max(2000).optional().default(""),
  badge: z.string().max(50).optional().default(""),
  cta: z.string().max(100).optional().default(""),
  ctaLink: z.string().optional().default(""),
  ctaUrl: z.string().optional().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  bannerImg: z.string().url().optional().or(z.literal("")).or(z.null()),
  type: z.enum(["Banner", "Popup", "Flash", "Bundle", "Sidebar"]).optional().default("Banner"),
  status: z.enum(["active", "scheduled", "ended", "draft"]).optional().default("active"),
  scheduledAt: z.string().optional().or(z.null()),
  endsAt: z.string().optional().or(z.null()),
  starts: z.string().optional().default(""),
  ends: z.string().optional().default(""),
  discount: z.string().optional().default(""),
  priority: z.coerce.number().int().min(1).optional().default(1),
  targetBookId: objectId.optional().or(z.literal("")).or(z.null()),
});

const promotionUpdateSchema = promotionCreateSchema.partial();

// ── Coupons ───────────────────────────
const couponCreateSchema = z.object({
  code: z.string().min(2).max(50).transform((v) => v.toUpperCase()),
  type: z.enum(["flat", "percent"]),
  value: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  maxUses: z.coerce.number().int().min(1).optional().nullable(),
  minOrder: z.coerce.number().min(0).optional().default(0),
  min: z.coerce.number().min(0).optional().default(0),
  perUser: z.coerce.number().int().min(1).optional().default(1),
  categories: z.array(z.string()).optional().default([]),
  books: z.array(z.string()).optional().default([]),
  status: z.enum(["active", "expired", "disabled", "draft"]).optional().default("active"),
  startDate: z.string().optional().default(""),
  expiry: z.string().optional().default(""),
  expiresAt: z.string().optional().or(z.null()),
});

const couponUpdateSchema = z.object({
  code: z.string().min(2).max(50).transform((v) => v.toUpperCase()).optional(),
  type: z.enum(["flat", "percent"]).optional(),
  value: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  maxUses: z.coerce.number().int().min(1).optional().nullable(),
  minOrder: z.coerce.number().min(0).optional(),
  min: z.coerce.number().min(0).optional(),
  perUser: z.coerce.number().int().min(1).optional(),
  categories: z.array(z.string()).optional(),
  books: z.array(z.string()).optional(),
  status: z.enum(["active", "expired", "disabled", "draft"]).optional(),
  startDate: z.string().optional(),
  expiry: z.string().optional(),
  expiresAt: z.string().optional().or(z.null()),
});

// ── Reviews moderation ────────────────
const reviewStatusSchema = z.object({
  status: z.enum(["pending", "published", "flagged", "removed", "approved", "rejected"]),
});

// ── Support ───────────────────────────
const supportTicketCreateSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
});

const supportReplySchema = z.object({
  adminReply: z.string().min(1).max(5000),
  message: z.string().min(1).max(5000).optional(),
});

// ── Scheduler ─────────────────────────
const scheduledTaskCreateSchema = z.object({
  type: z.enum(["Book", "Promotion", "Homepage", "Notification"]),
  name: z.string().min(1).max(200),
  action: z.string().min(1).max(100),
  scheduledAt: z.string().min(1), // ISO or label string
  tz: z.string().optional().default("IST"),
  status: z.enum(["pending", "completed", "cancelled"]).optional().default("pending"),
  meta: z.any().optional(),
});

// ── Notification templates ────────────
const notificationTemplateCreateSchema = z.object({
  template: z.string().min(1).max(200),
  channel: z.enum(["email", "push", "sms"]).default("email"),
  trigger: z.string().min(1).max(100),
  status: z.enum(["active", "draft", "inactive"]).optional().default("active"),
  subject: z.string().max(200).optional().default(""),
  message: z.string().max(5000).optional().default(""),
});

const notificationTemplateUpdateSchema = notificationTemplateCreateSchema.partial();

const notificationSettingsSchema = z.object({
  settings: z.array(
    z.object({
      id: z.string(),
      event: z.string(),
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    })
  ).optional(),
}).passthrough();

// ── Media rename ──────────────────────
const mediaUpdateSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  type: z.enum(["image", "banner", "logo", "pdf", "video", "other"]).optional(),
});

// ── Order status ──────────────────────
const orderStatusSchema = z.object({
  status: z.enum(["Pending", "Completed", "Cancelled", "pending", "completed", "failed", "refund_pending", "refunded", "partial_refund"]),
});

// ── Refund action ─────────────────────
const refundActionSchema = z.object({
  action: z.enum(["approved", "rejected", "pending"]),
  reason: z.string().max(1000).optional(),
});

// ── Pagination ────────────────────────
const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  q: z.string().optional(),
});

const idParamSchema = z.object({
  id: objectId,
});

module.exports = {
  siteSettingGroupSchema,
  brandingUpdateSchema,
  seoUpdateSchema,
  themeUpdateSchema,
  featureFlagsSchema,
  homepageBlockItemSchema,
  homepageBlocksUpdateSchema,
  authorCreateSchema,
  authorUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  promotionCreateSchema,
  promotionUpdateSchema,
  couponCreateSchema,
  couponUpdateSchema,
  reviewStatusSchema,
  supportTicketCreateSchema,
  supportReplySchema,
  scheduledTaskCreateSchema,
  notificationTemplateCreateSchema,
  notificationTemplateUpdateSchema,
  notificationSettingsSchema,
  mediaUpdateSchema,
  orderStatusSchema,
  refundActionSchema,
  paginationQuerySchema,
  idParamSchema,
};
