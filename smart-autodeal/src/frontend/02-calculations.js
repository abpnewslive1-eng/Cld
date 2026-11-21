/* ================= calculations ================= */
const paidOf = d => num(d.cash) + (d.payments || []).reduce((a, p) => a + num(p.amount), 0);
const finAmt = d => num(d.finAmount);
const finPending = d => (d.finReceived ? 0 : finAmt(d));
const custDue = d => Math.max(0, num(d.dealAmount) - paidOf(d) - finAmt(d));
const dueOf = d => custDue(d) + finPending(d);
const carExp = c => num(c.repair) + (c.expenses || []).reduce((a, e) => a + num(e.amount), 0);
const carCost = c => num(c.buyPrice) + carExp(c);
const shopExp = ym => S.expenses.filter(e => (e.date || '').startsWith(ym)).reduce((a, e) => a + num(e.amount), 0);
const carOf = d => S.cars.find(c => c.id === d.carId);
function profitOf(d) { const c = carOf(d); return c ? num(d.dealAmount) - carCost(c) : null; }
function nextReceipt() { const m = S.deals.reduce((a, d) => Math.max(a, num(d.receiptNo)), 0); return m ? m + 1 : num(S.shop.firstReceipt) || 1; }
const carLabel = c => c ? [c.company, c.model].filter(Boolean).join(' ') || t('car') : '—';

/* ================= login ================= */
function langSwitch() { return `<span class="lang-switch" role="group" aria-label="Language"><button type="button" aria-pressed="${L === 'mr'}" onclick="setLang('mr')">मराठी</button><button type="button" aria-pressed="${L === 'en'}" onclick="setLang('en')">English</button></span>`; }
function showLogin() { $('#app').hidden = true; $('#bottom').hidden = true; $('#login').hidden = false; closeSheet(); renderLogin(); }
function renderLogin() {
  const keepL = L; L = 'en';
  $('#login').innerHTML = `<form class="login-box" lang="en" onsubmit="doLogin(event)">
    <div class="brand"><div class="logo brand-logo">${IC.car}</div><div><b>${BRAND}</b><small>${t('brand_tag')}</small></div></div>
    <h2>${t('login_title')}</h2>
    <div class="f"><label for="lu">${t('username')}</label><input id="lu" autocomplete="username" autocapitalize="none" required></div>
    <div class="f"><label for="lp">${t('password')}</label><input id="lp" type="password" autocomplete="current-password" required></div>
    <div class="login-err" id="lerr"></div>
    <button class="btn primary" style="width:100%;justify-content:center" type="submit">${t('login_btn')}</button>
    ${window.DEMO ? `<div class="demo-logins"><b>${t('demo_logins')}</b>${[['super','super123','Super Admin'],['admin','admin123','Sevasai – Owner'],['staff','staff123','Sevasai – Staff'],['malhar','malhar123','Jay Malhar (trial)'],['ganesh','ganesh123','Shri Ganesh (expired)']].map(([u,pw,l]) => `<button type="button" class="chip" onclick="document.querySelector('#lu').value='${u}';document.querySelector('#lp').value='${pw}'">${l}</button>`).join('')}</div>` : ''}
  </form>`;
  L = keepL;
}
async function doLogin(e) {
  e.preventDefault();
  try { const j = await api('POST', '/api/login', { username: $('#lu').value, password: $('#lp').value }); me = j.user; startApp(); }
  catch (err) { $('#lerr').textContent = err.code === 401 ? tEn('login_bad') : err.code === 403 ? tEn('susp_login') : err.code === 429 ? tEn('login_wait') : tEn('net_err'); }
}
async function logout() { try { await api('POST', '/api/logout'); } catch (e) {} me = null; TEN = null; loaded = false; showLogin(); }
async function startApp() {
  $('#login').hidden = true; $('#app').hidden = false; $('#bottom').hidden = false;
  $('#main').innerHTML = `<p class="empty">${t('loading')}</p>`;
  try { const j = await api('GET', '/api/me'); me = j.user; TEN = j.tenant || null; } catch (e) { return; }
  if (isSuper()) { loaded = true; await loadSA(); if (!location.hash.startsWith('#sa')) location.hash = 'sa'; render(); return; }
  PLIB = null; plThumbCache.clear();
  if (location.hash.startsWith('#sa')) location.hash = 'dashboard';
  await sync(true);
  loadMkt();
}
async function boot() {
  if (isPublic()) { bootPublic(); return; }
  document.documentElement.lang = L === 'en' ? 'en' : 'mr';
  try { const j = await api('GET', '/api/me'); me = j.user; startApp(); } catch (e) { if (e.code !== 401) { showLogin(); $('#lerr').textContent = tEn('net_err'); } }
}

