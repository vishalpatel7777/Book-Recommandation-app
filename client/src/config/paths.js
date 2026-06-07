/**
 * Frontend route paths — single source of truth for all navigation.
 * Change a path here → every Link, navigate(), and router definition updates.
 */

const PATHS = {
  // Public
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact-us",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
  EMAIL_VERIFIED: "/verification-success",

  // User
  WELCOME: "/welcome",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit-profile",
  PROFILE_WISHLIST: "/profile/wishlist",
  PROFILE_TERMS: "/profile/terms",
  PROFILE_PRIVACY: "/profile/privacy-policy",
  PROFILE_BLOG: "/profile/blog",
  PROFILE_FAQ: "/profile/faq",

  // Books
  WISHLIST: "/wishlist",
  WISHLIST_DETAIL: (id) => `/wishlist/${id}`,
  BUY: (id) => `/buy/${id}`,
  CART: "/addtocart",
  CHECKOUT: "/checkout",
  PAYMENT_SUCCESS: "/payment-success",
  NOTIFICATION: "/notification",
  THANKYOU: "/thankyou",

  // Admin
  ADMIN_HOME: "/admin/home",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_BOOKS: "/admin/books",
  ADMIN_USERS: "/admin/users",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CMS: "/admin/cms",
  ADMIN_ADD_BOOK: "/admin/books/add-book",
  ADMIN_EDIT_BOOK: (id) => `/admin/edit-book/${id}`,

  // Fallback
  NOT_FOUND: "/*",
};

export default PATHS;
