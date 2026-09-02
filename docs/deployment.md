# Deployment — BookMosaic (Render + Netlify)

> Commit-ready: no hardcoded secrets, `server/.env` gitignored, `server/.env.example` is template.

## Prerequisites

- MongoDB Atlas cluster + `DB_URI` (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/bookmosaic`)
- Gmail app password for `EMAIL_USER`/`EMAIL_PASS` (or any SMTP)
- Cashfree sandbox `CASHFREE_APP_ID`/`CASHFREE_SECRET_KEY` (`TEST...`), `CASHFREE_MODE=sandbox`
- Google Drive service account JSON for `GOOGLE_CREDENTIALS` (optional, falls back to `/uploads` local)
- Node 20+

## Environment

**Server `server/.env` (required, validated on boot via `src/config/env.js` Zod):**

```
NODE_ENV=production
PORT=1000
DB_URI=mongodb+srv://...
JWT_SECRET=<32+ chars>
FRONTEND_URL=https://mybookmosaic.netlify.app
BASE_URL=https://book-mosaic.onrender.com
WEBHOOK_URL=https://book-mosaic.onrender.com/api/v1/webhook
CASHFREE_APP_ID=TEST...
CASHFREE_SECRET_KEY=cfsk_...
CASHFREE_MODE=sandbox
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=<app-password>
GOOGLE_CREDENTIALS={"type":"service_account",...}
GOOGLE_DRIVE_FOLDER_ID=...
LOG_LEVEL=info
LOG_FILE=/var/log/bookmosaic/app.log
# Demo seed (used by scripts/ensure-demo-users.js, not committed)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong>
DEMO_AUTHOR_EMAIL=author@example.com
DEMO_AUTHOR_PASSWORD=<strong>
DEMO_USER_EMAIL=user@example.com
DEMO_USER_PASSWORD=<strong>
```

**Client `client/.env` (all `VITE_*` optional, fallbacks exist):**

```
VITE_CONTACT_EMAIL=support@bookmosaic.example
VITE_CONTACT_ADDRESS=BookMosaic HQ, Your City
VITE_CONTACT_PHONE=+91 00000 00000
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_AUTOREPLY_TEMPLATE=...
VITE_SUPPORT_EMAIL=support@bookmosaic.example
VITE_CASHFREE_MODE=sandbox
```

`server/.env.example` and `client` placeholders show required keys; never commit real `.env`.

## Build

```bash
# server
npm --prefix server install
# optional: npm --prefix server audit fix (22 vulns reported, non-blocking)
npm --prefix server run db:indexes      # ensure 30+ indexes — supports DB_URI or DATABASE_URL
node server/scripts/seed-live-data.js   # idempotent: 20 categories, 3 authors/promos/coupons, 5 templates, normalize genres
# PowerShell (Windows):
#   $env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="StrongPass123"; node server/scripts/ensure-demo-users.js
# Bash/macOS/Linux:
#   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass123 node server/scripts/ensure-demo-users.js
# Or set ADMIN_EMAIL/ADMIN_PASSWORD in server/.env then:
node server/scripts/ensure-demo-users.js

# client
npm --prefix client install
# optional: npm --prefix client audit fix
npm --prefix client run build            # dist/ with manualChunks (vendor/chunks/adminCMS)

# tests (logger warn for payment webhook is expected, not a failure)
npm --prefix server test                 # 10 suites 132 tests
```

## Render (Server)

- **Repo:** connect `github.com/.../Book-Recommandation-app`
- **Root:** `server` (or set `Root Directory: server`)
- **Build Command:** `npm install && npm run db:indexes`
- **Start Command:** `node server.cjs` (runs `connectToDb` then `app.listen(PORT)`)
- **Env:** paste `server/.env` vars in Render Dashboard → Environment
- **Health:** `GET /api/v1/admin/health` (requires admin cookie) → `{cashfree,email,storage}`; public `GET /api/v1/` → `{status:ok}`; Render health check can ping `/api/v1/`.
- **Logs:** structured JSON via `src/config/logger.js` (respects `LOG_LEVEL`, `LOG_FILE`)

## Netlify (Client)

- **Base directory:** `client`
- **Build:** `npm run build`
- **Publish:** `client/dist`
- **Env:** set `VITE_*` in Netlify → Site settings → Environment variables
- **Redirects:** SPA fallback `/* -> /index.html 200` (via `netlify.toml` or `_redirects`)
- **API:** `src/config/app.config.js` switches `API_BASE_URL` by `import.meta.env.MODE` (`localhost:1000` dev, `https://book-mosaic.onrender.com/api/v1` prod)

## Post-Deploy Checks

```bash
curl https://book-mosaic.onrender.com/api/v1/
curl -b cookies.txt -c cookies.txt https://book-mosaic.onrender.com/api/v1/admin/health  # after admin login
# CMS
curl https://book-mosaic.onrender.com/api/v1/blog
curl https://book-mosaic.onrender.com/api/v1/faq
```

Admin: login with `ADMIN_EMAIL`, visit `/admin/cms` → Support Center should show live tickets (not `MOCK_SUPPORT`), Reviews Manager no `r.book.toLowerCase` crash, `Authors/Categories` show 20 live categories, Cart `Place Order` with 2+ books → `POST /add-purchase` creates `Order` + N `Purchase`.

## Rollback

- Render: `Manual Deploy → Previous deploy`
- Netlify: `Deploys → Previous → Publish deploy`
- DB: `mongorestore` or Atlas point-in-time; indexes are idempotent (`ensureIndex`).

## Security Checklist

- [ ] `server/.env` not in git (`git check-ignore server/.env` should be ignored)
- [ ] `JWT_SECRET` rotated, ≥32 chars, not `ChangeMe`
- [ ] `helmet`, `mongoSanitize`, `xss-clean`, `hpp`, `apiLimiter` (skip admin) verified in `src/app.cjs:28`
- [ ] `withCredentials:true` + httpOnly `access_token` cookie (`src/config/app.config.js` cookie)
- [ ] No hardcoded `kuzemasachika` / `patelvishal` / `Author@123` outside `scripts/ensure-demo-users.js` (now env-driven)