/* ================= install ================= */
let installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (me && loaded) render(); });
addEventListener('appinstalled', () => { installEvt = null; if (me && loaded) render(); });
async function doInstall() { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) {} installEvt = null; render(); }
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ================= extra strings ================= */
Object.assign(T, {
  nav_settings:['सेटिंग','Settings'], search_all:['शोधा: गाडी नंबर, ग्राहक, पावती','Search car number, customer, receipt'], no_results:['काही सापडले नाही','Nothing found'],
  today_is:['आज, {d}','Today, {d}'], alerts_title:['सूचना','Alerts'], no_alerts:['सध्या कोणतीही सूचना नाही.','No alerts right now.'],
  al_followup:['फॉलो-अप: {n}','Follow-up: {n}'], al_loan:['{b} – {x}, {d} दिवस उशीर','{b} – {x}, {d} days late'], al_due:['{n} – {x} बाकी, मुदत संपली','{n} – {x} overdue'], al_ins:['{c} – इन्शुरन्स {d} ला संपतो','{c} – insurance ends {d}'],
  hello_sub:['या महिन्यात दुकानात काय चालले आहे ते पहा.','Here’s what’s happening at your shop this month.'], vs_last:['मागील महिन्याच्या तुलनेत','vs last month'],
  chart_profit:['नफा','Profit'], chart_sales:['विक्री','Sales'], last6:['मागील ६ महिने','Last 6 months'],
  mini_receipts:['पावत्या','receipts'], mini_receipts_note:['{x} ग्राहकांकडून <em>येणे बाकी</em>','{x} <em>pending</em> from customers'],
  mini_calls:['ग्राहक','customers'], mini_calls_note:['आज <em>फोन करायचा</em> आहे','<em>to call</em> today'],
  donut_title:['स्टॉक – कंपनीनुसार','Stock by make'], others:['इतर','Others'], no_stock:['स्टॉकमध्ये गाडी नाही','No cars in stock'],
  export:['एक्सपोर्ट','Export'], prev:['मागे','Previous'], next:['पुढे','Next'],
  c_receipt:['पावती क्र.','Receipt no.'], c_customer:['ग्राहक','Customer'], c_car:['गाडी','Car'], c_amount:['रक्कम','Amount'], c_date:['दिनांक','Date'], c_payment:['पेमेंट','Payment'], c_status:['स्थिती','Status'],
  c_number:['नंबर','Number'], c_km:['किमी','Km'], c_cost:['एकूण खर्च','Total cost'], c_price:['विक्री किंमत','Price'], c_margin:['मार्जिन','Margin'], c_days:['दिवस','Days'],
  c_phone:['फोन','Phone'], c_interest:['आवडलेली गाडी','Interest'], c_budget:['बजेट','Budget'], c_source:['स्रोत','Source'], c_followup:['फॉलो-अप','Follow-up'], c_type:['प्रकार','Type'], c_note:['नोंद','Note'],
  pay_cash:['रोख','Cash'], pay_loan:['लोन','Loan'],
  sc_all_receipts:['सर्व पावत्या','All receipts'], sc_cust_due:['ग्राहक बाकी','Customer due'], sc_loan_due:['लोन बाकी','Loan pending'], sc_complete:['पूर्ण','Complete'],
  pill_overdue:['उशीर','Overdue'], pill_due:['बाकी','Due'], pill_loan:['लोन बाकी','Loan pending'], pill_done:['पूर्ण','Complete'],
  sc_stock:['स्टॉक','In stock'], sc_booked:['बुक','Booked'], sc_old:['जुना स्टॉक (४५+)','Old stock (45+)'], sc_sold:['विकली','Sold'],
  sc_new:['नवीन','New'], sc_follow:['फॉलो-अप / टेस्ट','Follow-up / test'], sc_calls:['आज फोन','Call today'], sc_booked_l:['बुकिंग','Booked'],
  sc_shop:['दुकान खर्च','Shop expenses'], sc_carexp:['गाड्यांवरील खर्च','Spent on cars'], sc_biggest:['सर्वात मोठा खर्च','Largest expense'], sc_entries:['नोंदी','Entries'],
  set_sub:['दुकान, कर्मचारी, बॅकअप आणि ॲपचे स्वरूप','Shop, staff, backup and how the app looks'], set_appearance:['स्वरूप','Appearance'], set_appearance_sub:['हे बदल फक्त या डिव्हाइसवर लागू होतात.','These changes apply to this device only.'],
  theme:['थीम','Theme'], th_light:['हलका','Light'], th_dark:['गडद','Dark'], th_auto:['फोननुसार','Auto'], accent:['मुख्य रंग','Accent colour'],
  col_blue:['निळा','Blue'], col_red:['लाल','Red'], col_green:['हिरवा','Green'], col_purple:['जांभळा','Purple'], col_orange:['केशरी','Orange'],
  set_shop_sub:['हे नाव, पत्ता आणि फोन पावतीवर छापले जातात.','Name, address and phone printed on every receipt.'],
  set_users_sub:['कर्मचाऱ्यांना स्वतःचे लॉगिन द्या. कर्मचारी नोंदी हटवू शकत नाहीत आणि नफा पाहू शकत नाहीत.','Give each staff member their own login. Staff can’t delete records or see profit.'],
  set_account:['माझे खाते','My account'], signed_as:['{n} · {r}','{n} · {r}'], set_app:['ॲप','App'],
  app_help:['मोबाईल किंवा PC वर ॲप म्हणून इन्स्टॉल करा. बटण दिसत नसेल तर ब्राउझर मेनूमधून "Install" / "Add to Home screen" निवडा.','Install as an app on phone or PC. If no button shows, use “Install” / “Add to Home screen” from the browser menu.'],
  version:['आवृत्ती','Version'], user_you:['(तुम्ही)','(you)'],
});

