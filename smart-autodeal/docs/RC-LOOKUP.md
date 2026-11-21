# Number plate scan + RC details

In **Cars → Add car** the dealer can do three things:
1. **📷 Scan number plate.** The phone camera takes a photo, and the app reads the number on the phone itself with tesseract.js.
   This is free. The OCR files (~7 MB) are served from our own server under `/ocr/` and download only on the first scan;
   after that the phone keeps them. The reader fixes common OCR mix-ups (O/0, I/1, B/8…) and tries a few angles.
   It knows all state codes, plus the BH series and Delhi numbers like `DL3C AB 1234`. The dealer always sees the number and can correct it.
2. **🔎 Fill from RC.** The server asks an RC data provider and fills in make, model, year, colour, fuel, owner no.,
   chassis, engine, insurance, tax, **loan (hypothecation)** and the RC owner's name. A loan or a blacklisted vehicle is shown in red.
   The app scans the plate and then fetches RC details automatically when the dealer's plan allows it.
3. **Check on Parivahan ↗.** This is free for every plan. It copies the number and opens the government "Know your vehicle" page
   (`RC_FREE_URL` in `src/frontend/12-rc-scan.js`). Change that link if the government moves the page.

## Setting up the RC provider (Hostinger → environment variables)
| Variable | |
|---|---|
| `RC_PROVIDER` | `surepass`, `generic` or `mock` (fake data, for testing only) |
| `RC_API_KEY` | the key or token the provider gives you (keep it secret, never in git) |
| `RC_API_URL` | needed for `generic`; optional for `surepass` (default `https://kyc-api.surepass.io/api/v1/rc/rc-full`) |
| `RC_API_KEY_HEADER` | `generic` only: header for the key, default `Authorization` (a key without spaces is sent as `Bearer <key>`) |
| `RC_API_FIELD` | `generic` only: JSON field for the number, default `vehicle_number` |

`generic` sends `POST RC_API_URL` with `{"<RC_API_FIELD>": "MH20DV4521"}`. The answer can use most common field names
(`owner_name`, `maker_model`, `fuel_type`, `insurance_upto`, `financer`…), and `rcMap()` in `server.js` finds them.
For a provider with very different names, add those names to `rcMap()`.

## Limits and cost
- Each plan has **RC lookups / month** (Super Admin → Plans; 0 = off). Defaults: Basic 0, Pro 100, Premium 300.
- A number the same dealer already looked up in the last 30 days comes from cache. It costs nothing and is not counted again.
- A failed or "not found" lookup is not counted. Every lookup is written to the activity log (number only).
- Dealers only see their own lookups (`rc_lookups.tenant_id`).

## Privacy (DPDP Act)
The RC owner's name is personal data. The form reminds the dealer to check RC only with the seller's consent and to use the
details only for that purchase. Results are stored per dealer in `rc_lookups`. Delete old rows if you need a shorter retention.
