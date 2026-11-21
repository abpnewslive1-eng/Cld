/* ================= Poster studio ================= */
Object.assign(T, {
  nav_posters:['पोस्टर','Posters'], pst_title:['पोस्टर स्टुडिओ','Poster studio'], pst_sub:['गाडी, नवीन स्टॉक, सण आणि ऑफरचे तयार पोस्टर – तुमचे नाव, फोन आणि QR सह. WhatsApp Status, Instagram आणि Facebook साठी.','Ready posters for cars, new stock, festivals and offers – with your name, phone and QR. For WhatsApp Status, Instagram and Facebook.'],
  pst_tpl:['पोस्टरचा प्रकार','Poster type'], tpl_car:['गाडी विक्रीसाठी','Car for sale'], tpl_stock:['नवीन स्टॉक','New stock'], tpl_fest:['सणाच्या शुभेच्छा','Festival greeting'], tpl_offer:['ऑफर / सेल','Offer / sale'],
  pst_fmt:['आकार','Size'], fmt_sq:['चौकोनी (पोस्ट)','Square (post)'], fmt_story:['उभा (Status / Story)','Tall (Status / Story)'], pst_lang:['पोस्टरची भाषा','Poster language'],
  pst_style:['शैली','Style'], st_light:['हलकी','Light'], st_dark:['गडद','Dark'], st_bold:['रंगीत','Bold'], pst_color:['रंग','Colour'],
  pst_car:['गाडी','Car'], pst_cars:['गाड्या (४ पर्यंत)','Cars (up to 4)'], pst_photo:['फोटो','Photo'], pst_head:['मुख्य ओळ','Headline'], pst_head_ph:['रिकामे ठेवल्यास आपोआप','Leave empty for default'],
  pst_price:['किंमत दाखवा','Show price'], pst_qr:['कॅटलॉग QR दाखवा','Show catalogue QR'], pst_fest:['सण','Festival'], pst_msg:['संदेश','Message'], pst_offer_t:['ऑफरचे शीर्षक','Offer title'], pst_offer_s:['ऑफर तपशील','Offer details'], pst_valid:['ऑफर तारखेपर्यंत','Valid till'],
  pst_download:['⬇ डाउनलोड','⬇ Download'], pst_share:['📤 शेअर करा','📤 Share'], pst_share_na:['हा फोन थेट शेअरला सपोर्ट करत नाही – पोस्टर डाउनलोड झाले, आता WhatsApp मध्ये जोडा.','Direct share not supported here – the poster was downloaded; add it in WhatsApp.'],
  pst_no_cars:['पोस्टरसाठी स्टॉकमध्ये गाडी नाही','No cars in stock for a poster'], pst_make:['🖼 पोस्टर बनवा','🖼 Make poster'], pst_tip:['टीप: मोबाईलवर "शेअर करा" दाबून थेट WhatsApp Status वर टाका.','Tip: on mobile, tap “Share” to post straight to WhatsApp Status.'],
});
const PL = {
  en: { badge:'JUST ARRIVED', ask:'Call for price', scan:'Scan to see all cars', stock:'New Stock Arrived', offerT:'Festive Offer', offerS:'Easy Loan  •  Exchange  •  RC Transfer', valid:'Valid till {d}', call:'Call', km:'km',
        fuel:{ petrol:'Petrol', diesel:'Diesel', cng:'CNG', ev:'Electric' }, sub:'Wishing you joy and prosperity', from:'From all of us at {s}', owner1:'1st owner', ownerN:'{n} owners' },
  hi: { badge:'नई गाड़ी आई है', ask:'कीमत के लिए कॉल करें', scan:'सभी गाड़ियां देखने के लिए स्कैन करें', stock:'नया स्टॉक आया है', offerT:'त्योहारी ऑफर', offerS:'आसान लोन  •  एक्सचेंज  •  RC ट्रांसफर', valid:'{d} तक', call:'कॉल करें', km:'किमी',
        fuel:{ petrol:'पेट्रोल', diesel:'डीज़ल', cng:'CNG', ev:'इलेक्ट्रिक' }, sub:'आपको और आपके परिवार को हार्दिक शुभकामनाएं', from:'{s} की ओर से', owner1:'पहला मालिक', ownerN:'{n} मालिक' },
  mr: { badge:'नवीन गाडी आली', ask:'किमतीसाठी कॉल करा', scan:'सर्व गाड्या पाहण्यासाठी स्कॅन करा', stock:'नवीन स्टॉक आला आहे', offerT:'सणासुदीची ऑफर', offerS:'सोपे कर्ज  •  एक्सचेंज  •  RC ट्रान्सफर', valid:'{d} पर्यंत', call:'कॉल करा', km:'किमी',
        fuel:{ petrol:'पेट्रोल', diesel:'डिझेल', cng:'CNG', ev:'इलेक्ट्रिक' }, sub:'आपणास व आपल्या कुटुंबियांना हार्दिक शुभेच्छा', from:'{s} तर्फे', owner1:'पहिला मालक', ownerN:'{n} रा मालक' },
};
const FESTS = {
  diwali: ['diya', 'Happy Diwali', 'दीपावली की हार्दिक शुभकामनाएं', 'दिवाळीच्या हार्दिक शुभेच्छा'],
  dussehra: ['sparkle', 'Happy Dussehra', 'दशहरा की हार्दिक शुभकामनाएं', 'दसऱ्याच्या हार्दिक शुभेच्छा'],
  ganesh: ['flower', 'Happy Ganesh Chaturthi', 'गणेश चतुर्थी की हार्दिक शुभकामनाएं', 'गणेश चतुर्थीच्या हार्दिक शुभेच्छा'],
  navratri: ['sparkle', 'Happy Navratri', 'नवरात्रि की हार्दिक शुभकामनाएं', 'नवरात्रीच्या हार्दिक शुभेच्छा'],
  gudipadwa: ['flower', 'Happy Gudi Padwa', 'गुड़ी पड़वा की हार्दिक शुभकामनाएं', 'गुढीपाडव्याच्या हार्दिक शुभेच्छा'],
  holi: ['colors', 'Happy Holi', 'होली की हार्दिक शुभकामनाएं', 'होळीच्या हार्दिक शुभेच्छा'],
  sankranti: ['kite', 'Happy Makar Sankranti', 'मकर संक्रांति की हार्दिक शुभकामनाएं', 'मकर संक्रांतीच्या हार्दिक शुभेच्छा'],
  pongal: ['sun', 'Happy Pongal', 'पोंगल की हार्दिक शुभकामनाएं', 'पोंगलच्या हार्दिक शुभेच्छा'],
  onam: ['flower', 'Happy Onam', 'ओणम की हार्दिक शुभकामनाएं', 'ओणमच्या हार्दिक शुभेच्छा'],
  rakhi: ['flower', 'Happy Raksha Bandhan', 'रक्षाबंधन की हार्दिक शुभकामनाएं', 'रक्षाबंधनाच्या हार्दिक शुभेच्छा'],
  eid: ['crescent', 'Eid Mubarak', 'ईद मुबारक', 'ईद मुबारक'],
  christmas: ['star', 'Merry Christmas', 'मेरी क्रिसमस', 'नाताळच्या हार्दिक शुभेच्छा'],
  newyear: ['sparkle', 'Happy New Year', 'नया साल मुबारक', 'नववर्षाच्या हार्दिक शुभेच्छा'],
  independence: ['tricolor', 'Happy Independence Day', 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएं', 'स्वातंत्र्य दिनाच्या हार्दिक शुभेच्छा'],
  republic: ['tricolor', 'Happy Republic Day', 'गणतंत्र दिवस की हार्दिक शुभकामनाएं', 'प्रजासत्ताक दिनाच्या हार्दिक शुभेच्छा'],
};
const FEST_NAMES = { diwali:'Diwali', dussehra:'Dussehra', ganesh:'Ganesh Chaturthi', navratri:'Navratri', gudipadwa:'Gudi Padwa', holi:'Holi', sankranti:'Makar Sankranti', pongal:'Pongal', onam:'Onam', rakhi:'Raksha Bandhan', eid:'Eid', christmas:'Christmas', newyear:'New Year', independence:'Independence Day', republic:'Republic Day' };
ui.pst = { tpl: 'car', fmt: 'sq', lang: 'en', style: 'light', color: '', carId: '', carIds: [], photo: 0, head: '', showPrice: true, showQR: true, fest: 'diwali', msg: '', offerT: '', offerS: '', valid: '' };

function viewStudio() {
  const p = ui.pst; const stock = S.cars.filter(c => c.status !== 'sold');
  if (!p.carId && stock[0]) p.carId = stock[0].id;
  if (!p.carIds.length) p.carIds = stock.slice(0, 4).map(c => c.id);
  if (!p.color) p.color = S.shop.catAccent || pref.accent || 'blue';
  const car = S.cars.find(c => c.id === p.carId);
  const seg = (key, list) => `<div class="seg">${list.map(([v, l]) => `<button aria-pressed="${p[key] === v}" onclick="ui.pst.${key}='${v}';render()">${l}</button>`).join('')}</div>`;
  const tplCards = [['car', 'tpl_car', '🚗'], ['stock', 'tpl_stock', '🆕'], ['delivery', 'tpl_delivery', '🎉'], ['fest', 'tpl_fest', '🪔'], ['offer', 'tpl_offer', '🏷']].map(([k, l, e]) => `<button class="tplc" aria-pressed="${p.tpl === k}" onclick="ui.pst.tpl='${k}';render()"><span>${e}</span>${t(l)}</button>`).join('');
  let fields = '';
  if (p.tpl === 'car') fields = stock.length ? `<div class="f"><label for="ps_car">${t('pst_car')}</label><select id="ps_car" onchange="ui.pst.carId=this.value;ui.pst.photo=0;render()">${stock.map(c => `<option value="${c.id}" ${c.id === p.carId ? 'selected' : ''}>${esc(carLabel(c))} · ${esc(c.reg || '')}</option>`).join('')}</select></div>
      ${car && (car.photos || []).length > 1 ? `<div class="f"><label>${t('pst_photo')}</label><div class="ps-thumbs">${car.photos.map((ph, i) => `<button class="${i === p.photo ? 'on' : ''}" onclick="ui.pst.photo=${i};render()"><img src="${photoSrc(ph)}" alt=""></button>`).join('')}</div></div>` : ''}` : `<p class="empty">${t('pst_no_cars')}</p>`;
  if (p.tpl === 'stock') fields = `<div class="f"><label>${t('pst_cars')}</label><div class="kchips">${stock.map(c => `<label class="kchip"><input type="checkbox" ${p.carIds.includes(c.id) ? 'checked' : ''} onchange="pstToggleCar('${c.id}',this.checked)"> ${esc(carLabel(c))}</label>`).join('')}</div></div>`;
  if (p.tpl === 'delivery') { const ds = S.deals.slice().sort((a, b) => num(b.receiptNo) - num(a.receiptNo)); if (!p.dealId && ds[0]) p.dealId = ds[0].id;
    fields = ds.length ? `<div class="f"><label for="ps_deal">${t('pst_deal')}</label><select id="ps_deal" onchange="ui.pst.dealId=this.value;render()">${ds.map(d => `<option value="${d.id}" ${d.id === p.dealId ? 'selected' : ''}>#${esc(d.receiptNo)} · ${esc(d.buyer?.name || '')} · ${esc(d.vehicle?.model || '')}</option>`).join('')}</select></div>` : `<p class="empty">${t('pst_no_deals')}</p>`; }
  if (p.tpl === 'fest') fields = `<div class="f"><label for="ps_fest">${t('pst_fest')}</label><select id="ps_fest" onchange="ui.pst.fest=this.value;render()">${Object.keys(FESTS).map(k => `<option value="${k}" ${p.fest === k ? 'selected' : ''}>${FEST_NAMES[k]}</option>`).join('')}</select></div>
      <div class="f"><label for="ps_msg">${t('pst_msg')}</label><input id="ps_msg" value="${esc(p.msg)}" placeholder="${esc(PL[p.lang].sub)}" oninput="ui.pst.msg=this.value;pstDraw()"></div>`;
  if (p.tpl === 'offer') fields = `<div class="f"><label for="ps_ot">${t('pst_offer_t')}</label><input id="ps_ot" value="${esc(p.offerT)}" placeholder="${esc(PL[p.lang].offerT)}" oninput="ui.pst.offerT=this.value;pstDraw()"></div>
      <div class="f"><label for="ps_os">${t('pst_offer_s')}</label><input id="ps_os" value="${esc(p.offerS)}" placeholder="${esc(PL[p.lang].offerS)}" oninput="ui.pst.offerS=this.value;pstDraw()"></div>
      <div class="f"><label for="ps_v">${t('pst_valid')}</label><input id="ps_v" type="date" value="${esc(p.valid)}" onchange="ui.pst.valid=this.value;pstDraw()"></div>`;
  const headField = p.tpl === 'car' || p.tpl === 'stock' ? `<div class="f"><label for="ps_h">${t('pst_head')}</label><input id="ps_h" value="${esc(p.head)}" placeholder="${t('pst_head_ph')}" oninput="ui.pst.head=this.value;pstDraw()"></div>` : '';
  return `<div class="ph"><div><h1>${t('pst_title')}</h1><p class="sub">${t('pst_sub')}</p></div></div>
  <div class="pst">
    <div class="card pst-ctrl">
      <div class="tplcs">${tplCards}</div>
      <div class="f"><label>${t('pst_fmt')}</label>${seg('fmt', [['sq', t('fmt_sq')], ['story', t('fmt_story')]])}</div>
      <div class="f"><label>${t('pst_lang')}</label>${seg('lang', [['en', 'English'], ['hi', 'हिंदी'], ['mr', 'मराठी']])}</div>
      <div class="f"><label>${t('pst_style')}</label>${seg('style', [['light', t('st_light')], ['dark', t('st_dark')], ['bold', t('st_bold')]])}</div>
      <div class="f"><label>${t('pst_color')}</label><div class="swatches">${Object.entries(ACCENTS).map(([k, c]) => `<button class="swatch" style="background:${c}" aria-pressed="${p.color === k}" aria-label="${k}" onclick="ui.pst.color='${k}';render()"></button>`).join('')}</div></div>
      ${fields}${headField}
      <div class="kchips" style="margin-top:4px">${p.tpl === 'car' || p.tpl === 'stock' ? `<label class="kchip"><input type="checkbox" ${p.showPrice ? 'checked' : ''} onchange="ui.pst.showPrice=this.checked;pstDraw()"> ${t('pst_price')}</label>` : ''}<label class="kchip"><input type="checkbox" ${p.showQR ? 'checked' : ''} onchange="ui.pst.showQR=this.checked;pstDraw()"> ${t('pst_qr')}</label></div>
    </div>
    <div class="pst-prev"><canvas id="pstCanvas" aria-label="${t('pst_title')}"></canvas>
      <div class="sheet-foot" style="justify-content:center"><button class="btn" onclick="pstDownload()">${t('pst_download')}</button><button class="btn primary" onclick="pstShare()">${t('pst_share')}</button></div>
      <p class="r-meta" style="text-align:center;margin:6px 0 0">${t('pst_tip')}</p></div>
  </div>`;
}
function pstToggleCar(id, on) { const s2 = new Set(ui.pst.carIds); on ? s2.add(id) : s2.delete(id); ui.pst.carIds = [...s2].slice(0, 4); render(); }
function openPoster(carId) { closeSheet(); Object.assign(ui.pst, { tpl: 'car', carId, photo: 0 }); location.hash = 'posters'; render(); }

/* ---------- drawing helpers ---------- */
const PF = (w, size) => `${w} ${size}px "Plus Jakarta Sans","Mukta","Noto Sans Devanagari",sans-serif`;
const imgCache = {};
function pImg(src) { if (!src) return Promise.resolve(null); if (imgCache[src]) return imgCache[src];
  return (imgCache[src] = new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => res(null); im.src = src; })); }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function cover(ctx, im, x, y, w, h, r) {
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
  if (im) { const s = Math.max(w / im.width, h / im.height); const iw = im.width * s, ih = im.height * s; ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); }
  else { ctx.fillStyle = 'rgba(127,127,127,.15)'; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(127,127,127,.5)'; ctx.font = PF(700, Math.min(w, h) / 4); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚗', x + w / 2, y + h / 2); }
  ctx.restore();
}
function wrap(ctx, text, x, y, maxW, lh, maxLines, align) {
  const words = String(text || '').split(/\s+/); const lines = []; let cur = '';
  words.forEach(wd => { const tst = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tst).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = tst; });
  if (cur) lines.push(cur);
  const out = lines.slice(0, maxLines || 9); ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
  out.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return y + (out.length - 1) * lh;
}
function fitFont(ctx, text, weight, start, maxW, min) { let s = start; ctx.font = PF(weight, s); while (ctx.measureText(text).width > maxW && s > (min || 20)) { s -= 2; ctx.font = PF(weight, s); } return s; }
function drawQR(ctx, text, x, y, size) {
  try { const q = qrcode(0, 'M'); q.addData(text); q.make(); const n = q.getModuleCount(); const m = 2; const cell = size / (n + m * 2);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size); ctx.fillStyle = '#111';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) ctx.fillRect(Math.floor(x + (c + m) * cell), Math.floor(y + (r + m) * cell), Math.ceil(cell), Math.ceil(cell)); } catch (e) {}
}
function pstTheme(p) {
  const A = ACCENTS[p.color] || ACCENTS.blue;
  if (p.style === 'dark') return { A, bg1: '#0E1020', bg2: '#1B1F3A', ink: '#FFFFFF', muted: 'rgba(255,255,255,.72)', card: 'rgba(255,255,255,.08)', foot: '#FFFFFF', footInk: '#111' };
  if (p.style === 'bold') return { A, bg1: A, bg2: shade(A, -35), ink: '#FFFFFF', muted: 'rgba(255,255,255,.82)', card: 'rgba(255,255,255,.14)', foot: '#FFFFFF', footInk: '#111' };
  return { A, bg1: '#F6F7FB', bg2: '#E9ECF5', ink: '#14161C', muted: '#5B6070', card: '#FFFFFF', foot: '#14161C', footInk: '#FFFFFF' };
}
function shade(hex, pct) { const n = parseInt(hex.slice(1), 16); const f = c => Math.max(0, Math.min(255, Math.round(c + (pct / 100) * 255))); return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join(''); }
function bg(ctx, W, H, th) { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, th.bg1); g.addColorStop(1, th.bg2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = .12; ctx.fillStyle = th.A === th.bg1 ? '#fff' : th.A; ctx.beginPath(); ctx.arc(W * .92, H * .06, W * .32, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(W * .04, H * .7, W * .22, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
function footer(ctx, W, H, th, p, L2) {
  const fh = p.showQR ? 230 : 170, y = H - fh - 40, x = 40, w = W - 80;
  ctx.fillStyle = th.foot; rr(ctx, x, y, w, fh, 34); ctx.fill();
  const lx = x + 34, ly = y + fh / 2; ctx.fillStyle = th.A; ctx.beginPath(); ctx.arc(lx + 46, ly, 46, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = PF(800, 44); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText((S.shop.name || 'A').trim().charAt(0).toUpperCase(), lx + 46, ly + 2);
  const tx = lx + 116, tw = w - 150 - (p.showQR ? 200 : 0);
  ctx.fillStyle = th.footInk; fitFont(ctx, S.shop.name || '', 800, 42, tw, 26); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(S.shop.name || '', tx, ly - 18);
  ctx.font = PF(700, 34); ctx.fillStyle = th.A; ctx.fillText('📞 ' + (S.shop.phone || ''), tx, ly + 26);
  ctx.font = PF(500, 24); ctx.fillStyle = th.footInk === '#FFFFFF' ? 'rgba(255,255,255,.7)' : '#5B6070';
  wrap(ctx, S.shop.address || '', tx, ly + 64, tw, 28, 1);
  if (p.showQR) { const qs = 150; const qx = x + w - qs - 34, qy = y + 24; drawQR(ctx, publicUrl(), qx, qy, qs); ctx.font = PF(600, 18); ctx.fillStyle = th.footInk === '#FFFFFF' ? 'rgba(255,255,255,.8)' : '#444'; wrap(ctx, L2.scan, qx + qs / 2, qy + qs + 26, qs + 40, 20, 2, 'center'); }
  return y;
}
function pill2(ctx, text, x, y, bgc, fg, size) { ctx.font = PF(800, size); const w = ctx.measureText(text).width + size * 1.4, h = size * 1.9; ctx.fillStyle = bgc; rr(ctx, x, y, w, h, h / 2); ctx.fill(); ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, x + size * .7, y + h / 2 + 1); return w; }
const carSub = (c, L2) => [c.year, c.km ? num(c.km).toLocaleString('en-IN') + ' ' + L2.km : '', L2.fuel[c.fuel] || ''].filter(Boolean).join('  •  ');

/* ---------- motifs for festival posters (simple, original shapes) ---------- */
function motif(ctx, kind, cx, cy, s, th) {
  ctx.save();
  if (kind === 'diya') { ctx.fillStyle = '#7C2D12'; ctx.beginPath(); ctx.ellipse(cx, cy + s * .15, s * .55, s * .22, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#FDBA74'; ctx.beginPath(); ctx.ellipse(cx, cy + s * .15, s * .55, s * .08, 0, 0, 7); ctx.fill();
    const g = ctx.createRadialGradient(cx, cy - s * .25, 2, cx, cy - s * .2, s * .5); g.addColorStop(0, 'rgba(255,214,90,.95)'); g.addColorStop(1, 'rgba(255,214,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy - s * .2, s * .5, 0, 7); ctx.fill();
    ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.moveTo(cx, cy - s * .55); ctx.quadraticCurveTo(cx + s * .16, cy - s * .15, cx, cy + s * .06); ctx.quadraticCurveTo(cx - s * .16, cy - s * .15, cx, cy - s * .55); ctx.fill(); }
  else if (kind === 'kite') { ctx.translate(cx, cy); ctx.rotate(-.3); ctx.fillStyle = th.A; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.lineTo(s * .4, 0); ctx.lineTo(0, s * .6); ctx.lineTo(-s * .4, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -s * .6); ctx.lineTo(0, s * .6); ctx.moveTo(-s * .4, 0); ctx.lineTo(s * .4, 0); ctx.stroke(); ctx.strokeStyle = th.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, s * .6); ctx.bezierCurveTo(s * .3, s * .8, -s * .2, s * .9, s * .15, s * 1.0); ctx.stroke(); }
  else if (kind === 'tricolor') { const w = s * 1.6, h = s * .3; [['#FF9933', -1], ['#FFFFFF', 0], ['#138808', 1]].forEach(([c, i]) => { ctx.fillStyle = c; rr(ctx, cx - w / 2, cy + i * h - h / 2, w, h, 10); ctx.fill(); }); ctx.strokeStyle = '#000080'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, h * .38, 0, 7); ctx.stroke(); }
  else if (kind === 'star') { ctx.fillStyle = '#FBBF24'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * .25 : s * .6, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } ctx.closePath(); ctx.fill(); }
  else if (kind === 'crescent') { ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.arc(cx, cy, s * .55, 0, 7); ctx.fill(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(cx + s * .25, cy - s * .1, s * .48, 0, 7); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
  else if (kind === 'colors') { ['#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'].forEach((c, i) => { ctx.globalAlpha = .85; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + Math.cos(i * 1.3) * s * .45, cy + Math.sin(i * 1.3) * s * .35, s * (.22 + (i % 2) * .1), 0, 7); ctx.fill(); }); }
  else if (kind === 'flower') { ctx.fillStyle = '#F97316'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * s * .3, cy + Math.sin(a) * s * .3, s * .22, s * .12, a, 0, 7); ctx.fill(); } ctx.fillStyle = '#FACC15'; ctx.beginPath(); ctx.arc(cx, cy, s * .2, 0, 7); ctx.fill(); }
  else if (kind === 'sun') { ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(cx, cy, s * .35, 0, 7); ctx.fill(); ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 8; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * s * .45, cy + Math.sin(a) * s * .45); ctx.lineTo(cx + Math.cos(a) * s * .62, cy + Math.sin(a) * s * .62); ctx.stroke(); } }
  else { ctx.fillStyle = '#FBBF24'; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3, r = s * .5; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr2 = k % 2 ? 6 : 22, aa = k * Math.PI / 4; ctx.lineTo(x + rr2 * Math.cos(aa), y + rr2 * Math.sin(aa)); } ctx.closePath(); ctx.fill(); } ctx.beginPath(); ctx.arc(cx, cy, s * .18, 0, 7); ctx.fill(); }
  ctx.restore();
}

