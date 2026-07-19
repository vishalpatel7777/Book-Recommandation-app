import {
  Image, Palette, Globe, Users, BookOpen, Activity, FolderOpen,
  Bell, FileText, Layout, TrendingUp, Percent, Tag, BookMarked,
  Zap, Settings, Star, ShoppingBag, RefreshCw, MessageSquare,
  LogIn, LogOut, AlertTriangle, Search as SearchIcon, Eye,
  Heart, Package, CheckCircle, XCircle, Edit, UserCog,
} from "lucide-react";

export const SECTIONS = [
  { id: "branding",          label: "Branding",             icon: Image,         group: "Content" },
  { id: "theme",             label: "Theme Manager",         icon: Palette,       group: "Content" },
  { id: "metadata",          label: "SEO & Metadata",        icon: Globe,         group: "Content" },
  { id: "homepage-builder",  label: "Homepage Builder",      icon: Layout,        group: "Content" },
  { id: "media-library",     label: "Media Library",         icon: FolderOpen,    group: "Content" },
  { id: "user-analytics",    label: "User Analytics",        icon: Users,         group: "Analytics" },
  { id: "book-analytics",    label: "Book Analytics",        icon: BookOpen,      group: "Analytics" },
  { id: "event-tracking",    label: "Event Tracking",        icon: Activity,      group: "Analytics" },
  { id: "search-analytics",  label: "Search Analytics",      icon: SearchIcon,    group: "Analytics" },
  { id: "recommendations",   label: "Recommendations",       icon: Star,          group: "Analytics" },
  { id: "authors",           label: "Authors Manager",       icon: BookMarked,    group: "Catalog" },
  { id: "categories",        label: "Categories Manager",    icon: Tag,           group: "Catalog" },
  { id: "reviews",           label: "Reviews Manager",       icon: Star,          group: "Catalog" },
  { id: "promotions",        label: "Promotions",            icon: TrendingUp,    group: "Commerce" },
  { id: "coupons",           label: "Coupons",               icon: Percent,       group: "Commerce" },
  { id: "payment-settings",  label: "Payment Settings",      icon: Settings,      group: "Commerce" },
  { id: "orders",            label: "Orders Manager",        icon: ShoppingBag,   group: "Commerce" },
  { id: "refunds",           label: "Refund Manager",        icon: RefreshCw,     group: "Commerce" },
  { id: "notifications",     label: "Notification Center",   icon: Bell,          group: "System" },
  { id: "notification-settings", label: "Notification Settings", icon: Bell,     group: "System" },
  { id: "scheduler",         label: "Content Scheduler",     icon: FileText,      group: "System" },
  { id: "support",           label: "Support Center",        icon: MessageSquare, group: "System" },
  { id: "audit-logs",        label: "Audit Logs",            icon: FileText,      group: "System" },
  { id: "features",          label: "Feature Toggles",       icon: Zap,           group: "System" },
  { id: "integrations",      label: "Integrations",          icon: Settings,      group: "System" },
];

export const PRESETS = [
  { id: "matcha",  label: "Matcha",          primary: "#5C7A5E", accent: "#8B6F47", bg: "#FAF8F3" },
  { id: "vintage", label: "Vintage Library", primary: "#7B5E3A", accent: "#B8860B", bg: "#F5EDD6" },
  { id: "ocean",   label: "Ocean Paper",     primary: "#4A7A8A", accent: "#6B9EAA", bg: "#F0F7F9" },
  { id: "forest",  label: "Forest Reading",  primary: "#3D6B52", accent: "#8FAF7C", bg: "#F2F5EE" },
  { id: "minimal", label: "Minimal White",   primary: "#222222", accent: "#888888", bg: "#FFFFFF" },
];

export const FEATURE_DEFAULTS = {
  reviews: true, ratings: true, wishlist: true, cart: true,
  recommendations: true, notifications: true, blog: false, newsletter: false,
  coupons: false, giftCards: false, referrals: false,
};

export const FEATURE_LABELS = {
  reviews: "Reviews", ratings: "Ratings", wishlist: "Wishlist",
  cart: "Cart", recommendations: "AI Recommendations", notifications: "Notifications",
  blog: "Blog", newsletter: "Newsletter", coupons: "Coupons",
  giftCards: "Gift Cards", referrals: "Referral Programme",
};

