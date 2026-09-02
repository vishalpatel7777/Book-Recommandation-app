# BookMosaic Server — Express + Mongoose API

> Base: `http://localhost:1000/api/v1` (dev) — `API_PREFIX` in `src/config/paths.js`

## Setup

```bash
cp .env.example .env   # fill DB_URI (or DATABASE_URL), JWT_SECRET (≥32 chars), FRONTEND_URL, EMAIL_*, CASHFREE_*, GOOGLE_CREDENTIALS
npm install
# optional audit fix (non-blocking vulnerabilities)
# npm audit fix
npm run db:indexes      # create 30+ indexes (books text, users, orders, etc.) — accepts DB_URI or DATABASE_URL
node scripts/seed-live-data.js       # authors (3), categories (20 from Filter.jsx), promos (3), coupons (3), notification templates (5), normalize book.genre
# PowerShell (Windows):
#   $env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="StrongPass123"; node scripts/ensure-demo-users.js
# Bash/macOS/Linux:
#   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass123 node scripts/ensure-demo-users.js
# Or set ADMIN_EMAIL/ADMIN_PASSWORD/DEMO_* in server/.env then:
node scripts/ensure-demo-users.js    # upsert demo logins from env
npm run dev             # nodemon server.cjs → http://localhost:1000
```

**Env:** see `.env.example` (PORT, DB_URI, JWT_SECRET, FRONTEND_URL, EMAIL_USER/PASS, CASHFREE_*, GOOGLE_CREDENTIALS, LOG_LEVEL, LOG_FILE, BASE_URL, WEBHOOK_URL, ADMIN_EMAIL, DEMO_AUTHOR_EMAIL/PASSWORD, DEMO_USER_EMAIL/PASSWORD). `src/config/env.js` validates on boot, exits 1 if missing.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | nodemon |
| `npm start` | node server.cjs |
| `npm run db:indexes` | `scripts/create-indexes.js` ensureIndex |
| `npm run db:verify` | `scripts/verify-indexes.js` |
| `npm test` | jest (10 suites, 132 tests) |
| `node scripts/seed-live-data.js` | idempotent seed (authors/categories/promos/coupons/templates + genre normalize) |
| `node scripts/ensure-demo-users.js` | upsert demo logins from env |

## Architecture

```
src/
├── app.cjs        — helmet, cors, apiLimiter (skip admin), body parsers, sanitize, static /uploads, registerRoutes, 404, errorMiddleware
├── server.cjs     — connectToDb → app.listen + graceful SIGTERM/SIGINT + unhandledRejection
├── config/env.js — Zod requiredSchema, LOG_LEVEL/LOG_FILE warnings
├── config/logger.js — JSON {timestamp,level,message,meta} with LOG_LEVEL gate + optional file append
├── config/app.config.js — cors, cookie {httpOnly:true, secure:prod, sameSite}, body limits
├── middleware/rateLimiter.js — global 100/15min (legacy), apiLimiter 1000/15min skip admin, authLimiter 10/15min
├── middleware/auth.middleware.js — JWT from cookie `access_token`, isAdmin/isAuthor
├── routes/cms.routes.js — 30+ CMS endpoints (see below)
├── services/cms.service.js — authors/categories/promos/coupons/reviews (populate book/title), media, homepage blocks (DEFAULT_BLOCKS), orders/refunds, notification templates, support tickets, scheduler, search analytics (aggregate), user/book analytics, events
├── services/order.service.js — recordPurchaseAndCreateOrder (single) + recordCartPurchase (multi-book, one Order + N Purchase, skips already-purchased)
├── validators/order.validator.js — addPurchaseSchema accepts `book: ObjectId | ObjectId[]` (cart multi-buy)
└── models/* — 20+ Mongoose models with indexes
```

## API — Key Routes

**Auth (public + authLimiter):** `POST /validate-step1|validate-step2|signup`, `GET /verify-email/:token`, `POST /login` (sets httpOnly `access_token`), `POST /logout`, `POST /forgot-password|/reset-password/:token`

**Books (public):** `GET /get-all-books|/get-book-by-id/:id|/get-recent-books|/get-recommended-books|/get-books-by-genre?genres=&/get-all-books-search?search=`

