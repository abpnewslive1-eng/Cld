# Android app (APK / Play Store)

The Android app is a **Trusted Web Activity (TWA)**: a small APK that opens the live website full-screen,
with no browser bar, exactly like a normal app. There is no second codebase. Every time you update the website,
dealers get the update in the app automatically, with no new APK and no Play Store review.

Before you start:
1. The website must be live on **HTTPS** with your own domain, e.g. `https://app.smartautodeal.in`
   (see `DEPLOY-HOSTINGER.md`).
2. Pick a permanent **package name**, e.g. `in.smartautodeal.app`. It can never be changed after the first Play Store upload.

## Option A – PWABuilder (easiest, no software to install)
1. Open https://www.pwabuilder.com, enter your website address, and click **Start**.
   It checks the manifest, icons and service worker. All of these are already in the app.
2. Click **Package for stores → Android**. Enter:
   - Package ID: your package name
   - App name: `Smart AutoDeal`, Launcher name: `AutoDeal`
   - Signing key: **Create new**. Download it and **keep the key file and passwords safe forever**.
     Without them you can never update the app on the Play Store.
3. Download the zip. It contains:
   - `*.apk`: install this directly on phones (send it on WhatsApp, or put it on your website for download)
   - `*.aab`: upload this to Google Play Console
   - `assetlinks.json`: this holds your SHA-256 fingerprint
4. On Hostinger, set these environment variables, then restart the app:
   ```
   ANDROID_PACKAGE=in.smartautodeal.app
   ANDROID_SHA256=AA:BB:...:FF      (sha256_cert_fingerprints value from assetlinks.json)
   ```
   Check that `https://<your-domain>/.well-known/assetlinks.json` shows the package name.
   If this file is missing or wrong, the app still works, but it shows a browser bar at the top.
5. If you publish on Google Play, Play re-signs the app. Copy the **App signing key SHA-256** from
   Play Console → Setup → App integrity and add it as a second value:
   `ANDROID_SHA256=<your key>,<Play key>`

## Option B – Bubblewrap (command line, for developers)
Needs Node 18+ and JDK 17. Bubblewrap downloads the Android SDK on first run.
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://<your-domain>/manifest.webmanifest
bubblewrap build        # → app-release-signed.apk + app-release-bundle.aab
bubblewrap fingerprint list   # SHA-256 for ANDROID_SHA256
```

## Giving the APK to dealers
- **Direct APK:** share the `.apk` file on WhatsApp or as a download link. On the phone, the dealer taps it and allows
  "Install unknown apps" once. This is good for the first dealers and costs nothing.
- **Play Store:** a one-time Google Play developer account is needed. Upload the `.aab`, add the screenshots
  (`public/screenshots/`), a privacy policy URL, and fill in the store listing. After Google's review, dealers install
  it normally, which they trust more.

## What already works for the app
- `manifest.webmanifest`: name, icons (including a maskable icon), theme colour, shortcuts (Cars / Customers / Receipts on a
  long-press of the icon), and install screenshots
- Service worker: the app shell opens fast and works on a weak network. Data always comes live from the server.
- The phone **Back** button closes an open form or sheet first, then goes to the previous screen
- The layout is checked from a 320px phone up to a 1920px monitor (see `tests/e2e/`)
- `/.well-known/assetlinks.json` is served from `ANDROID_PACKAGE` / `ANDROID_SHA256`
