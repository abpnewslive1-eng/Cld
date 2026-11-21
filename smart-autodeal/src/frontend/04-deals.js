/* ================= deals ================= */
function dealStatus(d) {
  const tt = today();
  if (custDue(d) && d.dueDate && d.dueDate < tt) return ['red', t('pill_overdue')];
  if (finPending(d) && d.finExpected && d.finExpected < tt) return ['red', t('pill_overdue')];
  if (custDue(d)) return ['amber', t('pill_due')];
  if (finPending(d)) return ['amber', t('pill_loan')];
  return ['green', t('pill_done')];
}
function dealRows() {
  const q = ui.dealQ.toLowerCase();
  return S.deals.filter(d => ui.dealFilter === 'all' || (ui.dealFilter === 'cust' ? custDue(d) > 0 : ui.dealFilter === 'loan' ? finPending(d) > 0 : dueOf(d) === 0))
    .filter(d => !q || [d.receiptNo, d.buyer?.name, d.buyer?.phone, d.vehicle?.reg, d.vehicle?.model].join(' ').toLowerCase().includes(q))
    .sort((a, b) => num(b.receiptNo) - num(a.receiptNo));
}
function viewDeals() {
  const list = dealRows();
  const cust = S.deals.filter(d => custDue(d) > 0), loan = S.deals.filter(d => finPending(d) > 0), done = S.deals.filter(d => dueOf(d) === 0);
  const cols = [{ h:t('c_receipt') }, { h:t('c_customer'), k:'main' }, { h:t('c_car'), k:'meta' }, { h:t('c_amount'), num:true, k:'side' }, { h:t('c_date') }, { h:t('c_payment') }, { h:t('c_status') }];
  const rows = list.map(d => { const [cls, label] = dealStatus(d);
    return { click:`openDealView('${d.id}')`, cells:[
      `<b>#${esc(d.receiptNo)}</b>`, `<div class="r-title">${esc(d.buyer?.name || '—')}</div><div class="r-meta">${esc(d.buyer?.phone || '')}</div>`,
      `${esc(d.vehicle?.model || '')} <span class="r-meta">${esc(d.vehicle?.reg || '')}</span>`, `<b>${rs(d.dealAmount)}</b>`, fmtDate(d.date),
      finAmt(d) ? `${t('pay_loan')} <span class="r-meta">${esc(d.finBank || '')}</span>` : t('pay_cash'), pill(cls, label)] }; });
  return `<div class="ph"><div><h1>${t('deals_title')}</h1><p class="sub">${t('deals_sub')}</p></div></div>
  <div class="scards">${scard('blue', t('sc_all_receipts'), S.deals.length, rs(S.deals.reduce((a, d) => a + num(d.dealAmount), 0)), 'dealFilter', 'all')}${scard('orange', t('sc_cust_due'), cust.length, rs(cust.reduce((a, d) => a + custDue(d), 0)), 'dealFilter', 'cust')}${scard('yellow', t('sc_loan_due'), loan.length, rs(loan.reduce((a, d) => a + finPending(d), 0)), 'dealFilter', 'loan')}${scard('green', t('sc_complete'), done.length, '', 'dealFilter', 'done')}</div>
  <div class="tcard">${toolbar('dealQ', 'search_deals', list.length, 'exportDeals', `<button class="btn dark" onclick="openDeal()">${IC.plus}${t('new_receipt').replace('+ ', '')}</button>`)}
    ${list.length ? table('deals', cols, rows) : `<p class="empty" style="padding:18px">${t('no_deals')}</p>`}</div>`;
}
function exportDeals() { downloadCSV('receipts', [t('c_receipt'), t('date'), t('buyer'), t('phone'), t('model'), t('reg'), t('deal_amt'), t('received'), t('loan_amt'), t('fin_bank'), t('cust_due'), t('c_status'), ...(isAdmin() ? [t('profit')] : [])],
  dealRows().map(d => [d.receiptNo, d.date, d.buyer?.name, d.buyer?.phone, d.vehicle?.model, d.vehicle?.reg, d.dealAmount, paidOf(d), d.finAmount, d.finBank, custDue(d), dealStatus(d)[1], ...(isAdmin() ? [profitOf(d) ?? ''] : [])])); }

