/* ================= number plate scan + RC details (car form) ================= */
Object.assign(T, {
  rc_scan:['📷 नंबर प्लेट स्कॅन करा','📷 Scan number plate'], rc_fill:['🔎 RC वरून माहिती भरा','🔎 Fill from RC'],
  rc_parivahan:['mParivahan मध्ये पाहा ↗','Check on Parivahan ↗'], rc_copied:['नंबर कॉपी केला – Parivahan मध्ये पेस्ट करा','Number copied – paste it on Parivahan'],
  rc_reading:['नंबर वाचत आहे…','Reading the number…'], rc_read_ok:['नंबर सापडला: {n} – एकदा तपासा','Number found: {n} – please check it'],
  rc_read_fail:['नंबर वाचता आला नाही – हाताने टाका','Couldn’t read the number – please type it'],
  rc_loading:['RC माहिती आणत आहे…','Getting RC details…'], rc_filled:['RC माहिती भरली – एकदा तपासा','RC details filled – please check them'],
  rc_left:['या महिन्यात {n} RC तपासण्या बाकी','{n} RC lookups left this month'],
  rc_err_reg:['आधी बरोबर गाडी नंबर टाका','Enter a valid vehicle number first'], rc_err_nf:['या नंबरची RC माहिती मिळाली नाही','No RC details found for this number'],
  rc_err_limit:['या महिन्याच्या RC तपासण्या संपल्या – प्लॅन वाढवा','This month’s RC lookups are used up – upgrade your plan'],
  rc_err_plan:['RC माहिती तुमच्या प्लॅनमध्ये नाही','RC details aren’t part of your plan'], rc_err_fail:['RC सेवा सध्या मिळत नाही – नंतर प्रयत्न करा','RC service isn’t available right now – try later'],
  rc_consent:['विक्रेत्याच्या परवानगीनेच RC तपासा; माहिती फक्त या खरेदीसाठी वापरा.','Check RC only with the seller’s consent, and use the details only for this purchase.'],
  rc_loan:['⚠ या गाडीवर कर्ज आहे: {f}','⚠ This car has a loan: {f}'], rc_blacklist:['⚠ ही गाडी ब्लॅकलिस्टेड आहे','⚠ This vehicle is blacklisted'], rc_inactive:['⚠ RC स्थिती: {s}','⚠ RC status: {s}'],
  rc_owner:['RC मालक','RC owner'], rc_regd:['नोंदणी','Registered'], rc_per_month:['RC तपासण्या / महिना (0 = बंद)','RC lookups / month (0 = off)'],
});
const RC_FREE_URL = 'https://vahan.parivahan.gov.in/nrservices/faces/user/citizen/searchstatus.xhtml'; // official "Know your vehicle" page
const OCR = { js: '/ocr/js/tesseract.min.js', workerPath: '/ocr/js/worker.min.js', corePath: '/ocr/core', langPath: '/ocr/lang' }; // own server, loaded only when a dealer taps Scan
const rcOn = () => !!(TEN && TEN.rc && TEN.rc.enabled);

function rcBar(c) {
  return `<div class="rc-bar"><label class="btn dark" title="${t('rc_card_tip')}">${t('rc_card_scan')}<input type="file" accept="image/*" multiple hidden onchange="rcCardScan(this)"></label>
    <label class="btn">${t('rc_scan')}<input type="file" accept="image/*" capture="environment" hidden onchange="rcScan(this)"></label>
    ${rcOn() ? `<button class="btn" type="button" onclick="rcLookup()">${t('rc_fill')}</button>` : ''}
    <button class="btn" type="button" onclick="rcFree()">${t('rc_parivahan')}</button>
    <span class="r-meta rc-status"><span>${t('rc_card_tip')}</span> <span id="rcStatus">${rcOn() ? t('rc_left', { n: Math.max(0, TEN.rc.limit - TEN.rc.used) }) : ''}</span></span></div>
    <div id="rcInfo"></div>`;
}

