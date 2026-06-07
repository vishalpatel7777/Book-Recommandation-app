/**
 * CMS integration store — single source of truth for all CMS-driven content.
 * When backend APIs connect, replace the mock imports with API calls here.
 * All user-facing pages consume from here so admin changes flow through automatically.
 */

import {
  MOCK_AUTHORS, MOCK_CATEGORIES, MOCK_COUPONS, MOCK_PROMOTIONS,
  MOCK_NOTIFICATIONS, PRESETS, FEATURE_DEFAULTS, SEARCH_TERMS,
  NO_RESULT_SEARCHES,
} from "../pages/admin/cms/cmsData";

// Homepage builder blocks — mirrors HomepageBuilderSection initial state
export const CMS_HOMEPAGE_BLOCKS = [
  { id: "b1", type: "Hero Banner",      status: "active", order: 1, headline: "Discover Your Next Read",  subtext: "Curated books for every mood." },
  { id: "b2", type: "Featured Books",   status: "active", order: 2, headline: "Staff Picks",              subtext: "" },
  { id: "b3", type: "Categories",       status: "active", order: 3, headline: "Browse by Genre",           subtext: "" },
  { id: "b4", type: "New Arrivals",     status: "active", order: 4, headline: "Fresh off the Press",      subtext: "" },
  { id: "b5", type: "Promotion Banner", status: "inactive", order: 5, headline: "Summer Sale",            subtext: "Up to 40% off" },
  { id: "b6", type: "Trending",         status: "active", order: 6, headline: "Trending This Week",       subtext: "" },
  { id: "b7", type: "Newsletter",       status: "inactive", order: 7, headline: "Stay in the Loop",       subtext: "Get weekly book recommendations." },
];

// Active promotions (from CMS promotions manager)
export const CMS_PROMOTIONS = MOCK_PROMOTIONS.filter((p) => p.status === "active");

// Active coupons
export const CMS_COUPONS = MOCK_COUPONS.filter((c) => c.status === "active");

// Featured authors from CMS
export const CMS_AUTHORS = MOCK_AUTHORS;
export const CMS_FEATURED_AUTHORS = MOCK_AUTHORS.filter((a) => a.featured);

// Featured categories from CMS
export const CMS_CATEGORIES = MOCK_CATEGORIES;
export const CMS_FEATURED_CATEGORIES = MOCK_CATEGORIES.filter((c) => c.featured);

// Theme presets from CMS
export const CMS_THEME_PRESETS = PRESETS;
export const CMS_ACTIVE_THEME = PRESETS[0]; // matcha is default

// Feature flags
export const CMS_FEATURES = FEATURE_DEFAULTS;

// Notification templates
export const CMS_NOTIFICATION_TEMPLATES = MOCK_NOTIFICATIONS.filter((n) => n.status === "active");

// Search analytics
export const CMS_SEARCH_TERMS = SEARCH_TERMS;
export const CMS_NO_RESULT_TERMS = NO_RESULT_SEARCHES;

// Blog posts (CMS-managed — hardcoded as integration point)
export const CMS_BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Why Personalized Book Recommendations Matter",
    slug: "why-personalized-recommendations-matter",
    date: "March 5, 2025",
    category: "Technology",
    readTime: "4 min",
    featured: true,
    summary: "Discover how AI-driven recommendations are transforming the way we find and enjoy books.",
    content: "Personalized book recommendations have revolutionized reading habits worldwide. By analyzing reading history, purchase behavior, and genre preferences, modern recommendation engines surface titles that feel handpicked for each reader...",
  },
  {
    id: "blog-2",
    title: "Top 10 Must-Read Books of 2025",
    slug: "top-10-books-2025",
    date: "February 28, 2025",
    category: "Curated",
    readTime: "6 min",
    featured: true,
    summary: "A curated list of this year's most popular and critically acclaimed books.",
    content: "2025 has already delivered a remarkable set of titles across fiction, non-fiction, and everything in between. From debut novelists making waves to established authors reaching new heights...",
  },
  {
    id: "blog-3",
    title: "How AI is Shaping the Future of Reading",
    slug: "ai-shaping-future-of-reading",
    date: "January 20, 2025",
    category: "Technology",
    readTime: "5 min",
    featured: false,
    summary: "Learn how AI is making book recommendations smarter and more personalized than ever before.",
    content: "Artificial intelligence has quietly transformed how millions of people discover and consume books. From natural language processing that understands themes and tone, to collaborative filtering that finds patterns across millions of readers...",
  },
  {
    id: "blog-4",
    title: "The Art of Building a Reading Habit",
    slug: "building-a-reading-habit",
    date: "January 8, 2025",
    category: "Wellness",
    readTime: "3 min",
    featured: false,
    summary: "Simple strategies to read more consistently, from someone who went from zero to 50 books a year.",
    content: "Building a reading habit is less about willpower and more about design. The readers who consistently finish books aren't necessarily more disciplined — they've simply arranged their environment and expectations in ways that make reading the easy choice...",
  },
];

// FAQ content (CMS-managed)
export const CMS_FAQ = [
  {
    id: "faq-1",
    category: "Recommendations",
    question: "How does BookMosaic recommend books?",
    answer: "BookMosaic uses collaborative filtering and reading history to surface books that match your taste. The more you rate and review, the sharper your recommendations become.",
  },
  {
    id: "faq-2",
    category: "Payments",
    question: "Is my payment information secure?",
    answer: "Yes. All transactions are encrypted end-to-end. We never store raw card data on our servers — payments are processed through a PCI-compliant gateway.",
  },
  {
    id: "faq-3",
    category: "Downloads",
    question: "Can I download purchased books?",
    answer: "Once your purchase is complete, you'll find a download link in your notifications and purchase history. Books are available in PDF format.",
  },
  {
    id: "faq-4",
    category: "Account",
    question: "How do I reset my password?",
    answer: "Go to the login page and click 'Forgot Password'. We'll send a reset link to your registered email address within a few minutes.",
  },
  {
    id: "faq-5",
    category: "Refunds",
    question: "Do you offer refunds on book purchases?",
    answer: "Due to the digital nature of our products, refunds are assessed case-by-case. If you received the wrong edition or faced a technical issue, contact our support team within 7 days of purchase.",
  },
  {
    id: "faq-6",
    category: "Account",
    question: "Can I share my account with someone else?",
    answer: "BookMosaic accounts are for individual use only. Each reader benefits most from personalized recommendations, which require a single user profile.",
  },
];

// Social proof counters (admin configurable)
export const CMS_SOCIAL_PROOF = {
  titles: "10K+",
  avgRating: "4.8",
  readers: "50K+",
};