**User (auth):** `GET /user-information`, `PUT /update`, `PUT /add-to-cart|/remove-book-from-cart` (header `bookid`), `GET /get-user-cart`, `POST|DELETE /clear-cart`, wishlist `PUT /add-to-wishlist`, `GET /get-all-wishlist`, `POST /add-purchase` (single or array, validated), `GET /order-history|/library|/library/:bookId/read`, reading status `GET|POST|DELETE /reading-status`, notifications `GET /get-notifications`

**CMS Admin (`authenticateToken,isAdmin`):**
- Settings: `GET|PUT /cms/branding|/cms/seo|/cms/theme|/cms/features|/cms/integrations` + `GET /cms/settings/:group`
- Public: `GET /branding|/theme|/seo|/feature-flags|/homepage-blocks|/authors|/categories|/promotions/active`
- Homepage: `GET|PUT /cms/homepage-blocks`, `GET /homepage-blocks`
- Authors/Categories/Promos/Coupons: `GET|POST|PUT|DELETE /cms/authors|/cms/categories|/cms/promotions|/cms/coupons` + `POST /coupons/validate` (auth any)
- Reviews: `GET /cms/reviews`, `PATCH /cms/reviews/:id/status`, `DELETE /cms/reviews/:id`
- Media: `GET /cms/media`, `POST /cms/media/upload`, `PUT|DELETE /cms/media/:id`
- Orders/Refunds: `GET /cms/orders|/cms/refunds`, `PUT /cms/refunds/:id`
- Notifications: `GET|POST|PUT|DELETE /cms/notifications` + `POST /cms/notifications/:id/duplicate`, `GET|PUT /cms/notification-settings`
- Scheduler: `GET|POST|PUT|DELETE /cms/scheduled-tasks`
- Support: `GET /cms/support/tickets`, `PATCH /cms/support/tickets/:id/reply|/close`, `GET|POST|PATCH /support/tickets` (user)
- Analytics: `GET /cms/analytics/users|/cms/analytics/books|/cms/analytics/search`, `GET|POST /events`, `GET /cms/events`, `GET /cms/audit-logs|/export`, `GET /admin/health`

**Admin:** `GET /get-admin-profile`, `PUT /update-admin-profile`, `GET /daily|/user-activity|/book-analytics|/monthly-analytics|/monthly-stats`, `GET|PUT /admin/payment-settings`, `GET|PUT /admin/orders|/admin/refunds|/admin/commerce-analytics`

**Author:** `POST /author/register|/author/login`, `GET /author/dashboard|/author/books`

## Security

- `helmet()`, `mongoSanitize` (strip `$` `.`), `xss-clean`, `hpp`, `apiLimiter` (skip admin via JWT decode), `authLimiter` on auth, `validate`/`validateParams` Zod, `httpOnly` cookies (`app.config.js` cookie), `CORS` from `FRONTEND_URL`.

## Logging

`src/config/logger.js` JSON lines, `LOG_LEVEL=info|debug`, `LOG_FILE=./logs/app.log` optional. Services use `logger.info/warn/error` not `console.log` (audit, payment, mailer, s3Helper).

## Testing

`npm test` — 10 suites, 132 tests (`tests/unit/adminCms.test.js` checks CMS dummy vs live DB, `auth.service`, `order.service`, `payment`, `validators`). `tests/env.setup.js` mocks env, `globalSetup` uses `mongodb-memory-server`.

## Seed & Demo

- `seed-live-data.js` is idempotent: checks `findOne` before `create`, updates existing genres to `GENRES` list from `client/src/components/books/list/Filter.jsx` (20 genres), creates 20 categories, normalizes 33 books.
- `ensure-demo-users.js` reads `ADMIN_EMAIL/ADMIN_PASSWORD` + `DEMO_*` from env, `User.findOne({email})` upsert, `password` via pre-save hash, `isVerified:true`. Run after `seed-live-data`.

## Deployment

See `../docs/deployment.md` + root `README.md`. Health: `GET /api/v1/admin/health` → `{cashfree,email,storage}`.