/* ================= expenses ================= */
function expRows() {
  const ym = ui.expMonth || today().slice(0, 7); const q = ui.expQ.toLowerCase();
  return S.expenses.filter(e => (e.date || '').startsWith(ym)).filter(e => !q || [ol('shopExp', e.category), e.note].join(' ').toLowerCase().includes(q)).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
function viewExpenses() {
  const ym = ui.expMonth || today().slice(0, 7);
  const all = S.expenses.filter(e => (e.date || '').startsWith(ym)); const list = expRows();
  const total = all.reduce((a, e) => a + num(e.amount), 0);
  const byCat = {}; all.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + num(e.amount); });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const carExpMonth = S.cars.reduce((a, c) => a + (c.expenses || []).filter(e => (e.date || '').startsWith(ym)).reduce((x, e) => x + num(e.amount), 0), 0);
  const info = (color, label, value, sub) => `<div class="scard ${color}" style="cursor:default"><span class="sc-top">${label}</span><span class="sc-body"><b>${value}</b><small>${sub}</small></span></div>`;
  const cols = [{ h:t('c_type'), k:'main' }, { h:t('c_note'), k:'meta' }, { h:t('c_date') }, { h:t('c_amount'), num:true, k:'side' }];
  const rows = list.map(e => ({ click:`openExp('${e.id}')`, cells:[`<span class="r-title">${esc(ol('shopExp', e.category))}</span>`, esc(e.note || '—'), fmtDate(e.date), `<b>${rs(e.amount)}</b>`] }));
  return `<div class="ph"><div><h1>${t('exp_title')}</h1><p class="sub">${t('exp_sub')}</p></div>
    <div class="ph-actions"><label class="count" for="expMonth">${t('month')}</label><input id="expMonth" class="search" style="flex:none;min-width:0" type="month" value="${ym}" onchange="ui.expMonth=this.value;render()"></div></div>
  <div class="scards">${info('blue', t('sc_shop'), rs(total), '')}${info('orange', t('sc_carexp'), rs(carExpMonth), '')}${info('yellow', t('sc_biggest'), top ? rs(top[1]) : '—', top ? esc(ol('shopExp', top[0])) : '')}${info('green', t('sc_entries'), all.length, '')}</div>
  <div class="tcard">${toolbar('expQ', 'c_note', list.length, 'exportExp', `<button class="btn dark" onclick="openExp()">${IC.plus}${t('add_expense').replace('+ ', '')}</button>`)}
    ${list.length ? table('exp', cols, rows) : `<p class="empty" style="padding:18px">${t('no_exp')}</p>`}</div>`;
}
function exportExp() { downloadCSV('expenses', [t('date'), t('type'), t('note'), t('amount')], expRows().map(e => [e.date, ol('shopExp', e.category), e.note, e.amount])); }

