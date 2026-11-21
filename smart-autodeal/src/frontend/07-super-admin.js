/* ================= Super Admin (multi-dealer) ================= */
Object.assign(T, {
  sa_brand:['Super Admin','Super Admin'], sa_dash:['डॅशबोर्ड','Dashboard'], sa_dealers:['डीलर्स','Dealers'], sa_plans:['प्लॅन','Plans'], sa_news:['सूचना','Announcements'], sa_log:['नोंदवही','Activity log'],
  sa_hello:['नमस्कार {n} 👋','Hello {n} 👋'], sa_hello_sub:['सर्व डीलर, ट्रायल आणि पेमेंट एका ठिकाणी.','All dealers, trials and payments in one place.'],
  k_dealers:['एकूण डीलर','Total dealers'], k_trial:['ट्रायलवर','On trial'], k_trial_note:['{n} जण ३ दिवसांत संपणार','{n} ending in 3 days'], k_active:['चालू (पेड)','Active (paid)'], k_mrr:['अपेक्षित मासिक कमाई','Expected monthly revenue'],
  k_month_in:['या महिन्यात मिळाले','Received this month'], k_expired:['संपलेले / बंद','Expired / suspended'],
  p_trial_end:['ट्रायल लवकर संपणारे','Trials ending soon'], p_renew:['रिन्युअल जवळ आलेले','Renewals due soon'], p_idle:['कमी वापर (७ दिवस लॉगिन नाही)','Low usage (no login in 7 days)'],
  none_here:['सध्या कोणी नाही.','Nobody right now.'], add7:['+७ दिवस','+7 days'], add14:['+१४ दिवस','+14 days'], rec_pay:['पेमेंट नोंदवा','Record payment'],
  st_trial:['ट्रायल','Trial'], st_active:['चालू','Active'], st_expired:['संपला','Expired'], st_suspended:['बंद केला','Suspended'], days_left:['{n} दिवस बाकी','{n} days left'], ended_ago:['{n} दिवसांपूर्वी संपला','Ended {n} days ago'], till:['{d} पर्यंत','till {d}'],
  new_dealer:['+ नवीन डीलर','+ New dealer'], dealer_name:['दुकानाचे नाव','Shop name'], city:['शहर / गाव','City / town'], owner_name:['मालकाचे नाव','Owner name'], owner_login:['मालकाचे लॉगिन (युजरनेम)','Owner login (username)'],
  trial_days:['ट्रायल दिवस','Trial days'], plan:['प्लॅन','Plan'], create_dealer:['डीलर तयार करा','Create dealer'], dealer_created:['डीलर तयार झाला. लॉगिन: {u}','Dealer created. Login: {u}'],
  c_dealer:['डीलर','Dealer'], c_owner:['मालक','Owner'], c_plan:['प्लॅन','Plan'], c_cars:['गाड्या','Cars'], c_staff:['स्टाफ','Staff'], c_last:['शेवटचे लॉगिन','Last login'], never:['कधीच नाही','Never'],
  sc_trial:['ट्रायल','Trial'], sc_active:['चालू','Active'], sc_soon:['७ दिवसांत संपणारे','Ending in 7 days'], sc_off:['संपलेले / बंद','Expired / off'],
  open_as:['🔑 डीलर म्हणून उघडा','🔑 Open as dealer'], suspend:['बंद करा','Suspend'], activate:['चालू करा','Activate'], reset_owner:['मालकाचा पासवर्ड रीसेट','Reset owner password'],
  g_details:['माहिती','Details'], g_features:['सुविधा','Features'], f_catalog:['फोटो, QR व ऑनलाइन कॅटलॉग','Photos, QR & online catalogue'], f_wa:['WhatsApp मॉड्यूल','WhatsApp module'], notes:['अंतर्गत नोंद','Internal notes'],
  g_pay:['पेमेंट नोंदवा (मॅन्युअल)','Record payment (manual)'], months:['किती महिने','Months'], pay_amount:['रक्कम ₹','Amount ₹'], pay_mode:['कसे मिळाले','Received via'], pay_hist:['पेमेंट इतिहास','Payment history'], no_pay:['अजून पेमेंट नाही.','No payments yet.'],
  pay_done:['पेमेंट नोंदले. नवीन मुदत: {d}','Payment recorded. Valid till {d}'], saved_ok:['सेव्ह झाले','Saved'], extended:['मुदत वाढवली: {d}','Extended till {d}'], g_activity:['अलीकडील नोंदी','Recent activity'],
  plans_sub:['किंमती आणि मर्यादा तुम्ही ठरवा. "0" म्हणजे मर्यादा नाही. या नमुना किंमती आहेत.','Set prices and limits. "0" means unlimited. These are sample prices.'],
  plan_name:['नाव','Name'], plan_price:['महिन्याची किंमत ₹','Monthly price ₹'], max_cars:['जास्तीत जास्त गाड्या','Max cars'], max_staff:['जास्तीत जास्त स्टाफ','Max staff'], save_plans:['प्लॅन सेव्ह करा','Save plans'],
  news_sub:['सर्व डीलरच्या डॅशबोर्डवर वर दिसेल (उदा. नवीन सुविधा, देखभाल).','Shows at the top of every dealer’s dashboard (new features, maintenance).'], news_text:['सूचना','Message'], send_news:['सर्वांना पाठवा','Send to all'], hide:['लपवा','Hide'], news_none:['अजून सूचना नाही.','No announcements yet.'],
  c_when:['केव्हा','When'], c_who:['कोणी','Who'], c_what:['काय','What'], log_none:['अजून नोंद नाही.','No activity yet.'],
  imp_bar:['तुम्ही Super Admin म्हणून "{n}" पाहत आहात. येथे केलेले बदल डीलरच्या खात्यात होतील.','You are viewing “{n}” as Super Admin. Changes here affect the dealer’s account.'], imp_exit:['Super Admin वर परत','Back to Super Admin'],
  t_trial:['ट्रायल: {n} दिवस बाकी. पुढे वापरण्यासाठी {p} वर संपर्क करा.','Trial: {n} days left. To continue, contact {p}.'], t_expired:['तुमचा प्लॅन संपला आहे. माहिती पाहता येईल, पण नवीन नोंदी करता येणार नाहीत. संपर्क: {p}','Your plan has ended. You can view data but not add new records. Contact: {p}'],
  t_susp:['खाते बंद आहे. संपर्क: {p}','Account suspended. Contact: {p}'], t_limit:['तुमच्या प्लॅनची मर्यादा पूर्ण झाली. प्लॅन वाढवण्यासाठी संपर्क करा.','You’ve reached your plan’s limit. Contact us to upgrade.'], t_exp_short:['प्लॅन संपला – नवीन नोंद करता येत नाही','Plan ended – can’t add new records'],
  susp_login:['हे खाते बंद केले आहे. सपोर्टशी संपर्क करा.','This account is suspended. Please contact support.'], demo_logins:['डेमो लॉगिन','Demo logins'],
});
let TEN = null, SA = { tenants: [], plans: [], news: [], logs: [] };
const supportPhone = () => (TEN && TEN.supportPhone) || '';
const featOn = f => !TEN || !TEN.features || TEN.features[f] !== false;
const isSuper = () => me && me.role === 'super';
function tState(tn) { const tt = today(); if (tn.suspended) return 'suspended'; if (tn.expiry && tn.expiry < tt) return 'expired'; return tn.trial ? 'trial' : 'active'; }
const tDays = tn => tn.expiry ? daysBetween(today(), tn.expiry) : 0;
function tPill(tn) { const s = tState(tn), d = tDays(tn);
  if (s === 'suspended') return pill('red', t('st_suspended'));
  if (s === 'expired') return pill('red', t('st_expired') + ' · ' + t('ended_ago', { n: -d }));
  if (s === 'trial') return pill(d <= 3 ? 'amber' : 'blue', t('st_trial') + ' · ' + t('days_left', { n: d }));
  return pill(d <= 10 ? 'amber' : 'green', t('st_active') + ' · ' + t('till', { d: fmtDate(tn.expiry) })); }
