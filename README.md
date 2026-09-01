# 📚 BookMosaic — Personalized Book Recommendation & Purchase Platform

**BookMosaic** is a full-stack MERN platform for genre-based discovery, personalized recommendations, and secure digital purchases. The name reflects the mosaic of genres, authors, and features tailored to every reader.

> **Live Demo:** `https://mybookmosaic.netlify.app` (frontend) + `https://book-mosaic.onrender.com` (API)  
> **Status:** MVP complete · actively maintained · commit-ready (no hardcoded secrets)

---

## Architecture

```
Book-Recommandation-app/
├── client/   — React 18 + Vite 6 + Redux Toolkit + Tailwind 4 + Framer Motion
│   ├── src/pages/admin/cms/*  (25 CMS sections, API-authoritative)
│   ├── src/components/books/Home  (live homepage blocks via /homepage-blocks)
│   ├── src/store/cmsStore.js      (deprecated mock exports, now live hooks)
│   └── src/hooks/useCmsLive.js    (live CMS: blocks, authors, categories, promos, blog/faq)
├── server/   — Express 4 + Mongoose 8 + Zod validation + JWT httpOnly cookies
│   ├── src/routes/cms.routes.js   (public + admin CMS, 30+ endpoints)
│   ├── src/services/cms.service.js (authors/categories/promos/coupons/reviews/support/…)
│   ├── src/models/*               (User, Book, Review, Order, Purchase, etc.)
│   └── src/config/env.js         (Zod validates process.env on boot)
└── docs/     — product-audit, deployment guide
```

**Data flow:** `Home` fetches `GET /homepage-blocks` (active only) → `renderCMSSection`. `Cart` validates coupons via `POST /coupons/validate` (server authoritative, not `CMS_COUPONS` mock). Admin CMS sections fetch `GET /cms/*` with `[]` authoritative empty (no dummy fallback).

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18.3.1, Redux Toolkit 2.6.1, React Router 7.3, Axios 1.8.3, Tailwind 4, Framer Motion 12.5, Recharts 2.15 |
| Backend | Node 20+, Express 4.21, Mongoose 8, Zod 4, JWT 9, Bcryptjs 2, Cashfree PG 5, Nodemailer 7, Multer 1.4 |
| Security | Helmet, express-mongo-sanitize, xss-clean, hpp, express-rate-limit (per-route), httpOnly cookies, Zod env/route validation |
| DB | MongoDB Atlas (`DB_URI` in `.env`) — indexes via `npm run db:indexes` |
| Deploy | Netlify (client), Render (server) — see `docs/deployment.md` |

---

## Features

**User:** Home (hero carousel + CMS blocks), Discover by genre (`Filter.jsx` 20 genres + collections), Search, Wishlist (`PUT /add-to-wishlist`), Cart (`PUT /add-to-cart`, `POST /add-purchase` multi-book `recordCartPurchase`), Checkout (`POST /create-payment` Cashfree), Notifications (`GET /get-notifications`), Reading status, Profile (Dashboard, Reading Activity, Notifications, Edit, About, Blog, FAQ, Best Authors).

**Author:** `POST /author/register`, `POST /author/login`, dashboard.

**Admin (`/admin`):** `GET /book-analytics`, `GET /daily`, `GET /user-activity`, `GET /monthly-analytics`, manage books/users, **Control Center `/admin/cms`** 25 sections: Branding, Theme (`PUT /cms/theme`), SEO, Homepage Builder, Media Library, User/Book/Event/Search/Recommendation analytics, Authors, Categories, Reviews (`GET /cms/reviews` populated `book/user`), Promotions, Coupons (`POST /coupons/validate`), Orders/Refunds, Notifications, Scheduler, Support (`GET /cms/support/tickets` authoritative), Audit Logs, Features, Integrations.

---

## Quick Start

**Prereqs:** Node 20+, MongoDB Atlas URI, Gmail app password (for `EMAIL_*`), Cashfree sandbox keys.

```bash
# 1. Clone
git clone https://github.com/vishalpatel7777/Book-Recommandation-app.git
cd Book-Recommandation-app

# 2. Server env
cp server/.env.example server/.env
# edit server/.env: DB_URI, JWT_SECRET (≥32 chars), FRONTEND_URL, EMAIL_*, CASHFREE_*, GOOGLE_CREDENTIALS

# 3. Client env (optional)
# client/.env
# VITE_CONTACT_EMAIL=support@bookmosaic.example
# VITE_CONTACT_ADDRESS=Your HQ
# VITE_CONTACT_PHONE=+91 00000 00000
# VITE_EMAILJS_SERVICE_ID=...
# VITE_SUPPORT_EMAIL=support@bookmosaic.example

# 4. Install & seed
npm --prefix server install
npm --prefix client install
npm --prefix server run db:indexes
node server/scripts/seed-live-data.js      # 3 authors, 20 categories, 3 promos/coupons, 5 notification templates, normalize book genres
node server/scripts/ensure-demo-users.js   # requires ADMIN_EMAIL/DEMO_* in .env (see server/.env.example)

# 5. Dev
npm --prefix server run dev   # http://localhost:1000/api/v1
npm --prefix client run dev   # http://localhost:5173

# 6. Build / Test
npm --prefix client run build
npm --prefix server test
```

**Demo logins after `ensure-demo-users.js` (set via env, not hardcoded):**
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (or `EMAIL_USER` fallback) — admin
- `DEMO_AUTHOR_EMAIL` / `DEMO_AUTHOR_PASSWORD` — author
- `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` — user

See `server/.env.example` for all env vars. Never commit `server/.env`.

---

## Security

- `server/src/app.cjs:28` `helmet()` + `mongoSanitize` + `xss-clean` + `hpp` + `cookieParser` httpOnly.
- `server/src/config/env.js` Zod validates `DB_URI`, `JWT_SECRET≥32`, `FRONTEND_URL` on boot, exits 1 if invalid.
- `server/src/middleware/rateLimiter.js` `apiLimiter 1000/15min` (skip admin via JWT `role==='admin'`), `authLimiter 10/15min` on `auth.routes.js`.
- `server/src/config/logger.js` structured JSON `{timestamp,level,message,meta}` with `LOG_LEVEL`/`LOG_FILE` support, no `console.log` in services (payment/audit/mailer use `logger`).
- `server/src/middleware/validate.middleware.js` Zod on all `POST/PUT` plus `validateParams` for ObjectIds.

---

## Project Structure

See `server/README.md` and `client/README.md` for deep dives. Key paths: `server/src/routes/cms.routes.js`, `server/src/services/cms.service.js`, `client/src/pages/admin/AdminCMS.jsx`, `client/src/hooks/useCmsLive.js`, `docs/deployment.md`.

---

## Deployment

See `docs/deployment.md` for Render (server) + Netlify (client) steps, env matrix, health checks (`GET /api/v1/admin/health`), and rollback.

---

## Feedback

Open an Issue on GitHub. Configure `VITE_SUPPORT_EMAIL` for contact.