/* ================= settings page ================= */
let usersCache = null;
function viewSettings() {
  const sw = Object.entries(ACCENTS).map(([k, c]) => `<button class="swatch" style="background:${c}" aria-pressed="${pref.accent === k}" aria-label="${t('col_' + k)}" title="${t('col_' + k)}" onclick="setPref('accent','${k}')"></button>`).join('');
  const th = ['light', 'dark', 'auto'].map(k => `<button aria-pressed="${pref.theme === k}" onclick="setPref('theme','${k}')">${t('th_' + k)}</button>`).join('');
  const appearance = `<div class="card"><h2>${t('set_appearance')}</h2><p class="sub">${t('set_appearance_sub')}</p>
    <div class="opt-row"><span>${t('language')}</span>${langSwitch()}</div>
    <div class="opt-row"><span>${t('theme')}</span><span class="lang-switch" role="group">${th}</span></div>
    <div class="opt-row"><span>${t('accent')}</span><div class="swatches">${sw}</div></div></div>`;
  const account = `<div class="card"><h2>${t('set_account')}</h2><p class="sub">${t('signed_as', { n: esc(me.name) + ' (' + esc(me.username) + ')', r: ol('role', me.role) })}</p>
    <div class="fields"><div class="f"><label for="op">${t('old_pass')}</label><input id="op" type="password" autocomplete="current-password"></div><div class="f"><label for="np">${t('new_pass')}</label><input id="np" type="password" autocomplete="new-password"></div></div>
    <div class="sheet-foot"><button class="btn grow" onclick="logout()">${IC.logout}${t('logout')}</button><button class="btn primary" onclick="changePass()">${t('change_pass')}</button></div></div>`;
  const app = `<div class="card"><h2>${t('set_app')}</h2><p class="sub">${t('app_help')}</p>
    <div class="opt-row"><span>${t('version')}</span><span class="r-meta">2.0</span></div>
    ${installEvt ? `<div class="sheet-foot"><button class="btn primary" onclick="doInstall()">${t('install')}</button></div>` : ''}</div>`;
  if (!isAdmin()) return `<div class="ph"><div><h1>${t('set_title')}</h1></div></div><div class="sgrid">${appearance}${dashSettings()}${account}${app}</div>`;
  const shop = `<div class="card"><h2>${t('g_shop')}</h2><p class="sub">${t('set_shop_sub')}</p><div id="shopForm">
    <div class="fields">${[{ k:'name', l:'shop_name', req:true }, { k:'owner', l:'proprietor' }, { k:'phone', l:'mobile' }, { k:'firstReceipt', l:'first_receipt', type:'number' }, { k:'address', l:'address', full:true }].map(f => field(f, S.shop)).join('')}</div></div>
    <div class="sheet-foot"><button class="btn primary" onclick="saveShop()">${t('save_info')}</button></div></div>`;
  const users = `<div class="card wide"><h2>${t('g_users')}</h2><p class="sub">${t('set_users_sub')}</p><div id="usersBox"><p class="empty">${t('loading')}</p></div>
    <fieldset><legend>${t('g_new_user')}</legend><div class="fields" id="newUser">${[{ k:'name', l:'name', req:true }, { k:'username', l:'username', req:true }, { k:'password', l:'password', req:true }, { k:'role', l:'role', type:'select', opts: opts('role') }].map(f => field(f, { role:'staff' })).join('')}</div>
    <div class="sheet-foot"><button class="btn dark" onclick="createUser()">${IC.plus}${t('create_user')}</button></div></fieldset></div>`;
  const backup = `<div class="card"><h2>${t('g_backup')}</h2><p class="sub">${t('backup_help')}</p>
    <div class="sheet-foot" style="justify-content:flex-start"><button class="btn" onclick="backupDownload()">${IC.download}${t('backup_dl')}</button><label class="btn">${t('backup_imp')}<input type="file" accept="application/json,.json" hidden onchange="backupImport(this)"></label></div></div>`;
  return `<div class="ph"><div><h1>${t('set_title')}</h1><p class="sub">${t('set_sub')}</p></div></div>
  <div class="sgrid">${appearance}${dashSettings()}${shop}${brandSettings()}${rcptSettings()}${srcSettings()}${mktSettings()}${users}${backup}${account}${app}</div>`;
}
function afterRender(r) {
  if (r === 'posters') { if (ui.pstTab === 'create') pstDraw(); else plFillThumbs(); }
  if (r === 'wa') { const m = $('#waMsgs'); if (m) m.scrollTop = m.scrollHeight; }
  if (r !== 'settings' || !isAdmin()) return;
  const pw = $('#f_password'); if (pw) { pw.type = 'password'; pw.autocomplete = 'new-password'; }
  const un = $('#f_username'); if (un) un.setAttribute('autocapitalize', 'none');
  loadUsers();
}
async function loadUsers() {
  try { usersCache = (await api('GET', '/api/users')).users; } catch (e) { return; }
  const box = $('#usersBox'); if (!box) return;
  box.innerHTML = usersCache.map(u => `<div class="urow"><button class="avatar" tabindex="-1" aria-hidden="true" style="${u.active ? '' : 'opacity:.4'}">${esc(initials(u.name))}</button>
    <div><div class="r-title">${esc(u.name)} ${u.id === me.id ? `<span class="r-meta">${t('user_you')}</span>` : ''}</div><div class="r-meta">${esc(u.username)} · ${ol('role', u.role)} · ${u.active ? t('active') : t('disabled')}</div></div>
    <div class="acts"><button class="btn small" onclick="resetPass(${u.id},'${esc(u.name).replace(/'/g, '')}')">${t('reset_pass')}</button>${u.id === me.id ? '' : `<button class="btn small" onclick="toggleUser(${u.id},${!u.active})">${u.active ? t('disable') : t('enable')}</button>`}</div></div>`).join('');
}
function openSettings() { closeSheet(); location.hash = 'settings'; }
async function saveShop() {
  const o = clone(S.shop); document.querySelectorAll('#shopForm [data-k]').forEach(el => { let v = el.value.trim(); if (el.type === 'number') v = v === '' ? '' : num(v); o[el.dataset.k] = v; });
  o.id = 'shop'; if (!o.name) { toast(t('shop_name')); return; }
  if (await save('settings', o)) toast(t('info_saved'));
}
async function changePass() {
  const np = $('#np').value; if (np.length < 6) { toast(t('pass_short')); return; }
  try { await api('POST', '/api/me/password', { oldPassword: $('#op').value, newPassword: np }); $('#op').value = ''; $('#np').value = ''; toast(t('pass_changed')); }
  catch (e) { toast(e.error === 'old' ? t('pass_old_bad') : e.error === 'short' ? t('pass_short') : t('save_err')); }
}
async function backupDownload() {
  try {
    const r = await fetch('/api/backup', { credentials: 'same-origin' }); if (!r.ok) throw 0;
    const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = 'smart-autodeal-backup-' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); toast(t('backup_done'));
  } catch (e) { toast(t('save_err')); }
}
async function backupImport(inp) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  let d; try { d = JSON.parse(await f.text()); if (!['sevasai-crm', 'smart-autodeal'].includes(d.app)) throw 0; } catch (e) { toast(t('imp_bad')); return; }
  if (!confirm(t('imp_confirm'))) return;
  try { const j = await api('POST', '/api/restore', d); toast(t('imp_done', { n: j.count })); await sync(true); } catch (e) { toast(t('imp_bad')); }
}
async function createUser() {
  const o = {}; document.querySelectorAll('#newUser [data-k]').forEach(el => { o[el.dataset.k] = el.value.trim(); });
  try { await api('POST', '/api/users', o); toast(t('user_created')); render(); }
  catch (e) { toast(e.error === 'exists' ? t('user_exists') : e.error === 'fields' ? t('user_fields') : t('save_err')); }
}
async function resetPass(id, name) {
  const p = prompt(t('new_pass_for', { n: name })); if (p == null) return;
  if (p.length < 6) { toast(t('pass_short')); return; }
  try { await api('PATCH', '/api/users/' + id, { password: p }); toast(t('pass_changed')); } catch (e) { toast(t('save_err')); }
}
async function toggleUser(id, active) {
  try { await api('PATCH', '/api/users/' + id, { active }); loadUsers(); } catch (e) { toast(e.error === 'self' ? t('self_err') : t('save_err')); }
}