export const TOP_BUYERS = [
  { user: "anjali_r",  email: "anjali@example.com",  orders: 18, clv: "₹8,240", lastOrder: "2 days ago",  avg: "₹458" },
  { user: "dev_patel", email: "dev@example.com",     orders: 14, clv: "₹6,300", lastOrder: "5 days ago",  avg: "₹450" },
  { user: "priya_m",   email: "priya@example.com",   orders: 12, clv: "₹5,700", lastOrder: "1 week ago",  avg: "₹475" },
  { user: "meera_k",   email: "meera@example.com",   orders: 11, clv: "₹4,950", lastOrder: "3 days ago",  avg: "₹450" },
  { user: "arjun_s",   email: "arjun@example.com",   orders: 9,  clv: "₹3,870", lastOrder: "2 weeks ago", avg: "₹430" },
];

export const REFUND_HISTORY = [
  { id: "RF-001", user: "rohan_d",  book: "The Alchemist",        amount: "₹299", status: "approved", date: "Jun 2",  reason: "Duplicate purchase" },
  { id: "RF-002", user: "nisha_v",  book: "Atomic Habits",        amount: "₹349", status: "pending",  date: "Jun 4",  reason: "Wrong edition" },
  { id: "RF-003", user: "kartik_j", book: "Project Hail Mary",    amount: "₹399", status: "rejected", date: "Jun 1",  reason: "Change of mind" },
  { id: "RF-004", user: "priya_m",  book: "The Midnight Library", amount: "₹279", status: "approved", date: "May 30", reason: "Technical issue" },
];

export const REV_BY_USER = [
  { label: "₹0–500",   count: 312, pct: 48 },
  { label: "₹500–2k",  count: 187, pct: 29 },
  { label: "₹2k–5k",   count: 92,  pct: 14 },
  { label: "₹5k–10k",  count: 43,  pct: 7 },
  { label: "₹10k+",    count: 12,  pct: 2 },
];

export const EVENT_TYPES = [
  { id: "login",           label: "Login",           icon: LogIn,         color: "var(--accent-info)" },
  { id: "logout",          label: "Logout",          icon: LogOut,        color: "var(--text-faint)" },
  { id: "failed-login",    label: "Failed Login",    icon: AlertTriangle, color: "var(--accent-danger)" },
  { id: "search",          label: "Search",          icon: SearchIcon,    color: "var(--accent-amber)" },
  { id: "book-view",       label: "Book View",       icon: Eye,           color: "var(--text-muted)" },
  { id: "wishlist-add",    label: "Wishlist Add",    icon: Heart,         color: "var(--accent-danger)" },
  { id: "wishlist-remove", label: "Wishlist Remove", icon: Heart,         color: "var(--text-faint)" },
  { id: "cart-add",        label: "Cart Add",        icon: Package,       color: "var(--accent-amber)" },
  { id: "cart-remove",     label: "Cart Remove",     icon: Package,       color: "var(--text-faint)" },
  { id: "checkout-start",  label: "Checkout Start",  icon: ShoppingBag,   color: "var(--accent-sage)" },
  { id: "payment-success", label: "Payment Success", icon: CheckCircle,   color: "var(--accent-sage)" },
  { id: "payment-failure", label: "Payment Failure", icon: XCircle,       color: "var(--accent-danger)" },
  { id: "payment-cancel",  label: "Payment Cancel",  icon: XCircle,       color: "var(--text-muted)" },
  { id: "review-create",   label: "Review Created",  icon: Star,          color: "var(--accent-gold)" },
  { id: "review-edit",     label: "Review Edited",   icon: Edit,          color: "var(--accent-gold)" },
  { id: "review-delete",   label: "Review Deleted",  icon: Star,          color: "var(--text-faint)" },
  { id: "profile-update",  label: "Profile Updated", icon: UserCog,       color: "var(--accent-info)" },
];

