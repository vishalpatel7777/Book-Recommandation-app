require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const Author = require("../src/models/author.model");
const Category = require("../src/models/category.model");
const Promotion = require("../src/models/promotion.model");
const Coupon = require("../src/models/coupon.model");
const NotificationTemplate = require("../src/models/notificationTemplate.model");
const Book = require("../src/models/book.model");

const GENRES = [
  "Fiction", "Science", "History", "Romance", "Mystery", "Biography",
  "Fantasy", "Thriller", "Self-Help", "Poetry", "Philosophy", "Travel",
  "Children", "Drama", "Business", "Cooking", "Art", "Technology",
  "Psychology", "Politics",
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function seed() {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected to DB");

  // --- Authors: create 3 ---
  const authorsData = [
    { name: "James Clear", bio: "Bestselling author of Atomic Habits, expert on habits and continuous improvement.", genre: "Self-Help", website: "jamesclear.com", twitter: "@jamesclear", instagram: "@jamesclear", followers: 5200, verified: true, featured: true, status: "active" },
    { name: "Yuval Noah Harari", bio: "Historian and author of Sapiens, Homo Deus. Explores history and future of humanity.", genre: "History", website: "ynharari.com", twitter: "@harari_yuval", instagram: "", followers: 4100, verified: true, featured: true, status: "active" },
    { name: "Paulo Coelho", bio: "Brazilian lyricist and novelist, author of The Alchemist. Spiritual and philosophical fiction.", genre: "Fiction", website: "paulocoelho.com", twitter: "@paulocoelho", instagram: "@paulocoelho", followers: 6300, verified: true, featured: false, status: "active" },
  ];
  for (const a of authorsData) {
    const exists = await Author.findOne({ name: a.name });
    if (!exists) {
      await Author.create(a);
      console.log("Created author:", a.name);
    } else {
      console.log("Author exists:", a.name);
    }
  }

  // --- Categories: from Filter.jsx GENRES (20) ---
  const categoryDesc = {
    Fiction: "Novels, short stories and literary works",
    Science: "Natural sciences, physics, biology and discoveries",
    History: "Events, civilizations and the past",
    Romance: "Love stories and relationships",
    Mystery: "Suspense, crime and detective stories",
    Biography: "Life stories of notable individuals",
    Fantasy: "Magic, myth and imaginary worlds",
    Thriller: "Edge-of-seat suspense and twists",
    "Self-Help": "Personal development and productivity",
    Poetry: "Verse, rhythm and expression",
    Philosophy: "Ethics, metaphysics and epistemology",
    Travel: "Journeys, cultures and destinations",
    Children: "Books for young readers and families",
    Drama: "Plays, performance and emotion",
    Business: "Leadership, startups and management",
    Cooking: "Recipes, food and culinary arts",
    Art: "Visual arts, design and creativity",
    Technology: "Software, AI and innovation",
    Psychology: "Mind, behavior and cognition",
    Politics: "Governance, power and society",
  };
  for (const name of GENRES) {
    const slug = slugify(name);
    const exists = await Category.findOne({ slug });
    if (!exists) {
      await Category.create({
        name,
        slug,
        description: categoryDesc[name] || `${name} books`,
        featured: ["Fiction","Self-Help","Science","Fantasy","Biography","Mystery"].includes(name),
        status: "active",
        seoTitle: `${name} Books`,
        seoDesc: `Explore ${name} books on BookMosaic`,
      });
      console.log("Created category:", name);
    } else {
      // ensure active and correct
      await Category.updateOne({ slug }, { $set: { name, status: "active" } });
      console.log("Category exists:", name);
    }
  }

  // --- Promotions: 3 campaigns ---
  const promos = [
    { title: "Summer Reading Sale", name: "Summer Reading Sale", type: "Banner", status: "active", priority: 1, discount: "20%", badge: "20% OFF", cta: "Shop Now", ctaLink: "/category?genre=Fiction", ctaUrl: "/category?genre=Fiction", description: "Flat 20% off on all Fiction & Mystery titles until month end." },
    { title: "New User Welcome", name: "New User Welcome", type: "Popup", status: "active", priority: 2, discount: "10%", badge: "10% OFF", cta: "Claim Offer", ctaLink: "/signup", ctaUrl: "/signup", description: "Welcome gift for first purchase — applies automatically at checkout." },
    { title: "Midnight Flash Sale", name: "Midnight Flash Sale", type: "Flash", status: "scheduled", priority: 1, discount: "40%", badge: "FLASH 40%", cta: "Grab Deal", ctaLink: "/allbooks", ctaUrl: "/allbooks", description: "Midnight only — 40% off selected bestsellers.", scheduledAt: new Date(Date.now() + 7*24*60*60*1000), endsAt: new Date(Date.now() + 7*24*60*60*1000 + 2*60*60*1000) },
  ];
  for (const p of promos) {
    const exists = await Promotion.findOne({ title: p.title });
    if (!exists) {
      await Promotion.create(p);
      console.log("Created promotion:", p.title);
    } else {
      console.log("Promotion exists:", p.title);
    }
  }

  // --- Coupons: 3 discount coupons ---
  const coupons = [
    { code: "WELCOME20", type: "percent", value: 20, maxDiscount: 200, minOrder: 299, maxUses: 500, perUser: 1, status: "active", expiry: "2027-12-31", startDate: "2025-01-01", categories: [], books: [] },
    { code: "FLAT100", type: "flat", value: 100, maxDiscount: 100, minOrder: 499, maxUses: 300, perUser: 1, status: "active", expiry: "2027-12-31", startDate: "2025-01-01", categories: [], books: [] },
    { code: "READER50", type: "percent", value: 50, maxDiscount: 150, minOrder: 199, maxUses: 200, perUser: 1, status: "active", expiry: "2027-06-30", startDate: "2025-01-01", categories: ["Fiction","Self-Help"], books: [] },
  ];
  for (const c of coupons) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) {
      await Coupon.create(c);
      console.log("Created coupon:", c.code);
    } else {
      console.log("Coupon exists:", c.code);
    }
  }

  // --- Notification templates: defaults needed for current app ---
  const templates = [
    { template: "Order Confirmation", channel: "email", trigger: "payment-success", status: "active", subject: "Your order #{{order_id}} is confirmed!", message: "Hi {{name}}, your order #{{order_id}} for {{book}} has been confirmed. Track your purchase in your library. Thank you for shopping with BookMosaic!" },
    { template: "Welcome Email", channel: "email", trigger: "user-registered", status: "active", subject: "Welcome to BookMosaic, {{name}}!", message: "Hi {{name}}, welcome to BookMosaic! Discover curated books, track your reading, and get personalized recommendations. Start exploring now." },
    { template: "Payment Failed", channel: "email", trigger: "payment-failed", status: "active", subject: "Payment failed for your order", message: "Hi {{name}}, your payment for order #{{order_id}} failed. Please try again or contact support. Your cart items are still saved." },
    { template: "Refund Processed", channel: "email", trigger: "refund-approved", status: "active", subject: "Your refund of {{amount}} is processed", message: "Hi {{name}}, your refund request {{refund_id}} for {{book}} of {{amount}} has been approved and will reflect in 5-7 business days." },
    { template: "Review Reminder", channel: "push", trigger: "review-create", status: "active", subject: "Enjoying {{book}}? Leave a review", message: "Hi {{name}}, you purchased {{book}} recently. Share your rating and help others discover great reads!" },
  ];
  for (const t of templates) {
    const exists = await NotificationTemplate.findOne({ template: t.template, trigger: t.trigger });
    if (!exists) {
      await NotificationTemplate.create({ ...t, sent: 0 });
      console.log("Created template:", t.template);
    } else {
      console.log("Template exists:", t.template);
    }
  }

  // --- Edit existing books genres to match GENRES ---
  const books = await Book.find().lean();
  console.log(`Found ${books.length} books to normalize genres`);
  const genreMap = (oldGenre) => {
    const lower = (oldGenre||"").toLowerCase();
    if (lower.includes("fiction") || lower.includes("timeless")) return "Fiction";
    if (lower.includes("science") || lower.includes("beyond reality") && lower.includes("science")) return "Science";
    if (lower.includes("history") || lower.includes("royal reads")) return "History";
    if (lower.includes("love") || lower.includes("romance") || lower.includes("luxe")) return "Romance";
    if (lower.includes("mystery") || lower.includes("dark & twisted") && !lower.includes("fiction")) return "Mystery";
    if (lower.includes("biography") || lower.includes("memoir")) return "Biography";
    if (lower.includes("fantasy") || lower.includes("beyond reality")) return "Fantasy";
    if (lower.includes("thriller") || lower.includes("dark & twisted")) return "Thriller";
    if (lower.includes("self-help") || lower.includes("mind forge") || lower.includes("ceo")) return "Self-Help";
    if (lower.includes("poetry")) return "Poetry";
    if (lower.includes("philosophy") || lower.includes("thinker's")) return "Philosophy";
    if (lower.includes("travel") || lower.includes("globe")) return "Travel";
    if (lower.includes("children") || lower.includes("little dreamers")) return "Children";
    if (lower.includes("drama") || lower.includes("streetcar")) return "Drama";
    if (lower.includes("business") || lower.includes("ceo's library")) return "Business";
    if (lower.includes("cooking") || lower.includes("cozy")) return "Cooking";
    if (lower.includes("art") || lower.includes("aesthetic")) return "Art";
    if (lower.includes("technology") || lower.includes("tech")) return "Technology";
    if (lower.includes("psychology") || lower.includes("mindset")) return "Psychology";
    if (lower.includes("politics") || lower.includes("power")) return "Politics";
    // deterministic fallback based on title hash to distribute
    return GENRES[oldGenre.length % GENRES.length];
  };
  for (const b of books) {
    const newGenre = genreMap(b.genre);
    if (newGenre !== b.genre) {
      await Book.updateOne({ _id: b._id }, { $set: { genre: newGenre } });
      console.log(`Updated book "${b.title}" genre: "${b.genre}" -> "${newGenre}"`);
    }
  }

  const finalCats = await Category.find().select("name slug").lean();
  console.log("Categories total:", finalCats.length);
  console.log("Authors total:", await Author.countDocuments());
  console.log("Promotions total:", await Promotion.countDocuments());
  console.log("Coupons total:", await Coupon.countDocuments());
  console.log("Notification templates total:", await NotificationTemplate.countDocuments());
  console.log("Books genres distinct:", await Book.distinct("genre"));

  await mongoose.disconnect();
  console.log("Seed complete");
}

seed().catch(e=>{console.error(e); process.exit(1)});
