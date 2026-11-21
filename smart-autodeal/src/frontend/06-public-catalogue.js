/* ================= public catalogue ================= */
const isPublic = () => /^\/c\/[\w-]+/.test(location.pathname) || /^#c\/[\w-]+/.test(location.hash);
const pubParts = () => { const m = location.pathname.match(/^\/c\/([\w-]+)(?:\/([\w-]+))?/) || location.hash.match(/^#c\/([\w-]+)(?:\/([\w-]+))?/); return m ? { tid: m[1], car: m[2] || null } : { tid: null, car: null }; };
const pubTid = () => pubParts().tid;
const pubCarId = () => pubParts().car;
const pubPath = x => '/api/public/' + encodeURIComponent(pubTid()) + x;
let PUB = null, pubActive = false, gpsVal = '';
const MEMLS = {};
const lsGet = k => { try { const v = localStorage.getItem(k); if (v) return JSON.parse(v); } catch (e) {} return MEMLS[k] || null; };
const lsSet = (k, v) => { MEMLS[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
function visitorId() { let v = lsGet('scrm-vid'); if (!v) { v = uid(); lsSet('scrm-vid', v); } return v; }
async function pubApi(method, url, body) {
  const r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw { code: r.status, ...j }; return j;
}
async function bootPublic() {
  pubActive = true; document.documentElement.lang = htmlLang();
  ['#app', '#login', '#bottom'].forEach(s => { $(s).hidden = true; }); closeSheet(); $('#pub').hidden = false;
  $('#pub').innerHTML = `<p class="empty" style="padding:40px;text-align:center">${t('loading')}</p>`;
  try { PUB = await pubApi('GET', pubPath('/catalog')); PUB.tid = pubTid(); } catch (e) { $('#pub').innerHTML = `<p class="empty" style="padding:40px;text-align:center">${e.code === 404 ? t('pub_off') : t('net_err')}</p>`; return; }
  document.documentElement.style.setProperty('--accent', ACCENTS[PUB.shop.accent] || ACCENTS.blue);
  document.title = PUB.shop.name;
  showPublic();
}
async function showPublic() {
  const id = pubCarId();
  if (id && !PUB.cars.some(c => c.id === id) && !(PUB.extra && PUB.extra.id === id)) {
    try { const j = await pubApi('GET', pubPath('/car/' + id)); PUB.extra = j.car || { id, missing: true }; } catch (e) { PUB.extra = { id, missing: true }; }
  }
  const visitor = lsGet('scrm-visitor');
  pubApi('POST', pubPath('/view'), { carId: id, visitor: visitorId() }).catch(() => {});
  if (PUB.shop.requireForm && !visitor) { renderGate(); return; }
  if (visitor && id && !(visitor.sent || []).includes(id)) {
    pubApi('POST', pubPath('/lead'), { name: visitor.name, phone: visitor.phone, location: visitor.location, carId: id, visitor: visitorId() })
      .then(() => { visitor.sent = [...(visitor.sent || []), id]; lsSet('scrm-visitor', visitor); }).catch(() => {});
  }
  renderPublic();
}
const pubHeader = back => `<header class="pub-h">${back ? `<a class="btn small" href="${publicUrl()}" onclick="goPub(event)">${t('pub_back')}</a>` : `<div class="logo">${esc(initials(PUB.shop.name).slice(0, 1))}</div><div class="pub-brand"><b>${esc(PUB.shop.name)}</b><small>${esc(PUB.shop.address)}</small></div>`}<span style="margin-left:auto">${langSwitch()}</span></header>`;
const pubImg = (c, cls) => c.photos && c.photos.length ? `<img class="${cls}" src="${photoSrc(c.photos[0])}" alt="${esc(c.company + ' ' + c.model)}" loading="lazy">` : `<div class="${cls} noimg">${IC.car}</div>`;
const pubMeta = c => [c.year, c.km ? num(c.km).toLocaleString('en-IN') + ' km' : '', ol('fuel', c.fuel)].filter(Boolean).map(esc).join(' · ');
const telHref = () => 'tel:' + esc(PUB.shop.phone);
const waHref = msg => `https://wa.me/91${waNum(PUB.shop.whatsapp || PUB.shop.phone)}?text=${encodeURIComponent(msg)}`;
const pubUi = { fuel: 'all', q: '' };
function carCard(c) {
  return `<a class="pcard" href="${publicUrl(c.id)}" onclick="goPub(event,'${c.id}')">${pubImg(c, 'pimg')}<div class="pbody"><b>${esc(c.company)} ${esc(c.model)}</b><span>${pubMeta(c)}</span>
    <div class="pfoot"><strong>${c.price ? rs(c.price) : t('price_ask')}</strong>${c.status === 'booked' ? pill('amber', t('pub_booked')) : ''}</div></div></a>`;
}
function renderPublic() {
  const id = pubCarId(); const sh = PUB.shop;
  const back = window.DEMO ? `<a class="demo-back" href="#dashboard">${t('demo_back')}</a>` : '';
  if (!id) {
    const fuels = [...new Set(PUB.cars.map(c => c.fuel).filter(Boolean))];
    const q = pubUi.q.toLowerCase();
    const list = PUB.cars.filter(c => (pubUi.fuel === 'all' || c.fuel === pubUi.fuel) && (!q || (c.company + ' ' + c.model).toLowerCase().includes(q)));
    $('#pub').innerHTML = `${pubHeader(false)}<main class="pub-main">
      <section class="pub-hero"><h1>${t('pub_cars')}</h1><p>${esc(sh.intro) || t('pub_avail', { n: PUB.cars.length })}</p>
        <div class="acts" style="justify-content:flex-start"><a class="btn primary" href="${telHref()}">${t('pub_call')}</a><a class="btn" target="_blank" rel="noopener" href="${waHref(t('pub_wa_shop'))}">WhatsApp</a>${sh.mapUrl ? `<a class="btn" target="_blank" rel="noopener" href="${esc(sh.mapUrl)}">${t('pub_map')}</a>` : ''}</div></section>
      <div class="pub-filters"><input class="search" type="search" placeholder="${t('pub_search')}" value="${esc(pubUi.q)}" oninput="pubUi.q=this.value;clearTimeout(window._ps);window._ps=setTimeout(()=>{renderPublic();const s=document.querySelector('.pub-filters .search');s.focus();s.setSelectionRange(s.value.length,s.value.length)},250)">
        <div class="seg">${[['all', t('pub_all')], ...fuels.map(f => [f, ol('fuel', f)])].map(([k, l]) => `<button aria-pressed="${pubUi.fuel === k}" onclick="pubUi.fuel='${k}';renderPublic()">${esc(l)}</button>`).join('')}</div></div>
      ${list.length ? `<div class="pub-grid">${list.map(carCard).join('')}</div>` : `<p class="empty" style="padding:20px 0">${t('pub_none')}</p>`}
      <footer class="pub-foot">${esc(sh.name)} · ${esc(sh.phone)}<br><small>Powered by ${BRAND}</small></footer></main>${back}`;
    return;
  }
  const c = PUB.cars.find(x => x.id === id) || PUB.extra;
  const others = PUB.cars.filter(x => x.id !== id).slice(0, 4);
  if (!c || c.missing || c.sold) {
    $('#pub').innerHTML = `${pubHeader(true)}<main class="pub-main"><div class="card" style="margin:16px 0"><p style="margin:0">${c && c.sold ? t('pub_sold') : t('pub_nf')}</p></div>
      <h2 style="margin:18px 0 10px">${t('pub_more')}</h2><div class="pub-grid">${PUB.cars.slice(0, 8).map(carCard).join('')}</div></main>${back}`;
    return;
  }
  const v = lsGet('scrm-visitor');
  const label = `${c.company} ${c.model}`.trim();
  const specs = [[t('pub_year'), c.year], [t('pub_km'), c.km ? num(c.km).toLocaleString('en-IN') : ''], [t('pub_fuel'), ol('fuel', c.fuel)], [t('pub_color'), c.color],
    [t('pub_owner'), c.ownerNo ? (num(c.ownerNo) === 1 ? t('pub_owner_1') : t('pub_owner_n', { n: c.ownerNo })) : ''], [t('pub_reg'), c.reg], [t('pub_ins'), c.insurance ? fmtDate(c.insurance) : '']].filter(x => x[1]);
  const msg = t('pub_wa_msg', { c: label, r: c.reg }) + (v ? ` – ${v.name}` : '') + '\n' + publicUrl(c.id);
  $('#pub').innerHTML = `${pubHeader(true)}<main class="pub-main pub-car">
    <div class="gal" id="gal">${c.photos && c.photos.length ? c.photos.map(p => `<img src="${photoSrc(p)}" alt="${esc(label)}">`).join('') : `<div class="noimg">${IC.car}</div>`}</div>
    ${c.photos && c.photos.length > 1 ? `<div class="gal-n" id="galN">1 / ${c.photos.length}</div>` : ''}
    <h1 style="margin-top:14px">${esc(label)}</h1><p class="sub">${pubMeta(c)} ${c.status === 'booked' ? pill('amber', t('pub_booked')) : ''}</p>
    <div class="pub-price">${c.price ? rs(c.price) : t('price_ask')}</div>
    <div class="specs">${specs.map(([k, val]) => `<div><span>${k}</span><b>${esc(val)}</b></div>`).join('')}</div>
    ${c.features ? `<div class="card" style="margin-top:14px;white-space:pre-line">${esc(c.features)}</div>` : ''}
    ${others.length ? `<h2 style="margin:22px 0 10px">${t('pub_more')}</h2><div class="pub-grid">${others.map(carCard).join('')}</div>` : ''}
    <footer class="pub-foot">${esc(sh.name)} · ${esc(sh.address)}<br><small>Powered by ${BRAND}</small></footer></main>
    <div class="pub-bar"><a class="btn" href="${telHref()}">${t('pub_call')}</a><a class="btn primary" target="_blank" rel="noopener" href="${waHref(msg)}">${t('pub_ask_wa')}</a></div>${back}`;
  const g = $('#gal'), n = $('#galN');
  if (g && n) g.addEventListener('scroll', () => { n.textContent = `${Math.round(g.scrollLeft / g.clientWidth) + 1} / ${c.photos.length}`; }, { passive: true });
  window.scrollTo(0, 0);
}
function goPub(e, id) {
  if (useHashLinks()) return; // normal hash navigation
  e.preventDefault(); history.pushState(null, '', '/c/' + pubTid() + (id ? '/' + id : '')); showPublic();
}
addEventListener('popstate', () => { if (isPublic()) { if (PUB && PUB.tid === pubTid()) showPublic(); else bootPublic(); } });
addEventListener('hashchange', () => {
  if (isPublic()) { if (PUB && PUB.tid === pubTid()) showPublic(); else bootPublic(); }
  else if (pubActive) { pubActive = false; $('#pub').hidden = true; document.title = (S.shop.name ? S.shop.name + ' – ' : '') + BRAND; applyTheme(); if (me) { $('#app').hidden = false; $('#bottom').hidden = false; render(); sync(false); loadMkt(); } else boot(); }
});
function renderGate() {
  const sh = PUB.shop; const c = PUB.cars.find(x => x.id === pubCarId()) || (PUB.extra && !PUB.extra.missing ? PUB.extra : null);
  $('#pub').innerHTML = `${pubHeader(false)}<main class="pub-main"><form class="gate card" onsubmit="submitGate(event)" novalidate>
    ${c ? `${pubImg(c, 'gate-img')}<p class="r-meta" style="margin:8px 0 0">${esc(c.company)} ${esc(c.model)} · ${pubMeta(c)}</p>` : ''}
    <h1 style="margin-top:10px">${t('gate_title')}</h1><p class="sub" style="margin-bottom:14px">${t('gate_sub')}</p>
    <div class="f"><label for="g_name">${t('gate_name')}</label><input id="g_name" autocomplete="name" required></div>
    <div class="f"><label for="g_phone">${t('gate_phone')}</label><input id="g_phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="14" required></div>
    <div class="f"><label for="g_loc">${t('gate_loc')}</label><input id="g_loc" autocomplete="address-level2"></div>
    <button type="button" class="btn small" id="gpsBtn" onclick="useGps()" style="margin-top:6px">${t('gate_gps')}</button>
    <p class="login-err" id="g_err" role="alert"></p>
    <button class="btn primary" type="submit" style="width:100%;justify-content:center">${t('gate_btn')}</button>
    <p class="r-meta" style="margin:10px 0 0;text-align:center">${t('gate_privacy', { s: esc(sh.name) })}</p></form></main>${window.DEMO ? `<a class="demo-back" href="#dashboard">${t('demo_back')}</a>` : ''}`;
}
function useGps() {
  if (!navigator.geolocation) { $('#g_err').textContent = t('gate_gps_err'); return; }
  navigator.geolocation.getCurrentPosition(p => { gpsVal = p.coords.latitude.toFixed(5) + ',' + p.coords.longitude.toFixed(5); $('#gpsBtn').textContent = t('gate_gps_ok'); },
    () => { $('#g_err').textContent = t('gate_gps_err'); }, { timeout: 10000 });
}
async function submitGate(e) {
  e.preventDefault();
  const name = $('#g_name').value.trim(), phone = $('#g_phone').value.replace(/\D/g, '').slice(-10), location = $('#g_loc').value.trim();
  const err = $('#g_err');
  if (name.length < 2) { err.textContent = t('gate_err_name'); return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { err.textContent = t('gate_err_phone'); return; }
  if (!location && !gpsVal) { err.textContent = t('gate_err_loc'); return; }
  const carId = pubCarId();
  try { await pubApi('POST', pubPath('/lead'), { name, phone, location, geo: gpsVal, carId, visitor: visitorId() }); }
  catch (x) { err.textContent = x.code === 429 ? t('gate_wait') : t('net_err'); return; }
  lsSet('scrm-visitor', { name, phone, location, sent: carId ? [carId] : [] });
  renderPublic();
}

function pubRefresh() { if (PUB.shop.requireForm && !lsGet('scrm-visitor')) renderGate(); else renderPublic(); }

/* ================= WhatsApp module ================= */
Object.assign(T, {
  nav_wa:['WhatsApp','WhatsApp'], wa_title:['WhatsApp','WhatsApp'], wa_sub:['सर्व चॅट, जाहिरातीतून आलेले ग्राहक आणि आपोआप उत्तरे एका ठिकाणी','All chats, ad leads and auto-replies in one place'],
  tab_inbox:['इनबॉक्स','Inbox'], tab_bc:['ब्रॉडकास्ट','Broadcast'], tab_ads:['जाहिराती','Ads'], tab_auto:['स्वयंचलित','Automation'],
  f_mine:['माझे','Mine'], f_unread:['न वाचलेले','Unread'], f_closed:['बंद','Closed'], f_ads:['जाहिरात','From ads'],
  search_chats:['नाव किंवा नंबर शोधा','Search name or number'], no_chats:['इथे कोणतेही चॅट नाही.','No chats here.'], pick_chat:['डावीकडून एखादे चॅट निवडा','Pick a chat on the left'],
  from_ad:['जाहिरात: {a}','Ad: {a}'], assign_to:['कोणाकडे','Assigned to'], nobody:['कोणीही नाही','Unassigned'], close_chat:['✓ बंद करा','✓ Close'], reopen_chat:['पुन्हा उघडा','Reopen'],
  open_lead:['CRM मध्ये पहा','Open in CRM'], type_msg:['मेसेज लिहा…','Type a message…'], type_note:['अंतर्गत नोंद (ग्राहकाला दिसणार नाही)…','Internal note (customer won’t see)…'],
  send:['पाठवा','Send'], note_mode:['नोंद','Note'], quick:['तयार उत्तरे','Quick replies'], send_car:['गाडी पाठवा','Send a car'], send_tpl:['Template पाठवा','Send template'],
  window_closed:['ग्राहकाचा शेवटचा मेसेज २४ तासांपूर्वीचा आहे. WhatsApp च्या नियमानुसार आता फक्त मंजूर Template पाठवता येईल.','The customer’s last message is over 24 hours old. WhatsApp only allows an approved template now.'],
  window_left:['उत्तर देण्यासाठी {h} तास बाकी','{h}h left to reply freely'], dnc:['संपर्क नको (STOP)','Do not contact (STOP)'], dnc_on:['या ग्राहकाने STOP म्हटले आहे. मेसेज पाठवू नका.','This customer said STOP. Don’t message them.'],
  internal:['अंतर्गत नोंद','Internal note'], auto_tag:['आपोआप','Auto'], sim_in:['📩 नमुना मेसेज (डेमो)','📩 Sample message (demo)'], sim_note:['डेमो: जाहिरातीतून नवीन ग्राहकाचा मेसेज आल्यासारखे दाखवते.','Demo: simulates a new customer messaging from an ad.'],
  labels:['लेबल','Labels'], lb_hot:['गरम','Hot'], lb_test:['टेस्ट ड्राइव्ह','Test drive'], lb_loan:['लोन हवे','Needs loan'], lb_exchange:['एक्सचेंज','Exchange'], lb_price:['किंमत विचारली','Asked price'],
  pick_tpl:['Template निवडा','Choose a template'], pick_car:['पाठवायची गाडी निवडा','Choose a car to send'], car_msg:['🚗 {c} {y}\n{p}\nफोटो आणि माहिती: {u}','🚗 {c} {y}\n{p}\nPhotos & details: {u}'],
  bc_title:['नवीन ब्रॉडकास्ट','New broadcast'], bc_name:['मोहिमेचे नाव','Campaign name'], bc_tpl:['Template','Template'], bc_aud:['कोणाला','Audience'], bc_status:['ग्राहक स्थिती','Customer status'], bc_source:['स्रोत','Source'],
  aud_open:['सर्व चालू ग्राहक','All open customers'], aud_all:['सर्व ग्राहक','All customers'], aud_n:['{n} ग्राहकांना जाईल','Goes to {n} customers'], aud_skip:['{n} वगळले (STOP / नंबर नाही)','{n} skipped (STOP / no number)'],
  bc_send:['ब्रॉडकास्ट पाठवा','Send broadcast'], bc_confirm:['{n} ग्राहकांना मेसेज पाठवायचा?','Send to {n} customers?'], bc_sent:['ब्रॉडकास्ट पाठवला','Broadcast sent'], bc_hist:['मागील ब्रॉडकास्ट','Past broadcasts'], bc_none:['अजून ब्रॉडकास्ट नाही.','No broadcasts yet.'],
  bc_stats:['{s} पाठवले · {d} पोहोचले · {r} वाचले · {p} उत्तर','{s} sent · {d} delivered · {r} read · {p} replied'], bc_rule:['ब्रॉडकास्ट फक्त Meta-मंजूर Template ने जातो. एकदम खूप लोकांना पाठवू नका; STOP म्हणणारे आपोआप वगळले जातात.','Broadcasts use only Meta-approved templates. Don’t blast too many at once; STOP contacts are skipped automatically.'],
  ads_title:['जाहिरातनिहाय निकाल','Results by ad'], ads_sub:['Meta (Click-to-WhatsApp) जाहिरातीतून आलेले चॅट, टेस्ट ड्राइव्ह आणि विक्री. खर्च टाकला की एका विक्रीमागे खर्च दिसतो.','Chats, test drives and sales from Meta (Click-to-WhatsApp) ads. Enter spend to see cost per sale.'],
  c_ad:['जाहिरात','Ad'], c_chats:['चॅट','Chats'], c_tests:['टेस्ट ड्राइव्ह','Test drives'], c_sales:['विक्री','Sales'], c_spend:['खर्च ₹','Spend ₹'], c_cpc:['प्रति चॅट','Per chat'], c_cps:['प्रति विक्री','Per sale'],
  ads_none:['अजून जाहिरातीतून चॅट आलेले नाहीत.','No chats from ads yet.'], ads_total:['एकूण','Total'],
  au_title:['आपोआप होणारी कामे','Automations'], au_welcome:['स्वागत संदेश (पहिला मेसेज आल्यावर)','Welcome message (on first message)'], au_away:['दुकान बंद असताना उत्तर','Away reply (outside hours)'], au_hours:['दुकानाची वेळ','Shop hours'],
  au_lead:['नवीन चॅटवरून ग्राहक आपोआप CRM मध्ये','Auto-create customer in CRM from new chats'], au_stop:['STOP लिहिल्यावर "संपर्क नको" करा','Mark “do not contact” when they write STOP'],
  au_kw:['शब्दानुसार उत्तरे','Keyword replies'], au_kw_sub:['ग्राहकाच्या मेसेजमध्ये हा शब्द आला की हे उत्तर आपोआप जाते.','When a customer’s message contains the word, this reply goes automatically.'], kw_word:['शब्द','Word'], kw_reply:['उत्तर','Reply'],
  au_quick:['तयार उत्तरे','Quick replies'], qr_short:['शॉर्टकट','Shortcut'], au_tpl:['Templates (Meta मंजुरी)','Templates (Meta approval)'], tpl_name:['नाव','Name'], tpl_cat:['प्रकार','Category'], tpl_text:['मजकूर ({{1}} = ग्राहकाचे नाव)','Text ({{1}} = customer name)'],
  tpl_mkt:['मार्केटिंग','Marketing'], tpl_util:['सेवा / आठवण','Utility'], tpl_ok:['मंजूर','Approved'], tpl_wait:['मंजुरी बाकी','Pending'], add_tpl:['+ Template','+ Template'], save_auto:['सेव्ह करा','Save'], vars_help:['मजकुरात {name} = ग्राहकाचे नाव, {link} = कॅटलॉग लिंक, {shop} = दुकानाचे नाव','In text, {name} = customer name, {link} = catalogue link, {shop} = shop name'],
  src_meta:['Meta जाहिरात','Meta ad'], src_wa:['WhatsApp','WhatsApp'], src_group:['WhatsApp ग्रुप','WhatsApp group'], src_import:['इम्पोर्ट','Import'], st_cold:['थंड','Cold'],
  imp_title:['ग्राहक इम्पोर्ट','Import customers'], imp_btn:['⬆ इम्पोर्ट','⬆ Import'], imp_csv:['Excel / CSV फाईल','Excel / CSV file'], imp_csv_help:['पहिल्या ओळीत कॉलमची नावे: नाव, मोबाईल, गाव (Name, Phone, City). Excel मधून "Save as CSV" करा.','First row = column names: Name, Phone, City. In Excel use “Save as CSV”.'],
  imp_wa:['WhatsApp ग्रुप "Export chat" फाईल','WhatsApp group “Export chat” file'], imp_wa_help:['ग्रुप उघडा → ⋮ → More → Export chat → Without media. आलेली .txt फाईल इथे द्या. फक्त मेसेज केलेले, सेव्ह न केलेले नंबर मिळतात.','Open the group → ⋮ → More → Export chat → Without media. Upload the .txt here. Only numbers of people who messaged (and aren’t saved) appear.'],
  imp_group:['ग्रुपचे नाव','Group name'], imp_file:['फाईल निवडा','Choose file'], imp_prev:['{a} नवीन · {b} आधीपासून आहेत · {c} चुकीचे नंबर','{a} new · {b} already exist · {c} invalid numbers'], imp_go:['{n} ग्राहक इम्पोर्ट करा','Import {n} customers'],
  imp_ok:['{n} ग्राहक इम्पोर्ट झाले','{n} customers imported'], imp_none:['फाईलमध्ये नवीन नंबर सापडले नाहीत','No new numbers found in the file'], imp_cold_note:['इम्पोर्ट केलेले ग्राहक "थंड" स्थितीत येतात. त्यांना एकदम मेसेज पाठवू नका; एकेकाला वैयक्तिक मेसेज करा.','Imported customers come in as “Cold”. Don’t blast them; message one by one.'],
  open_chat:['WhatsApp चॅट','WhatsApp chat'], wa_badge:['{n} न वाचलेले','{n} unread'],
});
OPT.source.meta_ad = ['Meta जाहिरात', 'Meta ad']; OPT.source.whatsapp = ['WhatsApp', 'WhatsApp']; OPT.source.wa_group = ['WhatsApp ग्रुप', 'WhatsApp group']; OPT.source.import = ['इम्पोर्ट', 'Import'];
OPT.leadSt.cold = ['थंड', 'Cold'];
S.chats = []; S.broadcasts = [];
const IC_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 14h4"/></svg>';
const WA_LABELS = ['lb_hot', 'lb_test', 'lb_loan', 'lb_exchange', 'lb_price'];
const WA_DEFAULT = {
  welcomeOn: true, welcomeText: 'नमस्कार {name} 🙏 {shop} मध्ये आपले स्वागत! आमच्या सर्व गाड्या फोटो आणि किंमतीसह इथे पहा: {link}\nकोणती गाडी आवडली ते सांगा, आम्ही लगेच माहिती देतो.',
  awayOn: true, awayText: 'नमस्कार {name}, आत्ता दुकान बंद आहे. उद्या सकाळी आम्ही नक्की उत्तर देऊ. तोपर्यंत गाड्या इथे पहा: {link}', from: '09:30', to: '19:30',
  autoLead: true, stopOn: true,
  keywords: [{ k: 'किंमत', r: 'सर्व गाड्यांच्या किंमती इथे आहेत: {link}' }, { k: 'price', r: 'All car prices are here: {link}' }, { k: 'लोकेशन', r: '{shop} चा पत्ता: {address}' }, { k: 'loan', r: 'हो, आम्ही बँक लोन करून देतो. तुमचे गाव आणि पगार/व्यवसाय सांगा.' }],
  quick: [{ k: '/hi', r: 'नमस्कार {name}, बोला, कोणती गाडी हवी आहे?' }, { k: '/test', r: 'टेस्ट ड्राइव्हसाठी उद्या केव्हा येऊ शकाल? सकाळी की संध्याकाळी?' }, { k: '/docs', r: 'गाडीची सर्व कागदपत्रे (RC, इन्शुरन्स, NOC) तयार आहेत.' }, { k: '/loc', r: '{shop} – {address}' }],
  templates: [
    { id: 't1', name: 'new_stock', cat: 'mkt', status: 'ok', text: 'नमस्कार {{1}}, आमच्याकडे नवीन गाड्या आल्या आहेत! फोटो आणि किंमत पहा: {link}' },
    { id: 't2', name: 'follow_up', cat: 'mkt', status: 'ok', text: 'नमस्कार {{1}}, तुम्ही विचारलेल्या गाडीबद्दल आणखी माहिती हवी आहे का? टेस्ट ड्राइव्हसाठी कधीही या.' },
    { id: 't3', name: 'payment_reminder', cat: 'util', status: 'ok', text: 'नमस्कार {{1}}, तुमच्या गाडीची बाकी रक्कम देण्याची तारीख जवळ आली आहे. काही प्रश्न असल्यास कळवा.' },
    { id: 't4', name: 'thank_you_review', cat: 'util', status: 'ok', text: 'धन्यवाद {{1}}! नवीन गाडीसाठी शुभेच्छा 🚗 आमचा अनुभव कसा वाटला ते Google वर लिहाल का?' },
  ],
  adSpend: {},
};
const waCfg = () => ({ ...WA_DEFAULT, ...(S.shop.wa || {}) });
const fillVars = (s, c) => String(s || '').split('{name}').join((c && c.name) || '').split('{link}').join(publicUrl()).split('{shop}').join(S.shop.name || '').split('{address}').join(S.shop.address || '');
const within24 = c => c.lastInboundAt && Date.now() - c.lastInboundAt < 864e5;
const chatLead = c => c.leadId && S.leads.find(l => l.id === c.leadId);
const isDNC = c => { const l = chatLead(c); return !!(l && l.dnc); };
const unreadTotal = () => S.chats.reduce((a, c) => a + (c.status === 'closed' ? 0 : num(c.unread)), 0);
const hhmm = ts => { const d = new Date(ts); const same = new Date().toDateString() === d.toDateString(); return same ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); };
const waStatusTick = s => s === 'read' ? '<span style="color:#34B7F1">✓✓</span>' : s === 'delivered' ? '✓✓' : '✓';
Object.assign(ui, { waTab: 'inbox', waFilter: 'open', waQ: '', waChat: null, waNote: false });

function viewWa() {
  const tabs = [['inbox', 'tab_inbox'], ['bc', 'tab_bc'], ['ads', 'tab_ads'], ...(isAdmin() ? [['auto', 'tab_auto']] : [])];
  const head = `<div class="ph"><div><h1>${t('wa_title')}</h1><p class="sub">${t('wa_sub')}</p></div>
    <div class="ph-actions">${window.DEMO ? `<button class="btn" onclick="simulateInbound()" title="${t('sim_note')}">${t('sim_in')}</button>` : ''}</div></div>
    <div class="seg wa-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-pressed="${ui.waTab === k}" onclick="ui.waTab='${k}';render()">${t(l)}${k === 'inbox' && unreadTotal() ? ` <span class="ubadge">${unreadTotal()}</span>` : ''}</button>`).join('')}</div>`;
  return head + ({ inbox: waInbox, bc: waBroadcast, ads: waAds, auto: waAuto }[ui.waTab] || waInbox)();
}

/* ---------- inbox ---------- */
function waInbox() {
  const q = ui.waQ.toLowerCase();
  const list = S.chats.filter(c => {
      if (ui.waFilter === 'closed') return c.status === 'closed';
      if (c.status === 'closed') return false;
      if (ui.waFilter === 'mine') return c.assignee === me.name;
      if (ui.waFilter === 'unread') return num(c.unread) > 0;
      if (ui.waFilter === 'ads') return !!c.adName;
      return true; })
    .filter(c => !q || [c.name, c.phone].join(' ').toLowerCase().includes(q))
    .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0));
  const chips = [['open', 'f_open'], ['mine', 'f_mine'], ['unread', 'f_unread'], ['ads', 'f_ads'], ['closed', 'f_closed']];
  const cur = S.chats.find(c => c.id === ui.waChat);
  const items = list.map(c => { const lm = (c.messages || []).filter(m => m.dir !== 'note').slice(-1)[0];
    return `<button class="ci ${cur && cur.id === c.id ? 'on' : ''}" onclick="openChat('${c.id}')"><span class="avatar">${esc(initials(c.name || c.phone))}</span>
      <span class="ci-m"><span class="ci-t"><b>${esc(c.name || c.phone)}</b><small>${c.lastAt ? hhmm(c.lastAt) : ''}</small></span>
      <span class="ci-s">${lm ? (lm.dir === 'out' ? waStatusTick(lm.status) + ' ' : '') + esc(String(lm.text || '').split('\n')[0]).slice(0, 60) : ''}</span>
      <span class="ci-tags">${c.adName ? `<span class="pill blue">${esc(c.adName).slice(0, 22)}</span>` : ''}${num(c.unread) ? `<span class="ubadge">${c.unread}</span>` : ''}</span></span></button>`; }).join('');
  return `<div class="wa ${cur ? 'has-chat' : ''}">
    <aside class="wa-list"><div class="wa-lh"><input class="search" type="search" placeholder="${t('search_chats')}" value="${esc(ui.waQ)}" oninput="ui.waQ=this.value;clearTimeout(window._wq);window._wq=setTimeout(()=>{render();const s=document.querySelector('.wa-lh .search');s.focus();s.setSelectionRange(s.value.length,s.value.length)},250)">
      <div class="wa-chips">${chips.map(([k, l]) => `<button class="chip" aria-pressed="${ui.waFilter === k}" onclick="ui.waFilter='${k}';render()">${t(l)}</button>`).join('')}</div></div>
      <div class="wa-items">${items || `<p class="empty" style="padding:16px">${t('no_chats')}</p>`}</div></aside>
    <section class="wa-chat">${cur ? chatPane(cur) : `<div class="wa-empty">${IC_CHAT}<p>${t('pick_chat')}</p></div>`}</section></div>`;
}
function chatPane(c) {
  const lead = chatLead(c); const dnc = isDNC(c); const open24 = within24(c);
  const hoursLeft = open24 ? Math.max(1, Math.ceil((864e5 - (Date.now() - c.lastInboundAt)) / 36e5)) : 0;
  let lastDay = '';
  const msgs = (c.messages || []).map(m => { const day = new Date(m.at).toLocaleDateString(loc(), { day: 'numeric', month: 'long' }); const sep = day !== lastDay ? `<div class="day-sep"><span>${day}</span></div>` : ''; lastDay = day;
    const cls = m.dir === 'note' ? 'note' : m.dir;
    return `${sep}<div class="msg ${cls}">${m.dir === 'note' ? `<small class="mtag">📝 ${t('internal')} · ${esc(m.by || '')}</small>` : ''}${m.tpl ? `<small class="mtag">Template · ${esc(m.tpl)}</small>` : ''}${m.auto ? `<small class="mtag">⚡ ${t('auto_tag')}</small>` : ''}
      ${m.img ? `<img class="mimg" src="${m.img}" alt="">` : ''}<div class="mtext">${esc(m.text).replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s<]+|file:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')}</div>
      <div class="mmeta">${new Date(m.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}${m.dir === 'out' ? ' ' + waStatusTick(m.status) : ''}${m.dir === 'out' && m.by ? ' · ' + esc(m.by) : ''}</div></div>`; }).join('');
  const staff = [...new Set([me.name, ...S.chats.map(x => x.assignee).filter(Boolean)])];
  return `<header class="wa-ch">
      <button class="btn small ghost wa-back" onclick="ui.waChat=null;render()" aria-label="${t('close')}">${IC.chevL}</button>
      <span class="avatar">${esc(initials(c.name || c.phone))}</span>
      <div class="wa-chn"><b>${esc(c.name || c.phone)}</b><small>+91 ${esc(c.phone)}${c.adName ? ' · ' + t('from_ad', { a: esc(c.adName) }) : ''}</small></div>
      <div class="wa-cha">
        <select class="search" style="flex:none;min-width:0" aria-label="${t('assign_to')}" onchange="assignChat('${c.id}',this.value)"><option value="">${t('nobody')}</option>${staff.map(n => `<option ${c.assignee === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
        ${lead ? `<button class="btn small" onclick="openLead('${lead.id}')">${t('open_lead')}</button>` : ''}
        <button class="btn small ${c.status === 'closed' ? '' : 'dark'}" onclick="setChatStatus('${c.id}','${c.status === 'closed' ? 'open' : 'closed'}')">${c.status === 'closed' ? t('reopen_chat') : t('close_chat')}</button>
      </div></header>
    <div class="wa-labels">${WA_LABELS.map(k => `<button class="chip" aria-pressed="${(c.labels || []).includes(k)}" onclick="toggleLabel('${c.id}','${k}')">${t(k)}</button>`).join('')}${open24 ? `<span class="r-meta" style="margin-left:auto">⏱ ${t('window_left', { h: hoursLeft })}</span>` : ''}</div>
    <div class="wa-msgs" id="waMsgs">${msgs}</div>
    ${dnc ? `<div class="wa-warn red">${t('dnc_on')}</div>` : !open24 && !ui.waNote ? `<div class="wa-warn">${t('window_closed')} <button class="btn small primary" onclick="pickTemplate('${c.id}')">${t('send_tpl')}</button></div>` : ''}
    <footer class="wa-comp ${ui.waNote ? 'is-note' : ''}">
      <div class="wa-tools"><button class="btn small ${ui.waNote ? 'dark' : ''}" onclick="ui.waNote=!ui.waNote;render()">📝 ${t('note_mode')}</button>
        <button class="btn small" ${!open24 || dnc ? 'disabled' : ''} onclick="pickQuick('${c.id}')">⚡ ${t('quick')}</button>
        <button class="btn small" ${!open24 || dnc ? 'disabled' : ''} onclick="pickCar('${c.id}')">🚗 ${t('send_car')}</button>
        <button class="btn small" ${dnc ? 'disabled' : ''} onclick="pickTemplate('${c.id}')">📄 ${t('send_tpl')}</button></div>
      <div class="wa-row"><textarea id="waText" rows="1" placeholder="${ui.waNote ? t('type_note') : t('type_msg')}" ${(!open24 || dnc) && !ui.waNote ? 'disabled' : ''} onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendWa('${c.id}')}" oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,140)+'px';if(this.value.startsWith('/'))quickMatch('${c.id}',this.value)"></textarea>
      <button class="btn primary" ${(!open24 || dnc) && !ui.waNote ? 'disabled' : ''} onclick="sendWa('${c.id}')">${t('send')}</button></div></footer>`;
}
async function saveChat(c) { c.lastAt = Math.max(c.lastAt || 0, ...(c.messages || []).map(m => m.at)); return save('chats', c); }
function simulateStatus(chatId, msgId) {
  [['delivered', 1200], ['read', 3500]].forEach(([st, ms]) => setTimeout(async () => { const c = S.chats.find(x => x.id === chatId); const m = c && c.messages.find(x => x.id === msgId); if (!m || m.status === 'read') return; m.status = st; await save('chats', clone(c)); }, ms));
}
async function pushOut(c, msg) {
  const m = { id: uid(), dir: 'out', at: Date.now(), status: 'sent', by: me.name, ...msg };
  c.messages = [...(c.messages || []), m]; c.unread = 0;
  if (await saveChat(c)) { if (window.DEMO) simulateStatus(c.id, m.id); return true; } return false;
}
async function sendWa(id) {
  const el = $('#waText'); const text = el.value.trim(); if (!text) return;
  const c = clone(S.chats.find(x => x.id === id));
  if (ui.waNote) { c.messages = [...(c.messages || []), { id: uid(), dir: 'note', at: Date.now(), by: me.name, text }]; await saveChat(c); return; }
  if (!within24(c) || isDNC(c)) return;
  await pushOut(c, { text });
}
async function openChat(id) {
  ui.waChat = id; ui.waNote = false; const c = S.chats.find(x => x.id === id);
  if (c && num(c.unread)) { const cc = clone(c); cc.unread = 0; await save('chats', cc); } else render();
}
async function setChatStatus(id, st) { const c = clone(S.chats.find(x => x.id === id)); c.status = st; await save('chats', c); }
async function assignChat(id, who) { const c = clone(S.chats.find(x => x.id === id)); c.assignee = who; await save('chats', c); }
async function toggleLabel(id, k) { const c = clone(S.chats.find(x => x.id === id)); const s2 = new Set(c.labels || []); s2.has(k) ? s2.delete(k) : s2.add(k); c.labels = [...s2]; await save('chats', c);
  const l = chatLead(c); if (l && k === 'lb_test' && s2.has(k) && ['new', 'follow', 'cold'].includes(l.status)) await save('leads', { ...l, status: 'test' }); }
function quickMatch(id, v) { const q = waCfg().quick.find(x => x.k === v.trim()); if (q) { const c = S.chats.find(x => x.id === id); $('#waText').value = fillVars(q.r, c); } }
function pickQuick(id) {
  const c = S.chats.find(x => x.id === id);
  openSheet(head(t('quick')) + waCfg().quick.map((q, i) => `<div class="alert-row" onclick="closeSheet();document.querySelector('#waText').value=${esc(JSON.stringify(fillVars(q.r, c)))};document.querySelector('#waText').focus()"><span class="pill blue">${esc(q.k)}</span><span>${esc(fillVars(q.r, c))}</span></div>`).join(''));
}
function pickCar(id) {
  const cars = S.cars.filter(x => x.status !== 'sold');
  openSheet(head(t('pick_car')) + cars.map(x => `<div class="alert-row" onclick="sendCar('${id}','${x.id}')"><span class="cthumb">${x.photos && x.photos.length ? `<img src="${photoSrc(x.photos[0])}" alt="">` : IC.car}</span><span><b>${esc(carLabel(x))}</b> ${esc(x.year || '')}<br><span class="r-meta">${rs(x.askPrice)} · ${esc(x.reg || '')}</span></span></div>`).join(''));
}
async function sendCar(id, carId) {
  closeSheet(); const c = clone(S.chats.find(x => x.id === id)); const car = S.cars.find(x => x.id === carId);
  const text = t('car_msg', { c: carLabel(car), y: car.year || '', p: S.shop.showPrice !== false && num(car.askPrice) ? rs(car.askPrice) : t('price_ask'), u: publicUrl(car.id) });
  await pushOut(c, { text, img: car.photos && car.photos.length ? photoSrc(car.photos[0]) : '' });
  const l = chatLead(c); if (l && !l.interest) await save('leads', { ...l, interest: carLabel(car) + ' (' + car.reg + ')' });
}
function pickTemplate(id) {
  const c = S.chats.find(x => x.id === id);
  openSheet(head(t('pick_tpl')) + waCfg().templates.filter(x => x.status === 'ok').map(x => `<div class="alert-row" onclick="sendTpl('${id}','${x.id}')"><span class="pill ${x.cat === 'mkt' ? 'amber' : 'green'}">${t(x.cat === 'mkt' ? 'tpl_mkt' : 'tpl_util')}</span><span><b>${esc(x.name)}</b><br><span class="r-meta">${esc(fillVars(x.text, c).split('{{1}}').join(c.name || ''))}</span></span></div>`).join(''));
}
async function sendTpl(id, tplId) {
  closeSheet(); const c = clone(S.chats.find(x => x.id === id)); const tp = waCfg().templates.find(x => x.id === tplId);
  await pushOut(c, { text: fillVars(tp.text, c).split('{{1}}').join(c.name || ''), tpl: tp.name });
}

/* incoming message handling – in the live app this runs on the server when Meta's webhook arrives */
async function processInbound(phone, name, text, adName) {
  const cfg = waCfg(); const now = Date.now();
  let c = S.chats.find(x => x.phone === phone); const isNew = !c;
  c = c ? clone(c) : { id: 'ch' + uid(), phone, name, status: 'open', unread: 0, labels: [], messages: [], adName: adName || '', assignee: '' };
  c.messages.push({ id: uid(), dir: 'in', at: now, text }); c.unread = num(c.unread) + 1; c.lastInboundAt = now; c.status = 'open';
  if (!c.leadId && cfg.autoLead) {
    let l = S.leads.find(x => waNum(x.phone) === phone);
    if (!l) { l = { id: 'wa' + uid(), name: name || phone, phone, source: adName ? 'meta_ad' : 'whatsapp', status: 'new', followUp: today(), interest: '', budget: '', address: '', note: adName ? 'Meta जाहिरात: ' + adName : 'WhatsApp' }; await save('leads', l); }
    c.leadId = l.id;
  }
  if (!c.assignee) c.assignee = me.name;
  const auto = r => c.messages.push({ id: uid(), dir: 'out', at: Date.now() + 1, status: 'sent', auto: true, by: 'Bot', text: fillVars(r, c) });
  const hm = new Date().toTimeString().slice(0, 5);
  if (cfg.stopOn && /^\s*stop\s*$/i.test(text)) { const l = S.leads.find(x => x.id === c.leadId); if (l) await save('leads', { ...l, dnc: true }); auto('ठीक आहे, यापुढे आम्ही तुम्हाला मेसेज पाठवणार नाही. 🙏'); }
  else if (isNew && cfg.welcomeOn) auto(cfg.welcomeText);
  else if (cfg.awayOn && (hm < cfg.from || hm > cfg.to)) auto(cfg.awayText);
  else { const kw = cfg.keywords.find(k => k.k && text.toLowerCase().includes(k.k.toLowerCase())); if (kw) auto(kw.r); }
  await saveChat(c);
  const last = c.messages[c.messages.length - 1]; if (last.auto && window.DEMO) simulateStatus(c.id, last.id);
  return c;
}
async function simulateInbound() {
  const people = [['अजय शिंदे', '9822' + Math.floor(100000 + Math.random() * 899999)], ['पूजा कदम', '9970' + Math.floor(100000 + Math.random() * 899999)], ['सुरेश घुगे', '9404' + Math.floor(100000 + Math.random() * 899999)], ['नितीन पाटील', '9850' + Math.floor(100000 + Math.random() * 899999)]];
  const ads = ['Swift ऑफर – नोव्हेंबर', 'SUV – Bolero/Innova', 'बजेट गाड्या ₹3 लाखांखाली'];
  const texts = ['नमस्कार, मला या गाडीबद्दल माहिती हवी आहे', 'Swift ची किंमत काय आहे?', 'लोन होईल का?', 'डिझेल गाडी आहे का?'];
  const p = people[Math.floor(Math.random() * people.length)];
  const c = await processInbound(p[1], p[0], texts[Math.floor(Math.random() * texts.length)], ads[Math.floor(Math.random() * ads.length)]);
  ui.waTab = 'inbox'; ui.waFilter = 'open'; toast('📩 ' + p[0]); render();
}

/* ---------- broadcast ---------- */
Object.assign(ui, { bcStatus: 'open', bcSource: '', bcTpl: 't1' });
function bcAudience() {
  return S.leads.filter(l => (ui.bcStatus === 'all' || (ui.bcStatus === 'open' ? !['booked', 'lost'].includes(l.status) : l.status === ui.bcStatus)) && (!ui.bcSource || l.source === ui.bcSource));
}
function waBroadcast() {
  const aud = bcAudience(); const ok = aud.filter(l => !l.dnc && /^[6-9]\d{9}$/.test(waNum(l.phone)));
  const tpls = waCfg().templates.filter(x => x.status === 'ok'); const tp = tpls.find(x => x.id === ui.bcTpl) || tpls[0];
  const hist = S.broadcasts.slice().sort((a, b) => b.at - a.at);
  return `<div class="sgrid" style="margin-top:16px"><div class="card"><h2>${t('bc_title')}</h2><p class="sub">${t('bc_rule')}</p>
      <div class="fields"><div class="f full"><label for="bcName">${t('bc_name')}</label><input id="bcName" value="${esc(t('nav_cars'))} – ${fmtDate(today())}"></div>
      <div class="f full"><label for="bcTpl">${t('bc_tpl')}</label><select id="bcTpl" onchange="ui.bcTpl=this.value;render()">${tpls.map(x => `<option value="${x.id}" ${tp && tp.id === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>
      <div class="f"><label for="bcSt">${t('bc_status')}</label><select id="bcSt" onchange="ui.bcStatus=this.value;render()">${[['open', t('aud_open')], ['all', t('aud_all')], ...opts('leadSt')].map(([k, l]) => `<option value="${k}" ${ui.bcStatus === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <div class="f"><label for="bcSrc">${t('bc_source')}</label><select id="bcSrc" onchange="ui.bcSource=this.value;render()"><option value="">${t('all_sources')}</option>${opts('source').map(([k, l]) => `<option value="${k}" ${ui.bcSource === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div></div>
      ${tp ? `<div class="msg out" style="margin:14px 0 0;max-width:100%"><small class="mtag">Template · ${esc(tp.name)}</small><div class="mtext">${esc(fillVars(tp.text, { name: (ok[0] && ok[0].name) || 'ग्राहक' }).split('{{1}}').join((ok[0] && ok[0].name) || 'ग्राहक')).replace(/\n/g, '<br>')}</div></div>` : ''}
      <div class="calc"><b>${t('aud_n', { n: ok.length })}</b>${aud.length - ok.length ? ` · <span class="r-meta">${t('aud_skip', { n: aud.length - ok.length })}</span>` : ''}</div>
      <div class="sheet-foot"><button class="btn primary" ${ok.length && tp ? '' : 'disabled'} onclick="sendBroadcast()">${t('bc_send')}</button></div></div>
    <div class="card"><h2>${t('bc_hist')}</h2>${hist.length ? hist.map(b => `<div class="list-row"><div><div class="r-title">${esc(b.name)}</div><div class="r-meta">${esc(b.tpl)} · ${fmtDate(new Date(b.at).toISOString().slice(0, 10))}</div><div class="r-meta">${t('bc_stats', { s: b.sent, d: b.delivered, r: b.read, p: b.replied })}</div></div>
      <div class="src-bar" style="width:90px"><i style="width:${b.sent ? Math.round(b.read / b.sent * 100) : 0}%"></i></div></div>`).join('') : `<p class="empty">${t('bc_none')}</p>`}</div></div>`;
}
async function sendBroadcast() {
  const ok = bcAudience().filter(l => !l.dnc && /^[6-9]\d{9}$/.test(waNum(l.phone)));
  const tp = waCfg().templates.find(x => x.id === ($('#bcTpl').value || ui.bcTpl));
  if (!ok.length || !tp || !confirm(t('bc_confirm', { n: ok.length }))) return;
  const b = { id: 'bc' + uid(), name: $('#bcName').value.trim() || tp.name, tpl: tp.name, at: Date.now(), sent: ok.length, delivered: 0, read: 0, replied: 0 };
  for (const l of ok) {
    const phone = waNum(l.phone); let c = S.chats.find(x => x.phone === phone);
    c = c ? clone(c) : { id: 'ch' + uid(), phone, name: l.name, leadId: l.id, status: 'open', unread: 0, labels: [], messages: [], assignee: '' };
    c.messages = [...(c.messages || []), { id: uid(), dir: 'out', at: Date.now(), status: 'delivered', by: me.name, tpl: tp.name, text: fillVars(tp.text, c).split('{{1}}').join(c.name || '') }];
    await saveChat(c);
  }
  await save('broadcasts', b); toast(t('bc_sent'));
  if (window.DEMO) setTimeout(async () => { const x = clone(S.broadcasts.find(y => y.id === b.id)); x.delivered = ok.length; x.read = Math.round(ok.length * .7); x.replied = Math.round(ok.length * .2); await save('broadcasts', x); }, 2500);
}

/* ---------- ads report ---------- */
function waAds() {
  const cfg = waCfg(); const g = {};
  S.chats.filter(c => c.adName).forEach(c => { (g[c.adName] = g[c.adName] || []).push(c); });
  const rows = Object.entries(g).map(([ad, chats]) => {
    const leads = chats.map(chatLead).filter(Boolean);
    const tests = leads.filter(l => ['test', 'booked'].includes(l.status)).length;
    const sales = leads.filter(l => l.status === 'booked' || S.deals.some(d => waNum(d.buyer && d.buyer.phone) === waNum(l.phone))).length;
    const spend = num(cfg.adSpend[ad]);
    return { ad, chats: chats.length, tests, sales, spend };
  }).sort((a, b) => b.chats - a.chats);
  const tot = rows.reduce((a, r) => ({ chats: a.chats + r.chats, tests: a.tests + r.tests, sales: a.sales + r.sales, spend: a.spend + r.spend }), { chats: 0, tests: 0, sales: 0, spend: 0 });
  const per = (s, n) => s && n ? rs(s / n) : '—';
  const tr = (r, isTot) => `<tr style="cursor:default"><td data-k="main">${isTot ? `<b>${t('ads_total')}</b>` : `<b>${esc(r.ad)}</b>`}</td><td class="num">${r.chats}</td><td class="num">${r.tests}</td><td class="num">${r.sales}</td>
    <td class="num">${isTot || !isAdmin() ? (r.spend ? rs(r.spend) : '—') : `<input class="search spend" type="number" inputmode="numeric" value="${r.spend || ''}" aria-label="${t('c_spend')}" onchange="setSpend(${esc(JSON.stringify(r.ad))},this.value)">`}</td>
    <td class="num">${per(r.spend, r.chats)}</td><td class="num"><b>${per(r.spend, r.sales)}</b></td></tr>`;
  return `<div class="tcard" style="margin-top:16px"><div class="toolbar"><div><h2>${t('ads_title')}</h2><p class="sub" style="margin:2px 0 0">${t('ads_sub')}</p></div></div>
    ${rows.length ? `<div class="tscroll"><table class="ads-t"><thead><tr><th>${t('c_ad')}</th><th class="num">${t('c_chats')}</th><th class="num">${t('c_tests')}</th><th class="num">${t('c_sales')}</th><th class="num">${t('c_spend')}</th><th class="num">${t('c_cpc')}</th><th class="num">${t('c_cps')}</th></tr></thead>
    <tbody>${rows.map(r => tr(r)).join('')}${tr(tot, true)}</tbody></table></div>` : `<p class="empty" style="padding:18px">${t('ads_none')}</p>`}</div>`;
}
async function setSpend(ad, v) { const cfg = waCfg(); await save('settings', { ...clone(S.shop), id: 'shop', wa: { ...cfg, adSpend: { ...cfg.adSpend, [ad]: num(v) } } }); }

/* ---------- automation (admin) ---------- */
function waAuto() {
  const c = waCfg();
  const tog = (id, on, label) => `<label class="dw-row" style="border:0;padding:6px 0"><span>${label}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}></label>`;
  const pairRows = (arr, kind) => arr.map((x, i) => `<div class="kw-row"><input class="search" value="${esc(x.k)}" data-${kind}k="${i}" aria-label="${t(kind === 'kw' ? 'kw_word' : 'qr_short')}"><input class="search" value="${esc(x.r)}" data-${kind}r="${i}" aria-label="${t('kw_reply')}"><button class="btn small" onclick="waRemove('${kind}',${i})" aria-label="${t('remove')}">✕</button></div>`).join('');
  return `<div class="sgrid" style="margin-top:16px">
    <div class="card"><h2>${t('au_title')}</h2><p class="sub">${t('vars_help')}</p>
      ${tog('au_w', c.welcomeOn, t('au_welcome'))}<div class="f"><textarea id="au_wt" rows="3">${esc(c.welcomeText)}</textarea></div>
      ${tog('au_a', c.awayOn, t('au_away'))}<div class="f"><textarea id="au_at" rows="2">${esc(c.awayText)}</textarea></div>
      <div class="fields" style="margin-top:8px"><div class="f"><label for="au_from">${t('au_hours')}</label><input id="au_from" type="time" value="${esc(c.from)}"></div><div class="f"><label for="au_to">&nbsp;</label><input id="au_to" type="time" value="${esc(c.to)}"></div></div>
      ${tog('au_l', c.autoLead, t('au_lead'))}${tog('au_s', c.stopOn, t('au_stop'))}
      <div class="sheet-foot"><button class="btn primary" onclick="saveAuto()">${t('save_auto')}</button></div></div>
    <div class="card"><h2>${t('au_kw')}</h2><p class="sub">${t('au_kw_sub')}</p><div id="kwBox">${pairRows(c.keywords, 'kw')}</div>
      <div class="sheet-foot" style="justify-content:space-between"><button class="btn" onclick="waAdd('kw')">${t('add')}</button><button class="btn primary" onclick="saveAuto()">${t('save_auto')}</button></div>
      <h2 style="margin-top:18px">${t('au_quick')}</h2><div id="qBox">${pairRows(c.quick, 'q')}</div>
      <div class="sheet-foot" style="justify-content:space-between"><button class="btn" onclick="waAdd('q')">${t('add')}</button><button class="btn primary" onclick="saveAuto()">${t('save_auto')}</button></div></div>
    <div class="card wide"><h2>${t('au_tpl')}</h2>${c.templates.map(x => `<div class="list-row"><div style="min-width:0"><div class="r-title">${esc(x.name)} <span class="pill ${x.cat === 'mkt' ? 'amber' : 'green'}">${t(x.cat === 'mkt' ? 'tpl_mkt' : 'tpl_util')}</span></div><div class="r-meta">${esc(x.text)}</div></div>${pill(x.status === 'ok' ? 'green' : 'amber', t(x.status === 'ok' ? 'tpl_ok' : 'tpl_wait'))}</div>`).join('')}
      <fieldset><legend>${t('add_tpl')}</legend><div class="fields"><div class="f"><label for="tpN">${t('tpl_name')}</label><input id="tpN" placeholder="festival_offer" autocapitalize="none"></div>
      <div class="f"><label for="tpC">${t('tpl_cat')}</label><select id="tpC"><option value="mkt">${t('tpl_mkt')}</option><option value="util">${t('tpl_util')}</option></select></div>
      <div class="f full"><label for="tpT">${t('tpl_text')}</label><textarea id="tpT" rows="3"></textarea></div></div>
      <div class="sheet-foot"><button class="btn dark" onclick="addTpl()">${t('add_tpl')}</button></div></fieldset></div></div>`;
}
function readPairs(kind) { const out = []; document.querySelectorAll(`[data-${kind}k]`).forEach(el => { const i = el.getAttribute(`data-${kind}k`); const r = document.querySelector(`[data-${kind}r="${i}"]`); if (el.value.trim()) out.push({ k: el.value.trim(), r: r.value.trim() }); }); return out; }
async function saveAuto(extra) {
  const c = waCfg();
  const wa = { ...c, welcomeOn: $('#au_w').checked, welcomeText: $('#au_wt').value, awayOn: $('#au_a').checked, awayText: $('#au_at').value, from: $('#au_from').value || c.from, to: $('#au_to').value || c.to,
    autoLead: $('#au_l').checked, stopOn: $('#au_s').checked, keywords: readPairs('kw'), quick: readPairs('q'), ...(extra || {}) };
  if (await save('settings', { ...clone(S.shop), id: 'shop', wa })) toast(t('info_saved'));
}
function waAdd(kind) { const key = kind === 'kw' ? 'keywords' : 'quick'; saveAuto({ [key]: [...readPairs(kind), { k: kind === 'q' ? '/' : '', r: '' }] }); }
function waRemove(kind, i) { const key = kind === 'kw' ? 'keywords' : 'quick'; const arr = readPairs(kind); arr.splice(i, 1); saveAuto({ [key]: arr }); }
async function addTpl() {
  const name = $('#tpN').value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'), text = $('#tpT').value.trim(); if (!name || !text) return;
  const tp = { id: 't' + uid(), name, cat: $('#tpC').value, text, status: 'wait' };
  await saveAuto({ templates: [...waCfg().templates, tp] });
  if (window.DEMO) setTimeout(() => { const cfg = waCfg(); save('settings', { ...clone(S.shop), id: 'shop', wa: { ...cfg, templates: cfg.templates.map(x => x.id === tp.id ? { ...x, status: 'ok' } : x) } }); }, 4000);
}

/* ---------- import (customers page) ---------- */
let IMP = null;
function openImport() {
  IMP = null;
  openSheet(head(t('imp_title')) + `<p class="r-meta" style="margin:0 0 10px">${t('imp_cold_note')}</p>
    <fieldset><legend>${t('imp_wa')}</legend><p class="r-meta" style="margin:0 0 8px">${t('imp_wa_help')}</p>
      <div class="fields"><div class="f"><label for="impGroup">${t('imp_group')}</label><input id="impGroup" placeholder="बिडकीन गाडी खरेदी-विक्री"></div>
      <div class="f"><label>&nbsp;</label><label class="btn">${t('imp_file')} (.txt)<input type="file" accept=".txt,text/plain" hidden onchange="readImport(this,'wa')"></label></div></div></fieldset>
    <fieldset><legend>${t('imp_csv')}</legend><p class="r-meta" style="margin:0 0 8px">${t('imp_csv_help')}</p>
      <label class="btn">${t('imp_file')} (.csv)<input type="file" accept=".csv,text/csv" hidden onchange="readImport(this,'csv')"></label></fieldset>
    <div id="impPrev"></div>`);
}
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true; else if (ch === ',' || ch === ';' || ch === '\t') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += ch; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
function parseWaExport(text) {
  const out = new Map();
  text.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\[?\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4},?\s+\d{1,2}[:.]\d{2}(?:[:.]\d{2})?\s*(?:[aApP]\.?\s?[mM]\.?)?\]?\s*(?:-\s*)?([^:]{3,40}):\s/);
    if (!m) return; const who = m[1].replace(/[\u200e\u202a\u202c]/g, '').trim(); const digits = who.replace(/\D/g, '');
    if (digits.length >= 10) { const ph = digits.slice(-10); if (!out.has(ph)) out.set(ph, { name: '', phone: ph }); }
  });
  return [...out.values()];
}
async function readImport(inp, kind) {
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  const text = await f.text(); let rows = [];
  if (kind === 'csv') {
    const r = parseCSV(text.replace(/^\uFEFF/, '')); if (!r.length) return;
    const h = r[0].map(x => x.trim().toLowerCase());
    const col = keys => h.findIndex(x => keys.some(k => x.includes(k)));
    const ni = col(['name', 'नाव', 'नाम']), pi = col(['phone', 'mobile', 'number', 'मोबाईल', 'फोन', 'नंबर']), ci = col(['city', 'village', 'town', 'गाव', 'शहर', 'address']);
    const body = pi >= 0 ? r.slice(1) : r;
    rows = body.map(x => ({ name: ni >= 0 ? (x[ni] || '').trim() : '', phone: waNum(pi >= 0 ? x[pi] : x.find(v => /\d{10}/.test(String(v).replace(/\D/g, ''))) || ''), address: ci >= 0 ? (x[ci] || '').trim() : '' }));
  } else rows = parseWaExport(text);
  const existing = new Set(S.leads.map(l => waNum(l.phone)));
  const seen = new Set(); let dup = 0, bad = 0; const fresh = [];
  rows.forEach(r => { if (!/^[6-9]\d{9}$/.test(r.phone)) { bad++; return; } if (existing.has(r.phone) || seen.has(r.phone)) { dup++; return; } seen.add(r.phone); fresh.push(r); });
  IMP = { kind, rows: fresh, group: kind === 'wa' ? ($('#impGroup').value.trim() || 'WhatsApp ग्रुप') : '' };
  $('#impPrev').innerHTML = `<div class="calc">${t('imp_prev', { a: fresh.length, b: dup, c: bad })}</div>
    ${fresh.length ? `<div class="sheet-foot"><button class="btn primary" onclick="doImport()">${t('imp_go', { n: fresh.length })}</button></div>` : `<p class="empty">${t('imp_none')}</p>`}`;
}
async function doImport() {
  if (!IMP || !IMP.rows.length) return; let n = 0;
  for (const r of IMP.rows) {
    const ok = await save('leads', { id: 'im' + uid(), name: r.name || '+91 ' + r.phone, phone: r.phone, address: r.address || '', source: IMP.kind === 'wa' ? 'wa_group' : 'import', status: 'cold', followUp: '', interest: '', budget: '', note: IMP.kind === 'wa' ? 'ग्रुप: ' + IMP.group : 'CSV इम्पोर्ट ' + today() });
    if (ok) n++;
  }
  closeSheet(); toast(t('imp_ok', { n }));
}

