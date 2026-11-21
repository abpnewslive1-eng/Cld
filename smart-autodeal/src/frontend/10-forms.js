/* ================= forms ================= */
function field(f, obj) {
  const v = getP(obj, f.k) ?? f.def ?? '';
  const id = 'f_' + f.k.replace(/\./g, '_');
  let input;
  if (f.type === 'select') input = `<select id="${id}" data-k="${f.k}">${f.opts.map(([ov, olab]) => `<option value="${esc(ov)}" ${String(v) === String(ov) ? 'selected' : ''}>${esc(olab)}</option>`).join('')}</select>`;
  else if (f.type === 'textarea') input = `<textarea id="${id}" data-k="${f.k}">${esc(v)}</textarea>`;
  else input = `<input id="${id}" data-k="${f.k}" type="${f.type || 'text'}" ${f.type === 'number' ? 'inputmode="numeric" min="0"' : ''} ${f.type === 'tel' ? 'inputmode="tel"' : ''} value="${esc(v)}" ${f.req ? 'required' : ''}>`;
  return `<div class="f ${f.full ? 'full' : ''}"><label for="${id}">${t(f.l)}${f.req ? ' *' : ''}</label>${input}</div>`;
}
const group = (title, fs, obj) => `<fieldset><legend>${t(title)}</legend><div class="fields">${fs.map(f => field(f, obj)).join('')}</div></fieldset>`;
function readForm(base) { const o = clone(base); document.querySelectorAll('#sheet [data-k]').forEach(el => { let v = el.value.trim(); if (el.type === 'number') v = v === '' ? '' : num(v); setP(o, el.dataset.k, v); }); return o; }
/* An open sheet owns one history entry, so the phone's Back button (and the APK's) closes the sheet instead of leaving the page. */
let sheetHist = false, sheetBackTimer = 0, sheetHref = '';
function openSheet(html) {
  $('#sheet').oninput = null; $('#sheet').innerHTML = html; $('#overlay').classList.add('open'); document.body.style.overflow = 'hidden';
  if (sheetBackTimer) { clearTimeout(sheetBackTimer); sheetBackTimer = 0; if (location.href === sheetHref && history.state && history.state.sheet) { sheetHist = true; return; } } // closed and reopened at once: reuse its entry
  if (!sheetHist) { sheetHist = true; history.pushState({ sheet: 1 }, ''); }
}
function closeSheet(fromBack) {
  $('#overlay').classList.remove('open'); document.body.style.overflow = '';
  if (!sheetHist) return; sheetHist = false; if (fromBack === true) return;
  const here = sheetHref = location.href; // drop our entry, unless the caller already navigated somewhere else
  sheetBackTimer = setTimeout(() => { sheetBackTimer = 0; if (location.href === here && history.state && history.state.sheet) history.back(); }, 0);
}
addEventListener('popstate', () => { if (sheetHist) closeSheet(true); });
$('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closeSheet(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
const head = title => `<div class="sheet-head"><h2 style="margin:0">${title}</h2><button class="btn ghost" onclick="closeSheet()" aria-label="${t('close')}">✕</button></div>`;
const delBtn = (col, id, conf) => isAdmin() ? `<button class="btn grow" onclick="if(confirm('${t(conf)}')){removeDoc('${col}','${id}');closeSheet()}">${t('delete')}</button>` : '';

/* car */
let carDraft = null;
function openCar(id) {
  const c = id ? clone(S.cars.find(x => x.id === id)) : { id: uid(), status: 'stock', buyDate: today(), fuel: 'petrol', expenses: [], photos: [], _new: true };
  c.expenses = c.expenses || [];
  if (num(c.repair)) { c.expenses.unshift({ date: c.buyDate || today(), type: 'repair', amount: num(c.repair), note: '' }); c.repair = 0; }
  c.photos = c.photos || []; c.hideOnline = c.hideOnline ? '1' : '';
  carDraft = c;
  openSheet(head(id ? t('car_info') : t('new_car')) + photosBlock(c) +
    group('g_car', [{ k:'reg', l:'reg', req:true }, { k:'company', l:'company' }, { k:'model', l:'model', req:true }, { k:'year', l:'year', type:'number' }, { k:'color', l:'color' }, { k:'fuel', l:'fuel', type:'select', opts: opts('fuel') }, { k:'km', l:'km_run', type:'number' }, { k:'ownerNo', l:'owner_no', type:'number' }], c) +
    group('g_papers', [{ k:'chassis', l:'chassis' }, { k:'engine', l:'engine' }, { k:'insurance', l:'insurance_till', type:'date' }, { k:'tax', l:'tax' }, { k:'finance', l:'finance_on_car', full:true }], c) +
    group('g_buy', [{ k:'buySource', l:'buy_source', type:'select', opts: buySrcOpts() }, { k:'buyFrom', l:'buy_from' }, { k:'buyFromPhone', l:'buy_from_phone', type:'tel' }], c) +
    group('g_price', [{ k:'buyDate', l:'buy_date', type:'date' }, { k:'buyPrice', l:'buy_price', type:'number' }, { k:'askPrice', l:'ask_price', type:'number' }, { k:'status', l:'status', type:'select', opts: opts('carSt') }, { k:'hideOnline', l:'show_online', type:'select', opts: [['', t('yes')], ['1', t('no')]] }, { k:'features', l:'features', type:'textarea', full:true }, { k:'note', l:'note', type:'textarea', full:true }], c) +
    `<fieldset><legend>${t('car_exp_title')}</legend><div class="exp-list" id="expList"></div>
      <div class="exp-row"><input id="exDate" type="date" value="${today()}" aria-label="${t('date')}"><select id="exType" aria-label="${t('type')}">${opts('carExp').map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select><input id="exNote" placeholder="${t('exp_note_ph')}" aria-label="${t('note')}"><input id="exAmt" type="number" inputmode="numeric" placeholder="${t('amount')}" aria-label="${t('amount')}"><button class="btn" type="button" onclick="addCarExp()">${t('add')}</button></div>
    </fieldset>
    <div class="calc" id="carCalc"></div>
    ${qrBlock(c, !id)}
    <div class="sheet-foot">${id ? delBtn('cars', c.id, 'confirm_del_car') : ''}${id ? `<button class="btn" onclick="openPoster('${c.id}')">${t('pst_make')}</button>` : ''}<button class="btn" onclick="closeSheet()">${t('cancel')}</button><button class="btn primary" onclick="saveCar()">${t('save_car')}</button></div>`);
  $('#sheet').oninput = updCar; renderExp(); renderPhotos();
}
function renderExp() {
  $('#expList').innerHTML = carDraft.expenses.length ? carDraft.expenses.map((e, i) => `<div class="item"><span>${fmtDate(e.date)} · ${esc(ol('carExp', e.type))}${e.note ? ' · ' + esc(e.note) : ''}</span><span><b>${rs(e.amount)}</b> <button class="btn small ghost" type="button" onclick="carDraft.expenses.splice(${i},1);renderExp()" aria-label="${t('delete')}">✕</button></span></div>`).join('') : `<p class="empty" style="padding:2px 0">${t('no_car_exp')}</p>`;
  updCar();
}
function addCarExp() {
  const amt = num($('#exAmt').value); if (!amt) { toast(t('enter_exp_amt')); return; }
  carDraft.expenses.push({ date: $('#exDate').value || today(), type: $('#exType').value, amount: amt, note: $('#exNote').value.trim() });
  $('#exAmt').value = ''; $('#exNote').value = ''; renderExp();
}
function updCar() { const o = readForm(carDraft); $('#carCalc').innerHTML = `${t('car_calc', { a: rs(o.buyPrice), b: rs(carExp(o)) })} <b>${rs(carCost(o))}</b> · ${t('exp_profit')} <b style="color:var(--ok)">${rs(num(o.askPrice) - carCost(o))}</b>`; }
async function saveCar() {
  const o = readForm(carDraft);
  if (!o.reg || !o.model) { toast(t('need_reg_model')); return; }
  o.reg = o.reg.toUpperCase();
  const removed = o._removed || []; delete o._removed; delete o._new; o.hideOnline = !!o.hideOnline;
  if (await save('cars', o)) { removed.forEach(pid => api('DELETE', '/api/photos/' + encodeURIComponent(pid)).catch(() => {})); closeSheet(); toast(t('car_saved')); }
}

/* lead */
function openLead(id) {
  const l = id ? { ...clone(S.leads.find(x => x.id === id)) } : { id: uid(), status: 'new', source: 'walkin', followUp: today() };
  l.dnc = l.dnc ? '1' : '';
  const chat = id && S.chats.find(c => c.leadId === id || c.phone === waNum(l.phone));
  const carOpts = [['', t('choose')], ...S.cars.filter(c => c.status !== 'sold').map(c => { const s = carLabel(c) + ' (' + c.reg + ')'; return [s, s]; })];
  if (l.interest && !carOpts.some(o => o[0] === l.interest)) carOpts.push([l.interest, l.interest]);
  openSheet(head(id ? t('cust_info') : t('new_cust')) + group('g_cust', [
    { k:'name', l:'name', req:true }, { k:'phone', l:'phone', type:'tel', req:true },
    { k:'source', l:'source', type:'select', opts: opts('source') }, { k:'status', l:'status', type:'select', opts: opts('leadSt') },
    { k:'interest', l:'liked_car', type:'select', opts: carOpts }, { k:'budget', l:'budget', type:'number' },
    { k:'followUp', l:'next_followup', type:'date' }, { k:'address', l:'village' }, { k:'dnc', l:'dnc', type:'select', opts: [['', t('no')], ['1', t('yes')]] }, { k:'note', l:'note', type:'textarea', full:true }], l) +
    `<div class="sheet-foot">${id ? delBtn('leads', l.id, 'confirm_del_lead') + (chat ? `<button class="btn" onclick="closeSheet();ui.waTab='inbox';ui.waFilter='open';ui.waChat='${chat.id}';location.hash='wa';render()">💬 ${t('open_chat')}</button>` : '') + `<button class="btn" onclick="closeSheet();openDeal(null,'${l.id}')">${t('make_receipt')}</button>` : ''}<button class="btn" onclick="closeSheet()">${t('cancel')}</button><button class="btn primary" onclick="saveLead('${l.id}',${!!id})">${t('save_cust')}</button></div>`);
}
async function saveLead(id, existing) {
  const o = readForm(existing ? S.leads.find(x => x.id === id) : { id });
  o.dnc = o.dnc === '1' || o.dnc === true;
  if (!o.name || !o.phone) { toast(t('need_name_phone')); return; }
  if (await save('leads', o)) { closeSheet(); toast(t('cust_saved')); }
}

/* shop expense */
function openExp(id) {
  const e = id ? S.expenses.find(x => x.id === id) : { id: uid(), date: today(), category: 'rent' };
  openSheet(head(id ? t('edit_exp') : t('new_exp')) + group('g_exp', [{ k:'category', l:'type', type:'select', opts: opts('shopExp') }, { k:'amount', l:'amount', type:'number', req:true }, { k:'date', l:'date', type:'date' }, { k:'note', l:'note' }], e) +
    `<div class="sheet-foot">${id ? delBtn('expenses', e.id, 'confirm_del_exp') : ''}<button class="btn" onclick="closeSheet()">${t('cancel')}</button><button class="btn primary" onclick="saveExp('${e.id}',${!!id})">${t('save_exp')}</button></div>`);
}
async function saveExp(id, existing) {
  const o = readForm(existing ? S.expenses.find(x => x.id === id) : { id });
  if (!num(o.amount)) { toast(t('need_amt')); return; }
  if (await save('expenses', o)) { closeSheet(); toast(t('exp_saved')); }
}

/* deal */
let sigPads = {}, dealDraft = null;
function fillVehicle(d, c) { d.vehicle = { reg: c.reg || '', model: c.model || '', color: c.color || '', company: c.company || '', chassis: c.chassis || '', engine: c.engine || '', insurance: c.insurance ? fmtDate(c.insurance) : '', tax: c.tax || '', finance: c.finance || '' }; }
function openDeal(id, leadId) {
  let d;
  if (id) d = clone(S.deals.find(x => x.id === id));
  else {
    const l = leadId ? S.leads.find(x => x.id === leadId) : null;
    d = { id: uid(), receiptNo: nextReceipt(), date: today(), time: new Date().toTimeString().slice(0, 5), place: S.shop.name,
      buyer: { name: l?.name || '', phone: l?.phone || '', address: l?.address || '' },
      seller: { name: S.shop.owner || S.shop.name, phone: S.shop.phone, address: S.shop.address, occupation: 'वाहन व्यवसाय' },
      vehicle: {}, payments: [], leadId: leadId || '' };
    if (l?.interest) { const c = S.cars.find(c => c.reg && l.interest.includes(c.reg)); if (c) { d.carId = c.id; fillVehicle(d, c); d.dealAmount = c.askPrice; } }
  }
  dealDraft = d;
  const carOpts = [['', t('choose_stock')], ...S.cars.filter(c => c.status !== 'sold' || c.id === d.carId).map(c => [c.id, carLabel(c) + ' · ' + c.reg])];
  openSheet(head(t('dn_title', { n: esc(d.receiptNo) })) +
    group('g_buyer', [{ k:'buyer.name', l:'name', req:true }, { k:'buyer.age', l:'age', type:'number' }, { k:'buyer.occupation', l:'occupation' }, { k:'buyer.phone', l:'phone', type:'tel' }, { k:'buyer.address', l:'address', full:true }], d) +
    group('g_seller', [{ k:'seller.name', l:'name' }, { k:'seller.age', l:'age', type:'number' }, { k:'seller.occupation', l:'occupation' }, { k:'seller.phone', l:'phone', type:'tel' }, { k:'seller.address', l:'address', full:true }], d) +
    group('g_vehicle', [{ k:'carId', l:'from_stock', type:'select', opts: carOpts, full:true }, { k:'vehicle.reg', l:'reg' }, { k:'vehicle.model', l:'model' }, { k:'vehicle.color', l:'color' }, { k:'vehicle.company', l:'company' }, { k:'vehicle.chassis', l:'chassis' }, { k:'vehicle.engine', l:'engine' }, { k:'vehicle.insurance', l:'insurance_till' }, { k:'vehicle.tax', l:'tax' }, { k:'vehicle.finance', l:'finance_on_car', full:true }], d) +
    group('g_deal', [{ k:'date', l:'date', type:'date' }, { k:'time', l:'time', type:'time' }, { k:'place', l:'place', full:true }, { k:'dealAmount', l:'deal_amt', type:'number', req:true }, { k:'cash', l:'cash_at', type:'number' }, { k:'dueDate', l:'due_date', type:'date' }, { k:'chequeNo', l:'cheque_no' }, { k:'chequeAmount', l:'cheque_amt', type:'number' }], d) +
    group('g_fin', [{ k:'finBank', l:'fin_bank' }, { k:'finFileNo', l:'fin_file' }, { k:'finAmount', l:'fin_amt', type:'number' }, { k:'finExpected', l:'fin_exp', type:'date' }], d) +
    `<div class="calc" id="dealCalc"></div>` +
    group('g_witness', [{ k:'w1.name', l:'witness1' }, { k:'w1.mobile', l:'mobile', type:'tel' }, { k:'w2.name', l:'witness2' }, { k:'w2.mobile', l:'mobile', type:'tel' }], d) +
    `<fieldset><legend>${t('g_photo')}</legend><div class="photo-row">
      <img id="buyerPhotoImg" class="photo-box" alt="${t('g_photo')}" ${d.buyerPhoto ? `src="${d.buyerPhoto}"` : 'hidden'}>
      <div id="buyerPhotoEmpty" class="photo-box empty-box" ${d.buyerPhoto ? 'hidden' : ''}>${t('no_photo')}</div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><label class="btn">${t('take_photo')}<input type="file" accept="image/*" capture="environment" hidden onchange="takeBuyerPhoto(this)"></label><button class="btn small ghost" type="button" onclick="clearBuyerPhoto()">${t('remove_photo')}</button></div>
    </div></fieldset>
    <fieldset><legend>${t('g_sign')}</legend><p class="r-meta" style="margin:0 0 8px">${t('sign_help')}</p><div class="sigs">
      ${['sigBuyer', 'sigSeller'].map(s => `<div><div class="sig"><canvas id="${s}" aria-label="${t(s === 'sigBuyer' ? 'sign_buyer' : 'sign_seller')}"></canvas></div><div class="sig-cap">${t(s === 'sigBuyer' ? 'sign_buyer' : 'sign_seller')} <span class="sig-tools"><label class="btn small">${t('sign_photo')}<input type="file" accept="image/*" capture="environment" hidden onchange="sigPhoto('${s}',this)"></label><button class="btn small ghost" type="button" onclick="clearSig('${s}')">${t('erase')}</button></span></div></div>`).join('')}
    </div></fieldset>
    <div class="sheet-foot"><button class="btn" onclick="closeSheet()">${t('cancel')}</button><button class="btn primary" onclick="saveDeal(${!!id})">${t('save_receipt')}</button></div>`);
  const sel = $('#f_carId');
  sel.addEventListener('change', () => { const c = S.cars.find(x => x.id === sel.value); if (!c) return; const tmp = {}; fillVehicle(tmp, c);
    Object.entries(tmp.vehicle).forEach(([k, v]) => { const el = $('#f_vehicle_' + k); if (el) el.value = v ?? ''; });
    const amt = $('#f_dealAmount'); if (!num(amt.value)) amt.value = c.askPrice || ''; updCalc(); });
  const updCalc = () => { const o = readForm(dealDraft); const due = custDue(o);
    $('#dealCalc').innerHTML = `${t('calc_deal')} <b>${rs(o.dealAmount)}</b> · ${t('calc_cash')} <b>${rs(paidOf(o))}</b>${finAmt(o) ? ` · ${t('calc_loan')} <b>${rs(finAmt(o))}</b>` : ''} · ${t('calc_cust_due')} <b style="color:var(--brand)">${rs(due)}</b>
      <div class="words">${t('in_words')}: ${words(o.dealAmount) || '—'}${due ? '<br>' + t('due_in_words') + ': ' + words(due) : ''}</div>`; };
  $('#sheet').oninput = updCalc; updCalc();
  sigPads = {}; initSig('sigBuyer', d.sigBuyer); initSig('sigSeller', d.sigSeller);
}
function initSig(id, existing) {
  const cv = document.getElementById(id); const ratio = Math.min(2, devicePixelRatio || 1);
  const w = cv.clientWidth || 300, h = 130; cv.width = w * ratio; cv.height = h * ratio;
  const ctx = cv.getContext('2d'); ctx.scale(ratio, ratio); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#14213d';
  const pad = { cv, ctx, w, h, dirty: false, data: existing || '' };
  if (existing) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, w, h); im.src = existing; }
  let drawing = false, last = null;
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; pad.dirty = true; });
  const end = () => { drawing = false; }; cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  sigPads[id] = pad;
}
function clearSig(id) { const p = sigPads[id]; p.ctx.clearRect(0, 0, p.cv.width, p.cv.height); p.dirty = false; p.data = ''; }
function sigData(id) {
  const p = sigPads[id]; if (!p.dirty) return p.data;
  const c = document.createElement('canvas'); c.width = 720; c.height = 260; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 720, 260); x.drawImage(p.cv, 0, 0, 720, 260);
  return c.toDataURL('image/jpeg', 0.7);
}
function loadImg(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = r.result; }; r.onerror = rej; r.readAsDataURL(file); }); }
async function takeBuyerPhoto(inp) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  try {
    const im = await loadImg(f); const s = Math.min(1, 520 / Math.max(im.width, im.height));
    const c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    dealDraft.buyerPhoto = c.toDataURL('image/jpeg', 0.72);
    const img = $('#buyerPhotoImg'); img.src = dealDraft.buyerPhoto; img.hidden = false; $('#buyerPhotoEmpty').hidden = true;
  } catch (e) { toast(t('photo_err')); }
}
function clearBuyerPhoto() { dealDraft.buyerPhoto = ''; const img = $('#buyerPhotoImg'); img.removeAttribute('src'); img.hidden = true; $('#buyerPhotoEmpty').hidden = false; }
async function sigPhoto(id, inp) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  try {
    const im = await loadImg(f); const s = Math.min(1, 1100 / Math.max(im.width, im.height));
    const W = Math.round(im.width * s), H = Math.round(im.height * s);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
    const px = x.getImageData(0, 0, W, H), a = px.data; const lum = new Float32Array(W * H); let sum = 0;
    for (let i = 0; i < W * H; i++) { const v = 0.299 * a[i * 4] + 0.587 * a[i * 4 + 1] + 0.114 * a[i * 4 + 2]; lum[i] = v; sum += v; }
    const thr = (sum / (W * H)) * 0.62; const mx = Math.round(W * 0.03), my = Math.round(H * 0.03);
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { const i = y * W + xx; const ink = lum[i] < thr;
      a[i * 4] = ink ? 20 : 255; a[i * 4 + 1] = ink ? 33 : 255; a[i * 4 + 2] = ink ? 61 : 255; a[i * 4 + 3] = 255;
      if (ink && xx > mx && xx < W - mx && y > my && y < H - my) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    x.putImageData(px, 0, 0);
    if (x1 < 0) { toast(t('no_sign_found')); return; }
    const pd = 12; x0 = Math.max(0, x0 - pd); y0 = Math.max(0, y0 - pd); x1 = Math.min(W - 1, x1 + pd); y1 = Math.min(H - 1, y1 + pd);
    const cw = x1 - x0, ch = y1 - y0; const p = sigPads[id];
    const k = Math.min((p.w - 10) / cw, (p.h - 10) / ch); const dw = cw * k, dh = ch * k;
    p.ctx.clearRect(0, 0, p.cv.width, p.cv.height); p.ctx.fillStyle = '#fff'; p.ctx.fillRect(0, 0, p.w, p.h);
    p.ctx.drawImage(c, x0, y0, cw, ch, (p.w - dw) / 2, (p.h - dh) / 2, dw, dh);
    p.dirty = true; toast(t('sign_added'));
  } catch (e) { toast(t('photo_err')); }
}
async function saveDeal(existing) {
  const o = readForm(dealDraft);
  if (!o.buyer?.name || !num(o.dealAmount)) { toast(t('need_buyer_amt')); return; }
  o.sigBuyer = sigData('sigBuyer'); o.sigSeller = sigData('sigSeller');
  if (o.vehicle?.reg) o.vehicle.reg = o.vehicle.reg.toUpperCase();
  if (!(await save('deals', o))) return;
  if (o.carId) { const c = S.cars.find(x => x.id === o.carId); if (c && c.status !== 'sold') await save('cars', { ...c, status: 'sold', soldDate: o.date, salePrice: o.dealAmount }); }
  if (o.leadId) { const l = S.leads.find(x => x.id === o.leadId); if (l && l.status !== 'booked') await save('leads', { ...l, status: 'booked' }); }
  closeSheet(); toast(t('receipt_saved')); openDealView(o.id);
}
function openDealView(id) {
  const d = S.deals.find(x => x.id === id); if (!d) return;
  const due = custDue(d), p = profitOf(d), tt = today();
  openSheet(head(t('receipt_t', { n: esc(d.receiptNo) })) + `
    ${d.buyerPhoto ? `<img src="${d.buyerPhoto}" alt="${t('g_photo')}" class="photo-box" style="float:right;margin:0 0 8px 12px">` : ''}
    <div class="kv">
      <div><span>${t('buyer')}</span><b>${esc(d.buyer?.name)}</b></div><div><span>${t('phone')}</span><b>${esc(d.buyer?.phone || '—')}</b></div><div><span>${t('date')}</span><b>${fmtDate(d.date)}</b></div>
      <div><span>${t('car')}</span><b>${esc(d.vehicle?.model || '—')}</b></div><div><span>${t('number')}</span><b>${esc(d.vehicle?.reg || '—')}</b></div><div><span>${t('deal_amt')}</span><b>${rs(d.dealAmount)}</b></div>
      <div><span>${t('received')}</span><b>${rs(paidOf(d))}</b></div><div><span>${t('cust_due')}</span><b style="color:${due ? 'var(--brand)' : 'var(--ok)'}">${due ? rs(due) : t('done')}</b></div>${isAdmin() ? `<div><span>${t('profit')}</span><b>${p != null ? rs(p) : '—'}</b></div>` : ''}
    </div>
    ${(d.payments || []).length ? `<fieldset><legend>${t('instalments')}</legend>${d.payments.map(x => `<div class="r-meta">${fmtDate(x.date)} · <b style="color:var(--ink)">${rs(x.amount)}</b> ${esc(x.note || '')}</div>`).join('')}</fieldset>` : ''}
    ${finAmt(d) ? `<fieldset><legend>${t('g_loan')}</legend><div class="kv"><div><span>${t('bank')}</span><b>${esc(d.finBank || '—')}</b></div><div><span>${t('loan_amt')}</span><b>${rs(d.finAmount)}</b></div><div><span>${t('status')}</span><b style="color:${d.finReceived ? 'var(--ok)' : 'var(--brand)'}">${d.finReceived ? t('received_on', { d: fmtDate(d.finReceived) }) : (d.finExpected ? (d.finExpected < tt ? t('days_late', { n: daysBetween(d.finExpected, tt) }) : t('expected', { d: fmtDate(d.finExpected) })) : t('pending'))}</b></div></div>
      ${d.finReceived ? '' : `<div class="pay"><div class="f"><label for="finDate">${t('loan_recv_date')}</label><input id="finDate" type="date" value="${tt}"></div><button class="btn primary" onclick="markFinReceived('${d.id}')">${t('loan_received')}</button></div>`}</fieldset>` : ''}
    ${due ? `<fieldset><legend>${t('collect_due')}</legend><div class="pay"><div class="f"><label for="payAmt">${t('amount')}</label><input id="payAmt" type="number" inputmode="numeric" value="${due}"></div><div class="f"><label for="payDate">${t('date')}</label><input id="payDate" type="date" value="${tt}"></div><div class="f"><label for="payNote">${t('note')}</label><input id="payNote" placeholder="${t('pay_note_ph')}"></div><button class="btn primary" onclick="addPayment('${d.id}')">${t('collect')}</button></div></fieldset>` : ''}
    <div class="sheet-foot">
      ${delBtn('deals', d.id, 'confirm_del_deal')}
      ${d.buyer?.phone ? `<a class="btn" target="_blank" rel="noopener" href="${waDeal(d)}">${t('send_wa')}</a>` : ''}
      <button class="btn" onclick="closeSheet();openDeal('${d.id}')">${t('edit')}</button>
      <button class="btn primary" onclick="printDeal('${d.id}')">${t('print')}</button>
    </div>`);
}
async function addPayment(id) {
  const d = clone(S.deals.find(x => x.id === id)); const amt = num($('#payAmt').value);
  if (!amt) { toast(t('need_amt')); return; }
  d.payments = [...(d.payments || []), { date: $('#payDate').value || today(), amount: amt, note: $('#payNote').value.trim() }];
  if (await save('deals', d)) { toast(t('pay_saved')); openDealView(id); }
}
async function markFinReceived(id) {
  const d = clone(S.deals.find(x => x.id === id)); d.finReceived = $('#finDate').value || today();
  if (await save('deals', d)) { toast(t('loan_saved')); openDealView(id); }
}
function waDeal(d) {
  const due = custDue(d);
  const msg = `${S.shop.name}\n${t('receipt_t', { n: d.receiptNo })} | ${fmtDate(d.date)}\n\n${t('wa_hello')} ${d.buyer?.name || ''},\n${t('car')}: ${d.vehicle?.model || ''} (${d.vehicle?.reg || ''})\n${t('wa_deal')}: ${rs(d.dealAmount)}\n${t('wa_recv')}: ${rs(paidOf(d))}\n${due ? `${t('wa_due')}: ${rs(due)}${d.dueDate ? ' – ' + fmtDate(d.dueDate) + ' ' + t('wa_till') : ''}` : t('wa_full')}\n\n${S.shop.phone}`;
  return `https://wa.me/91${waNum(d.buyer.phone)}?text=${encodeURIComponent(msg)}`;
}