/* ---------- main render ---------- */
let pstBusy = 0;
async function pstDraw() {
  const cv = $('#pstCanvas'); if (!cv) return; const job = ++pstBusy;
  const p = ui.pst, L2 = PL[p.lang], th = pstTheme(p); th.style = p.style;
  const W = 1080, H = p.fmt === 'story' ? 1920 : 1080; cv.width = W; cv.height = H;
  try { if (document.fonts && document.fonts.load) await Promise.all([document.fonts.load(PF(800, 40)), document.fonts.load(PF(600, 30))]); } catch (e) {}
  const ctx = cv.getContext('2d'); if (job !== pstBusy) return;
  bg(ctx, W, H, th);
  const tall = H > W;
  if (p.tpl === 'car') {
    const c = S.cars.find(x => x.id === p.carId); if (!c) return;
    const im = await pImg(c.photos && c.photos.length ? photoSrc(c.photos[Math.min(p.photo, c.photos.length - 1)]) : ''); if (job !== pstBusy) return;
    pill2(ctx, (p.head || L2.badge).toUpperCase(), 60, tall ? 60 : 48, th.A === th.bg1 ? '#fff' : th.A, th.A === th.bg1 ? th.A : '#fff', 30);
    const py = tall ? 150 : 130, ph = tall ? 900 : 420; cover(ctx, im, 60, py, W - 120, ph, 36);
    let y = py + ph + (tall ? 110 : 70);
    ctx.fillStyle = th.ink; const name = carLabel(c); fitFont(ctx, name, 800, tall ? 76 : 62, W - 120, 36); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(name, 60, y);
    y += tall ? 60 : 45; ctx.font = PF(600, tall ? 38 : 32); ctx.fillStyle = th.muted; ctx.fillText(carSub(c, L2), 60, y);
    const priceTxt = p.showPrice && num(c.askPrice) ? rs(c.askPrice) : L2.ask;
    y += tall ? 100 : 80; ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; fitFont(ctx, priceTxt, 800, tall ? 92 : 70, W - 120, 36); ctx.fillText(priceTxt, 60, y);
    if (tall) { const hl = String(c.features || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 3); ctx.font = PF(600, 34); let yy = y + 70; hl.forEach(h => { ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; ctx.fillText('✓', 60, yy); ctx.fillStyle = th.ink; ctx.fillText(h, 110, yy); yy += 54; }); }
  } else if (p.tpl === 'stock') {
    const cars = p.carIds.map(id => S.cars.find(c => c.id === id)).filter(Boolean).slice(0, 4);
    ctx.fillStyle = th.ink; fitFont(ctx, p.head || L2.stock, 800, tall ? 84 : 66, W - 120, 36); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(p.head || L2.stock, 60, tall ? 150 : 120);
    ctx.fillStyle = th.A === th.bg1 ? '#fff' : th.A; rr(ctx, 60, tall ? 180 : 142, 140, 10, 5); ctx.fill();
    const top = tall ? 240 : 180, gap = 30, cols = 2, rows = cars.length > 2 ? 2 : 1;
    const cw = (W - 120 - gap) / cols, avail = (tall ? H - 330 - 240 : H - 290 - 180) - gap * (rows - 1), ch = avail / rows;
    const imgs = await Promise.all(cars.map(c => pImg(c.photos && c.photos.length ? photoSrc(c.photos[0]) : ''))); if (job !== pstBusy) return;
    cars.forEach((c, i) => { const x = 60 + (i % cols) * (cw + gap), y = top + Math.floor(i / cols) * (ch + gap);
      ctx.fillStyle = th.card; rr(ctx, x, y, cw, ch, 28); ctx.fill();
      const ih = ch - (tall ? 150 : 120); cover(ctx, imgs[i], x + 14, y + 14, cw - 28, ih - 14, 20);
      ctx.fillStyle = th.ink; fitFont(ctx, carLabel(c), 800, 34, cw - 40, 20); ctx.textAlign = 'left'; ctx.fillText(carLabel(c), x + 22, y + ih + 44);
      ctx.font = PF(800, 32); ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; ctx.fillText(p.showPrice && num(c.askPrice) ? rs(c.askPrice) : L2.ask, x + 22, y + ih + 88); });
    if (!cars.length) { ctx.font = PF(600, 36); ctx.fillStyle = th.muted; ctx.fillText('—', 60, top + 60); }
  } else if (p.tpl === 'delivery') {
    const d = S.deals.find(x => x.id === p.dealId); if (!d) return;
    const car = carOf(d); const carName = car ? carLabel(car) : (d.vehicle?.model || '');
    const im = await pImg(d.buyerPhoto || (car && car.photos && car.photos.length ? photoSrc(car.photos[0]) : '')); if (job !== pstBusy) return;
    const rnd = plRand(d.id); ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#8B5CF6'].forEach(c => { for (let i = 0; i < 9; i++) { ctx.fillStyle = c; ctx.globalAlpha = .75; ctx.save(); ctx.translate(rnd() * W, rnd() * (H * .55)); ctx.rotate(rnd() * 3); ctx.fillRect(-9, -4, 18, 8); ctx.restore(); } }); ctx.globalAlpha = 1;
    const cg = { en: 'Congratulations!', hi: 'बधाई हो!', mr: 'हार्दिक अभिनंदन!' }[p.lang], on = { en: 'on your new {c}', hi: 'नई {c} के लिए', mr: 'नवीन {c} बद्दल' }[p.lang].replace('{c}', carName);
    const thx = { en: 'Thank you for choosing {s}', hi: '{s} को चुनने के लिए धन्यवाद', mr: '{s} निवडल्याबद्दल धन्यवाद' }[p.lang].replace('{s}', S.shop.name || '');
    ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; fitFont(ctx, cg, 800, tall ? 92 : 72, W - 120, 36); ctx.fillText(cg, W / 2, tall ? 170 : 110);
    const sz = tall ? 760 : 430, px = (W - sz) / 2, py = tall ? 230 : 145; ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; rr(ctx, px - 10, py - 10, sz + 20, sz + 20, 44); ctx.fill(); cover(ctx, im, px, py, sz, sz, 36);
    ctx.fillStyle = th.ink; const nm = d.buyer?.name || ''; fitFont(ctx, nm, 800, tall ? 76 : 58, W - 120, 30); ctx.textAlign = 'center'; ctx.fillText(nm, W / 2, py + sz + (tall ? 110 : 75));
    ctx.font = PF(600, tall ? 40 : 32); ctx.fillStyle = th.muted; wrap(ctx, on, W / 2, py + sz + (tall ? 170 : 120), W - 160, 44, 1, 'center');
    if (tall) { ctx.font = PF(700, 36); ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; wrap(ctx, thx, W / 2, py + sz + 250, W - 160, 46, 2, 'center'); }
  } else if (p.tpl === 'fest') {
    const f = FESTS[p.fest] || FESTS.diwali; const greet = p.lang === 'en' ? f[1] : p.lang === 'hi' ? f[2] : f[3];
    const cy = tall ? 680 : 280, ms = tall ? 320 : 200; motif(ctx, f[0], W / 2, f[0] === 'kite' ? cy - ms * .35 : cy, f[0] === 'kite' ? ms * .8 : ms, th);
    ctx.fillStyle = th.ink; let gs = fitFont(ctx, greet, 800, tall ? 96 : 80, W - 140, 40); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const gy = wrap(ctx, greet, W / 2, cy + (tall ? 360 : 230), W - 140, gs * 1.15, 2, 'center');
    ctx.font = PF(600, tall ? 40 : 34); ctx.fillStyle = th.muted; wrap(ctx, p.msg || L2.sub, W / 2, gy + (tall ? 90 : 64), W - 200, tall ? 52 : 42, 2, 'center');
    ctx.font = PF(700, tall ? 36 : 30); ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; ctx.fillText(L2.from.replace('{s}', S.shop.name || ''), W / 2, gy + (tall ? 230 : 150));
  } else if (p.tpl === 'offer') {
    const title = p.offerT || L2.offerT, sub = p.offerS || L2.offerS;
    const cy = tall ? 520 : 330; ctx.save(); ctx.translate(W / 2, cy); ctx.rotate(-.06); ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; const two = (p.offerT || L2.offerT).length > 18; const bh = two ? 300 : 230; rr(ctx, -(W - 200) / 2, -bh / 2, W - 200, bh, 40); ctx.fill();
    ctx.fillStyle = th.style === 'bold' ? th.A : '#fff'; const ts = fitFont(ctx, title, 900, tall ? 110 : 96, W - 280, 40); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; wrap(ctx, title, 0, two ? -ts * .45 : 6, W - 280, ts * 1.05, 2, 'center'); ctx.restore();
    ctx.fillStyle = th.ink; ctx.font = PF(700, tall ? 46 : 38); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; wrap(ctx, sub, W / 2, cy + (tall ? 280 : 230), W - 160, tall ? 60 : 50, 2, 'center');
    if (p.valid) { ctx.font = PF(600, tall ? 34 : 30); ctx.fillStyle = th.muted; ctx.fillText(L2.valid.replace('{d}', fmtDate(p.valid)), W / 2, cy + (tall ? 400 : 330)); }
    const stock = S.cars.filter(c => c.status !== 'sold').length;
    if (stock) { const sy = tall ? cy + 560 : cy + (p.valid ? 400 : 340); ctx.font = PF(800, tall ? 64 : 52); ctx.fillStyle = th.style === 'bold' ? '#fff' : th.A; ctx.fillText(stock + '+', W / 2, sy); ctx.font = PF(600, tall ? 32 : 28); ctx.fillStyle = th.muted; ctx.fillText(p.lang === 'en' ? 'cars ready to drive home' : p.lang === 'hi' ? 'गाड़ियां घर ले जाने को तैयार' : 'गाड्या घरी नेण्यासाठी तयार', W / 2, sy + (tall ? 50 : 42)); }
  }
  footer(ctx, W, H, th, p, L2);
}
function pstBlob() { return new Promise(res => $('#pstCanvas').toBlob(res, 'image/png')); }
const pstName = () => `poster-${ui.pst.tpl}-${today()}.png`;
async function pstDownload() { const b = await pstBlob(); if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = pstName(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); }
async function pstShare() {
  const b = await pstBlob(); if (!b) return; const file = new File([b], pstName(), { type: 'image/png' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: (S.shop.name || '') + ' – ' + publicUrl() }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  await pstDownload(); toast(t('pst_share_na'));
}

const IC_PST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>';
const IC_MORE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>';
Object.assign(T, { nav_more:['अधिक','More'] });
const k_unread = () => (typeof unreadTotal === 'function' && featOn('wa') && unreadTotal() ? `<span class="ubadge navb2">${unreadTotal()}</span>` : '');
function openMore() {
  const MAIN = ['dashboard', 'cars', 'leads', 'deals'];
  openSheet(head(t('nav_more')) + `<div class="more-grid">${routes().filter(x => !MAIN.includes(x[0])).map(([k, l, i]) => `<a class="more-it" href="#${k}" onclick="closeSheet()">${i}<span>${t(l)}</span>${k === 'wa' ? k_unread() : ''}</a>`).join('')}</div>`);
}