export const MOCK_EVENTS = [
  { id: "e1",  type: "payment-success", user: "anjali_r",  meta: "Atomic Habits · ₹349",           time: "1m ago",  ip: "103.x.x.1" },
  { id: "e2",  type: "review-create",   user: "meera_k",   meta: "Project Hail Mary · 5★",          time: "8m ago",  ip: "117.x.x.4" },
  { id: "e3",  type: "failed-login",    user: "unknown",   meta: "IP: 192.168.0.55 (3rd attempt)",  time: "15m ago", ip: "192.168.0.55" },
  { id: "e4",  type: "checkout-start",  user: "arjun_s",   meta: "Cart: 2 items · ₹648",            time: "18m ago", ip: "106.x.x.9" },
  { id: "e5",  type: "wishlist-add",    user: "nisha_v",   meta: "Sapiens",                          time: "24m ago", ip: "49.x.x.2" },
  { id: "e6",  type: "search",          user: "rohan_d",   meta: '"philosophy books"',               time: "31m ago", ip: "59.x.x.7" },
  { id: "e7",  type: "payment-failure", user: "kartik_j",  meta: "The Alchemist · Card declined",   time: "40m ago", ip: "103.x.x.8" },
  { id: "e8",  type: "profile-update",  user: "priya_m",   meta: "Email + password changed",        time: "1h ago",  ip: "117.x.x.3" },
  { id: "e9",  type: "login",           user: "dev_patel", meta: "Chrome / Windows 11",             time: "2h ago",  ip: "122.x.x.6" },
  { id: "e10", type: "book-view",       user: "anjali_r",  meta: "Midnight Library × 3",            time: "2h ago",  ip: "103.x.x.1" },
];

export const EVENT_VOLUME = [
  { date: "Jun 1", logins: 48, purchases: 22, searches: 140 },
  { date: "Jun 2", logins: 52, purchases: 29, searches: 165 },
  { date: "Jun 3", logins: 61, purchases: 35, searches: 180 },
  { date: "Jun 4", logins: 44, purchases: 19, searches: 122 },
  { date: "Jun 5", logins: 58, purchases: 31, searches: 155 },
  { date: "Jun 6", logins: 67, purchases: 38, searches: 201 },
  { date: "Jun 7", logins: 74, purchases: 42, searches: 219 },
];

