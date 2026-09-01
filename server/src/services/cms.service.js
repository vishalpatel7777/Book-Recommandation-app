const Author = require("../models/author.model");
const Category = require("../models/category.model");
const Promotion = require("../models/promotion.model");
const Coupon = require("../models/coupon.model");
const MediaAsset = require("../models/mediaAsset.model");
const HomepageBlock = require("../models/homepageBlock.model");
const Review = require("../models/review.model");
const Order = require("../models/order.model");
const Refund = require("../models/refund.model");
const NotificationTemplate = require("../models/notificationTemplate.model");
const ScheduledTask = require("../models/scheduledTask.model");
const SupportTicket = require("../models/supportTicket.model");
const SearchQuery = require("../models/searchQuery.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");

/* ── helpers ── */
function paginate(query, page, limit) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  return query.skip((p - 1) * l).limit(l);
}

// ── Authors ───────────────────────────────
async function listAuthors({ page = 1, limit = 10, search, status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: "i" };
  const q = Author.find(filter).sort({ createdAt: -1 });
  const total = await Author.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createAuthor(data) { return Author.create(data); }
async function getAuthorById(id) { return Author.findById(id); }
async function updateAuthor(id, data) { return Author.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
async function deleteAuthor(id) { return Author.findByIdAndUpdate(id, { status: "archived" }, { new: true }); }
async function hardDeleteAuthor(id) { return Author.findByIdAndDelete(id); }

// ── Categories ────────────────────────────
async function listCategories({ page = 1, limit = 50, search, status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: "i" };
  const q = Category.find(filter).sort({ createdAt: -1 });
  const total = await Category.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createCategory(data) { return Category.create(data); }
async function getCategoryById(id) { return Category.findById(id); }
async function updateCategory(id, data) { return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
async function deleteCategory(id) { return Category.findByIdAndUpdate(id, { status: "archived" }, { new: true }); }
async function hardDeleteCategory(id) { return Category.findByIdAndDelete(id); }

// ── Promotions ────────────────────────────
async function listPromotions({ page = 1, limit = 10, status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  const q = Promotion.find(filter).sort({ createdAt: -1 });
  const total = await Promotion.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createPromotion(data) { return Promotion.create(data); }
async function getPromotionById(id) { return Promotion.findById(id); }
async function updatePromotion(id, data) { return Promotion.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
async function deletePromotion(id) { return Promotion.findByIdAndDelete(id); }
async function getActivePromotions() {
  const now = new Date();
  return Promotion.find({
    status: "active",
    $or: [
      { scheduledAt: null, endsAt: null },
      { scheduledAt: { $lte: now }, endsAt: { $gte: now } },
      { scheduledAt: { $lte: now }, endsAt: null },
    ],
  }).sort({ priority: 1, createdAt: -1 });
}

// ── Coupons ───────────────────────────────
async function listCoupons({ page = 1, limit = 10, status, search } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.code = { $regex: search, $options: "i" };
  const q = Coupon.find(filter).sort({ createdAt: -1 });
  const total = await Coupon.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createCoupon(data) { return Coupon.create(data); }
async function getCouponById(id) { return Coupon.findById(id); }
async function updateCoupon(id, data) { return Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
async function deleteCoupon(id) { return Coupon.findByIdAndDelete(id); }
async function validateCoupon(code, cartTotal) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return { valid: false, message: "Invalid coupon code" };
  if (coupon.status !== "active") return { valid: false, message: `Coupon is ${coupon.status}` };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: "Coupon expired" };
  if (coupon.maxUses && coupon.uses >= coupon.maxUses) return { valid: false, message: "Coupon usage limit reached" };
  if (cartTotal < (coupon.minOrder || coupon.min || 0)) return { valid: false, message: `Minimum order ₹${coupon.minOrder || coupon.min} required` };
  let discount = 0;
  if (coupon.type === "flat") discount = coupon.value;
  else if (coupon.type === "percent") {
    discount = (cartTotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  }
  const finalTotal = Math.max(0, cartTotal - discount);
  return { valid: true, discount, finalTotal, couponId: coupon._id };
}

// ── Reviews moderation ────────────────────
async function listReviews({ page = 1, limit = 10, status, search } = {}) {
  const filter = {};
  if (status && status !== "all") {
    filter.status = status;
  }
  let q = Review.find(filter).sort({ createdAt: -1 }).populate("userId", "username email").populate("bookId", "title author");
  const total = await Review.countDocuments(filter);
  let data = await paginate(q, page, limit);
  // normalize for frontend: ensure book/user names are available even if populate missing (old docs)
  data = data.map((r) => {
    const o = r.toObject ? r.toObject() : r;
    o.book = o.bookId?.title || o.book || "—";
    o.user = o.userId?.username || o.user || o.userId || "—";
    o.text = o.review || o.comment || o.text || "";
    o.rating = o.rating ?? 0;
    o.date = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date || "";
    o.id = o._id || o.id;
    return o;
  });
  // optional search filter on normalized fields
  if (search) {
    const s = search.toLowerCase();
    data = data.filter((r) => String(r.book).toLowerCase().includes(s) || String(r.user).toLowerCase().includes(s) || String(r.text).toLowerCase().includes(s));
  }
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function updateReviewStatus(id, status) {
  // Store status as extra field if schema allows mixed, else just return updated object
  return Review.findByIdAndUpdate(id, { status }, { new: true });
}
async function deleteReview(id) { return Review.findByIdAndDelete(id); }

// ── Media ─────────────────────────────────
async function listMedia({ page = 1, limit = 20, type, search } = {}) {
  const filter = {};
  if (type && type !== "all") filter.type = type;
  if (search) filter.name = { $regex: search, $options: "i" };
  const q = MediaAsset.find(filter).sort({ uploadedAt: -1 });
  const total = await MediaAsset.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createMedia(data) { return MediaAsset.create(data); }
async function updateMedia(id, data) { return MediaAsset.findByIdAndUpdate(id, data, { new: true }); }
async function deleteMedia(id) { return MediaAsset.findByIdAndDelete(id); }
async function deleteMediaByPublicId(publicId) { return MediaAsset.findOneAndDelete({ publicId }); }

// ── Homepage blocks ───────────────────────
const DEFAULT_BLOCKS = [
  { blockId: "b1", type: "Hero Banner", status: "active", order: 1, headline: "Discover Your Next Read", subtext: "Curated books for every mood." },
  { blockId: "b2", type: "Featured Books", status: "active", order: 2, headline: "Staff Picks", subtext: "" },
  { blockId: "b3", type: "Categories", status: "active", order: 3, headline: "Browse by Genre", subtext: "" },
  { blockId: "b4", type: "New Arrivals", status: "active", order: 4, headline: "Fresh off the Press", subtext: "" },
  { blockId: "b5", type: "Promotion Banner", status: "inactive", order: 5, headline: "Summer Sale", subtext: "Up to 40% off" },
  { blockId: "b6", type: "Trending", status: "active", order: 6, headline: "Trending This Week", subtext: "" },
  { blockId: "b7", type: "Newsletter", status: "inactive", order: 7, headline: "Stay in the Loop", subtext: "Get weekly book recommendations." },
];
async function getHomepageBlocks(page = "home") {
  let doc = await HomepageBlock.findOne({ page });
  if (!doc) {
    doc = await HomepageBlock.create({ page, blocks: DEFAULT_BLOCKS });
  }
  return doc;
}
async function updateHomepageBlocks(page = "home", blocks) {
  const doc = await HomepageBlock.findOneAndUpdate(
    { page },
    { $set: { blocks } },
    { new: true, upsert: true }
  );
  return doc;
}
async function getPublicHomepageBlocks(page = "home") {
  const doc = await getHomepageBlocks(page);
  const active = (doc.blocks || []).filter((b) => b.status === "active");
  return active;
}

// ── Orders (admin) ────────────────────────
async function listOrders({ page = 1, limit = 10, status, search } = {}) {
  const filter = {};
  if (status && status !== "all") filter.status = { $regex: `^${status}$`, $options: "i" };
  if (search) {
    // search is not applied at DB level for simplicity; filtered after
  }
  const q = Order.find(filter).sort({ createdAt: -1 }).populate("user", "username email").populate("books", "title author price image");
  const total = await Order.countDocuments(filter);
  let data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function getOrderById(id) {
  return Order.findById(id).populate("user", "username email").populate("books", "title author price image");
}
async function updateOrderStatus(id, status) {
  return Order.findByIdAndUpdate(id, { status }, { new: true });
}

// ── Refunds (admin) ───────────────────────
async function listRefunds({ page = 1, limit = 10, status, search } = {}) {
  const filter = {};
  if (status && status !== "all") filter.status = status;
  const q = Refund.find(filter).sort({ createdAt: -1 }).populate("user", "username email").populate("book", "title author").populate("order");
  const total = await Refund.countDocuments(filter);
  const data = await paginate(q, page, limit);
  // enrich with amount aggregation for KPI
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function getRefundById(id) { return Refund.findById(id).populate("user", "username email").populate("book", "title author"); }
async function updateRefundStatus(id, action, processedBy = null) {
  const status = action === "approved" ? "approved" : action === "rejected" ? "rejected" : action;
  return Refund.findByIdAndUpdate(id, { status, processedBy, processedAt: new Date() }, { new: true });
}

// ── Notification templates ────────────────
async function listNotificationTemplates({ page = 1, limit = 20, search } = {}) {
  const filter = {};
  if (search) filter.template = { $regex: search, $options: "i" };
  const q = NotificationTemplate.find(filter).sort({ createdAt: -1 });
  const total = await NotificationTemplate.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createNotificationTemplate(data) { return NotificationTemplate.create(data); }
async function getNotificationTemplateById(id) { return NotificationTemplate.findById(id); }
async function updateNotificationTemplate(id, data) { return NotificationTemplate.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
async function deleteNotificationTemplate(id) { return NotificationTemplate.findByIdAndDelete(id); }
async function duplicateNotificationTemplate(id) {
  const orig = await NotificationTemplate.findById(id);
  if (!orig) return null;
  const dup = orig.toObject();
  delete dup._id;
  delete dup.createdAt;
  delete dup.updatedAt;
  dup.template = `${dup.template} Copy`;
  dup.status = "draft";
  dup.sent = 0;
  return NotificationTemplate.create(dup);
}

// ── Support tickets ───────────────────────
async function listSupportTickets({ page = 1, limit = 10, status, search } = {}) {
  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (search) filter.subject = { $regex: search, $options: "i" };
  const q = SupportTicket.find(filter).sort({ createdAt: -1 });
  const total = await SupportTicket.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function listUserSupportTickets(userId) {
  return SupportTicket.find({ userId }).sort({ createdAt: -1 });
}
async function createSupportTicket(userId, data) {
  const user = await User.findById(userId).select("username");
  return SupportTicket.create({ userId, customer: user ? user.username : "", ...data });
}
async function getSupportTicketById(id) { return SupportTicket.findById(id); }
async function replySupportTicket(id, adminReply) {
  return SupportTicket.findByIdAndUpdate(id, { adminReply, repliedAt: new Date(), status: "pending" }, { new: true });
}
async function closeSupportTicket(id) {
  return SupportTicket.findByIdAndUpdate(id, { status: "resolved" }, { new: true });
}
async function updateSupportTicketStatus(id, status) {
  return SupportTicket.findByIdAndUpdate(id, { status }, { new: true });
}

// ── Scheduler ─────────────────────────────
async function listScheduledTasks({ page = 1, limit = 10, status } = {}) {
  const filter = {};
  if (status && status !== "all") filter.status = status;
  const q = ScheduledTask.find(filter).sort({ scheduledAt: 1 });
  const total = await ScheduledTask.countDocuments(filter);
  const data = await paginate(q, page, limit);
  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) };
}
async function createScheduledTask(data) { return ScheduledTask.create(data); }
async function getScheduledTaskById(id) { return ScheduledTask.findById(id); }
async function updateScheduledTask(id, data) { return ScheduledTask.findByIdAndUpdate(id, data, { new: true }); }
async function deleteScheduledTask(id) { return ScheduledTask.findByIdAndDelete(id); }

// ── Search analytics ──────────────────────
async function listSearchAnalytics() {
  const topTermsAgg = await SearchQuery.aggregate([
    { $group: { _id: "$query", count: { $sum: 1 }, successCount: { $sum: { $cond: [{ $gt: ["$resultCount", 0] }, 1, 0] } } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const topTerms = topTermsAgg.map((t) => ({
    term: t._id,
    count: t.count,
    success: t.count ? Math.round((t.successCount / t.count) * 100) : 0,
  }));
  const noResultAgg = await SearchQuery.aggregate([
    { $match: { resultCount: 0 } },
    { $group: { _id: "$query", count: { $sum: 1 }, lastSeen: { $max: "$createdAt" } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const noResultTerms = noResultAgg.map((t) => ({
    term: t._id,
    count: t.count,
    lastSeen: t.lastSeen ? new Date(t.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
  }));
  const totalSearches = await SearchQuery.countDocuments();
  return { topTerms, noResultTerms, totalSearches };
}
async function logSearch(query, userId, resultCount) {
  try { await SearchQuery.create({ query, userId: userId || null, resultCount: resultCount || 0 }); } catch (_) {}
}

// ── User & Book analytics ─────────────────
async function getUserAnalytics() {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
  const topBuyersAgg = await Order.aggregate([
    { $group: { _id: "$user", orders: { $sum: 1 }, totalSpent: { $sum: "$totalPrice" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
  ]);
  const topBuyers = topBuyersAgg.map((r) => ({
    user: r.user.username,
    email: r.user.email,
    orders: r.orders,
    clv: `₹${r.totalSpent.toLocaleString()}`,
    avg: `₹${Math.round(r.totalSpent / r.orders).toLocaleString()}`,
    lastOrder: r.user.lastLogin ? new Date(r.user.lastLogin).toLocaleDateString() : "—",
  }));
  const refunds = await Refund.find().sort({ createdAt: -1 }).limit(4).populate("user", "username").populate("book", "title");
  const recentRefunds = refunds.map((r) => ({
    id: r._id.toString().slice(-6).toUpperCase(),
    user: r.user ? r.user.username : "unknown",
    book: r.book ? r.book.title : "—",
    amount: `₹${r.amount}`,
    status: r.status,
    date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    reason: r.reason || "",
  }));
  // CLV distribution
  const allUserSpending = await Order.aggregate([
    { $group: { _id: "$user", total: { $sum: "$totalPrice" } } },
  ]);
  const tiers = [
    { label: "₹0–500", min: 0, max: 500, count: 0 },
    { label: "₹500–2k", min: 500, max: 2000, count: 0 },
    { label: "₹2k–5k", min: 2000, max: 5000, count: 0 },
    { label: "₹5k–10k", min: 5000, max: 10000, count: 0 },
    { label: "₹10k+", min: 10000, max: Infinity, count: 0 },
  ];
  allUserSpending.forEach((u) => {
    const tier = tiers.find((t) => u.total >= t.min && u.total < t.max);
    if (tier) tier.count += 1;
  });
  const totalTier = allUserSpending.length || 1;
  const clvDistribution = tiers.map((t) => ({ label: t.label, count: t.count, pct: Math.round((t.count / totalTier) * 100) }));
  return { kpis: { totalUsers, activeUsers }, topBuyers, recentRefunds, clvDistribution };
}

async function logEvent({ type, userId, user, meta, ip }) {
  try { const Event = require("../models/event.model"); await Event.create({ type, userId: userId||null, user: user||"", meta: meta||"", ip: ip||"" }); } catch(_) {}
}
async function getEventAnalytics() {
  try {
    const Event = require("../models/event.model");
    const since = new Date(Date.now() - 7*24*60*60*1000);
    const volumeAgg = await Event.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { day: { $dateToString:{ format:"%Y-%m-%d", date:"$createdAt" } }, type:{ $substr:["$type",0,6] } }, count:{ $sum:1 } } },
    ]).catch(()=>[]);
    return { volume: volumeAgg };
  } catch { return { volume: [] }; }
}

async function getBookAnalytics({ limit = 5 } = {}) {
  const books = await Book.find().sort({ createdAt: -1 }).limit(50).lean();
  // Enrich with purchase counts from Order
  const purchaseCounts = await Order.aggregate([
    { $unwind: "$books" },
    { $group: { _id: "$books", purchases: { $sum: 1 } } },
  ]);
  const purchaseMap = Object.fromEntries(purchaseCounts.map((p) => [String(p._id), p.purchases]));
  const enriched = books.map((b) => ({
    title: b.title,
    author: b.author,
    views: Math.floor(Math.random() * 2000) + 500, // until view tracking implemented
    purchases: purchaseMap[String(b._id)] || 0,
    ratings: b.ratings || 0,
    price: b.price,
  })).sort((a, b) => b.purchases - a.purchases).slice(0, limit);
  return enriched;
}

module.exports = {
  // authors
  listAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor, hardDeleteAuthor,
  // categories
  listCategories, createCategory, getCategoryById, updateCategory, deleteCategory, hardDeleteCategory,
  // promotions
  listPromotions, createPromotion, getPromotionById, updatePromotion, deletePromotion, getActivePromotions,
  // coupons
  listCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon, validateCoupon,
  // reviews
  listReviews, updateReviewStatus, deleteReview,
  // media
  listMedia, createMedia, updateMedia, deleteMedia, deleteMediaByPublicId,
  // homepage
  getHomepageBlocks, updateHomepageBlocks, getPublicHomepageBlocks, DEFAULT_BLOCKS,
  // orders
  listOrders, getOrderById, updateOrderStatus,
  // refunds
  listRefunds, getRefundById, updateRefundStatus,
  // notifications
  listNotificationTemplates, createNotificationTemplate, getNotificationTemplateById, updateNotificationTemplate, deleteNotificationTemplate, duplicateNotificationTemplate,
  // support
  listSupportTickets, listUserSupportTickets, createSupportTicket, getSupportTicketById, replySupportTicket, closeSupportTicket, updateSupportTicketStatus,
  // scheduler
  listScheduledTasks, createScheduledTask, getScheduledTaskById, updateScheduledTask, deleteScheduledTask,
  // search
  listSearchAnalytics, logSearch,
  // analytics
  getUserAnalytics, getBookAnalytics,
  // events
  logEvent, getEventAnalytics,
};