/* ================= buy source + dashboard customisation ================= */
Object.assign(T, {
  g_buy:['खरेदी माहिती – गाडी कुठून घेतली','Purchase – where the car came from'], buy_source:['खरेदी स्रोत','Purchase source'], buy_from:['कोणाकडून (नाव)','Bought from (name)'], buy_from_phone:['त्यांचा फोन','Their phone'],
  all_sources:['सर्व स्रोत','All sources'], c_source_buy:['स्रोत','Source'], no_source:['स्रोत भरलेला नाही','Source not set'],
  w_sources:['गाडी खरेदी स्रोत','Purchase sources'], src_title:['खरेदी स्रोत – कुठून जास्त फायदा','Purchase sources – where profit comes from'],
  src_meta:['{b} खरेदी · {s} विकल्या · {k} स्टॉकमध्ये','{b} bought · {s} sold · {k} in stock'], src_avg:['सरासरी नफा','Avg profit'], src_days:['सरासरी {n} दिवसांत विक्री','Sells in ~{n} days'], src_none:['अजून गाड्यांना स्रोत दिलेला नाही. गाडी उघडून "खरेदी स्रोत" निवडा.','No sources yet. Open a car and choose “Purchase source”.'],
  k_bought:['या महिन्यात खरेदी','Bought this month'], k_bought_note:['{x} गुंतवले','{x} invested'],
  g_dash:['डॅशबोर्ड','Dashboard'], g_dash_sub:['डॅशबोर्डवर काय दिसावे ते निवडा आणि ↑ ↓ ने क्रम बदला. हे या डिव्हाइसवर लागू होते.','Choose what appears on the dashboard and reorder with ↑ ↓. Applies to this device.'],
  dash_cards:['मुख्य आकडे (वरचे कार्ड)','Key numbers (top cards)'], dash_sections:['विभाग','Sections'], dash_reset:['मूळ रचना','Reset to default'], dash_view:['डॅशबोर्ड पहा','View dashboard'], move_up:['वर','Up'], move_down:['खाली','Down'],
  w_kpis:['मुख्य आकडे','Key numbers'], w_chart:['नफा / विक्री आलेख','Profit / sales chart'], w_mini_due:['पावत्या बाकी','Receipts pending'], w_mini_calls:['आज फोन करायचे ग्राहक','Customers to call today'],
  w_donut:['स्टॉक – कंपनीनुसार','Stock by make'], w_mkt:['कॅटलॉग व QR','Catalogue & QR'], w_fin:['लोन येणे बाकी','Loan payments pending'], w_cust:['ग्राहकांकडून बाकी','Pending from customers'], w_fups:['आजचे फॉलो-अप','Today’s follow-ups'], w_old:['जुना स्टॉक','Old stock'],
  dash_empty:['डॅशबोर्डवर काहीही निवडलेले नाही. सेटिंगमध्ये विभाग चालू करा.','Nothing selected for the dashboard. Turn sections on in Settings.'],
  g_srcs:['गाडी खरेदी स्रोत यादी','Purchase source list'], g_srcs_sub:['तुमच्या व्यवसायानुसार नवीन स्रोत जोडा (उदा. "पुणे दलाल – सुनील").','Add sources that fit your business (e.g. “Pune broker – Sunil”).'], src_new:['नवीन स्रोत','New source'], src_added:['स्रोत जोडला','Source added'], builtin:['मूळ','Built-in'],
});
const BUY_SRC = { owner:['थेट मालकाकडून','Direct from owner'], broker:['दलाल / एजंट','Broker / agent'], exchange:['एक्सचेंज (जुनी गाडी बदलून)','Exchange (trade-in)'], dealer:['दुसऱ्या डीलरकडून','Other dealer'], auction:['लिलाव / बँक जप्ती','Auction / bank repossession'], online:['ऑनलाइन (OLX, फेसबुक)','Online (OLX, Facebook)'], other:['इतर','Other'] };
const customSrc = () => Array.isArray(S.shop.buySources) ? S.shop.buySources : [];
const bsl = k => BUY_SRC[k] ? pick(BUY_SRC[k], PACK && PACK.BUY_SRC && PACK.BUY_SRC[k]) : ((customSrc().find(x => x.key === k) || {}).label || k || '');
const buySrcOpts = () => [['', t('choose')], ...Object.keys(BUY_SRC).map(k => [k, bsl(k)]), ...customSrc().map(x => [x.key, x.label])];
async function addSource() {
  const v = $('#srcNew').value.trim(); if (!v) return;
  const list = [...customSrc(), { key: 'cs' + uid(), label: v }];
  if (await save('settings', { ...clone(S.shop), id: 'shop', buySources: list })) toast(t('src_added'));
}
async function removeSource(key) { await save('settings', { ...clone(S.shop), id: 'shop', buySources: customSrc().filter(x => x.key !== key) }); }