export const MOCK_AUDIT = [
  { id: "a1", actor: "admin",  action: "BOOK_PUBLISHED",   target: "Atomic Habits",         time: "Jun 7, 09:12", ip: "192.168.1.1", severity: "info" },
  { id: "a2", actor: "admin",  action: "USER_BANNED",      target: "spam_account_99",       time: "Jun 7, 08:44", ip: "192.168.1.1", severity: "warn" },
  { id: "a3", actor: "system", action: "COUPON_CREATED",   target: "SUMMER20",              time: "Jun 6, 17:30", ip: "system",      severity: "info" },
  { id: "a4", actor: "admin",  action: "REFUND_APPROVED",  target: "RF-001 · rohan_d",      time: "Jun 6, 14:00", ip: "192.168.1.1", severity: "info" },
  { id: "a5", actor: "admin",  action: "BOOK_DELETED",     target: "Old Edition (ID:4872)", time: "Jun 5, 11:20", ip: "192.168.1.1", severity: "danger" },
  { id: "a6", actor: "system", action: "BACKUP_COMPLETED", target: "Full DB · 2.3GB",       time: "Jun 5, 03:00", ip: "system",      severity: "info" },
  { id: "a7", actor: "admin",  action: "SETTINGS_CHANGED", target: "Feature Flags updated", time: "Jun 4, 16:45", ip: "192.168.1.1", severity: "warn" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", channel: "email", template: "Order Confirmation", trigger: "payment-success", status: "active",   sent: 1192, subject: "Your order is confirmed!", message: "Hi {{name}}, your order #{{order_id}} has been placed successfully." },
  { id: "n2", channel: "email", template: "Welcome Email",      trigger: "user-registered", status: "active",   sent: 318,  subject: "Welcome to BookMosaic!", message: "Hi {{name}}, welcome to BookMosaic! Start exploring thousands of books." },
  { id: "n3", channel: "push",  template: "New Review Alert",   trigger: "review-create",   status: "active",   sent: 742,  subject: "New review on {{book}}", message: "{{user}} left a {{rating}}★ review." },
  { id: "n4", channel: "email", template: "Refund Processed",   trigger: "refund-approved", status: "active",   sent: 14,   subject: "Your refund of {{amount}} is processed", message: "Your refund request RF-{{id}} has been approved." },
  { id: "n5", channel: "push",  template: "Cart Abandonment",   trigger: "checkout-start",  status: "draft",    sent: 0,    subject: "You left something behind!", message: "Complete your purchase of {{book}}." },
  { id: "n6", channel: "email", template: "Weekly Digest",      trigger: "cron-weekly",     status: "inactive", sent: 0,    subject: "Your weekly reading picks", message: "Here are this week's top picks for you." },
];

export const MOCK_MEDIA = [
  { id: "m1", name: "atomic-habits-cover.jpg",  type: "image", size: "84 KB",  url: "https://placehold.co/400x600", used: true,  uploaded: "Jun 5",  usedIn: ["Book: Atomic Habits"] },
  { id: "m2", name: "midnight-library.jpg",     type: "image", size: "102 KB", url: "https://placehold.co/400x600", used: true,  uploaded: "Jun 4",  usedIn: ["Book: The Midnight Library"] },
  { id: "m3", name: "banner-summer-sale.png",   type: "banner", size: "312 KB", url: "https://placehold.co/1200x400", used: false, uploaded: "Jun 3",  usedIn: [] },
  { id: "m4", name: "project-hail-mary.jpg",    type: "image", size: "91 KB",  url: "https://placehold.co/400x600", used: true,  uploaded: "May 30", usedIn: ["Book: Project Hail Mary"] },
  { id: "m5", name: "og-image-default.png",     type: "logo",  size: "48 KB",  url: "https://placehold.co/1200x630", used: true,  uploaded: "May 28", usedIn: ["SEO: OpenGraph Default"] },
  { id: "m6", name: "logo-light.svg",           type: "logo",  size: "6 KB",   url: "https://placehold.co/200x60",  used: true,  uploaded: "May 20", usedIn: ["Branding: Light Logo"] },
];

export const MOCK_COUPONS = [
  { id: "c1", code: "SUMMER20",  type: "percent", value: 20, maxDiscount: 200, min: 299, uses: 84,  maxUses: 200,  expiry: "Jun 30", status: "active",  startDate: "Jun 1",  perUser: 1, categories: ["Fiction"], books: [] },
  { id: "c2", code: "FLAT50",    type: "flat",    value: 50, maxDiscount: 50,  min: 199, uses: 31,  maxUses: 100,  expiry: "Jun 15", status: "active",  startDate: "Jun 1",  perUser: 2, categories: [], books: [] },
  { id: "c3", code: "WELCOME10", type: "percent", value: 10, maxDiscount: 100, min: 0,   uses: 318, maxUses: null, expiry: null,     status: "active",  startDate: "Jan 1",  perUser: 1, categories: [], books: [] },
  { id: "c4", code: "JULY15",    type: "percent", value: 15, maxDiscount: 150, min: 499, uses: 0,   maxUses: 150,  expiry: "Jul 31", status: "draft",   startDate: "Jul 1",  perUser: 1, categories: ["Self-Help"], books: [] },
  { id: "c5", code: "MAY30",     type: "percent", value: 30, maxDiscount: 300, min: 999, uses: 52,  maxUses: 50,   expiry: "May 31", status: "expired", startDate: "May 1",  perUser: 1, categories: [], books: [] },
];

export const MOCK_CATEGORIES = [
  { id: "c1", name: "Fiction",    slug: "fiction",    desc: "Novels, short stories and literary works", books: 142, featured: true,  seoTitle: "Fiction Books",    seoDesc: "Explore fiction books" },
  { id: "c2", name: "Self-Help",  slug: "self-help",  desc: "Personal development and productivity",    books: 87,  featured: true,  seoTitle: "Self-Help Books",  seoDesc: "Improve yourself" },
  { id: "c3", name: "Science",    slug: "science",    desc: "Natural sciences, physics, biology",       books: 64,  featured: false, seoTitle: "Science Books",    seoDesc: "Discover science" },
  { id: "c4", name: "Biography",  slug: "biography",  desc: "Life stories of notable individuals",      books: 51,  featured: true,  seoTitle: "Biography Books",  seoDesc: "Read life stories" },
  { id: "c5", name: "Technology", slug: "technology", desc: "Software, AI, and technology trends",      books: 39,  featured: false, seoTitle: "Tech Books",       seoDesc: "Learn technology" },
  { id: "c6", name: "Philosophy", slug: "philosophy", desc: "Ethics, metaphysics, and epistemology",    books: 28,  featured: false, seoTitle: "Philosophy Books", seoDesc: "Explore philosophy" },
];

export const MOCK_AUTHORS = [
  { id: "au1", name: "James Clear",  bio: "Author of Atomic Habits.",            books: 3,  followers: 4820, verified: true,  featured: true,  website: "jamesclear.com", twitter: "@jamesclear", instagram: "@james_clear", joined: "Jan 2024" },
  { id: "au2", name: "Matt Haig",    bio: "Novelist, The Midnight Library.",      books: 5,  followers: 2310, verified: true,  featured: false, website: "matthaig.com",   twitter: "@matthaig1",  instagram: "@matthaig",   joined: "Feb 2024" },
  { id: "au3", name: "Andy Weir",    bio: "Sci-fi author, The Martian.",          books: 2,  followers: 1876, verified: false, featured: false, website: "",               twitter: "@andyweir",   instagram: "",            joined: "Mar 2024" },
  { id: "au4", name: "Paulo Coelho", bio: "Brazilian lyricist, The Alchemist.",   books: 7,  followers: 6140, verified: true,  featured: true,  website: "paulocoelho.com",twitter: "@paulocoelho",instagram: "@paulocoelho",joined: "Jan 2024" },
  { id: "au5", name: "Yuval Harari", bio: "Historian, Sapiens.",                  books: 4,  followers: 3290, verified: false, featured: false, website: "ynharari.com",   twitter: "@ylharari",   instagram: "",            joined: "Apr 2024" },
];

export const MOCK_PROMOTIONS = [
  { id: "p1", name: "Summer Reading Sale",   type: "Banner",  status: "active",    starts: "Jun 1",  ends: "Jun 30", discount: "20%", cta: "Shop Now",  ctaUrl: "/books", priority: 1, bannerImg: "" },
  { id: "p2", name: "New User Welcome",      type: "Popup",   status: "active",    starts: "Jan 1",  ends: "Dec 31", discount: "10%", cta: "Claim",     ctaUrl: "/signup", priority: 2, bannerImg: "" },
  { id: "p3", name: "Midnight Flash Sale",   type: "Flash",   status: "scheduled", starts: "Jun 15", ends: "Jun 15", discount: "40%", cta: "Grab Deal", ctaUrl: "/books", priority: 1, bannerImg: "" },
  { id: "p4", name: "Author Spotlight Pack", type: "Bundle",  status: "draft",     starts: "—",      ends: "—",      discount: "15%", cta: "View Pack", ctaUrl: "/books", priority: 3, bannerImg: "" },
];

export const MOCK_REVIEWS = [
  { id: "r1", user: "anjali_r",  book: "Atomic Habits",        rating: 5, text: "Life-changing book. Highly recommend.", date: "Jun 5", status: "approved" },
  { id: "r2", user: "meera_k",   book: "Project Hail Mary",    rating: 5, text: "Best sci-fi I've read in years!",         date: "Jun 5", status: "approved" },
  { id: "r3", user: "rohan_d",   book: "The Alchemist",        rating: 4, text: "Beautiful and inspiring story.",           date: "Jun 4", status: "pending" },
  { id: "r4", user: "nisha_v",   book: "Sapiens",              rating: 3, text: "Dense but worth the read.",               date: "Jun 3", status: "pending" },
  { id: "r5", user: "kartik_j",  book: "The Midnight Library", rating: 2, text: "Not my cup of tea.",                      date: "Jun 2", status: "rejected" },
  { id: "r6", user: "dev_patel", book: "Atomic Habits",        rating: 5, text: "Already changed my daily routine.",        date: "Jun 1", status: "approved" },
];

export const MOCK_ORDERS = [
  { id: "ORD-1091", customer: "anjali_r",  books: ["Atomic Habits", "Sapiens"],    amount: "₹698",  method: "UPI",    status: "delivered", date: "Jun 5",  items: 2 },
  { id: "ORD-1090", customer: "meera_k",   books: ["Project Hail Mary"],           amount: "₹399",  method: "Card",   status: "delivered", date: "Jun 5",  items: 1 },
  { id: "ORD-1089", customer: "dev_patel", books: ["The Alchemist"],               amount: "₹299",  method: "UPI",    status: "shipped",   date: "Jun 4",  items: 1 },
  { id: "ORD-1088", customer: "nisha_v",   books: ["Atomic Habits"],               amount: "₹349",  method: "Card",   status: "pending",   date: "Jun 4",  items: 1 },
  { id: "ORD-1087", customer: "arjun_s",   books: ["Sapiens", "The Alchemist"],    amount: "₹578",  method: "Wallet", status: "cancelled", date: "Jun 3",  items: 2 },
  { id: "ORD-1086", customer: "rohan_d",   books: ["The Midnight Library"],        amount: "₹279",  method: "UPI",    status: "delivered", date: "Jun 2",  items: 1 },
];

export const MOCK_SUPPORT = [
  { id: "TKT-201", customer: "anjali_r",  subject: "Book not downloading",      priority: "high",   status: "open",     updated: "1h ago" },
  { id: "TKT-200", customer: "nisha_v",   subject: "Wrong book delivered",       priority: "high",   status: "open",     updated: "3h ago" },
  { id: "TKT-199", customer: "kartik_j",  subject: "Refund status query",        priority: "medium", status: "pending",  updated: "1d ago" },
  { id: "TKT-198", customer: "rohan_d",   subject: "Can't login after reset",    priority: "high",   status: "resolved", updated: "2d ago" },
  { id: "TKT-197", customer: "dev_patel", subject: "Coupon code not applying",   priority: "low",    status: "resolved", updated: "3d ago" },
  { id: "TKT-196", customer: "priya_m",   subject: "Change delivery address",    priority: "low",    status: "pending",  updated: "3d ago" },
];

export const MOCK_SCHEDULED = [
  { id: "sch1", type: "Book",          name: "Atomic Habits — 2nd Ed",   action: "Publish",          scheduledAt: "Jun 10, 09:00", tz: "IST", status: "pending" },
  { id: "sch2", type: "Promotion",     name: "Midnight Flash Sale",       action: "Activate",         scheduledAt: "Jun 15, 00:00", tz: "IST", status: "pending" },
  { id: "sch3", type: "Homepage",      name: "Hero Banner — Summer",      action: "Publish",          scheduledAt: "Jun 12, 10:00", tz: "IST", status: "pending" },
  { id: "sch4", type: "Notification",  name: "Weekly Digest",             action: "Send",             scheduledAt: "Jun 9, 08:00",  tz: "IST", status: "pending" },
  { id: "sch5", type: "Book",          name: "Old Edition (ID:3301)",     action: "Archive",          scheduledAt: "Jun 8, 23:59",  tz: "IST", status: "completed" },
];

export const NOTIF_SETTINGS = [
  { id: "ns1", event: "Order Created",      email: true,  push: true,  sms: false },
  { id: "ns2", event: "Payment Success",    email: true,  push: true,  sms: true },
  { id: "ns3", event: "Payment Failed",     email: true,  push: false, sms: false },
  { id: "ns4", event: "Refund Requested",   email: true,  push: false, sms: false },
  { id: "ns5", event: "Refund Approved",    email: true,  push: true,  sms: true },
  { id: "ns6", event: "Review Created",     email: false, push: true,  sms: false },
  { id: "ns7", event: "Review Approved",    email: false, push: true,  sms: false },
  { id: "ns8", event: "User Registered",    email: true,  push: false, sms: false },
  { id: "ns9", event: "Password Reset",     email: true,  push: false, sms: false },
  { id: "ns10",event: "Admin Login",        email: true,  push: false, sms: false },
  { id: "ns11",event: "Failed Login",       email: true,  push: false, sms: false },
];

export const SEARCH_TERMS = [
  { term: "atomic habits",     count: 412, success: 98 },
  { term: "self help books",   count: 287, success: 94 },
  { term: "philosophy",        count: 198, success: 91 },
  { term: "best sellers",      count: 176, success: 89 },
  { term: "andy weir",         count: 143, success: 100 },
  { term: "management books",  count: 98,  success: 86 },
  { term: "love story",        count: 76,  success: 72 },
];

export const NO_RESULT_SEARCHES = [
  { term: "harry potter",      count: 64, lastSeen: "Jun 6" },
  { term: "manga collection",  count: 38, lastSeen: "Jun 5" },
  { term: "cook books",        count: 29, lastSeen: "Jun 7" },
  { term: "comic books",       count: 22, lastSeen: "Jun 4" },
];