const planOf = id => SA.plans.find(p => p.id === id) || { name: id, price: 0 };
async function loadSA() { try { SA = await api('GET', '/api/sa/overview'); } catch (e) {} }
async function saPatch(id, body, msg) { try { const j = await api('PATCH', '/api/sa/tenants/' + id, body); await loadSA(); render(); if (msg) toast(msg(j)); return j; } catch (e) { toast(t('save_err')); } }

/* ---------- dealer side: banner + gating ---------- */
function tenantBanner() {
  if (!TEN) return '';
  const ph = supportPhone() || '—'; let out = '';
  if (TEN.impersonating) out += `<div class="tbanner imp"><span>${t('imp_bar', { n: esc(TEN.name) })}</span><button class="btn small" onclick="exitImpersonate()">${t('imp_exit')}</button></div>`;
  if (TEN.status === 'trial') out += `<div class="tbanner ${TEN.daysLeft <= 3 ? 'warn' : ''}">⏳ ${t('t_trial', { n: TEN.daysLeft, p: ph })}</div>`;
  if (TEN.status === 'expired') out += `<div class="tbanner red">${t('t_expired', { p: ph })}</div>`;
  const n = TEN.news; let dis = []; try { dis = JSON.parse(localStorage.getItem('scrm-news') || '[]'); } catch (e) {}
  if (n && !dis.includes(n.id)) out += `<div class="tbanner news">📢 ${esc(n.text)}<button class="btn small ghost" onclick="dismissNews('${n.id}')" aria-label="${t('close')}">✕</button></div>`;
  return out;
}
function dismissNews(id) { try { const d = JSON.parse(localStorage.getItem('scrm-news') || '[]'); d.push(id); localStorage.setItem('scrm-news', JSON.stringify(d)); } catch (e) {} render(); }
async function exitImpersonate() { try { await api('POST', '/api/sa/exit'); } catch (e) {} closeSheet(); location.hash = 'sa-dealers'; await startApp(); }
async function openAsDealer(id) { try { await api('POST', '/api/sa/impersonate/' + id); } catch (e) { toast(t('save_err')); return; } closeSheet(); location.hash = 'dashboard'; await startApp(); }

