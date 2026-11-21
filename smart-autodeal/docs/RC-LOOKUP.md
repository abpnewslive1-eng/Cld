# Number plate scan + RC details

In **Cars → Add car** the dealer can do four things:
0. **📄 Scan RC (free, no API key).** The dealer photographs the RC smart card (both sides), or picks a screenshot of the
   DigiLocker / mParivahan RC. The phone reads it with OCR. `rcFromText()` in `src/frontend/13-rc-card.js` finds the labelled
   fields (owner, maker, model, colour, fuel, chassis, engine, registration and manufacturing dates, owner serial no., financier)
   and fills the form. Nothing is sent to any outside company, and there is no cost per scan. Printed RC formats differ by state,
   so the dealer should always check the filled form. A missing field just stays empty.
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
| `RC_PROVIDER` | `cashfree`, `surepass`, `generic` or `mock` (fake data, for testing only) |
| `CASHFREE_CLIENT_ID` / `CASHFREE_CLIENT_SECRET` | `cashfree`: from Cashfree Merchant Dashboard → Secure ID / Verification → API keys |
| `CASHFREE_ENV` | `cashfree`: `production` (default, `https://api.cashfree.com`) or `sandbox` (`https://sandbox.cashfree.com`, test keys and Cashfree's test numbers) |
| `RC_API_KEY` | the key or token the provider gives you (keep it secret, never in git) |
| `RC_API_URL` | needed for `generic`; optional for `surepass` (default `https://kyc-api.surepass.io/api/v1/rc/rc-full`) |
| `RC_API_KEY_HEADER` | `generic` only: header for the key, default `Authorization` (a key without spaces is sent as `Bearer <key>`) |
| `RC_API_FIELD` | `generic` only: JSON field for the number, default `vehicle_number` |

`generic` sends `POST RC_API_URL` with `{"<RC_API_FIELD>": "MH20DV4521"}`. The answer can use most common field names
(`owner_name`, `maker_model`, `fuel_type`, `insurance_upto`, `financer`…), and `rcMap()` in `server.js` finds them.
For a provider with very different names, add those names to `rcMap()`.

### Cashfree (Secure ID → Vehicle RC)
We call `POST {base}/verification/vehicle-rc` with the headers `x-client-id` and `x-client-secret` and the body
`{"verification_id": "<unique, ≤50 chars>", "vehicle_number": "MH20DV4521"}` (this follows Cashfree's API reference).
- `status: "VALID"` fills the form (`vehicle_manufacturer_name`, `model`, `vehicle_colour`, `type` = fuel, `owner_count`, `owner`,
  `chassis`, `engine`, `reg_date`, `vehicle_manufacturing_month_year`, `vehicle_insurance_upto`, `vehicle_tax_upto`, `rc_financer`,
  `reg_authority`, `class`, `blacklist_status`, `rc_status`). If the RC status is not ACTIVE, the form shows a red warning.
- `status: "INVALID"` means "no RC details found" and is not counted.
- 401 (wrong keys), 403 (**server IP not whitelisted**: add your Hostinger server IP in the Cashfree dashboard),
  422 (**low balance**: top up your Cashfree wallet) and 429 (too many requests) show the dealer "service not available".
  They are not counted, and the error is written to the Super Admin activity log, so you can see why.
- Test first with `CASHFREE_ENV=sandbox` and the sandbox keys, then switch to production keys.

## Limits and cost
- Each plan has **RC lookups / month** (Super Admin → Plans; 0 = off). Defaults: Basic 0, Pro 100, Premium 300.
- A number the same dealer already looked up in the last 30 days comes from cache. It costs nothing and is not counted again.
- A failed or "not found" lookup is not counted. Every lookup is written to the activity log (number only).
- Dealers only see their own lookups (`rc_lookups.tenant_id`).

## Privacy (DPDP Act)
The RC owner's name is personal data. The form reminds the dealer to check RC only with the seller's consent and to use the
details only for that purchase. Results are stored per dealer in `rc_lookups`. Delete old rows if you need a shorter retention.