/* ================= theme ================= */
const ACCENTS = { blue:'#3D3BF3', red:'#C62828', green:'#0E9F6E', purple:'#7C3AED', orange:'#E8590C' };
const pref = { theme:'auto', accent:'blue' };
try { Object.assign(pref, JSON.parse(localStorage.getItem('scrm-ui') || '{}')); } catch (e) {}
function applyTheme() {
  const r = document.documentElement;
  if (pref.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', pref.theme);
  r.style.setProperty('--accent', ACCENTS[pref.accent] || ACCENTS.blue);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = ACCENTS[pref.accent] || ACCENTS.blue;
}
function setPref(k, v) { pref[k] = v; try { localStorage.setItem('scrm-ui', JSON.stringify(pref)); } catch (e) {} applyTheme(); render(); }
applyTheme();

/* ================= icons ================= */
const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC = {
  dash: sv('<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>'),
  car: sv('<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/>'),
  lead: sv('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M17 8h5M19.5 5.5v5"/>'),
  deal: sv('<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>'),
  exp: sv('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 14.5h2"/><path d="M6 6l9-3 1.5 3"/>'),
  gear: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  bell: sv('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'),
  search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  logout: sv('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'),
  arrow: sv('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
  plus: sv('<path d="M12 5v14M5 12h14"/>'),
  download: sv('<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>'),
  check: sv('<path d="M20 6 9 17l-5-5"/>'),
  user: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
  chevL: sv('<path d="m15 18-6-6 6-6"/>'), chevR: sv('<path d="m9 18 6-6-6-6"/>'),
};

/* ================= shell ================= */
const routes = () => [['dashboard','nav_dashboard',IC.dash],['cars','nav_cars',IC.car],['leads','nav_leads',IC.lead],...(featOn('wa') ? [['wa','nav_wa',IC_CHAT]] : []),['deals','nav_deals',IC.deal],['posters','nav_posters',IC_PST],...(isAdmin() ? [['expenses','nav_expenses',IC.exp]] : []),['settings','nav_settings',IC.gear]];
const route = () => { const h = location.hash.slice(1); return routes().some(r => r[0] === h) ? h : 'dashboard'; };
addEventListener('hashchange', () => { if (isPublic()) return; if (me && loaded) { render(); window.scrollTo(0, 0); } });
const initials = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const ui = { carSrc:'', carFilter:'stock', carQ:'', leadFilter:'all', leadQ:'', dealFilter:'all', dealQ:'', expMonth:'', expQ:'', chart:'profit', page:{} };
const PER_PAGE = 15;

function render() {
  if (!me) return;
  if (isSuper()) { if (loaded) renderSA(); return; }
  const r = route(), rr = routes();
  const navLinks = rr.filter(x => x[0] !== 'settings').map(([k, l, i]) => `<a href="#${k}" aria-label="${t(l)}" ${k === r ? 'aria-current="page"' : ''}>${i}${k === 'wa' && unreadTotal() ? `<span class="ubadge navb">${unreadTotal()}</span>` : ''}<span class="tip">${t(l)}</span></a>`).join('');
  $('#side').innerHTML = `<div class="logo" title="${esc(S.shop.name)}">${esc(initials(S.shop.name).slice(0, 1) || 'S')}</div><nav class="nav">${navLinks}</nav><div class="spacer"></div>
    <a href="#settings" aria-label="${t('nav_settings')}" ${r === 'settings' ? 'aria-current="page"' : ''}>${IC.gear}<span class="tip">${t('nav_settings')}</span></a>
    <button onclick="logout()" aria-label="${t('logout')}">${IC.logout}<span class="tip">${t('logout')}</span></button>`;
  const MAIN = ['dashboard', 'cars', 'leads', 'deals'];
  const extra = rr.filter(x => !MAIN.includes(x[0]));
  $('#bottom').style.gridTemplateColumns = `repeat(${MAIN.length + 1},1fr)`;
  $('#bottom').innerHTML = rr.filter(x => MAIN.includes(x[0])).map(([k, l, i]) => `<a href="#${k}" ${k === r ? 'aria-current="page"' : ''}>${i}<span>${t(l === 'nav_deals' ? 'nav_deals_short' : l)}</span></a>`).join('')
    + `<a href="#more" onclick="event.preventDefault();openMore()" ${extra.some(x => x[0] === r) ? 'aria-current="page"' : ''}>${IC_MORE}<span>${t('nav_more')}</span>${k_unread()}</a>`;
  if (!(document.activeElement && document.activeElement.id === 'gsearch')) renderTop();
  if (!loaded) return;
  $('#main').innerHTML = tenantBanner() + ({ dashboard:viewDash, cars:viewCars, leads:viewLeads, deals:viewDeals, expenses:viewExpenses, settings:viewSettings, wa:viewWa, posters:viewPosters })[r]();
  afterRender(r);
}
function renderTop() {
  const n = alerts().length;
  const d = new Date().toLocaleDateString(loc(), { weekday:'short', day:'numeric', month:'short' });
  $('#topbar').innerHTML = `
    <div class="tb-brand"><div class="logo">${esc(initials(S.shop.name).slice(0, 1) || 'S')}</div><span>${esc(S.shop.name)}</span></div>
    <div class="tb-search">${IC.search}<input id="gsearch" type="search" placeholder="${t('search_all')}" autocomplete="off" aria-label="${t('search_all')}" oninput="gSearch(this.value)" onfocus="gSearch(this.value)"><div class="gs-results" id="gsr" hidden></div></div>
    <span class="tb-date">${t('today_is', { d })}</span>
    <div class="tb-actions">
      ${isOnline ? '' : `<span class="pill red">${t('offline')}</span>`}
      <a class="icon-btn" href="#settings" aria-label="${t('nav_settings')}">${IC.gear}</a>
      <button class="icon-btn" onclick="openAlerts()" aria-label="${t('alerts_title')}">${IC.bell}${n ? `<span class="dot">${n > 9 ? '9+' : n}</span>` : ''}</button>
      <button class="avatar" onclick="location.hash='settings'" aria-label="${esc(me.name)}" title="${esc(me.name)}">${esc(initials(me.name))}</button>
    </div>`;
}
document.addEventListener('click', e => { const g = $('#gsr'); if (g && !e.target.closest('.tb-search')) g.hidden = true; });

/* global search */
function gSearch(q) {
  const box = $('#gsr'); q = q.trim().toLowerCase();
  if (!q) { box.hidden = true; return; }
  const hit = (...v) => v.join(' ').toLowerCase().includes(q);
  const res = [
    ...S.deals.filter(d => hit(d.receiptNo, d.buyer?.name, d.buyer?.phone, d.vehicle?.reg)).slice(0, 4).map(d => [`openDealView('${d.id}')`, `#${esc(d.receiptNo)} · ${esc(d.buyer?.name || '')}`, t('receipt')]),
    ...S.cars.filter(c => hit(c.reg, c.company, c.model)).slice(0, 4).map(c => [`openCar('${c.id}')`, `${esc(carLabel(c))} · ${esc(c.reg || '')}`, t('car')]),
    ...S.leads.filter(l => hit(l.name, l.phone)).slice(0, 4).map(l => [`openLead('${l.id}')`, `${esc(l.name)} · ${esc(l.phone || '')}`, t('c_customer')]),
  ];
  box.innerHTML = res.length ? res.map(([fn, label, type]) => `<button onclick="$('#gsr').hidden=true;${fn}"><span>${label}</span><small>${type}</small></button>`).join('') : `<p class="empty" style="padding:8px 10px">${t('no_results')}</p>`;
  box.hidden = false;
}

/* alerts */
function alerts() {
  const tt = today(), out = [];
  const soon = new Date(tt); soon.setDate(soon.getDate() + 15); const soonS = soon.toISOString().slice(0, 10);
  S.leads.filter(l => !['booked', 'lost'].includes(l.status) && l.followUp && l.followUp <= tt).forEach(l => out.push({ ic:'📞', bg:'var(--accent-soft)', text:t('al_followup', { n: esc(l.name) }), fn:`openLead('${l.id}')` }));
  S.deals.filter(d => finPending(d) && d.finExpected && d.finExpected < tt).forEach(d => out.push({ ic:'🏦', bg:'var(--warn-soft)', text:t('al_loan', { b: esc(d.finBank || t('g_loan')), x: rs(finPending(d)), d: daysBetween(d.finExpected, tt) }), fn:`openDealView('${d.id}')` }));
  S.deals.filter(d => custDue(d) && d.dueDate && d.dueDate < tt).forEach(d => out.push({ ic:'₹', bg:'var(--danger-soft)', text:t('al_due', { n: esc(d.buyer?.name || ''), x: rs(custDue(d)) }), fn:`openDealView('${d.id}')` }));
  if (unreadTotal()) out.unshift({ ic:'💬', bg:'color-mix(in srgb,#25D366 18%,var(--surface))', text:'WhatsApp – ' + t('wa_badge', { n: unreadTotal() }), fn:`ui.waTab='inbox';ui.waFilter='unread';location.hash='wa'` });
  S.cars.filter(c => c.status !== 'sold' && c.insurance && c.insurance <= soonS).forEach(c => out.push({ ic:'🛡', bg:'var(--surface-2)', text:t('al_ins', { c: esc(c.reg || carLabel(c)), d: fmtDate(c.insurance) }), fn:`openCar('${c.id}')` }));
  return out;
}
function openAlerts() {
  const a = alerts();
  openSheet(head(t('alerts_title')) + (a.length ? a.map(x => `<div class="alert-row" onclick="closeSheet();${x.fn}"><span class="ai" style="background:${x.bg}">${x.ic}</span><span>${x.text}</span></div>`).join('') : `<p class="empty">${t('no_alerts')}</p>`));
}

