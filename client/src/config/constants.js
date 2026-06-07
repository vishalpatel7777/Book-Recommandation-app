/**
 * UI constants — pagination, limits, labels.
 * Change DEFAULT_PAGE_SIZE here → all paginated lists update.
 */

const UI_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  BOOKS_PER_PAGE: 12,
  NOTIFICATIONS_PER_PAGE: 20,

  // Limits
  MAX_CART_ITEMS: 50,
  MAX_WISHLIST_ITEMS: 100,
  MAX_SEARCH_RESULTS: 50,

  // Debounce
  SEARCH_DEBOUNCE_MS: 400,

  // Toast / alert durations (ms)
  ALERT_DURATION: 2000,
  TOAST_DURATION: 3000,
  ERROR_TOAST_DURATION: 5000,

  // Fallback labels
  LABELS: {
    LOADING: "Loading...",
    NO_RESULTS: "No results found.",
    ERROR: "Something went wrong. Please try again.",
    EMPTY_CART: "Your cart is empty.",
    EMPTY_WISHLIST: "No books in your wishlist yet.",
  },
};

export default UI_CONSTANTS;
