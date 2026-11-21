/* ================= building blocks ================= */
const pct = (cur, prev) => (prev ? Math.round(((cur - prev) / Math.abs(prev)) * 100) : null);
const delta = d => d == null ? '' : `<span class="delta ${d < 0 ? 'down' : ''}">${d >= 0 ? '+' : ''}${d}%</span>`;
const kpi = (label, value, note, link, filled, d) => `<div class="kpi ${filled ? 'filled' : ''}"><div class="kpi-h"><span>${label}</span>${link ? `<a class="kpi-go" href="#${link}" aria-label="${label}">${IC.arrow}</a>` : ''}</div><div class="kpi-v">${value}${delta(d)}</div><div class="kpi-n">${note}</div></div>`;
const scard = (color, label, value, sub, key, val) => `<button class="scard ${color}" aria-pressed="${ui[key] === val}" onclick="ui.${key}='${val}';ui.page={};render()"><span class="sc-top">${label}</span><span class="sc-body"><b>${value}</b><small>${sub}</small></span></button>`;
const pill = (cls, text) => `<span class="pill ${cls}">${text}</span>`;
const short = v => (v < 0 ? '-' : '') + '₹' + (Math.abs(v) >= 1e5 ? (Math.abs(v) / 1e5).toFixed(1) + 'L' : Math.abs(v) >= 1e3 ? Math.round(Math.abs(v) / 1e3) + 'K' : Math.round(Math.abs(v)));
const monthKey = (offset) => { const d = new Date(today()); d.setDate(1); d.setMonth(d.getMonth() + offset); return d.toISOString().slice(0, 7); };