/* print – always the shop's Marathi paper format */
const DEFAULT_TERMS = [
  'गाडीची कुठल्याही प्रकारची गॅरंटी राहणार नाही.',
  'गाडीच्या पेपरची व गाडीची पूर्ण खात्री करुन व्यवहार करीत आहे.',
  'सदर ठरल्याप्रमाणे वेळेवर व्यवहार पूर्ण करीन अशी हमी आपणांस देत आहे.',
  'ठरलेल्या वेळेवर व्यवहाराची पुर्तता न केल्यास त्याची पेनल्टी देड देईल ती घेण्याचा आपणास पुर्ण अधिकार राहील. अशी कबूली देत असुन ते पुर्ण मान्य राहील.',
  'जोपर्यंत आपले व्यवहार पुर्ण करीत नाही तो पर्यंत गाडीची पुर्ण जबाबदारी गाडी घेणार यांची राहील. त्यास गाडी विकणार याचा कुठलाही प्रकारचा संबंध राहणार नाही. याची मी पुर्ण हमी देत आहे.',
  'जर मुदतीत रकमेची फेड झाली नाही किंवा इतर कोणत्याही कारणामुळे व्यवहार रद्द झाल्यास दिलेला इसार परत मांगण्याचा मला अधिकार नाही. सदर रकमेबद्दल कोणतीही मागणी करणार नाही. किंवा कोणताही कायदेशीर कार्यवाई करणार नाही. तसेच कुठल्याही प्रकारचा केस किंवा खटला करण्याचा मला अधिकार नाही.',
  'गाडीचा व्यवहार केल्यानंतर कुठलीही तक्रार मान्य केलीजाणार नाही.',
  'सदर राहिलेली रकमेच्या सिक्युरिटी पोटी आपणास चेक नं. {cheque} रुपये {chequeAmt} व स्टॅम्प देत आहे.',
  'सदर वाहन {reg} चा ठरलेल्या व्यवहार ठरलेल्या मुदतीत पूर्ण न केल्यास सदर वाहनाचा ताबा मागल त्या ठिकाणी तुम्हास देईल.',
  'सदर वाहनाचे आजपासुन पुढील काळाकरिता येणारे आर.टी.ओ.चे परवाने, इन्शुरन्स, टॅक्सेस वेळोवेळी भरीन.',
  'सदर नियम व अटी या मी वाचलेले असून त्या मला मान्य आहेत सर्व खात्री करुन घेऊन स्वखुशीने व्यवहार करीत आहे. सर्व नियम व अटींचे पालन करण्याची आपणांस हमी देऊन व्यवहार करीत आहे. कबुली पोटी खाली सही देत आहे.',
];
const PRINT_COLORS = { red:'#B3261E', blue:'#1E40AF', green:'#166534', black:'#111111', purple:'#6B21A8' };
const rcpt = () => ({ title: S.shop.printTitle || 'डिलिव्हरी नोट / पावती', banner: S.shop.printBanner ?? 'विक्री केलेली गाडी परत घेतली जाणार नाही.', color: PRINT_COLORS[S.shop.printColor] || PRINT_COLORS.red,
  terms: Array.isArray(S.shop.terms) && S.shop.terms.length ? S.shop.terms : DEFAULT_TERMS });
