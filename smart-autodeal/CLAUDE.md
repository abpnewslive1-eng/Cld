# Smart AutoDeal – guide for Claude Code

**Smart AutoDeal** ("डीलरचा डिजिटल मुनीम") is a multi-dealer SaaS for used-vehicle dealers in India.
One server + one MySQL database serve many dealers (tenants). A **Super Admin** (the owner of the product)
creates dealers, gives trials, records payments by hand, runs the poster library. Each **dealer** gets a CRM:
stock, customers (leads), receipts/delivery notes with signatures and print, expenses, loan tracking,
online catalogue with QR stickers, WhatsApp inbox (demo only), and a poster studio + daily poster library.
First real customer: *Sevasai Vahan Bazar* (Bidkin, Maharashtra). Target: dealers all over India.

## Commands
| | |
|---|---|
| `npm install` | install (Node 18+) |
| `npm run db:up` | start MySQL 8 in Docker (creates `autodeal` and `autodeal_test`) |
| `cp .env.example .env` / `cp .env.test.example .env.test` | local config |
| `npm run dev` | build frontend + run server with auto-restart → http://localhost:3000 (login: SUPER_USERNAME / SUPER_PASSWORD) |
| `npm run build` | concatenate `src/frontend/*.js` → `public/app.js` |
| `npm test` | **API tests** (`tests/api.test.mjs`) – starts a real server on the `_test` database and WIPES it |
| `npm run build:demo` | build `dist/smart-autodeal-demo.html` – the whole app with a fake in-memory server (`dev/demo-mock.js`) |
| `npm run test:e2e` | **browser tests** (Playwright, desktop + mobile) against the demo file. First time: `npx playwright install chromium` |
| `npm run check` | syntax check |

## Definition of done (always)
1. `npm run check`, `npm test` and `npm run test:e2e` all pass.
2. New/changed API behaviour → add or update a test in `tests/api.test.mjs`.
3. New/changed screen or flow → add or update a Playwright test in `tests/e2e/`, and if the screen calls a new
   endpoint, add that endpoint to `dev/demo-mock.js` so the demo keeps working.
4. Every new UI string goes into the `T` dictionary with **both** Marathi and English (`key: ['मराठी', 'English']`).
   Then `node scripts/extract-strings.mjs` (after `npm run build:demo`), add the new keys to every `public/lang/*.json`
   pack, and `node scripts/check-lang.mjs` must print OK for all (missing keys fall back to English at runtime).
5. Bump `VERSION` in `public/sw.js` when frontend files change (phones cache the app).

## Architecture
- **server.js** – Express API + static files. Tables: `tenants`, `users` (role `super|admin|staff`, `tenant_id`),
  `docs` (generic JSON documents: PK `tenant_id, col, id`; cols = cars, leads, deals, expenses, settings, chats, broadcasts),
  `photos` (images as LONGBLOB; `_platform` tenant = super-admin assets), `views` (catalogue analytics),
  `payments`, `logs`, `rc_lookups` (RC cache/usage per dealer), `platform` (key/value: plans, news, supportPhone, posterLib, posterCfg, dealerPoster).
- Auth: JWT in an httpOnly cookie `sad`. Super admin "open as dealer" = JWT with `act: <tenantId>` (logged).
- **Tenant isolation is enforced on the server** (`req.tid` in every query). Never trust a tenant id from the client.
- Plan state: `trial | active | expired | suspended` from `tenants.expiry/trial/suspended`. Expired = read-only (HTTP 402).
  Suspended = cannot log in (403). Limits per plan (`maxCars`, `maxStaff`; 0 = unlimited) → 403 `limit`.
  Features per dealer: `catalog`, `wa`. Plans also carry `rcPerMonth` (RC lookups; 0 = off).