const DASH_W = [['kpis','w_kpis'],['chart','w_chart'],['mini_due','w_mini_due'],['mini_calls','w_mini_calls'],['donut','w_donut'],['sources','w_sources',1],['mkt','w_mkt'],['fin','w_fin'],['cust','w_cust'],['fups','w_fups'],['old','w_old']];
const DASH_K = [['net','st_net',1],['sales','st_month_sales'],['stock','st_stock'],['fin','st_fin'],['cust','st_cust'],['bought','k_bought']];
const dashCfg = () => pref.dash || {};
const wAllowed = w => !w[2] || isAdmin();
function dashOrder() { const o = (dashCfg().order || []).filter(id => DASH_W.some(w => w[0] === id)); DASH_W.forEach(w => { if (!o.includes(w[0])) o.push(w[0]); }); return o.filter(id => wAllowed(DASH_W.find(w => w[0] === id))); }
const wOn = id => !(dashCfg().hidden || []).includes(id);
function kpiOn(id) { const k = dashCfg().kpis; if (k) return k.includes(id); return isAdmin() ? ['net','sales','stock','fin'].includes(id) : ['sales','stock','fin','cust'].includes(id); }
function setDash(patch) { setPref('dash', { ...dashCfg(), ...patch }); }
function toggleW(id, on) { const h = new Set(dashCfg().hidden || []); on ? h.delete(id) : h.add(id); setDash({ hidden: [...h] }); }
function toggleK(id, on) { const cur = DASH_K.filter(k => kpiOn(k[0])).map(k => k[0]); const s2 = new Set(cur); on ? s2.add(id) : s2.delete(id); setDash({ kpis: DASH_K.map(k => k[0]).filter(k => s2.has(k)) }); }
function moveW(id, dir) { const o = dashOrder(); const i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; setDash({ order: o }); }
function resetDash() { setPref('dash', {}); }
function dashSettings() {
  const rows = dashOrder().map((id, i, arr) => { const w = DASH_W.find(x => x[0] === id);
    return `<div class="dw-row"><label><input type="checkbox" ${wOn(id) ? 'checked' : ''} onchange="toggleW('${id}',this.checked)"> ${t(w[1])}</label>
      <span class="dw-move"><button class="btn small" ${i === 0 ? 'disabled' : ''} onclick="moveW('${id}',-1)" aria-label="${t('move_up')}">↑</button><button class="btn small" ${i === arr.length - 1 ? 'disabled' : ''} onclick="moveW('${id}',1)" aria-label="${t('move_down')}">↓</button></span></div>`; }).join('');
  const kp = DASH_K.filter(wAllowed).map(([id, l]) => `<label class="kchip"><input type="checkbox" ${kpiOn(id) ? 'checked' : ''} onchange="toggleK('${id}',this.checked)"> ${t(l)}</label>`).join('');
  return `<div class="card"><h2>${t('g_dash')}</h2><p class="sub">${t('g_dash_sub')}</p>
    <b class="dw-h">${t('dash_cards')}</b><div class="kchips">${kp}</div>
    <b class="dw-h">${t('dash_sections')}</b><div class="dw-list">${rows}</div>
    <div class="sheet-foot"><button class="btn grow" onclick="resetDash()">${t('dash_reset')}</button><a class="btn primary" href="#dashboard">${t('dash_view')}</a></div></div>`;
}
function srcSettings() {
  return `<div class="card"><h2>${t('g_srcs')}</h2><p class="sub">${t('g_srcs_sub')}</p>
    ${Object.keys(BUY_SRC).map(k => `<div class="opt-row"><span>${esc(bsl(k))}</span><span class="r-meta">${t('builtin')}</span></div>`).join('')}
    ${customSrc().map(x => `<div class="opt-row"><span>${esc(x.label)}</span><button class="btn small" onclick="removeSource('${x.key}')">${t('remove')}</button></div>`).join('')}
    <div class="pay"><div class="f"><label for="srcNew">${t('src_new')}</label><input id="srcNew"></div><button class="btn dark" onclick="addSource()">${t('add')}</button></div></div>`;
}
function sourcesWidget() {
  const groups = {};
  S.cars.forEach(c => { const k = c.buySource || ''; (groups[k] = groups[k] || []).push(c); });
  const rows = Object.entries(groups).filter(([k]) => k).map(([k, cars]) => {
    const sold = cars.filter(c => c.status === 'sold');
    const profits = sold.map(c => { const d = S.deals.find(x => x.carId === c.id); return d ? num(d.dealAmount) - carCost(c) : null; }).filter(v => v != null);
    const days = sold.filter(c => c.buyDate && c.soldDate).map(c => daysBetween(c.buyDate, c.soldDate));
    return { k, n: cars.length, s: sold.length, st: cars.length - sold.length, total: profits.reduce((a, v) => a + v, 0), avg: profits.length ? profits.reduce((a, v) => a + v, 0) / profits.length : null, days: days.length ? Math.round(days.reduce((a, v) => a + v, 0) / days.length) : null };
  }).sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...rows.map(r => Math.abs(r.total)));
  const body = rows.length ? rows.map(r => `<div class="src-row"><div><div class="r-title">${esc(bsl(r.k))}</div><div class="r-meta">${t('src_meta', { b: r.n, s: r.s, k: r.st })}</div></div>
      <div class="r-right"><div class="r-amt">${r.avg != null ? rs(r.avg) : '—'}</div><div class="r-meta">${t('src_avg')}${r.days != null ? ' · ' + t('src_days', { n: r.days }) : ''}</div></div>
      <div class="src-bar"><i style="width:${Math.max(2, Math.abs(r.total) / max * 100)}%;${r.total < 0 ? 'background:var(--danger)' : ''}"></i></div></div>`).join('') : `<p class="empty">${t('src_none')}</p>`;
  const unset = (groups[''] || []).length;
  return `<div class="card half"><div class="card-h"><h2>${t('src_title')}</h2><a class="go" href="#cars" aria-label="${t('nav_cars')}">${IC.arrow}</a></div>${body}${unset && rows.length ? `<p class="r-meta" style="margin:8px 0 0">${t('no_source')}: ${unset}</p>` : ''}</div>`;
}