function printDeal(id) {
  const d = S.deals.find(x => x.id === id); const v = d.vehicle || {}; const due = custDue(d);
  const V = x => `<span class="v">${esc(x || ' ')}</span>`;
  const hdr = `<div class="hd"><div class="nm">${esc(S.shop.name)}</div><div class="ph">${S.shop.owner ? 'प्रो.प्रा. ' + esc(S.shop.owner) + '<br>' : ''}मो. ${esc(S.shop.phone)}</div></div><div class="addr">Address: ${esc(S.shop.address)}</div>`;
  const sig = (src, label) => `<div>${src ? `<img src="${src}" alt="">` : '<div style="height:56px;width:150px;border:1px solid var(--pc)"></div>'}<div>${label}</div></div>`;
  const dayName = d.date ? new Date(d.date).toLocaleDateString('mr-IN', { weekday: 'long' }) : '';
  const rem = num(d.dealAmount) - num(d.cash);
  const R = rcpt();
  const terms = R.terms.map(x => `<li>${esc(x).split('{cheque}').join(V(d.chequeNo)).split('{chequeAmt}').join(V(d.chequeAmount ? rs(d.chequeAmount) : '')).split('{reg}').join(V(v.reg))}</li>`).join('');
  $('#print').innerHTML = `
  <div class="pp" style="--pc:${R.color}">${hdr}
    <div style="display:flex;justify-content:space-between;align-items:center"><div>पावती क्र. <b style="font-size:20px;color:#111">${esc(d.receiptNo)}</b></div><div class="ttl"><span>${esc(R.title)}</span></div><div style="width:90px;text-align:right">${d.buyerPhoto ? `<img src="${d.buyerPhoto}" alt="" style="width:80px;height:98px;object-fit:cover;border:1.5px solid var(--pc)">` : ''}</div></div>
    <div class="ln">वाहन घेणाऱ्यांचे नाव: ${V(d.buyer?.name)} वय: ${V(d.buyer?.age)}</div>
    <div class="ln">व्यवसाय: ${V(d.buyer?.occupation)} पत्ता: ${V(d.buyer?.address)} फोन नं: ${V(d.buyer?.phone)}</div>
    <div class="ln">वाहन देणाऱ्यांचे नाव: ${V(d.seller?.name)} वय: ${V(d.seller?.age)}</div>
    <div class="ln">व्यवसाय: ${V(d.seller?.occupation)} पत्ता: ${V(d.seller?.address)} फोन नं: ${V(d.seller?.phone)}</div>
    <div class="ln">डिलिव्हरी व्यवहाराचे ठिकाण: ${V(d.place)} वेळ: ${V(d.time)}</div>
    <div class="ln">आज दि. ${V(fmtDate(d.date))} रोजी सदर वाहनाचा व्यवहार रुपये ${V(rs(d.dealAmount))} अक्षरी रुपये ${V(mrWords(d.dealAmount))} नक्की झालेला आहे.</div>
    <div class="ln">डिलेव्हरी गाडी ताब्यात येते वेळेस रोख रक्कम ${V(rs(d.cash))} अक्षरी रुपये ${V(mrWords(d.cash))} मिळाले आहे</div>
    <div class="ln">व राहीलेली रक्कम ${V(rs(rem))} अक्षरी रुपये ${V(mrWords(rem))} दिनांक: ${V(fmtDate(d.dueDate))} रोजी रोख देण्याचे ठरले आहे.</div>
    <p style="margin:6px 0">सदर वाहन खरेदीदार यांच्या ताब्यात खालील तपशीलाप्रमाणे आज रोजी मिळालेले आहे. सदर वाहनाबद्दल काही तक्रार नाही. सदर वाहनाची आज दि: ${V(fmtDate(d.date))} पासुन पुढील सर्व जबाबदारी वाहन खरेदीदार यांची राहील. सदर वाहनांमध्ये गैर वाहतूक व कोणत्याही प्रकारचे गैर काम आढळल्यास त्यास खरेदीदार पूर्णपणे जबाबदार राहील.</p>
    <div class="two">
      <div>1. वाहनाचा कलर ${V(v.color)}</div><div>2. रजिस्टर नंबर ${V(v.reg)}</div>
      <div>3. कंपनी ${V(v.company)}</div><div>4. वाहनाचे मॉडेल ${V(v.model)}</div>
      <div>5. चेसीस नंबर ${V(v.chassis)}</div><div>6. इंजिन नंबर ${V(v.engine)}</div>
      <div>7. इन्शुरंस ${V(v.insurance)}</div><div>8. टॅक्स ${V(v.tax)}</div>
      <div style="grid-column:1/-1">9. बँक लोन / फायनान्स ${V(v.finance)}</div>
    </div>
    <div style="display:flex;gap:18px;align-items:flex-start">
      <div class="box"><div>सौदा रक्कम रु.: <b style="color:#111">${rs(d.dealAmount)}</b></div><div>डिलेव्हरी (गाडी) ताब्यात घेतेवेळेस रक्कम रु.: <b style="color:#111">${rs(d.cash)}</b></div>
        ${(d.payments || []).map(x => `<div>${fmtDate(x.date)} जमा: <b style="color:#111">${rs(x.amount)}</b></div>`).join('')}
        ${finAmt(d) ? `<div>बँक लोन ${esc(d.finBank || '')} रु.: <b style="color:#111">${rs(d.finAmount)}</b>${d.finReceived ? ' (मिळाले)' : ''}</div>` : ''}
        <div>राहिलेली रक्कम रु.: <b style="color:#111">${rs(due)}</b></div></div>
      <div class="signrow" style="flex:1">${sig(d.sigSeller, 'लिहून देणार सही / अंगठा')}${sig(d.sigBuyer, 'लिहून घेणार सही / अंगठा')}</div>
    </div>
    <div class="two" style="margin-top:8px"><div>साक्षीदार 1. ${V(d.w1?.name)}</div><div>2. ${V(d.w2?.name)}</div><div>मोबाईल नं. ${V(d.w1?.mobile)}</div><div>मोबाईल नं. ${V(d.w2?.mobile)}</div></div>
  </div>
  <div class="pp" style="--pc:${R.color}">${hdr}
    <div class="ttl"><span>नियम व अटी</span></div>
    <ol>${terms}</ol>
    <div class="signrow"><div>दि. ${V(fmtDate(d.date))}<br>वार ${V(dayName)}</div>${sig(d.sigBuyer, 'घेणाराची सही')}${sig(d.sigSeller, 'देणाराची सही')}</div>
    ${R.banner ? `<div class="banner">${esc(R.banner)}</div>` : ''}
  </div>`;
  try { window.print(); } catch (e) { toast(t('print_err')); }
}