/* --- reading the plate --- */
const STATES = 'AN AP AR AS BR CG CH DD DL DN GA GJ HP HR JH JK KA KL LA LD MH ML MN MP MZ NL OD OR PB PY RJ SK TN TR TS UK UP WB'.split(' ');
const TO_L = { 0:'O', 1:'I', 2:'Z', 4:'A', 5:'S', 6:'G', 8:'B' }, TO_D = { O:'0', Q:'0', D:'0', U:'0', I:'1', L:'1', J:'1', Z:'2', S:'5', B:'8', G:'6', T:'7', A:'4' };
const asL = s => [...s].map(ch => /[A-Z]/.test(ch) ? ch : TO_L[ch]).join(''), asD = s => [...s].map(ch => /\d/.test(ch) ? ch : TO_D[ch]).join('');
// Finds an Indian registration number in OCR text, fixing the usual letter/digit mix-ups by position. Returns "MH20 DV 4521" or ''.
function plateFromText(text) { const r = plateParse(text); return r ? r.text : ''; }
function plateParse(text) {
  const s = String(text || '').toUpperCase().replace(/\bIND\b/g, ' ').replace(/[^A-Z0-9]/g, '');
  const bh = s.match(/(\d{2})BH(\d{4})([A-Z]{1,2})/); if (bh) return { text: `${bh[1]} BH ${bh[2]} ${bh[3]}`, cost: 0 };
  const dl = s.match(/DL(\d{1,2})([CSEPRTVY])([A-Z]{1,2})(\d{4})/); if (dl) return { text: `DL${dl[1]}${dl[2]} ${dl[3]} ${dl[4]}`, cost: 0 }; // Delhi: DL 3C AB 1234 (C = vehicle class)
  for (let i = 0; i + 7 <= s.length; i++) {
    const st = asL(s.slice(i, i + 2)); if (st.length !== 2 || !STATES.includes(st)) continue;
    let best = null; // among the possible splits, keep the one that needs the fewest letter/digit fixes
    for (const dl of [2, 1]) for (const sl of [2, 1, 3, 0]) {
      const raw = s.slice(i + 2, i + 6 + dl + sl), d = asD(raw.slice(0, dl)), se = asL(raw.slice(dl, dl + sl)), n = asD(raw.slice(dl + sl));
      if (raw.length !== 4 + dl + sl || d.length !== dl || se.length !== sl || !/^\d{4}$/.test(n) || !Number(d)) continue;
      // cost = fixes (a fix inside the last 4 digits counts more) + how unusual the shape is (1-digit district, 3 or 0 series letters)
      const fixes = [...(d + se + n)].reduce((a, ch, k) => a + (ch === raw[k] ? 0 : k >= dl + sl ? 1.5 : 1), 0) + (dl === 1 ? 1.5 : 0) + (sl === 3 ? 1 : sl === 0 ? 1 : 0);
      if (!best || fixes < best.cost) best = { cost: fixes, text: `${st}${d}${se ? ' ' + se : ''} ${n}` };
    }
    if (best) return best;
  }
  return null;
}
let tessP = null;
function loadTess() {
  return tessP || (tessP = new Promise((ok, no) => {
    if (window.Tesseract) return ok(window.Tesseract);
    const sc = document.createElement('script'); sc.src = OCR.js; sc.onload = () => ok(window.Tesseract); sc.onerror = () => { tessP = null; no(new Error('ocr')); }; document.head.appendChild(sc);
  }));
}
// grey + stretch contrast + scale (+ optional small rotation), which helps OCR on phone photos
async function loadImg(file) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = URL.createObjectURL(file); }); }
function prepPlate(img, deg = 0) {
  const sc = Math.min(1, 1600 / Math.max(img.width, img.height)), w = Math.round(img.width * sc), h = Math.round(img.height * sc);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.translate(w / 2, h / 2); g.rotate(deg * Math.PI / 180); g.drawImage(img, -w / 2, -h / 2, w, h); g.setTransform(1, 0, 0, 1, 0, 0);
  const d = g.getImageData(0, 0, w, h), px = d.data; let lo = 255, hi = 0;
  for (let i = 0; i < px.length; i += 4) { const v = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114; px[i] = v; if (v < lo) lo = v; if (v > hi) hi = v; }
  const k = 255 / Math.max(1, hi - lo); for (let i = 0; i < px.length; i += 4) { const v = (px[i] - lo) * k; px[i] = px[i + 1] = px[i + 2] = v; }
  g.putImageData(d, 0, 0); return cv;
}
// Returns the plate ("MH20 DV 4521") or ''. Tries a few reading modes and small tilts until a valid number turns up.
async function readPlate(file) {
  if (window.PLATE_OCR) return plateFromText(await window.PLATE_OCR(file)); // tests / demo hook
  const Tess = await loadTess(); const img = await loadImg(file);
  const worker = await Tess.createWorker('eng', 1, { workerPath: OCR.workerPath, corePath: OCR.corePath, langPath: OCR.langPath, gzip: true });
  const votes = {};
  try {
    await worker.setParameters({ tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ' });
    for (const [psm, deg] of [['3', 0], ['6', 0], ['6', -2], ['6', 2], ['6', -4], ['6', 4], ['6', -6], ['6', 6], ['6', -8], ['6', 8], ['6', -11], ['6', 11], ['11', 0]]) {
      await worker.setParameters({ tessedit_pageseg_mode: psm });
      const { data } = await worker.recognize(prepPlate(img, deg)); const r = plateParse(data.text);
      if (!r || r.cost > 2.5) continue;
      const v = votes[r.text] = votes[r.text] || { text: r.text, n: 0, cost: r.cost }; v.n++; v.cost = Math.min(v.cost, r.cost);
      if (v.n >= 2) return v.text; // two different readings agree – trust it
    }
    // nothing agreed: take the reading seen most, then the cleanest (the dealer still checks the number)
    const all = Object.values(votes).sort((a, b) => b.n - a.n || a.cost - b.cost); return all.length ? all[0].text : '';
  } finally { worker.terminate(); URL.revokeObjectURL(img.src); }
}
async function rcScan(inp) {
  const file = inp.files && inp.files[0]; inp.value = ''; if (!file) return;
  const st = $('#rcStatus'); if (st) st.textContent = t('rc_reading');
  let plate = ''; try { plate = await readPlate(file); } catch (e) {}
  if (st) st.textContent = '';
  const reg = $('#f_reg');
  if (!plate) { toast(t('rc_read_fail')); if (reg) reg.focus(); return; }
  if (reg) { reg.value = plate; reg.dispatchEvent(new Event('input', { bubbles: true })); }
  toast(t('rc_read_ok', { n: plate }));
  if (rcOn()) rcLookup();
}

/* --- RC details --- */
const cleanMaker = s => String(s || '').replace(/\b(INDIA|PVT|PRIVATE|LTD|LIMITED|CO|COMPANY|CORPORATION|AUTOMOBILES?|MOTORS?|MOTOR|KIRLOSKAR|CARS?)\b\.?/gi, ' ').replace(/\s+/g, ' ').trim()
  .toLowerCase().replace(/(^|[\s&-])\S/g, m => m.toUpperCase());
const titleCase = s => String(s || '').toLowerCase().replace(/(^|[\s/-])\S/g, m => m.toUpperCase());
async function rcLookup() {
  const regEl = $('#f_reg'); const reg = regEl ? regEl.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
  if (!/^([A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}|\d{2}BH\d{4}[A-Z]{1,2})$/.test(reg)) { toast(t('rc_err_reg')); if (regEl) regEl.focus(); return; }
  const st = $('#rcStatus'); if (st) st.textContent = t('rc_loading');
  let j; try { j = await api('POST', '/api/rc/lookup', { reg }); }
  catch (e) { if (st) st.textContent = ''; toast(t({ rc_nf:'rc_err_nf', rc_limit:'rc_err_limit', rc_plan:'rc_err_plan', rc_reg:'rc_err_reg' }[e.error] || (e.code === 402 ? 't_exp_short' : 'rc_err_fail'))); return; }
  if (TEN) TEN.rc = { enabled: j.enabled, limit: j.limit, used: j.used };
  if (st) st.textContent = t('rc_left', { n: Math.max(0, j.limit - j.used) });
  rcApply(j.rc); toast(t('rc_filled'));
}
function rcApply(rc) {
  const fresh = !!(carDraft && carDraft._new);
  const setF = (k, v) => { const el = $('#f_' + k); if (!el || v === '' || v == null) return; if (!fresh && el.value.trim() && !(k === 'fuel')) return; el.value = v; };
  setF('company', cleanMaker(rc.company)); setF('model', rc.model); setF('year', rc.year); setF('color', titleCase(rc.color));
  if (rc.fuel && (fresh || !carDraft.fuel || carDraft.fuel === 'petrol')) setF('fuel', rc.fuel);
  setF('ownerNo', rc.ownerNo); setF('chassis', rc.chassis); setF('engine', rc.engine); setF('insurance', rc.insurance); setF('tax', rc.tax);
  setF('finance', rc.finance === 'Yes' ? t('yes') : rc.finance); setF('buyFrom', titleCase(rc.owner));
  const box = $('#rcInfo'); if (!box) return;
  box.innerHTML = `<div class="rc-info">${rc.finance ? `<b class="rc-warn">${t('rc_loan', { f: esc(rc.finance === 'Yes' ? t('yes') : rc.finance) })}</b>` : ''}${rc.blacklisted ? `<b class="rc-warn">${t('rc_blacklist')}</b>` : ''}${rc.rcStatus && !/^active$/i.test(rc.rcStatus) ? `<b class="rc-warn">${t('rc_inactive', { s: esc(rc.rcStatus) })}</b>` : ''}
    <span>${t('rc_owner')}: <b>${esc(titleCase(rc.owner) || '—')}</b>${rc.ownerNo ? ' · ' + esc(String(rc.ownerNo)) : ''}</span>
    <span>${[rc.regDate ? t('rc_regd') + ': ' + esc(rc.regDate) : '', esc(rc.rto || ''), esc(rc.vehicleClass || '')].filter(Boolean).join(' · ')}</span>
    <small class="r-meta">${t('rc_consent')}</small></div>`;
}
async function rcFree() {
  const reg = ($('#f_reg') || {}).value || '';
  if (reg.trim()) { try { await navigator.clipboard.writeText(reg.toUpperCase().replace(/[^A-Z0-9]/g, '')); toast(t('rc_copied')); } catch (e) {} }
  window.open(RC_FREE_URL, '_blank', 'noopener');
}