/* ---------- super admin shell ---------- */
const IC_SA = { dealers: sv('<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>'), plans: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 15h3"/>'), news: sv('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8"/>'), log: sv('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>') };
const saRoutes = () => [['sa', 'sa_dash', IC.dash], ['sa-dealers', 'sa_dealers', IC_SA.dealers], ['sa-plans', 'sa_plans', IC_SA.plans], ['sa-posters', 'sa_posters', IC_PST], ['sa-news', 'sa_news', IC_SA.news], ['sa-log', 'sa_log', IC_SA.log]];
const saRoute = () => { const h = location.hash.slice(1); return saRoutes().some(r => r[0] === h) ? h : 'sa'; };
Object.assign(ui, { saFilter: 'all', saQ: '' });
function renderSA() {
  const r = saRoute(), rr = saRoutes();
  $('#side').innerHTML = `<div class="side-brand"><div class="logo sa-logo">SA</div><b>${BRAND}</b></div><nav class="nav">${rr.map(([k, l, i]) => `<a href="#${k}" aria-label="${t(l)}" ${k === r ? 'aria-current="page"' : ''}>${i}<span class="lbl">${t(l)}</span></a>`).join('')}</nav><div class="spacer"></div>
    <button onclick="logout()" aria-label="${t('logout')}">${IC.logout}<span class="lbl">${t('logout')}</span></button>`;
  $('#bottom').style.gridTemplateColumns = `repeat(${rr.length},1fr)`;
  $('#bottom').innerHTML = rr.map(([k, l, i]) => `<a href="#${k}" ${k === r ? 'aria-current="page"' : ''}>${i}<span>${t(l)}</span></a>`).join('');
  $('#topbar').innerHTML = `<div class="tb-brand"><div class="logo sa-logo">SA</div><span>${t('sa_brand')}</span></div><span class="pill blue" style="font-size:13px">${BRAND} · ${t('sa_brand')}</span>
    <div class="tb-actions">${langSwitch()}<button class="icon-btn" onclick="logout()" aria-label="${t('logout')}">${IC.logout}</button><button class="avatar" aria-label="${esc(me.name)}">${esc(initials(me.name))}</button></div>`;
  $('#main').innerHTML = ({ sa: saDash, 'sa-dealers': saDealers, 'sa-plans': saPlans, 'sa-posters': saPosters, 'sa-news': saNews, 'sa-log': saLog })[r]();
  if (r === 'sa-posters') saFillThumbs();
}

/* ---------- dashboard ---------- */
function saDash() {
  const T_ = SA.tenants, tt = today(), ym = tt.slice(0, 7);
  const trial = T_.filter(x => tState(x) === 'trial'), act = T_.filter(x => tState(x) === 'active'), off = T_.filter(x => ['expired', 'suspended'].includes(tState(x)));
  const mrr = act.reduce((a, x) => a + num(planOf(x.plan).price), 0);
  const got = T_.reduce((a, x) => a + (x.payments || []).filter(p => (p.date || '').startsWith(ym)).reduce((b, p) => b + num(p.amount), 0), 0);
  const ending = trial.filter(x => tDays(x) <= 7).sort((a, b) => a.expiry.localeCompare(b.expiry));
  const renew = act.filter(x => tDays(x) <= 10).sort((a, b) => a.expiry.localeCompare(b.expiry));
  const idle = T_.filter(x => tState(x) !== 'suspended' && (!x.lastLogin || Date.now() - x.lastLogin > 7 * 864e5));
  const row = (x, acts) => `<div class="list-row"><div class="click" style="cursor:pointer" onclick="saDealer('${x.id}')"><div class="r-title">${esc(x.name)}</div><div class="r-meta">${esc(x.city || '')} · ${esc(x.ownerName || '')} · ${esc(x.phone || '')}</div></div><div class="acts">${tPill(x)}${acts || ''}</div></div>`;
  const quick = x => `<button class="btn small" onclick="saPatch('${x.id}',{extendDays:7},j=>t('extended',{d:fmtDate(j.expiry)}))">${t('add7')}</button><button class="btn small dark" onclick="saDealer('${x.id}','pay')">${t('rec_pay')}</button>`;
  return `<div class="ph"><div><h1>${t('sa_hello', { n: esc(me.name) })}</h1><p class="sub">${t('sa_hello_sub')}</p></div><div class="ph-actions"><button class="btn dark" onclick="saNewDealer()">${IC.plus}${t('new_dealer').replace('+ ', '')}</button></div></div>
  <div class="dash"><div class="kpis solo">
    ${kpi(t('k_dealers'), T_.length, t('sc_active') + ': ' + act.length, 'sa-dealers', true, null)}
    ${kpi(t('k_trial'), trial.length, t('k_trial_note', { n: trial.filter(x => tDays(x) <= 3).length }), 'sa-dealers', false, null)}
    ${kpi(t('k_mrr'), rs(mrr), t('k_active') + ': ' + act.length, 'sa-plans', false, null)}
    ${kpi(t('k_month_in'), rs(got), '', 'sa-dealers', false, null)}
    ${kpi(t('k_expired'), off.length, '', 'sa-dealers', false, null)}</div>
    <div class="card half"><div class="card-h"><h2>${t('p_trial_end')}</h2></div>${ending.length ? ending.map(x => row(x, quick(x))).join('') : `<p class="empty">${t('none_here')}</p>`}</div>
    <div class="card half"><div class="card-h"><h2>${t('p_renew')}</h2></div>${renew.length ? renew.map(x => row(x, `<button class="btn small dark" onclick="saDealer('${x.id}','pay')">${t('rec_pay')}</button>`)).join('') : `<p class="empty">${t('none_here')}</p>`}</div>
    <div class="card half"><div class="card-h"><h2>${t('p_idle')}</h2></div>${idle.length ? idle.map(x => row(x, x.phone ? `<a class="btn small" href="tel:${esc(x.phone)}">${t('call')}</a>` : '')).join('') : `<p class="empty">${t('none_here')}</p>`}</div>
    <div class="card half"><div class="card-h"><h2>${t('sa_log')}</h2><a class="go" href="#sa-log" aria-label="${t('sa_log')}">${IC.arrow}</a></div>${SA.logs.slice(0, 6).map(l => `<div class="list-row"><div><div class="r-title" style="font-weight:500">${esc(l.what)}</div><div class="r-meta">${esc(l.who)} · ${hhmm(l.at)}</div></div></div>`).join('') || `<p class="empty">${t('log_none')}</p>`}</div>
  </div>`;
}

/* ---------- dealers ---------- */
function saRows() {
  const q = ui.saQ.toLowerCase();
  return SA.tenants.filter(x => { const s = tState(x);
      if (ui.saFilter === 'trial') return s === 'trial'; if (ui.saFilter === 'active') return s === 'active';
      if (ui.saFilter === 'soon') return ['trial', 'active'].includes(s) && tDays(x) <= 7; if (ui.saFilter === 'off') return ['expired', 'suspended'].includes(s); return true; })
    .filter(x => !q || [x.name, x.city, x.ownerName, x.phone, x.username].join(' ').toLowerCase().includes(q))
    .sort((a, b) => (a.expiry || '').localeCompare(b.expiry || ''));
}
function saDealers() {
  const T_ = SA.tenants, list = saRows();
  const cnt = f => T_.filter(f).length;
  const cols = [{ h: t('c_dealer'), k: 'main' }, { h: t('c_owner'), k: 'meta' }, { h: t('c_plan') }, { h: t('c_status'), k: 'side' }, { h: t('c_cars'), num: true }, { h: t('c_staff'), num: true }, { h: t('c_last') }];
  const rows = list.map(x => ({ click: `saDealer('${x.id}')`, cells: [`<div class="r-title">${esc(x.name)}</div><div class="r-meta">${esc(x.city || '')}</div>`,
    `${esc(x.ownerName || '')}<div class="r-meta">${esc(x.phone || '')} · ${esc(x.username || '')}</div>`, esc(planOf(x.plan).name), tPill(x), x.stats.cars, x.stats.staff, x.lastLogin ? hhmm(x.lastLogin) : `<span class="r-meta">${t('never')}</span>`] }));
  return `<div class="ph"><div><h1>${t('sa_dealers')}</h1><p class="sub">${t('sa_hello_sub')}</p></div></div>
  <div class="scards">${scard('blue', t('sc_trial'), cnt(x => tState(x) === 'trial'), '', 'saFilter', 'trial')}${scard('green', t('sc_active'), cnt(x => tState(x) === 'active'), '', 'saFilter', 'active')}${scard('yellow', t('sc_soon'), cnt(x => ['trial', 'active'].includes(tState(x)) && tDays(x) <= 7), '', 'saFilter', 'soon')}${scard('orange', t('sc_off'), cnt(x => ['expired', 'suspended'].includes(tState(x))), '', 'saFilter', 'off')}</div>
  <div class="tcard">${toolbar('saQ', 'search_all', list.length, 'exportSA', `${ui.saFilter !== 'all' ? `<button class="btn" onclick="ui.saFilter='all';render()">${t('f_all')}</button>` : ''}<button class="btn dark" onclick="saNewDealer()">${IC.plus}${t('new_dealer').replace('+ ', '')}</button>`)}
    ${list.length ? table('sa', cols, rows) : `<p class="empty" style="padding:18px">${t('none_here')}</p>`}</div>`;
}
function exportSA() { downloadCSV('dealers', [t('c_dealer'), t('city'), t('c_owner'), t('phone'), t('username'), t('c_plan'), t('c_status'), 'Expiry', t('c_cars'), t('c_staff')],
  saRows().map(x => [x.name, x.city, x.ownerName, x.phone, x.username, planOf(x.plan).name, tState(x), x.expiry, x.stats.cars, x.stats.staff])); }
function saNewDealer() {
  openSheet(head(t('new_dealer').replace('+ ', '')) + `<div class="fields" id="ndForm">
    ${[{ k: 'name', l: 'dealer_name', req: true }, { k: 'city', l: 'city' }, { k: 'ownerName', l: 'owner_name', req: true }, { k: 'phone', l: 'phone', type: 'tel', req: true },
      { k: 'username', l: 'owner_login', req: true }, { k: 'password', l: 'password', req: true }, { k: 'plan', l: 'plan', type: 'select', opts: SA.plans.map(p => [p.id, p.name + ' – ' + rs(p.price)]) }, { k: 'trialDays', l: 'trial_days', type: 'number' }]
      .map(f => field(f, { trialDays: 14, plan: (SA.plans[1] || SA.plans[0] || {}).id })).join('')}</div>
    <div class="sheet-foot"><button class="btn" onclick="closeSheet()">${t('cancel')}</button><button class="btn primary" onclick="saCreate()">${t('create_dealer')}</button></div>`);
  const un = $('#f_username'); if (un) un.setAttribute('autocapitalize', 'none');
}
async function saCreate() {
  const o = {}; document.querySelectorAll('#ndForm [data-k]').forEach(el => { o[el.dataset.k] = el.value.trim(); });
  o.username = (o.username || '').toLowerCase(); o.trialDays = num(o.trialDays) || 14;
  try { await api('POST', '/api/sa/tenants', o); await loadSA(); closeSheet(); render(); toast(t('dealer_created', { u: o.username })); }
  catch (e) { toast(e.error === 'exists' ? t('user_exists') : t('user_fields')); }
}
function saDealer(id, focus) {
  const x = SA.tenants.find(y => y.id === id); if (!x) return; const pl = planOf(x.plan); const s = tState(x);
  const feats = { ...{ catalog: true, wa: false }, ...(x.features || {}) };
  openSheet(head(esc(x.name)) + `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">${tPill(x)}<span class="pill">${esc(pl.name)}</span></div>
    <div class="kv"><div><span>${t('c_cars')}</span><b>${x.stats.cars}</b></div><div><span>${t('nav_leads')}</span><b>${x.stats.leads}</b></div><div><span>${t('nav_deals_short')}</span><b>${x.stats.deals}</b></div>
      <div><span>${t('c_staff')}</span><b>${x.stats.staff}</b></div><div><span>${t('c_last')}</span><b>${x.lastLogin ? hhmm(x.lastLogin) : t('never')}</b></div><div><span>${t('owner_login')}</span><b>${esc(x.username || '')}</b></div></div>
    <div class="acts" style="justify-content:flex-start;margin:12px 0">
      <button class="btn primary" onclick="openAsDealer('${x.id}')">${t('open_as')}</button>
      ${s === 'trial' || s === 'expired' ? `<button class="btn" onclick="saPatch('${x.id}',{extendDays:7},j=>t('extended',{d:fmtDate(j.expiry)})).then(()=>saDealer('${x.id}'))">${t('add7')}</button><button class="btn" onclick="saPatch('${x.id}',{extendDays:14},j=>t('extended',{d:fmtDate(j.expiry)})).then(()=>saDealer('${x.id}'))">${t('add14')}</button>` : ''}
      <button class="btn" onclick="saPatch('${x.id}',{suspended:${!x.suspended}}).then(()=>saDealer('${x.id}'))">${x.suspended ? t('activate') : t('suspend')}</button>
      <button class="btn" onclick="saResetOwner('${x.id}')">${t('reset_owner')}</button></div>
    <fieldset id="payBox"><legend>${t('g_pay')}</legend><div class="fields">
      <div class="f"><label for="pm">${t('months')}</label><select id="pm" onchange="document.querySelector('#pa').value=${num(pl.price)}*this.value">${[1, 3, 6, 12].map(m => `<option value="${m}">${m}</option>`).join('')}</select></div>
      <div class="f"><label for="pa">${t('pay_amount')}</label><input id="pa" type="number" inputmode="numeric" value="${num(pl.price)}"></div>
      <div class="f"><label for="pd">${t('date')}</label><input id="pd" type="date" value="${today()}"></div>
      <div class="f"><label for="pn">${t('pay_mode')}</label><input id="pn" placeholder="UPI / रोख / चेक"></div></div>
      <div class="sheet-foot"><button class="btn dark" onclick="saPay('${x.id}')">${t('rec_pay')}</button></div></fieldset>
    <fieldset><legend>${t('g_details')}</legend><div class="fields" id="tdForm">
      ${[{ k: 'name', l: 'dealer_name' }, { k: 'city', l: 'city' }, { k: 'ownerName', l: 'owner_name' }, { k: 'phone', l: 'phone', type: 'tel' }, { k: 'plan', l: 'plan', type: 'select', opts: SA.plans.map(p => [p.id, p.name + ' – ' + rs(p.price)]) }, { k: 'notes', l: 'notes', type: 'textarea', full: true }].map(f => field(f, x)).join('')}</div>
      <b class="dw-h">${t('g_features')}</b><div class="kchips"><label class="kchip"><input type="checkbox" id="ft_catalog" ${feats.catalog ? 'checked' : ''}> ${t('f_catalog')}</label><label class="kchip"><input type="checkbox" id="ft_wa" ${feats.wa ? 'checked' : ''}> ${t('f_wa')}</label></div>
      <div class="sheet-foot"><button class="btn primary" onclick="saSaveDetails('${x.id}')">${t('save_info')}</button></div></fieldset>
    ${saPattiBlock(x)}
    <fieldset><legend>${t('pay_hist')}</legend>${(x.payments || []).length ? x.payments.slice().reverse().map(p => `<div class="list-row"><div><div class="r-title">${rs(p.amount)}</div><div class="r-meta">${fmtDate(p.date)} · ${p.months} ${t('months')} ${p.note ? '· ' + esc(p.note) : ''}</div></div></div>`).join('') : `<p class="empty">${t('no_pay')}</p>`}</fieldset>
    <fieldset><legend>${t('g_activity')}</legend>${SA.logs.filter(l => l.tenant === x.id).slice(0, 6).map(l => `<div class="r-meta" style="padding:3px 0">${hhmm(l.at)} · ${esc(l.who)} · ${esc(l.what)}</div>`).join('') || `<p class="empty">${t('log_none')}</p>`}</fieldset>`);
  if (focus === 'pay') setTimeout(() => { const b = $('#payBox'); if (b) { b.scrollIntoView({ block: 'center' }); $('#pa').focus(); } }, 50);
}
async function saPay(id) {
  const body = { payment: { months: num($('#pm').value), amount: num($('#pa').value), date: $('#pd').value || today(), note: $('#pn').value.trim() } };
  if (!body.payment.amount) { toast(t('need_amt')); return; }
  await saPatch(id, body, j => t('pay_done', { d: fmtDate(j.expiry) })); saDealer(id);
}
async function saSaveDetails(id) {
  const o = {}; document.querySelectorAll('#tdForm [data-k]').forEach(el => { o[el.dataset.k] = el.value.trim(); });
  o.features = { catalog: $('#ft_catalog').checked, wa: $('#ft_wa').checked };
  await saPatch(id, o, () => t('saved_ok')); saDealer(id);
}
async function saResetOwner(id) {
  const x = SA.tenants.find(y => y.id === id); const p = prompt(t('new_pass_for', { n: x.ownerName || x.username })); if (p == null) return;
  if (p.length < 6) { toast(t('pass_short')); return; } await saPatch(id, { ownerPassword: p }, () => t('pass_changed'));
}

/* ---------- plans, announcements, log ---------- */
function saPlans() {
  return `<div class="ph"><div><h1>${t('sa_plans')}</h1><p class="sub">${t('plans_sub')}</p></div></div>
  <div class="card" style="margin-bottom:16px"><div class="pay"><div class="f"><label for="spPh">${t('support_ph')}</label><input id="spPh" inputmode="tel" value="${esc(SA.supportPhone || '')}"></div><button class="btn dark" onclick="saSupport()">${t('save_info')}</button></div><p class="r-meta" style="margin:8px 0 0">${t('support_ph_sub')}</p></div>
  <div class="sgrid">${SA.plans.map((p, i) => `<div class="card" data-plan="${i}"><div class="fields">
    <div class="f"><label>${t('plan_name')}</label><input data-pk="name" value="${esc(p.name)}"></div><div class="f"><label>${t('plan_price')}</label><input data-pk="price" type="number" inputmode="numeric" value="${num(p.price)}"></div>
    <div class="f"><label>${t('max_cars')}</label><input data-pk="maxCars" type="number" inputmode="numeric" value="${num(p.maxCars)}"></div><div class="f"><label>${t('max_staff')}</label><input data-pk="maxStaff" type="number" inputmode="numeric" value="${num(p.maxStaff)}"></div>
    <div class="f"><label>${t('rc_per_month')}</label><input data-pk="rcPerMonth" type="number" inputmode="numeric" value="${num(p.rcPerMonth)}"></div></div>
    <b class="dw-h">${t('g_features')}</b><div class="kchips"><label class="kchip"><input type="checkbox" data-pf="catalog" ${p.features && p.features.catalog ? 'checked' : ''}> ${t('f_catalog')}</label><label class="kchip"><input type="checkbox" data-pf="wa" ${p.features && p.features.wa ? 'checked' : ''}> ${t('f_wa')}</label></div>
    <p class="r-meta" style="margin:10px 0 0">${t('k_active')}: ${SA.tenants.filter(x => x.plan === p.id && tState(x) === 'active').length} · ${t('k_trial')}: ${SA.tenants.filter(x => x.plan === p.id && tState(x) === 'trial').length}</p></div>`).join('')}</div>
  <div class="sheet-foot"><button class="btn primary" onclick="saSavePlans()">${t('save_plans')}</button></div>`;
}
async function saSavePlans() {
  const plans = SA.plans.map((p, i) => { const card = document.querySelector(`[data-plan="${i}"]`); const o = { ...p, features: { ...(p.features || {}) } };
    card.querySelectorAll('[data-pk]').forEach(el => { o[el.dataset.pk] = el.type === 'number' ? num(el.value) : el.value.trim(); });
    card.querySelectorAll('[data-pf]').forEach(el => { o.features[el.dataset.pf] = el.checked; }); return o; });
  try { await api('PUT', '/api/sa/plans', { plans }); await loadSA(); render(); toast(t('saved_ok')); } catch (e) { toast(t('save_err')); }
}
function saNews() {
  return `<div class="ph"><div><h1>${t('sa_news')}</h1><p class="sub">${t('news_sub')}</p></div></div>
  <div class="sgrid"><div class="card"><div class="f"><label for="nwT">${t('news_text')}</label><textarea id="nwT" rows="3" placeholder="उदा. नवीन सुविधा: आता WhatsApp वरून गाडीचे फोटो पाठवा!"></textarea></div>
    <div class="sheet-foot"><button class="btn primary" onclick="saSendNews()">${t('send_news')}</button></div></div>
    <div class="card">${SA.news.length ? SA.news.slice().reverse().map(n => `<div class="list-row"><div><div class="r-title" style="font-weight:500">${esc(n.text)}</div><div class="r-meta">${hhmm(n.at)}</div></div>${n.active ? `<button class="btn small" onclick="saHideNews('${n.id}')">${t('hide')}</button>` : `<span class="pill">${t('hide')}</span>`}</div>`).join('') : `<p class="empty">${t('news_none')}</p>`}</div></div>`;
}
async function saSendNews() { const text = $('#nwT').value.trim(); if (!text) return; try { await api('POST', '/api/sa/news', { text }); await loadSA(); render(); toast(t('saved_ok')); } catch (e) { toast(t('save_err')); } }
async function saHideNews(id) { try { await api('PATCH', '/api/sa/news/' + id, { active: false }); await loadSA(); render(); } catch (e) {} }
function saLog() {
  return `<div class="ph"><div><h1>${t('sa_log')}</h1></div></div><div class="tcard"><div class="tscroll"><table><thead><tr><th>${t('c_when')}</th><th>${t('c_who')}</th><th>${t('c_what')}</th><th>${t('c_dealer')}</th></tr></thead>
  <tbody>${SA.logs.map(l => `<tr style="cursor:default"><td data-k="side">${hhmm(l.at)}</td><td data-k="meta">${esc(l.who)}</td><td data-k="main">${esc(l.what)}</td><td data-k="meta">${esc((SA.tenants.find(x => x.id === l.tenant) || {}).name || '')}</td></tr>`).join('')}</tbody></table></div>${SA.logs.length ? '' : `<p class="empty" style="padding:18px">${t('log_none')}</p>`}</div>`;
}

