const SiteSetting = require("../models/siteSetting.model");

const DEFAULTS = {
  branding: { siteTitle: "BookMosaic", tagline: "A World of Literature", logoUrl: "", faviconUrl: "" },
  seo: { seoTitle: "BookMosaic — Discover Your Next Read", metaDescription: "Curated book recommendations", keywords: "buy books online, book recommendations, ebooks", ogTitle: "BookMosaic", ogDescription: "Open Graph description", ogImage: "" },
  theme: { activePresetId: "matcha", primary: "#5C7A5E", accent: "#8B6F47", bg: "#FAF8F3", textColor: "#2C2C2C", secondary: "#8FAF7C", radius: "12px", shadow: "soft" },
  features: { reviews: true, ratings: true, wishlist: true, cart: true, recommendations: true, notifications: true, blog: false, newsletter: false, coupons: false, giftCards: false, referrals: false, darkMode: false, socialSharing: false, guestCheckout: false, readingStatus: true },
  integrations: { cashfreeApiKey: "", smtpHost: "", cloudinaryCloudName: "", googleAnalyticsId: "", cdnBaseUrl: "" },
  notifications: { settings: [] },
  payments: null, // handled by PaymentSettings model
  recommendations: { enabled: true, algorithm: "avgRating", topN: 4 },
  // next: editorial CMS groups — stored via generic /cms/settings/:group, public via /blog /faq /social-proof
  blog: { posts: [] }, // {posts:[{id,title,slug,date,category,readTime,featured,summary,content}]}
  faq: { items: [] }, // {items:[{id,category,question,answer}]}
  socialProof: { titles: "10K+", avgRating: "4.8", readers: "50K+" },
};

async function getGroup(group) {
  let doc = await SiteSetting.findOne({ group });
  if (!doc) {
    const def = DEFAULTS[group];
    if (def === undefined) return null;
    doc = await SiteSetting.create({ group, value: def || {} });
  }
  return doc;
}

async function updateGroup(group, data, userId = null) {
  const update = { value: data };
  if (userId) update.updatedBy = userId;
  const doc = await SiteSetting.findOneAndUpdate(
    { group },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc;
}

async function getFeatureFlags() {
  const doc = await getGroup("features");
  return doc ? doc.value : DEFAULTS.features;
}

async function updateFeatureFlags(flags) {
  const current = await getFeatureFlags();
  const merged = { ...current, ...flags };
  const doc = await updateGroup("features", merged);
  return doc.value;
}

module.exports = { getGroup, updateGroup, getFeatureFlags, updateFeatureFlags, DEFAULTS };
