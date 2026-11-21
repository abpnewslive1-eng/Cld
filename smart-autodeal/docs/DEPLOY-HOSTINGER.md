# Smart AutoDeal – Setup Guide (Hostinger, Node.js + MySQL)

**Smart AutoDeal** – डीलरचा डिजिटल मुनीम. Ek software, kai dealer: aap Super Admin, aur har dealer ka data poori tarah alag.

## Kya chahiye
- Hostinger **Business Web Hosting** ya **Cloud** plan (Node.js Web App wala)
- Domain/subdomain, jaise `app.smartautodeal.in` (SSL on)

## Step 1: MySQL database
hPanel → Databases → MySQL Databases → naya database + user banao. Naam, user aur password note karo. Tables khud ban jayenge.

## Step 2: App upload
1. Zip ke andar ki `smart-autodeal` folder ki files dobara zip karo (`node_modules` nahi)
2. hPanel → Websites → Add Website → **Node.js web app** → Upload
3. Entry file: `server.js`, start command: `npm start`, Node 18/20/22
4. **Environment variables** mein `.env.example` ki har line apni values ke saath daalo
5. Deploy. Logs mein "Smart AutoDeal chal raha hai" dikhe to app live hai.

## Step 3: Super Admin (aap)
1. Domain kholo, `SUPER_USERNAME` / `SUPER_PASSWORD` se login
2. **प्लॅन** page: support number aur plans ki kimat/seema tay karo
3. **डीलर्स → + नवीन डीलर**: dukaan, malik, mobile, login, plan, trial ke din
4. Dealer ko uska username/password do. Woh usi domain par login karega.

## Roz ka kaam (sab manual)
- **Trial badhana:** dealer kholo → +7 / +14 din
- **Payment:** dealer kholo → पेमेंट नोंदवा (mahine, rakam, UPI/rokh). Mudat apne aap aage badhti hai.
- **Band/chalu:** dealer kholo → बंद करा / चालू करा
- **Support:** 🔑 "डीलर म्हणून उघडा" – dealer ka CRM uski nazar se. Har baar नोंदवही mein darj hota hai.
- **Sabko sandesh:** सूचना page

## Dealer ko kya milta hai
- Dashboard, gaadiyan (photo, kharid source, kharcha), grahak, pavti (sahi, photo, print), dukaan kharcha, loan tracking
- **Pavti ka apna format:** Settings → पावती फॉरमॅट (shirshak, niyam-ati, rang)
- Plan ke hisaab se: online catalogue + QR sticker, WhatsApp module
- Apna catalogue link: `aapkadomain/c/<dealer-id>`
- Trial ke din, plan khatam hone par "sirf dekhna", aur aapka support number

## Bhasha
- Login page hamesha **English** mein (poore Bharat ke liye)
- App ki default bhasha English; har user Settings → Language se मराठी chun sakta hai

## Daily Posters (MahaPoster jaisa hi)
**Super Admin → Posters** ke 4 tab:
- **Posters:** search, category / plan / status filter, Grid ↔ Table, Edit, Hide/Show, Delete, "Showing X of Y".
  - **＋ Upload poster:** image (1080×1350) ya bina image auto-design (subtitle, emoji, 6 rang), category (plan usi se), tarikh ya "No date, always available", dealer-prakar ke liye branding, Publish switch.
  - **⇪ Bulk upload:** ek saath 60 images tak. File ke naam se tarikh aur shirshak apne aap: `2026-11-05_Diwali-1.jpg` → 5 Nov 2026, "Diwali 1" (ya `05-11-2026 Diwali.jpg`). Bina tarikh wali files ke liye default tarikh, "No date" switch, dealer-prakar branding, **"Assign dates in order"** (shuru ki tarikh + roz kitne poster), har row mein shirshak/tarikh badlo ya hatao, aur "Publish all".
  - Pehli baar: **"नमुना पोस्टर भरा"** (rashtriya din, jayanti, good morning, car tips, offer, business). Diwali/Holi/Eid jaise tyohaar ड्राफ्ट mein aate hain, tarikh daalkar chalu karo.
- **Categories:** Hindi/Marathi naam, plan (Basic/Pro/Premium), kram, dikhe/chhupe. Jis category mein poster hain, use delete nahi kar sakte.
- **Dealer types:** used cars, two-wheelers, commercial, tractors… Branding poster sirf usi prakar ke dealer ko dikhte hain.
- **Settings → Designer patti approval:** chalu karne par har dealer ki patti designer banata hai aur aapke approve karne ke baad hi poster download hote hain (MahaPoster wala flow). Band rakhne par patti dealer ki jaankari se apne aap banti hai.

**Dealer kholkar "Poster patti":** dealer prakar chuno, 3 patti upload karo (sirf 1080×270 ya 2160×540; galat size par saaf error), transparent PNG chalega, phir **✓ Mark patti approved** / pending / "Needs changes", aur ek click mein dealer ko WhatsApp.

**Dealer → Posters → Daily posters:**
- Patti ka status. Pending ho to timeline: Request received → Designing → Approval → Ready.
- "⇄ Change patti", Pro/Premium dealer ke liye **Regular / ★ Business** tab, "Aaj" carousel, category chips (upar ke plan wale par 🔒 aur "Upgrade plan" card), "♾ Always available" aur aage ki tarikhein.
- Poster kholo: preview, lock card (plan khatam, upar ka plan chahiye, patti pending/needs changes) aur WhatsApp par support. Download / Share, hamesha poore 1080×1350 size mein.
- Settings → Poster branding: logo aur tagline (auto patti ke liye).

## Poster Studio (har dealer ke liye)
- Menu → **Posters** (mobile par "More" mein), ya gaadi kholkar "🖼 Make poster"
- 5 prakar: gaadi bikau, naya stock (4 gaadi tak), **delivery ki badhai** (grahak ki photo ke saath), tyohaar ki shubhkamnayein (15 tyohaar), offer/sale
- Size: chaukor (post) aur lamba (WhatsApp Status/Story); bhasha: English / हिंदी / मराठी; shaili: halki / gadad / rangeen; 5 rang
- Har poster par dealer ka naam, phone, pata aur catalogue ka QR apne aap
- Download (PNG), ya mobile par "Share" se seedha WhatsApp/Instagram

## Plan ki seema (server par laagu)
- Gaadiyon aur staff ki seema poori hone par nayi entry ruk jaati hai
- Plan khatam: data dikhega, nayi entry/badlav band
- Band dealer: login nahi kar sakta, catalogue bhi band
- Basic plan mein catalogue band (Super Admin features se badal sakte ho)

## Purana Sevasai (single-dealer) version se upgrade
Isi database par naya version chalao. Pehli baar chalte hi saara purana data apne aap **"default"** naam ke dealer mein chala jayega (Premium, 1 saal). `SUPER_USERNAME` / `SUPER_PASSWORD` set karna na bhoolo.

## Backup
- Har dealer: Settings → बॅकअप डाउनलोड
- Poora server: hPanel → Databases → phpMyAdmin → Export (hafte mein ek baar)

## Update
Nayi files upload karke redeploy. Design/code badle to `public/sw.js` mein `VERSION` badhao.

## Dhyan rahe
- WhatsApp module abhi demo/manual hai; asli WhatsApp API agla kadam hai
- Payment abhi manual hai; Razorpay baad mein
- Thodi der koi use na kare to Hostinger app ko sula deta hai; pehla load 2-5 second