- Public pages: `/c/<tenantId>` and `/c/<tenantId>/<carId>` (catalogue, first-visit name/phone/town form → lead with source `qr`).
- **Frontend** = plain browser JavaScript, no framework, one global scope. Source in `src/frontend/NN-*.js`,
  concatenated in file-name order by `scripts/build.mjs` → `public/app.js` (generated – never edit it).
  Pattern: global state `S`, `me`, `TEN` (tenant info), `ui`; `render()` redraws `#main`; views return HTML strings;
  forms open in a bottom sheet (`openSheet`); `save(col, obj)` → `PUT /api/docs/...`; `t(key)` for text; `OPT` for option labels.
  Super admin UI = `renderSA()` (routes `#sa…`). Public catalogue = `bootPublic()`.
- Posters (MahaPoster model, ported from the owner's MahaPoster project): poster art 1080×1350, bottom **patti** 1080×270
  (20%), auto-drawn from the dealer's logo/name/phone or designer PNGs uploaded by super admin, `PREVIEW` watermark when locked.
  Categories carry a plan tier; dealer types ("segments") make business-branding posters. Bulk upload parses
  `YYYY-MM-DD_Title.jpg` / `DD-MM-YYYY Title.jpg`.
- Car form: 📷 plate scan (tesseract.js served from `/ocr/`, `12-rc-scan.js`, `plateFromText` tested in e2e) → `POST /api/rc/lookup`
  (provider from `RC_PROVIDER`, mapped by `rcMap()` in server.js; demo/mock = fake data). Tests use `window.PLATE_OCR` to skip real OCR.
- Receipt print = the dealer's paper format (Marathi body text; title/terms/colour editable per dealer).

## Languages
Login page is always English. App default English; language dropdown per device (Settings → Appearance, super admin top bar,
public catalogue): English, हिन्दी, मराठी, বাংলা, తెలుగు, தமிழ், ગુજરાતી, ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ, ਪੰਜਾਬੀ, অসমীয়া.
English + Marathi are built into `T`; the others are packs `public/lang/<code>.json` fetched on demand (inlined in the demo build).
Translations were machine-generated – have native speakers review them. Receipt print body is still Marathi. Posters: English / हिंदी / मराठी.

## Deployment
Hostinger Business/Cloud "Node.js web app" (entry `server.js`, start `npm start`). See `docs/DEPLOY-HOSTINGER.md`.
Android APK / Play Store: `docs/ANDROID-APP.md`. Number plate scan + RC provider setup: `docs/RC-LOOKUP.md`.
`npm start` builds `public/app.js` first, so the generated file never needs to be committed.

## Backlog (owner's priorities, roughly in order)
1. Receipt (delivery note) body text in English and Hindi, chosen per dealer (now Marathi only).
2. ~~Hindi as a third UI language~~ – done (11 Indian languages). Next: native-speaker review of the packs; Urdu (needs RTL).
3. WhatsApp Cloud API: webhook `/api/whatsapp/webhook` → real inbox, auto-replies, Meta-ad attribution (`ctwa_clid`), templates.
4. Play Store app (TWA wrapper around the PWA) – app side ready (manifest, Back button, `/.well-known/assetlinks.json` from
   `ANDROID_PACKAGE`/`ANDROID_SHA256`); APK is built once the site is live on its domain – see `docs/ANDROID-APP.md`.
5. Online payments (Razorpay) – today super admin records payments by hand on purpose.
6. Daily automatic database backup; image storage limits.

## Guardrails
- Don't break tenant isolation; every new query must filter by `req.tid`.
- Don't store secrets in the repo; config comes from env vars.
- Keep the app usable on a cheap Android phone: no heavy libraries, mobile-first CSS. It must also work well on desktop
  (sidebar with names) and tablets – the e2e test checks 320px → 1920px for horizontal overflow.
- Bottom sheets own a history entry (`openSheet`/`closeSheet` in 10-forms.js) so Android Back closes them – keep it that way.
- Poster artwork must be our own or licensed – no copyrighted film/celebrity/deity images in starter content.
