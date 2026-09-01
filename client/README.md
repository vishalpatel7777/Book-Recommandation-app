# BookMosaic Client — React + Vite

> `http://localhost:5173` dev — `API_BASE_URL` in `src/config/app.config.js` (dev `http://localhost:1000/api/v1`, prod `https://book-mosaic.onrender.com/api/v1`)

## Setup

```bash
npm install
# optional client/.env (Vite)
# VITE_CONTACT_EMAIL=support@bookmosaic.example
# VITE_CONTACT_ADDRESS=BookMosaic HQ, Your City
# VITE_CONTACT_PHONE=+91 00000 00000
# VITE_EMAILJS_SERVICE_ID=...
# VITE_EMAILJS_TEMPLATE_ID=...
# VITE_EMAILJS_PUBLIC_KEY=...
# VITE_EMAILJS_AUTOREPLY_TEMPLATE=...
# VITE_SUPPORT_EMAIL=support@bookmosaic.example
# VITE_CASHFREE_MODE=sandbox

npm run dev      # vite → http://localhost:5173
npm run build    # vite build → dist/ (manualChunks: vendor, adminCMS, charts)
npm run preview  # serve dist
```

## Structure

```
src/
├── App.jsx              — <Outlet/> only (mobile block removed, responsive via Tailwind)
├── config/app.config.js — API_BASE_URL single source, FEATURES flags
├── services/axios.js    — baseURL + withCredentials:true (httpOnly cookies)
├── store/               — Redux Toolkit auth + user (cart/wishlist ids), cmsStore.js (legacy mock exports, now live hooks)
├── hooks/useCmsLive.js  — useBrandingLive, useThemeLive, useFeatureFlagsLive, useHomepageBlocksLive, useAuthorsLive, useCategoriesLive, usePromotionsLive, useBlogLive, useFaqLive, useSocialProofLive
├── hooks/useSyncUserState.js — on isLoggedIn fetches GET /get-user-cart + /get-all-wishlist → dispatch setCart/setWishlist
├── components/books/Home/Home.jsx — useHomepageBlocksLive + useAuthorsLive + useCategoriesLive + usePromotionsLive + useSocialProofLive, renderCMSSection, PromoBanner, HeroCarousel (no CMS_* mock fallback)
├── pages/user/Cart.jsx — GET /get-user-cart, POST /coupons/validate (server authoritative), POST /add-purchase (book: ObjectId | ObjectId[] via recordCartPurchase), POST /clear-cart
├── components/user/Profile/* — Blog.jsx (useBlogLive → posts ?? STATIC with CATEGORIES fix), Faq.jsx (useFaqLive), BestAuthor.jsx (useAuthorsLive), EditProfile, Wishlist, etc.
├── pages/admin/cms/* — 18 sections: AuthorsSection, CategoriesSection, CouponsSection, PromotionsSection, MediaLibrarySection, HomepageBuilderSection, ReviewsSection (String(book) guard), SupportSection (api authoritative []), NotificationCenter, Scheduler, SearchAnalytics, Recommendations, etc. — all useState([])+loading, no MOCK_* fallback
└── routes/ — user.routes.jsx, admin.routes.jsx, auth.routes.jsx + ErrorBoundary (MainLayout)
```

## Key Pages

| Path | Component | Data |
|------|-----------|------|
| `/` | `Home` | `GET /homepage-blocks` (active), `GET /get-recent-books`, `GET /get-recommended-books`, `GET /authors`, `GET /categories` |
| `/category` | `Filter.jsx` | `GENRES` 20 + `GET /get-books-by-genre?genres=` |
| `/cart` | `Cart.jsx` | `GET /get-user-cart`, `POST /coupons/validate`, `POST /add-purchase` (multi) |
| `/wishlist`, `/profile/wishlist` | `Wishlist`/`Favorite` | `GET /get-all-wishlist` |
| `/profile` | `Profile.jsx` | `GET /user-information`, Dashboard `GET /get-notifications/:id` + `GET /reading-status-counts` |
| `/admin/cms` | `AdminCMS.jsx` | 25 sections, sidebar `SECTIONS` from `cmsData.js`, `RERENDERERS` map |
| `/blog`, `/authors` | `Blog`, `BestAuthor` | `GET /blog` via `useBlogLive` (fallback static), `GET /authors` |

## CMS Data

`src/pages/admin/cms/cmsData.js` still defines `MOCK_*` dummy exports for docs, but no admin section imports them as initial state (all `useState([])`). `src/store/cmsStore.js` legacy `CMS_*` filtered mocks kept for Blog/Faq sample fallback only; Home/Cart/BestAuthor now use live hooks.

## Security / Standards

- No hardcoded secrets — Contact page uses `import.meta.env.VITE_*` with fallback `support@bookmosaic.example`.
- `axios` `withCredentials:true` for httpOnly `access_token` cookie.
- `ErrorBoundary.jsx` logs only in `import.meta.env.DEV` via `console.warn`.
- `ReviewsSection` `String(r.book).toLowerCase()` guard prevents `r.book.toLowerCase is not a function`.
- `SearchAnalytics` / `Recommendations` show `· live`/empty states not dummy.

## Build

`npm run build` → `manualChunks` (`vendor` react, `adminCMS`, `charts` recharts) fixes 601kB warning → `adminCMS 257k`, `vendor 340k`, `charts 392k`. `vite.config.js` `chunkSizeWarningLimit:650`.

## Env

All `VITE_*` are optional; placeholders used if missing. See root `README.md` + `server/.env.example` for server env.