function table(key, cols, rows) {
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const p = Math.min(ui.page[key] || 1, pages);
  const slice = rows.slice((p - 1) * PER_PAGE, p * PER_PAGE);
  return `<div class="tscroll"><table><thead><tr>${cols.map(c => `<th class="${c.num ? 'num' : ''}">${c.h}</th>`).join('')}</tr></thead>
    <tbody>${slice.map(r => `<tr onclick="${r.click}" tabindex="0" onkeydown="if(event.key==='Enter'){${r.click}}">${r.cells.map((c, i) => `<td class="${cols[i].num ? 'num' : ''}" data-k="${cols[i].k || 'hide'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    ${rows.length ? (pages > 1 ? `<div class="pager"><span>${p} / ${pages}</span><button class="btn small" ${p <= 1 ? 'disabled' : ''} onclick="ui.page.${key}=${p - 1};render()" aria-label="${t('prev')}">${IC.chevL}</button><button class="btn small" ${p >= pages ? 'disabled' : ''} onclick="ui.page.${key}=${p + 1};render()" aria-label="${t('next')}">${IC.chevR}</button></div>` : '') : ''}`;
}
function toolbar(qKey, ph, count, exportFn, addBtn) {
  return `<div class="toolbar"><input class="search" type="search" placeholder="${t(ph)}" value="${esc(ui[qKey])}" aria-label="${t(ph)}" oninput="ui.${qKey}=this.value;ui.page={};clearTimeout(window._st);window._st=setTimeout(()=>{render();const s=document.querySelector('.toolbar .search');s.focus();s.setSelectionRange(s.value.length,s.value.length)},250)">
    <span class="count">${t('entries_n', { n: count })}</span>
    <div class="end"><button class="btn" onclick="${exportFn}()">${IC.download}${t('export')}</button>${addBtn}</div></div>`;
}
function downloadCSV(name, header, rows) {
  const cell = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = '\uFEFF' + [header, ...rows].map(r => r.map(cell).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name + '-' + today() + '.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

/* ================= dashboard ================= */
function viewDash() {
  const tt = today(), ym = monthKey(0), pm = monthKey(-1);
  const dealsIn = m => S.deals.filter(d => (d.date || '').startsWith(m));
  const netOf = m => dealsIn(m).reduce((a, d) => a + (profitOf(d) || 0), 0) - shopExp(m);
  const salesOf = m => dealsIn(m).reduce((a, d) => a + num(d.dealAmount), 0);
  const stock = S.cars.filter(c => c.status !== 'sold');
  const stockVal = stock.reduce((a, c) => a + carCost(c), 0);
  const md = dealsIn(ym);
  const finDeals = S.deals.filter(d => finPending(d) > 0).sort((a, b) => (a.finExpected || '9').localeCompare(b.finExpected || '9'));
  const finTotal = finDeals.reduce((a, d) => a + finPending(d), 0);
  const finLate = finDeals.filter(d => d.finExpected && d.finExpected < tt).length;
  const dueDeals = S.deals.filter(d => custDue(d) > 0).sort((a, b) => (a.dueDate || '9').localeCompare(b.dueDate || '9'));
  const dueTotal = dueDeals.reduce((a, d) => a + custDue(d), 0);
  const fups = S.leads.filter(l => !['booked', 'lost'].includes(l.status) && l.followUp && l.followUp <= tt).sort((a, b) => a.followUp.localeCompare(b.followUp));
  const tests = S.leads.filter(l => l.status === 'test').length;
  const old = stock.filter(c => c.buyDate && daysBetween(c.buyDate, tt) > 45).sort((a, b) => a.buyDate.localeCompare(b.buyDate));
  const red = s => `<span style="color:var(--danger)">${s}</span>`;

  const boughtM = S.cars.filter(c => (c.buyDate || '').startsWith(ym));
  const KP = {
    net: () => kpi(t('st_net'), rs(netOf(ym)), t('vs_last'), 'expenses', false, pct(netOf(ym), netOf(pm))),
    sales: () => kpi(t('st_month_sales'), md.length, t('st_turnover', { x: rs(salesOf(ym)) }), 'deals', false, pct(md.length, dealsIn(pm).length)),
    stock: () => kpi(t('st_stock'), stock.length, t('st_invest', { x: rs(stockVal) }), 'cars', false, null),
    fin: () => kpi(t('st_fin'), rs(finTotal), t('st_fin_note', { n: finDeals.length }) + (finLate ? ', ' + red(t('late_n', { n: finLate })) : ''), 'deals', false, null),
    cust: () => kpi(t('st_cust'), rs(dueTotal), t('st_cust_note', { n: dueDeals.length }), 'deals', false, null),
    bought: () => kpi(t('k_bought'), boughtM.length, t('k_bought_note', { x: rs(boughtM.reduce((a2, c) => a2 + carCost(c), 0)) }), 'cars', false, null),
  };
  const kpiIds = DASH_K.filter(k => wAllowed(k) && kpiOn(k[0])).map(k => k[0]);
  const kpisHtml = kpiIds.map((id, i) => { const h = KP[id](); return i === 0 ? h.replace('class="kpi ', 'class="kpi filled ') : h; }).join('');
  // bar chart
  const mode = isAdmin() ? ui.chart : 'sales';
  const months = [-5, -4, -3, -2, -1, 0].map(monthKey);
  const vals = months.map(m => mode === 'profit' ? netOf(m) : salesOf(m));
  const maxV = Math.max(1, ...vals.map(Math.abs));
  const W = 560, H = 230, L0 = 46, top = 16, base = 186, bw = 44, gap = (W - L0 - 6 * bw) / 6;
  const grid = [0, .25, .5, .75, 1].map(f => { const y = base - f * (base - top); return `<line class="gl" x1="${L0}" x2="${W}" y1="${y}" y2="${y}"/><text x="${L0 - 8}" y="${y + 4}" text-anchor="end">${short(maxV * f)}</text>`; }).join('');
  const bars = vals.map((v, i) => { const h = Math.max(3, (Math.abs(v) / maxV) * (base - top)); const x = L0 + gap / 2 + i * (bw + gap); const cur = i === 5;
    return `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="7" fill="${v < 0 ? 'var(--danger)' : 'var(--accent)'}" opacity="${cur ? 1 : .78}"><title>${rs(v)}</title></rect>
      ${cur || v === Math.max(...vals) ? `<text x="${x + bw / 2}" y="${base - h - 7}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${short(v)}</text>` : ''}
      <text x="${x + bw / 2}" y="${base + 20}" text-anchor="middle">${new Date(months[i] + '-01').toLocaleDateString(loc(), { month:'short' })}</text>`; }).join('');
  const chart = `<div class="card chart chart-card"><div class="card-h"><h2>${t(mode === 'profit' ? 'chart_profit' : 'chart_sales')}<small>${t('last6')}</small></h2>
    ${isAdmin() ? `<div class="seg" role="group"><button aria-pressed="${mode === 'profit'}" onclick="ui.chart='profit';render()">${t('chart_profit')}</button><button aria-pressed="${mode === 'sales'}" onclick="ui.chart='sales';render()">${t('chart_sales')}</button></div>` : ''}</div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t(mode === 'profit' ? 'chart_profit' : 'chart_sales')}">${grid}${bars}</svg></div>`;

  // donut: stock by make
  const byMake = {}; stock.forEach(c => { const k = (c.company || t('others')).trim(); byMake[k] = (byMake[k] || 0) + 1; });
  let parts = Object.entries(byMake).sort((a, b) => b[1] - a[1]);
  if (parts.length > 5) { const rest = parts.slice(4).reduce((a, x) => a + x[1], 0); parts = [...parts.slice(0, 4), [t('others'), rest]]; }
  const COLORS = ['var(--accent)', '#F59E0B', '#22C55E', '#F97316', '#94A3B8'];
  const total = parts.reduce((a, x) => a + x[1], 0); let acc = 0; const R = 52, C = 2 * Math.PI * R;
  const arcs = parts.map(([, n], i) => { const len = (n / total) * C; const s = `<circle cx="75" cy="75" r="${R}" fill="none" stroke="${COLORS[i]}" stroke-width="22" stroke-dasharray="${Math.max(0, len - 2)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 75 75)"/>`; acc += len; return s; }).join('');
  const donut = `<div class="card donut-card"><div class="card-h"><h2>${t('donut_title')}</h2><a class="go" href="#cars" aria-label="${t('nav_cars')}">${IC.arrow}</a></div>
    ${total ? `<div class="donut"><svg viewBox="0 0 150 150" role="img" aria-label="${t('donut_title')}">${arcs}<text x="75" y="80" text-anchor="middle" style="fill:var(--ink);font-size:22px;font-weight:700">${total}</text></svg>
    <ul class="legend">${parts.map(([k, n], i) => `<li><i style="background:${COLORS[i]}"></i>${esc(k)}<b>${n}</b></li>`).join('')}</ul></div>` : `<p class="empty">${t('no_stock')}</p>`}</div>`;

  const mini1 = `<div class="card mini"><div class="card-h"><span class="ic">${IC.deal}</span><a class="go" href="#deals" aria-label="${t('nav_deals')}">${IC.arrow}</a></div><div class="big">${dueDeals.length}<span>${t('mini_receipts')}</span></div><p>${t('mini_receipts_note', { x: rs(dueTotal) })}</p></div>`;
  const mini2 = `<div class="card mini"><div class="card-h"><span class="ic">${IC.user}</span><a class="go" href="#leads" aria-label="${t('nav_leads')}">${IC.arrow}</a></div><div class="big">${fups.length}<span>${t('mini_calls')}</span></div><p>${t('mini_calls_note')}${tests ? ' · ' + t('sc_follow') + ' ' + tests : ''}</p></div>`;

  const listCard = (title, link, items, emptyKey) => `<div class="card half"><div class="card-h"><h2>${title}</h2><a class="go" href="#${link}" aria-label="${title}">${IC.arrow}</a></div>${items.length ? items.join('') : `<p class="empty">${t(emptyKey)}</p>`}</div>`;
  const finItems = finDeals.slice(0, 5).map(d => { const late = d.finExpected && d.finExpected < tt; return `<div class="list-row click" onclick="openDealView('${d.id}')"><div><div class="r-title">${esc(d.finBank || t('g_loan'))}</div><div class="r-meta">${esc(d.buyer?.name || '')} · ${esc(d.vehicle?.reg || '')}</div></div><div class="r-right"><div class="r-amt">${rs(finPending(d))}</div>${d.finExpected ? (late ? pill('red', t('days_late', { n: daysBetween(d.finExpected, tt) })) : `<div class="r-meta">${t('expected', { d: fmtDate(d.finExpected) })}</div>`) : ''}</div></div>`; });
  const dueItems = dueDeals.slice(0, 5).map(d => `<div class="list-row click" onclick="openDealView('${d.id}')"><div><div class="r-title">${esc(d.buyer?.name || '—')}</div><div class="r-meta">#${esc(d.receiptNo)} · ${esc(d.vehicle?.reg || '')}</div></div><div class="r-right"><div class="r-amt">${rs(custDue(d))}</div>${d.dueDate ? (d.dueDate < tt ? pill('red', t('pill_overdue')) : `<div class="r-meta">${fmtDate(d.dueDate)}</div>`) : ''}</div></div>`);
  const fupItems = fups.slice(0, 5).map(l => `<div class="list-row"><div><div class="r-title">${esc(l.name)} ${l.followUp < tt ? pill('red', t('late')) : ''}</div><div class="r-meta">${esc(l.interest || '')}${l.budget ? ' · ' + rs(l.budget) : ''}</div></div><div class="acts">${l.phone ? `<a class="btn small" href="tel:${esc(l.phone)}">${t('call')}</a><a class="btn small" target="_blank" rel="noopener" href="https://wa.me/91${waNum(l.phone)}">WhatsApp</a>` : ''}<button class="btn small" onclick="openLead('${l.id}')">${t('update')}</button></div></div>`);
  const oldItems = old.slice(0, 5).map(c => `<div class="list-row click" onclick="openCar('${c.id}')"><div><div class="r-title">${esc(carLabel(c))}</div><div class="r-meta">${esc(c.reg || '')} · ${rs(c.askPrice)}</div></div>${pill('amber', t('days_n', { n: daysBetween(c.buyDate, tt) }))}</div>`);

  const order = dashOrder().filter(wOn);
  const vis = id => order.includes(id);
  const WG = {
    kpis: () => kpiIds.length ? `<div class="kpis ${vis('chart') ? '' : 'solo'}">${kpisHtml}</div>` : '',
    chart: () => vis('kpis') && kpiIds.length ? chart : chart.replace('chart-card', 'chart-card solo'),
    mini_due: () => mini1, mini_calls: () => mini2, donut: () => donut, sources: sourcesWidget, mkt: mktCard,
    fin: () => listCard(t('p_fin'), 'deals', finItems, 'no_fin'), cust: () => listCard(t('p_cust'), 'deals', dueItems, 'no_due'),
    fups: () => listCard(t('p_followups'), 'leads', fupItems, 'no_followups'), old: () => listCard(t('p_old'), 'cars', oldItems, 'no_old'),
  };
  const dashBody = order.map(id => WG[id]()).join('') || `<div class="card" style="grid-column:1/-1"><p class="empty">${t('dash_empty')}</p><a class="btn primary" href="#settings">${t('nav_settings')}</a></div>`;
  return `<div class="ph"><div><h1>${t('hello')}, ${esc(me.name)} 👋</h1><p class="sub">${t('hello_sub')}</p></div>
    <div class="ph-actions">${installEvt ? `<button class="btn" onclick="doInstall()">${t('install')}</button>` : ''}${isAdmin() ? `<button class="btn" onclick="openExp()">${t('add_exp')}</button>` : ''}<button class="btn dark" onclick="openDeal()">${IC.plus}${t('new_receipt').replace('+ ', '')}</button></div></div>
  ${isAdmin() ? '' : `<p class="r-meta" style="margin:-8px 0 14px">${t('staff_note')}</p>`}
  <div class="dash">${dashBody}</div>`;
}

/* ================= cars ================= */
function carRows() {
  const tt = today(); const q = ui.carQ.toLowerCase();
  return S.cars.filter(c => { const st = c.status || 'stock';
      if (ui.carFilter === 'old') return st !== 'sold' && c.buyDate && daysBetween(c.buyDate, tt) > 45;
      return ui.carFilter === 'all' || st === ui.carFilter; })
    .filter(c => !q || [c.reg, c.company, c.model, c.color, c.buyFrom].join(' ').toLowerCase().includes(q))
    .filter(c => !ui.carSrc || (c.buySource || '') === ui.carSrc)
    .sort((a, b) => (b.buyDate || '').localeCompare(a.buyDate || ''));
}
function viewCars() {
  const tt = today(); const list = carRows();
  const cnt = st => S.cars.filter(c => (c.status || 'stock') === st);
  const oldN = S.cars.filter(c => c.status !== 'sold' && c.buyDate && daysBetween(c.buyDate, tt) > 45);
  const sum = arr => rs(arr.reduce((a, c) => a + num(c.askPrice), 0));
  const cols = [{ h:t('c_car'), k:'main' }, { h:t('c_number'), k:'meta' }, { h:t('c_km'), num:true }, ...(isAdmin() ? [{ h:t('c_cost'), num:true }] : []), { h:t('c_price'), num:true, k:'side' }, ...(isAdmin() ? [{ h:t('c_margin'), num:true }] : []), { h:t('c_days'), num:true }, { h:t('c_status') }];
  const rows = list.map(c => { const st = c.status || 'stock'; const age = c.buyDate && st !== 'sold' ? daysBetween(c.buyDate, tt) : null;
    return { click:`openCar('${c.id}')`, cells:[
      `<div class="ccell"><div class="cthumb">${c.photos && c.photos.length ? `<img src="${photoSrc(c.photos[0])}" alt="" loading="lazy">` : IC.car}</div><div><div class="r-title">${esc(carLabel(c))}</div><div class="r-meta">${[c.year, ol('fuel', c.fuel), c.color].filter(Boolean).map(esc).join(' · ')}${MKT.byCar[c.id] ? ' · 👁 ' + MKT.byCar[c.id] : ''}</div>${c.buySource ? `<div class="r-meta">↙ ${esc(bsl(c.buySource))}${c.buyFrom ? ' – ' + esc(c.buyFrom) : ''}</div>` : ''}</div></div>`,
      esc(c.reg || t('no_number')), c.km ? num(c.km).toLocaleString('en-IN') : '—',
      ...(isAdmin() ? [rs(carCost(c))] : []), `<b>${rs(c.askPrice)}</b>`, ...(isAdmin() ? [rs(num(c.askPrice) - carCost(c))] : []),
      age != null ? (age > 45 ? pill('amber', age) : age) : '—',
      pill({ stock:'blue', booked:'amber', sold:'green' }[st] || '', ol('carSt', st))] }; });
  return `<div class="ph"><div><h1>${t('cars_title')}</h1><p class="sub">${t('cars_sub', { n: S.cars.filter(c => c.status !== 'sold').length })}</p></div></div>
  <div class="scards">${scard('blue', t('sc_stock'), cnt('stock').length, sum(cnt('stock')), 'carFilter', 'stock')}${scard('orange', t('sc_booked'), cnt('booked').length, sum(cnt('booked')), 'carFilter', 'booked')}${scard('yellow', t('sc_old'), oldN.length, sum(oldN), 'carFilter', 'old')}${scard('green', t('sc_sold'), cnt('sold').length, t('f_all') + ': ' + S.cars.length, 'carFilter', 'sold')}</div>
  <div class="tcard">${toolbar('carQ', 'search_cars', list.length, 'exportCars', `<select class="search" style="flex:none;min-width:0" aria-label="${t('buy_source')}" onchange="ui.carSrc=this.value;ui.page={};render()"><option value="">${t('all_sources')}</option>${buySrcOpts().slice(1).map(([k, l]) => `<option value="${esc(k)}" ${ui.carSrc === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select><button class="btn" onclick="printStickers()">${t('all_stickers')}</button><a class="btn" href="${publicUrl()}" ${useHashLinks() ? '' : 'target="_blank" rel="noopener"'}>${t('open_catalog')}</a><button class="btn dark" onclick="openCar()">${IC.plus}${t('add_car').replace('+ ', '')}</button>`)}
    ${list.length ? table('cars', cols, rows) : `<p class="empty" style="padding:18px">${t('no_cars')}</p>`}</div>`;
}
function exportCars() { downloadCSV('cars', [t('reg'), t('company'), t('model'), t('year'), t('fuel'), t('color'), t('km_run'), t('buy_date'), t('buy_source'), t('buy_from'), t('buy_from_phone'), ...(isAdmin() ? [t('buy_price'), t('c_cost')] : []), t('ask_price'), t('status')],
  carRows().map(c => [c.reg, c.company, c.model, c.year, ol('fuel', c.fuel), c.color, c.km, c.buyDate, bsl(c.buySource), c.buyFrom, c.buyFromPhone, ...(isAdmin() ? [c.buyPrice, carCost(c)] : []), c.askPrice, ol('carSt', c.status || 'stock')])); }

/* ================= leads ================= */
function leadRows() {
  const tt = today(); const q = ui.leadQ.toLowerCase();
  return S.leads.filter(l => { const st = l.status || 'new';
      if (ui.leadFilter === 'open') return !['booked', 'lost'].includes(st);
      if (ui.leadFilter === 'follow') return st === 'follow' || st === 'test';
      if (ui.leadFilter === 'calls') return !['booked', 'lost'].includes(st) && l.followUp && l.followUp <= tt;
      return ui.leadFilter === 'all' || st === ui.leadFilter; })
    .filter(l => !q || [l.name, l.phone, l.interest].join(' ').toLowerCase().includes(q))
    .sort((a, b) => (a.followUp || '9').localeCompare(b.followUp || '9'));
}
function viewLeads() {
  const tt = today(); const list = leadRows();
  const open = S.leads.filter(l => !['booked', 'lost'].includes(l.status));
  const cols = [{ h:t('c_customer'), k:'main' }, { h:t('c_interest'), k:'meta' }, { h:t('c_budget'), num:true }, { h:t('c_source') }, { h:t('c_followup'), k:'side' }, { h:t('c_status') }, { h:'' }];
  const rows = list.map(l => { const st = l.status || 'new'; const late = l.followUp && l.followUp <= tt && !['booked', 'lost'].includes(st);
    return { click:`openLead('${l.id}')`, cells:[
      `<div class="r-title">${esc(l.name)}</div><div class="r-meta">${esc(l.phone || '')}</div>`, esc(l.interest || t('no_car_chosen')), l.budget ? rs(l.budget) : '—', esc(ol('source', l.source)),
      l.followUp ? (late ? pill('red', fmtDate(l.followUp)) : fmtDate(l.followUp)) : '—',
      pill({ new:'blue', follow:'amber', test:'amber', booked:'green', lost:'red' }[st] || '', ol('leadSt', st)),
      `<div class="acts" onclick="event.stopPropagation()">${l.phone ? `<a class="btn small" href="tel:${esc(l.phone)}">${t('call')}</a><a class="btn small" target="_blank" rel="noopener" href="https://wa.me/91${waNum(l.phone)}">WA</a>` : ''}<button class="btn small" onclick="openDeal(null,'${l.id}')">${t('receipt')}</button></div>`] }; });
  return `<div class="ph"><div><h1>${t('leads_title')}</h1><p class="sub">${t('leads_sub')}</p></div></div>
  <div class="scards">${scard('blue', t('sc_new'), S.leads.filter(l => (l.status || 'new') === 'new').length, t('f_open') + ': ' + open.length, 'leadFilter', 'new')}${scard('orange', t('sc_follow'), S.leads.filter(l => ['follow', 'test'].includes(l.status)).length, '', 'leadFilter', 'follow')}${scard('yellow', t('sc_calls'), open.filter(l => l.followUp && l.followUp <= tt).length, '', 'leadFilter', 'calls')}${scard('green', t('sc_booked_l'), S.leads.filter(l => l.status === 'booked').length, t('f_all') + ': ' + S.leads.length, 'leadFilter', 'booked')}</div>
  <div class="tcard">${toolbar('leadQ', 'search_leads', list.length, 'exportLeads', `<button class="btn" onclick="openImport()">${t('imp_btn')}</button><button class="btn dark" onclick="openLead()">${IC.plus}${t('add_lead').replace('+ ', '')}</button>`)}
    ${list.length ? table('leads', cols, rows) : `<p class="empty" style="padding:18px">${t('no_leads')}</p>`}</div>`;
}
function exportLeads() { downloadCSV('customers', [t('name'), t('phone'), t('c_interest'), t('budget'), t('source'), t('next_followup'), t('status'), t('village'), t('note')],
  leadRows().map(l => [l.name, l.phone, l.interest, l.budget, ol('source', l.source), l.followUp, ol('leadSt', l.status || 'new'), l.address, l.note])); }

