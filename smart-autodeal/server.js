// Smart AutoDeal – multi-dealer server (Node.js + Express + MySQL/MariaDB)
require('dotenv').config();
const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || '';
if (SECRET.length < 24) { console.error('JWT_SECRET kam se kam 24 akshar ka hona chahiye'); process.exit(1); }

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
  charset: 'utf8mb4', waitForConnections: true, connectionLimit: 8,
});

const COLS = new Set(['cars', 'leads', 'deals', 'expenses', 'settings', 'chats', 'broadcasts']);
const ADMIN_COLS = new Set(['expenses', 'settings']);
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const TID_RE = /^[a-z0-9-]{2,40}$/;
const COOKIE = 'sad';
const TZ_MIN = Number(process.env.TZ_OFFSET_MIN || 330);
const localDate = (plusDays = 0) => new Date(Date.now() + TZ_MIN * 60e3 + plusDays * 864e5).toISOString().slice(0, 10);
const addMonths = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 10); };
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const DEFAULT_PLANS = [
  { id: 'basic', name: 'Basic', price: 999, maxCars: 30, maxStaff: 2, rcPerMonth: 0, features: { catalog: false, wa: false } },
  { id: 'pro', name: 'Pro', price: 1999, maxCars: 100, maxStaff: 5, rcPerMonth: 100, features: { catalog: true, wa: false } },
  { id: 'premium', name: 'Premium', price: 3499, maxCars: 0, maxStaff: 10, rcPerMonth: 300, features: { catalog: true, wa: true } },
];

const pcat = (id, en, hi, mr, tier, sort) => ({ id, names: { en, hi, mr }, tier, active: true, sort });
const DEFAULT_PCATS = [
  pcat('festival', 'Festivals', 'त्योहार', 'सण', 'basic', 1), pcat('national', 'National days', 'राष्ट्रीय दिवस', 'राष्ट्रीय दिवस', 'basic', 2),
  pcat('jayanti', 'Jayanti', 'जयंती', 'जयंती', 'basic', 3), pcat('good-morning', 'Good Morning', 'सुप्रभात', 'शुभ सकाळ', 'basic', 4),
  pcat('tips', 'Car tips', 'गाड़ी टिप्स', 'गाडी टिप्स', 'basic', 5), pcat('offer', 'Offers', 'ऑफ़र', 'ऑफर', 'pro', 6), pcat('business', 'Business', 'बिज़नेस', 'व्यवसाय', 'pro', 7),
];
const pseg = (id, en, hi, mr, sort) => ({ id, names: { en, hi, mr }, active: true, sort });
const DEFAULT_SEGS = [pseg('cars', 'Used cars', 'पुरानी कारें', 'जुन्या कार', 1), pseg('bikes', 'Two-wheelers', 'टू-व्हीलर', 'टू-व्हीलर', 2), pseg('commercial', 'Commercial vehicles', 'कमर्शियल वाहन', 'व्यावसायिक वाहने', 3), pseg('tractors', 'Tractors', 'ट्रैक्टर', 'ट्रॅक्टर', 4), pseg('other', 'Other', 'अन्य', 'इतर', 99)];

/* ================= database ================= */
const q = (sql, args) => pool.query(sql, args);
async function hasColumn(table, col) { const [[r]] = await q('SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?', [table, col]); return r.n > 0; }
async function hasTable(table) { const [[r]] = await q('SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', [table]); return r.n > 0; }
async function platformGet(k, def) { const [[r]] = await q('SELECT v FROM platform WHERE k = ?', [k]); return r ? JSON.parse(r.v) : def; }
async function platformSet(k, v) { await q('INSERT INTO platform (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [k, JSON.stringify(v)]); }
async function logIt(who, what, tenantId) { await q('INSERT INTO logs (at, who, what, tenant_id) VALUES (?,?,?,?)', [Date.now(), who, what, tenantId || null]); }

async function migrate() {
  const oldInstall = await hasTable('users') && !(await hasColumn('users', 'tenant_id'));
  await q(`CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(40) PRIMARY KEY, name VARCHAR(120) NOT NULL, city VARCHAR(120) NOT NULL DEFAULT '', owner_name VARCHAR(100) NOT NULL DEFAULT '',
    phone VARCHAR(20) NOT NULL DEFAULT '', username VARCHAR(50) NOT NULL DEFAULT '', plan VARCHAR(30) NOT NULL DEFAULT 'basic',
    trial TINYINT(1) NOT NULL DEFAULT 1, suspended TINYINT(1) NOT NULL DEFAULT 0, expiry VARCHAR(10) NOT NULL, features TEXT,
    notes TEXT, last_login BIGINT NULL, created_at BIGINT NOT NULL) CHARACTER SET utf8mb4`);
  await q(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, tenant_id VARCHAR(40) NULL, name VARCHAR(100) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE,
    pass_hash VARCHAR(100) NOT NULL, role ENUM('super','admin','staff') NOT NULL DEFAULT 'staff', active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, KEY idx_tenant (tenant_id)) CHARACTER SET utf8mb4`);
  await q(`CREATE TABLE IF NOT EXISTS docs (
    tenant_id VARCHAR(40) NOT NULL, col VARCHAR(20) NOT NULL, id VARCHAR(64) NOT NULL, data LONGTEXT NOT NULL,
    deleted TINYINT(1) NOT NULL DEFAULT 0, updated_at BIGINT NOT NULL, updated_by INT NULL,
    PRIMARY KEY (tenant_id, col, id), KEY idx_updated (tenant_id, updated_at)) CHARACTER SET utf8mb4`);
  await q(`CREATE TABLE IF NOT EXISTS photos (
    id VARCHAR(40) NOT NULL PRIMARY KEY, tenant_id VARCHAR(40) NOT NULL, car_id VARCHAR(64) NOT NULL, mime VARCHAR(30) NOT NULL,
    data LONGBLOB NOT NULL, created_at BIGINT NOT NULL, KEY idx_car (tenant_id, car_id))`);
  await q(`CREATE TABLE IF NOT EXISTS views (
    id INT AUTO_INCREMENT PRIMARY KEY, tenant_id VARCHAR(40) NOT NULL, car_id VARCHAR(64) NULL, kind ENUM('view','lead') NOT NULL DEFAULT 'view',
    visitor VARCHAR(64) NULL, created_at BIGINT NOT NULL, KEY idx_t (tenant_id, created_at))`);
  await q(`CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY, tenant_id VARCHAR(40) NOT NULL, date VARCHAR(10) NOT NULL, amount INT NOT NULL, months INT NOT NULL,
    note VARCHAR(200) NOT NULL DEFAULT '', created_at BIGINT NOT NULL, KEY idx_t (tenant_id)) CHARACTER SET utf8mb4`);
  await q(`CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY, at BIGINT NOT NULL, who VARCHAR(120) NOT NULL, what VARCHAR(300) NOT NULL, tenant_id VARCHAR(40) NULL, KEY idx_at (at)) CHARACTER SET utf8mb4`);
  await q(`CREATE TABLE IF NOT EXISTS rc_lookups (id BIGINT AUTO_INCREMENT PRIMARY KEY, tenant_id VARCHAR(40) NOT NULL, reg VARCHAR(16) NOT NULL,
    at BIGINT NOT NULL, data LONGTEXT NOT NULL, INDEX (tenant_id, reg), INDEX (tenant_id, at)) CHARACTER SET utf8mb4`);
  await q('CREATE TABLE IF NOT EXISTS platform (k VARCHAR(40) PRIMARY KEY, v LONGTEXT NOT NULL) CHARACTER SET utf8mb4');

  // upgrade from the single-dealer version: everything moves into tenant "default"
  if (oldInstall) {
    console.log('Purana single-dealer data mila – "default" dealer mein shift kar rahe hain…');
    await q('ALTER TABLE users ADD COLUMN tenant_id VARCHAR(40) NULL AFTER id');
    await q("ALTER TABLE users MODIFY role ENUM('super','admin','staff') NOT NULL DEFAULT 'staff'");
    await q("UPDATE users SET tenant_id = 'default' WHERE tenant_id IS NULL");
  }
  for (const t of ['docs', 'photos', 'views']) {
    if (!(await hasColumn(t, 'tenant_id'))) {
      await q(`ALTER TABLE ${t} ADD COLUMN tenant_id VARCHAR(40) NOT NULL DEFAULT 'default' FIRST`);
      if (t === 'docs') await q('ALTER TABLE docs DROP PRIMARY KEY, ADD PRIMARY KEY (tenant_id, col, id)');
    }
  }
  const [[hasDefaultUsers]] = await q("SELECT COUNT(*) AS n FROM users WHERE tenant_id = 'default'");
  const [[defTenant]] = await q("SELECT COUNT(*) AS n FROM tenants WHERE id = 'default'");
  if (hasDefaultUsers.n && !defTenant.n) {
    const [[shopRow]] = await q("SELECT data FROM docs WHERE tenant_id = 'default' AND col = 'settings' AND id = 'shop'");
    const shop = shopRow ? JSON.parse(shopRow.data) : {};
    const [[owner]] = await q("SELECT name, username FROM users WHERE tenant_id = 'default' AND role = 'admin' ORDER BY id LIMIT 1");
    await q('INSERT INTO tenants (id, name, city, owner_name, phone, username, plan, trial, expiry, features, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      ['default', shop.name || 'Dealer', shop.address || '', owner ? owner.name : '', shop.phone || '', owner ? owner.username : '', 'premium', 0, localDate(365), JSON.stringify({ catalog: true, wa: true }), Date.now()]);
  }
  if (!(await platformGet('plans', null))) await platformSet('plans', DEFAULT_PLANS);
  if (!(await platformGet('news', null))) await platformSet('news', []);
  if (!(await platformGet('supportPhone', null))) await platformSet('supportPhone', process.env.SUPPORT_PHONE || '');
  if (!(await platformGet('posterLib', null))) await platformSet('posterLib', { categories: DEFAULT_PCATS, segments: DEFAULT_SEGS, posters: [] });
  if (!(await platformGet('dealerPoster', null))) await platformSet('dealerPoster', {});
  if (!(await platformGet('posterCfg', null))) await platformSet('posterCfg', { designerApprove: false });

  const [[sup]] = await q("SELECT COUNT(*) AS n FROM users WHERE role = 'super'");
  if (!sup.n) {
    const u = String(process.env.SUPER_USERNAME || 'super').trim().toLowerCase();
    const p = process.env.SUPER_PASSWORD || '';
    if (p.length < 8) {
      const [[any]] = await q('SELECT COUNT(*) AS n FROM users');
      if (!any.n) { console.error('Pehli baar ke liye SUPER_PASSWORD (8+ akshar) set karo'); process.exit(1); }
      console.warn('Super Admin abhi nahi bana – SUPER_USERNAME aur SUPER_PASSWORD set karke app restart karo.');
    } else {
      await q("INSERT INTO users (tenant_id, name, username, pass_hash, role) VALUES (NULL, 'Super Admin', ?, ?, 'super')", [u, await bcrypt.hash(p, 10)]);
      console.log('Super Admin bana:', u);
    }
  }
}

/* ================= helpers ================= */
const rowTenant = r => r && ({ id: r.id, name: r.name, city: r.city, ownerName: r.owner_name, phone: r.phone, username: r.username, plan: r.plan,
  trial: !!r.trial, suspended: !!r.suspended, expiry: r.expiry, features: r.features ? JSON.parse(r.features) : {}, notes: r.notes || '', lastLogin: r.last_login ? Number(r.last_login) : null, createdAt: Number(r.created_at) });
const tState = tn => (tn.suspended ? 'suspended' : tn.expiry < localDate() ? 'expired' : tn.trial ? 'trial' : 'active');
const daysLeft = tn => Math.round((new Date(tn.expiry + 'T00:00:00Z') - new Date(localDate() + 'T00:00:00Z')) / 864e5);
async function getTenant(id) { const [[r]] = await q('SELECT * FROM tenants WHERE id = ?', [id]); return rowTenant(r); }
async function planFor(tn) { const plans = await platformGet('plans', DEFAULT_PLANS); return plans.find(p => p.id === tn.plan) || {}; }

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '6mb' }));
app.use(cookieParser());
app.use((req, res, next) => { res.set('X-Content-Type-Options', 'nosniff'); res.set('Referrer-Policy', 'same-origin'); res.set('X-Frame-Options', 'SAMEORIGIN'); next(); });
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);
const cookieOpts = req => ({ httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: 30 * 864e5, path: '/' });
const setSession = (req, res, payload) => res.cookie(COOKIE, jwt.sign(payload, SECRET, { expiresIn: '30d' }), cookieOpts(req));
const err = (res, code, error) => res.status(code).json({ error });

const auth = wrap(async (req, res, next) => {
  let p; try { p = jwt.verify(req.cookies[COOKIE] || '', SECRET); } catch (e) { return err(res, 401, 'login'); }
  const [[u]] = await q('SELECT id, tenant_id, name, username, role, active FROM users WHERE id = ?', [p.uid]);
  if (!u || !u.active) return err(res, 401, 'login');
  req.user = u; req.acting = u.role === 'super' && !!p.act;
  req.tid = u.role === 'super' ? (p.act || null) : u.tenant_id;
  if (req.tid) {
    req.tenant = await getTenant(req.tid);
    if (!req.tenant) return err(res, 401, 'login');
    if (u.role !== 'super' && req.tenant.suspended) return err(res, 403, 'suspended');
    req.state = tState(req.tenant); req.writable = ['trial', 'active'].includes(req.state);
  }
  next();
});
const needTenant = (req, res, next) => (req.tid ? next() : err(res, 403, 'tenant'));
const isTenantAdmin = req => req.user.role === 'admin' || req.acting;
const tenantAdmin = (req, res, next) => (req.tid && isTenantAdmin(req) ? next() : err(res, 403, 'admin'));
const writable = (req, res, next) => (req.writable ? next() : err(res, 402, 'expired'));
const superOnly = (req, res, next) => (req.user.role === 'super' ? next() : err(res, 403, 'super'));

/* ================= login ================= */
const tries = new Map();
app.post('/api/login', wrap(async (req, res) => {
  const key = req.ip; const t = tries.get(key) || { n: 0, until: 0 };
  if (t.until > Date.now()) return err(res, 429, 'wait');
  const username = String(req.body?.username || '').trim().toLowerCase(), password = String(req.body?.password || '');
  const [[u]] = await q('SELECT * FROM users WHERE username = ? AND active = 1', [username]);
  if (!u || !(await bcrypt.compare(password, u.pass_hash))) {
    t.n++; if (t.n >= 5) { t.until = Date.now() + 10 * 60e3; t.n = 0; } tries.set(key, t); return err(res, 401, 'bad');
  }
  tries.delete(key);
  if (u.role !== 'super') {
    const tn = await getTenant(u.tenant_id);
    if (!tn) return err(res, 401, 'bad');
    if (tn.suspended) return err(res, 403, 'suspended');
    await q('UPDATE tenants SET last_login = ? WHERE id = ?', [Date.now(), tn.id]);
  }
  setSession(req, res, { uid: u.id });
  res.json({ user: { id: u.id, name: u.name, username: u.username, role: u.role } });
}));
app.post('/api/logout', (req, res) => { res.clearCookie(COOKIE, { path: '/' }); res.json({ ok: true }); });
app.get('/api/me', auth, wrap(async (req, res) => {
  const u = req.user;
  const user = req.acting ? { id: u.id, name: u.name === 'Super Admin' ? 'Super Admin' : u.name + ' (Super Admin)', username: u.username, role: 'admin' } : { id: u.id, name: u.name, username: u.username, role: u.role };
  let tenant = null;
  if (req.tenant) {
    const news = (await platformGet('news', [])).filter(n => n.active).slice(-1)[0];
    tenant = { id: req.tenant.id, name: req.tenant.name, plan: req.tenant.plan, status: req.state, rc: await rcStatus(req.tenant), daysLeft: daysLeft(req.tenant), expiry: req.tenant.expiry,
      features: req.tenant.features, impersonating: req.acting, poster: { ...((await platformGet('dealerPoster', {}))[req.tenant.id] || {}), designerApprove: !!(await platformGet('posterCfg', {})).designerApprove }, news: news ? { id: news.id, text: news.text } : null, supportPhone: await platformGet('supportPhone', '') };
  }
  res.json({ user, tenant });
}));
app.post('/api/me/password', auth, wrap(async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!newPassword || String(newPassword).length < 6) return err(res, 400, 'short');
  const [[u]] = await q('SELECT pass_hash FROM users WHERE id = ?', [req.user.id]);
  if (!(await bcrypt.compare(String(oldPassword || ''), u.pass_hash))) return err(res, 400, 'old');
  await q('UPDATE users SET pass_hash = ? WHERE id = ?', [await bcrypt.hash(String(newPassword), 10), req.user.id]);
  res.json({ ok: true });
}));

/* ================= dealer data ================= */
app.get('/api/data', auth, needTenant, wrap(async (req, res) => {
  const since = Number(req.query.since || 0), now = Date.now();
  const hideExp = !isTenantAdmin(req);
  const [rows] = await q(`SELECT col, id, data, deleted FROM docs WHERE tenant_id = ? AND updated_at > ? ${since ? '' : 'AND deleted = 0'} ${hideExp ? "AND col <> 'expenses'" : ''}`, [req.tid, since]);
  res.json({ now, rows: rows.map(r => ({ col: r.col, id: r.id, deleted: !!r.deleted, data: r.deleted ? null : JSON.parse(r.data) })) });
}));
const upsertDoc = (tid, col, id, data, by) => q(
  `INSERT INTO docs (tenant_id, col, id, data, deleted, updated_at, updated_by) VALUES (?,?,?,?,0,?,?)
   ON DUPLICATE KEY UPDATE data = VALUES(data), deleted = 0, updated_at = VALUES(updated_at), updated_by = VALUES(updated_by)`,
  [tid, col, id, JSON.stringify(data), Date.now(), by || null]);
app.put('/api/docs/:col/:id', auth, needTenant, writable, wrap(async (req, res) => {
  const { col, id } = req.params;
  if (!COLS.has(col) || !ID_RE.test(id)) return err(res, 400, 'path');
  if (ADMIN_COLS.has(col) && !isTenantAdmin(req)) return err(res, 403, 'admin');
  const data = req.body?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return err(res, 400, 'body');
  if (col === 'cars') {
    const plan = await planFor(req.tenant);
    if (plan.maxCars) {
      const [[ex]] = await q("SELECT COUNT(*) AS n FROM docs WHERE tenant_id = ? AND col = 'cars' AND id = ? AND deleted = 0", [req.tid, id]);
      if (!ex.n) { const [[c]] = await q("SELECT COUNT(*) AS n FROM docs WHERE tenant_id = ? AND col = 'cars' AND deleted = 0", [req.tid]); if (c.n >= plan.maxCars) return err(res, 403, 'limit'); }
    }
  }
  data.id = id;
  await upsertDoc(req.tid, col, id, data, req.user.id);
  res.json({ ok: true, now: Date.now() });
}));
app.delete('/api/docs/:col/:id', auth, tenantAdmin, writable, wrap(async (req, res) => {
  const { col, id } = req.params;
  if (!COLS.has(col) || !ID_RE.test(id)) return err(res, 400, 'path');
  await q('UPDATE docs SET deleted = 1, data = ?, updated_at = ?, updated_by = ? WHERE tenant_id = ? AND col = ? AND id = ?', ['{}', Date.now(), req.user.id, req.tid, col, id]);
  res.json({ ok: true });
}));
app.get('/api/backup', auth, tenantAdmin, wrap(async (req, res) => {
  const [rows] = await q('SELECT col, data FROM docs WHERE tenant_id = ? AND deleted = 0', [req.tid]);
  const out = { app: 'smart-autodeal', version: 3, created: new Date().toISOString(), cars: [], leads: [], deals: [], expenses: [], chats: [], broadcasts: [], shop: null };
  rows.forEach(r => { const d = JSON.parse(r.data); if (r.col === 'settings') { if (d.id === 'shop') out.shop = d; } else if (out[r.col]) out[r.col].push(d); });
  res.set('Content-Disposition', `attachment; filename="smart-autodeal-backup-${localDate()}.json"`);
  res.json(out);
}));
app.post('/api/restore', auth, tenantAdmin, writable, wrap(async (req, res) => {
  const b = req.body || {};
  if (!['sevasai-crm', 'smart-autodeal'].includes(b.app)) return err(res, 400, 'file');
  let count = 0;
  for (const col of ['cars', 'leads', 'deals', 'expenses', 'chats', 'broadcasts']) for (const d of Array.isArray(b[col]) ? b[col] : []) { if (d && ID_RE.test(String(d.id || ''))) { await upsertDoc(req.tid, col, d.id, d, req.user.id); count++; } }
  if (b.shop && typeof b.shop === 'object') { await upsertDoc(req.tid, 'settings', 'shop', { ...b.shop, id: 'shop' }, req.user.id); count++; }
  res.json({ ok: true, count });
}));

/* ================= dealer staff ================= */
app.get('/api/users', auth, tenantAdmin, wrap(async (req, res) => {
  const [rows] = await q("SELECT id, name, username, role, active FROM users WHERE tenant_id = ? AND role <> 'super' ORDER BY id", [req.tid]);
  res.json({ users: rows.map(u => ({ ...u, active: !!u.active })) });
}));
app.post('/api/users', auth, tenantAdmin, writable, wrap(async (req, res) => {
  const name = String(req.body?.name || '').trim(), username = String(req.body?.username || '').trim().toLowerCase(), password = String(req.body?.password || '');
  const role = req.body?.role === 'admin' ? 'admin' : 'staff';
  if (!name || !/^[a-z0-9._-]{3,50}$/.test(username) || password.length < 6) return err(res, 400, 'fields');
  const plan = await planFor(req.tenant);
  if (plan.maxStaff) { const [[c]] = await q('SELECT COUNT(*) AS n FROM users WHERE tenant_id = ? AND active = 1', [req.tid]); if (c.n >= plan.maxStaff) return err(res, 403, 'limit'); }
  try { await q('INSERT INTO users (tenant_id, name, username, pass_hash, role) VALUES (?,?,?,?,?)', [req.tid, name, username, await bcrypt.hash(password, 10), role]); }
  catch (e) { if (e.code === 'ER_DUP_ENTRY') return err(res, 409, 'exists'); throw e; }
  res.json({ ok: true });
}));
app.patch('/api/users/:id', auth, tenantAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id), b = req.body || {};
  const [[target]] = await q("SELECT id FROM users WHERE id = ? AND tenant_id = ? AND role <> 'super'", [id, req.tid]);
  if (!target) return err(res, 404, 'nf');
  if (id === req.user.id && (b.active === false || b.role === 'staff')) return err(res, 400, 'self');
  if (b.password !== undefined) { if (String(b.password).length < 6) return err(res, 400, 'short'); await q('UPDATE users SET pass_hash = ? WHERE id = ?', [await bcrypt.hash(String(b.password), 10), id]); }
  if (typeof b.active === 'boolean') await q('UPDATE users SET active = ? WHERE id = ?', [b.active ? 1 : 0, id]);
  if (b.role === 'admin' || b.role === 'staff') await q('UPDATE users SET role = ? WHERE id = ?', [b.role, id]);
  if (b.name) await q('UPDATE users SET name = ? WHERE id = ?', [String(b.name).trim(), id]);
  res.json({ ok: true });
}));

/* ================= photos ================= */
app.post('/api/photos', auth, needTenant, writable, wrap(async (req, res) => {
  const carId = String(req.body?.carId || '');
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(req.body?.data || ''));
  if (!ID_RE.test(carId) || !m) return err(res, 400, 'photo');
  const buf = Buffer.from(m[2], 'base64'); if (buf.length > 3 * 1024 * 1024) return err(res, 413, 'big');
  const id = newId();
  await q('INSERT INTO photos (id, tenant_id, car_id, mime, data, created_at) VALUES (?,?,?,?,?,?)', [id, req.tid, carId, m[1], buf, Date.now()]);
  res.json({ ok: true, id });
}));
app.delete('/api/photos/:id', auth, needTenant, wrap(async (req, res) => {
  if (!ID_RE.test(req.params.id)) return err(res, 400, 'path');
  await q('DELETE FROM photos WHERE id = ? AND tenant_id = ?', [req.params.id, req.tid]); res.json({ ok: true });
}));
app.get('/p/:id', wrap(async (req, res) => {
  const id = String(req.params.id).replace(/\.jpg$/, ''); if (!ID_RE.test(id)) return res.status(404).end();
  const [[row]] = await q('SELECT mime, data FROM photos WHERE id = ?', [id]); if (!row) return res.status(404).end();
  res.set('Content-Type', row.mime); res.set('Cache-Control', 'public, max-age=31536000, immutable'); res.send(row.data);
}));

/* ================= public catalogue (per dealer) ================= */
const maskReg = r => { const p = String(r || '').toUpperCase().replace(/\s+/g, ' ').trim().split(' '); return p.length >= 3 ? `${p[0]} ** ${p[p.length - 1]}` : (r ? String(r).slice(0, 4) + ' **' : ''); };
const publicShop = s => ({ name: s.name || 'Dealer', phone: s.phone || '', whatsapp: s.whatsapp || s.phone || '', address: s.address || '', mapUrl: s.mapUrl || '', intro: s.catIntro || '',
  showPrice: s.showPrice !== false, requireForm: s.requireForm !== false, accent: s.catAccent || 'blue' });
const publicCar = (c, shop) => ({ id: c.id, company: c.company || '', model: c.model || '', year: c.year || '', fuel: c.fuel || '', km: c.km || '', color: c.color || '', ownerNo: c.ownerNo || '',
  status: c.status || 'stock', reg: maskReg(c.reg), photos: Array.isArray(c.photos) ? c.photos : [], price: shop.showPrice ? (c.askPrice || null) : null, insurance: c.insurance || '', features: c.features || '' });
async function pubTenant(req, res) {
  const tid = String(req.params.tid || '');
  if (!TID_RE.test(tid)) { err(res, 404, 'nf'); return null; }
  const tn = await getTenant(tid);
  if (!tn || tn.suspended || tn.features.catalog === false) { err(res, 404, 'nf'); return null; }
  const [[s]] = await q("SELECT data FROM docs WHERE tenant_id = ? AND col = 'settings' AND id = 'shop' AND deleted = 0", [tid]);
  return { tn, shop: publicShop(s ? JSON.parse(s.data) : { name: tn.name }) };
}
app.get('/api/public/:tid/catalog', wrap(async (req, res) => {
  const t = await pubTenant(req, res); if (!t) return;
  const [rows] = await q("SELECT data FROM docs WHERE tenant_id = ? AND col = 'cars' AND deleted = 0", [t.tn.id]);
  const cars = rows.map(r => JSON.parse(r.data)).filter(c => c.status !== 'sold' && !c.hideOnline).sort((a, b) => String(b.buyDate || '').localeCompare(String(a.buyDate || ''))).map(c => publicCar(c, t.shop));
  res.set('Cache-Control', 'no-store'); res.json({ shop: t.shop, cars });
}));
app.get('/api/public/:tid/car/:id', wrap(async (req, res) => {
  const t = await pubTenant(req, res); if (!t) return;
  if (!ID_RE.test(req.params.id)) return err(res, 404, 'nf');
  const [[row]] = await q("SELECT data FROM docs WHERE tenant_id = ? AND col = 'cars' AND id = ? AND deleted = 0", [t.tn.id, req.params.id]);
  if (!row) return res.json({ shop: t.shop, car: null });
  const c = JSON.parse(row.data); res.set('Cache-Control', 'no-store');
  res.json({ shop: t.shop, car: c.hideOnline ? null : { ...publicCar(c, t.shop), sold: c.status === 'sold' } });
}));
const pubHits = new Map();
const limited = (req, kind, max) => { const key = kind + req.ip, now = Date.now(); const h = (pubHits.get(key) || []).filter(x => now - x < 3600e3); h.push(now); pubHits.set(key, h); return h.length > max; };
app.post('/api/public/:tid/view', wrap(async (req, res) => {
  if (limited(req, 'v', 200)) return res.json({ ok: true });
  const t = await pubTenant(req, res); if (!t) return;
  const carId = ID_RE.test(String(req.body?.carId || '')) ? req.body.carId : null;
  await q("INSERT INTO views (tenant_id, car_id, kind, visitor, created_at) VALUES (?, ?, 'view', ?, ?)", [t.tn.id, carId, String(req.body?.visitor || '').slice(0, 64) || null, Date.now()]);
  res.json({ ok: true });
}));
app.post('/api/public/:tid/lead', wrap(async (req, res) => {
  if (limited(req, 'l', 15)) return err(res, 429, 'wait');
  const t = await pubTenant(req, res); if (!t) return;
  const name = String(req.body?.name || '').trim().slice(0, 80), phone = String(req.body?.phone || '').replace(/\D/g, '').slice(-10);
  const location = String(req.body?.location || '').trim().slice(0, 120);
  const geo = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/.test(String(req.body?.geo || '')) ? req.body.geo : '';
  const carId = ID_RE.test(String(req.body?.carId || '')) ? req.body.carId : null;
  if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone)) return err(res, 400, 'fields');
  let carText = '';
  if (carId) { const [[row]] = await q("SELECT data FROM docs WHERE tenant_id = ? AND col = 'cars' AND id = ?", [t.tn.id, carId]); if (row) { const c = JSON.parse(row.data); carText = `${[c.company, c.model].filter(Boolean).join(' ')} (${c.reg || ''})`; } }
  const day = localDate();
  const line = `QR/कॅटलॉग ${day}${carText ? ' – ' + carText : ''}${geo ? ' – https://maps.google.com/?q=' + geo : ''}`;
  const [rows] = await q("SELECT data FROM docs WHERE tenant_id = ? AND col = 'leads' AND deleted = 0 AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.phone')) LIKE ?", [t.tn.id, '%' + phone]);
  let lead;
  if (rows.length) {
    lead = JSON.parse(rows[0].data); lead.note = [lead.note, line].filter(Boolean).join('\n').slice(-4000);
    if (carText) lead.interest = carText; if (lead.status !== 'booked') { lead.followUp = day; if (lead.status === 'lost') lead.status = 'follow'; }
    if (!lead.address && location) lead.address = location;
  } else lead = { id: 'qr' + newId(), name, phone, source: 'qr', status: 'new', followUp: day, interest: carText, address: location, budget: '', note: line };
  await upsertDoc(t.tn.id, 'leads', lead.id, lead, null);
  await q("INSERT INTO views (tenant_id, car_id, kind, visitor, created_at) VALUES (?, ?, 'lead', ?, ?)", [t.tn.id, carId, String(req.body?.visitor || '').slice(0, 64) || null, Date.now()]);
  res.json({ ok: true });
}));
app.get('/api/stats/marketing', auth, needTenant, wrap(async (req, res) => {
  const since = Date.now() - 30 * 864e5;
  const [[v]] = await q("SELECT COUNT(*) AS n FROM views WHERE tenant_id = ? AND kind = 'view' AND created_at > ?", [req.tid, since]);
  const [[l]] = await q("SELECT COUNT(*) AS n FROM views WHERE tenant_id = ? AND kind = 'lead' AND created_at > ?", [req.tid, since]);
  const [by] = await q("SELECT car_id, COUNT(*) AS n FROM views WHERE tenant_id = ? AND kind = 'view' AND car_id IS NOT NULL GROUP BY car_id", [req.tid]);
  res.json({ views30: v.n, leads30: l.n, byCar: Object.fromEntries(by.map(r => [r.car_id, r.n])) });
}));

/* ================= super admin ================= */
app.get('/api/sa/overview', auth, superOnly, wrap(async (req, res) => {
  const [trows] = await q('SELECT * FROM tenants ORDER BY created_at');
  const [counts] = await q("SELECT tenant_id, col, COUNT(*) AS n FROM docs WHERE deleted = 0 AND col IN ('cars','leads','deals') GROUP BY tenant_id, col");
  const [staff] = await q("SELECT tenant_id, COUNT(*) AS n FROM users WHERE active = 1 AND role <> 'super' GROUP BY tenant_id");
  const [pays] = await q('SELECT tenant_id, date, amount, months, note FROM payments ORDER BY id');
  const [logs] = await q('SELECT at, who, what, tenant_id FROM logs ORDER BY id DESC LIMIT 300');
  const tenants = trows.map(rowTenant).map(tn => {
    const c = col => (counts.find(x => x.tenant_id === tn.id && x.col === col) || { n: 0 }).n;
    return { ...tn, stats: { cars: c('cars'), leads: c('leads'), deals: c('deals'), staff: (staff.find(x => x.tenant_id === tn.id) || { n: 0 }).n },
      payments: pays.filter(p => p.tenant_id === tn.id).map(p => ({ date: p.date, amount: p.amount, months: p.months, note: p.note })) };
  });
  res.json({ tenants, plans: await platformGet('plans', DEFAULT_PLANS), news: await platformGet('news', []), supportPhone: await platformGet('supportPhone', ''), posterLib: await getLib(), posterCfg: await platformGet('posterCfg', { designerApprove: false }), dealerPoster: await platformGet('dealerPoster', {}),
    logs: logs.map(l => ({ at: Number(l.at), who: l.who, what: l.what, tenant: l.tenant_id })) });
}));
app.post('/api/sa/tenants', auth, superOnly, wrap(async (req, res) => {
  const b = req.body || {};
  const username = String(b.username || '').trim().toLowerCase(), password = String(b.password || ''), phone = String(b.phone || '').replace(/\D/g, '').slice(-10);
  if (!b.name || !b.ownerName || !/^[6-9]\d{9}$/.test(phone) || !/^[a-z0-9._-]{3,50}$/.test(username) || password.length < 6) return err(res, 400, 'fields');
  const [[dup]] = await q('SELECT COUNT(*) AS n FROM users WHERE username = ?', [username]); if (dup.n) return err(res, 409, 'exists');
  const plans = await platformGet('plans', DEFAULT_PLANS); const plan = plans.find(p => p.id === b.plan) || plans[0];
  let id = username.replace(/[^a-z0-9]/g, '').slice(0, 30) || 'dealer'; if (id.length < 2) id += 'dl';
  for (let i = 2; (await getTenant(id)); i++) id = id.replace(/-\d+$/, '') + '-' + i;
  const days = Math.max(1, Math.min(90, Number(b.trialDays) || 14));
  await q('INSERT INTO tenants (id, name, city, owner_name, phone, username, plan, trial, expiry, features, notes, created_at) VALUES (?,?,?,?,?,?,?,1,?,?,?,?)',
    [id, String(b.name).trim(), String(b.city || '').trim(), String(b.ownerName).trim(), phone, username, plan.id, localDate(days), JSON.stringify(plan.features || {}), '', Date.now()]);
  await q("INSERT INTO users (tenant_id, name, username, pass_hash, role) VALUES (?,?,?,?,'admin')", [id, String(b.ownerName).trim(), username, await bcrypt.hash(password, 10)]);
  await upsertDoc(id, 'settings', 'shop', { id: 'shop', name: String(b.name).trim(), phone, address: String(b.city || '').trim(), firstReceipt: 1, showPrice: true, requireForm: true, catAccent: 'blue' }, req.user.id);
  await logIt(req.user.name, `नवीन डीलर – ट्रायल ${days} दिवस`, id);
  res.json({ ok: true, id });
}));
app.patch('/api/sa/tenants/:id', auth, superOnly, wrap(async (req, res) => {
  const tn = await getTenant(req.params.id); if (!tn) return err(res, 404, 'nf');
  const b = req.body || {}, who = req.user.name;
  const sets = [], args = [];
  const set = (col, v) => { sets.push(col + ' = ?'); args.push(v); };
  if (b.name !== undefined) set('name', String(b.name).trim());
  if (b.city !== undefined) set('city', String(b.city).trim());
  if (b.ownerName !== undefined) set('owner_name', String(b.ownerName).trim());
  if (b.phone !== undefined) set('phone', String(b.phone).replace(/\D/g, '').slice(-10));
  if (b.notes !== undefined) set('notes', String(b.notes));
  if (b.features && typeof b.features === 'object') set('features', JSON.stringify({ catalog: !!b.features.catalog, wa: !!b.features.wa }));
  if (b.plan && b.plan !== tn.plan) { set('plan', String(b.plan)); await logIt(who, 'प्लॅन बदलला: ' + b.plan, tn.id); }
  if (typeof b.suspended === 'boolean') { set('suspended', b.suspended ? 1 : 0); await logIt(who, b.suspended ? 'खाते बंद केले' : 'खाते चालू केले', tn.id); }
  let expiry = tn.expiry; const base = () => (expiry > localDate() ? expiry : localDate());
  if (b.extendDays) { const n = Math.max(1, Math.min(90, Number(b.extendDays))); expiry = addDays(base(), n); set('expiry', expiry); await logIt(who, `मुदत +${n} दिवस`, tn.id); }
  if (b.payment) {
    const p = b.payment, months = Math.max(1, Math.min(36, Number(p.months) || 1)), amount = Math.max(0, Math.round(Number(p.amount) || 0));
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(p.date || '')) ? p.date : localDate();
    expiry = addMonths(base(), months); set('expiry', expiry); set('trial', 0);
    await q('INSERT INTO payments (tenant_id, date, amount, months, note, created_at) VALUES (?,?,?,?,?,?)', [tn.id, date, amount, months, String(p.note || '').slice(0, 200), Date.now()]);
    await logIt(who, `पेमेंट नोंदले ₹${amount.toLocaleString('en-IN')} – ${months} महिना`, tn.id);
  }
  if (b.ownerPassword) {
    if (String(b.ownerPassword).length < 6) return err(res, 400, 'short');
    await q("UPDATE users SET pass_hash = ? WHERE tenant_id = ? AND username = ? AND role <> 'super'", [await bcrypt.hash(String(b.ownerPassword), 10), tn.id, tn.username]);
    await logIt(who, 'मालकाचा पासवर्ड रीसेट', tn.id);
  }
  if (sets.length) await q(`UPDATE tenants SET ${sets.join(', ')} WHERE id = ?`, [...args, tn.id]);
  res.json({ ok: true, expiry });
}));
app.post('/api/sa/impersonate/:id', auth, superOnly, wrap(async (req, res) => {
  const tn = await getTenant(req.params.id); if (!tn) return err(res, 404, 'nf');
  setSession(req, res, { uid: req.user.id, act: tn.id }); await logIt(req.user.name, 'डीलर म्हणून उघडले', tn.id); res.json({ ok: true });
}));
app.post('/api/sa/exit', auth, superOnly, (req, res) => { setSession(req, res, { uid: req.user.id }); res.json({ ok: true }); });
app.put('/api/sa/plans', auth, superOnly, wrap(async (req, res) => {
  const plans = Array.isArray(req.body?.plans) ? req.body.plans : null; if (!plans || !plans.length) return err(res, 400, 'plans');
  await platformSet('plans', plans.map(p => ({ id: String(p.id), name: String(p.name || p.id), price: Math.max(0, Number(p.price) || 0), maxCars: Math.max(0, Number(p.maxCars) || 0), maxStaff: Math.max(0, Number(p.maxStaff) || 0), rcPerMonth: Math.max(0, Math.round(Number(p.rcPerMonth) || 0)), features: { catalog: !!(p.features && p.features.catalog), wa: !!(p.features && p.features.wa) } })));
  await logIt(req.user.name, 'प्लॅन बदलले', null); res.json({ ok: true });
}));
app.put('/api/sa/platform', auth, superOnly, wrap(async (req, res) => {
  if (req.body?.supportPhone !== undefined) await platformSet('supportPhone', String(req.body.supportPhone).trim().slice(0, 20));
  res.json({ ok: true });
}));
app.post('/api/sa/news', auth, superOnly, wrap(async (req, res) => {
  const text = String(req.body?.text || '').trim().slice(0, 300); if (!text) return err(res, 400, 'text');
  const news = await platformGet('news', []); news.push({ id: 'n' + newId(), text, at: Date.now(), active: true });
  await platformSet('news', news.slice(-50)); await logIt(req.user.name, 'सर्वांना सूचना पाठवली', null); res.json({ ok: true });
}));
app.patch('/api/sa/news/:id', auth, superOnly, wrap(async (req, res) => {
  const news = await platformGet('news', []); const n = news.find(x => x.id === req.params.id); if (n) n.active = false; await platformSet('news', news); res.json({ ok: true });
}));

/* ================= poster library (MahaPoster model) ================= */
const RANK = { basic: 1, pro: 2, premium: 3 };
const names3 = n => ({ en: String(n?.en || '').slice(0, 60), hi: String(n?.hi || n?.en || '').slice(0, 60), mr: String(n?.mr || n?.en || '').slice(0, 60) });
const cleanPoster = p => ({ id: String(p.id || newId()).slice(0, 40), title: String(p.title || '').slice(0, 80), subtitle: String(p.subtitle || '').slice(0, 80), eyebrow: String(p.eyebrow || '').slice(0, 80),
  glyph: String(p.glyph || '').slice(0, 8), theme: Array.isArray(p.theme) ? p.theme.slice(0, 3).map(c => (/^#[0-9a-fA-F]{6}$/.test(c) ? c : '#3D3BF3')) : ['#7A1E12', '#D9480F', '#F59F00'],
  category: String(p.category || '').slice(0, 40), date: /^\d{4}-\d{2}-\d{2}$/.test(String(p.date || '')) ? p.date : '', imageId: ID_RE.test(String(p.imageId || '')) ? p.imageId : '', active: p.active !== false,
  segments: Array.isArray(p.segments) ? p.segments.map(x => String(x).slice(0, 40)).slice(0, 20) : [] });
async function getLib() { const lib = await platformGet('posterLib', null) || {}; return { categories: lib.categories || DEFAULT_PCATS, segments: lib.segments || DEFAULT_SEGS, posters: lib.posters || [] }; }
app.get('/api/posters', auth, needTenant, wrap(async (req, res) => {
  const lib = await getLib(); const dp = (await platformGet('dealerPoster', {}))[req.tid] || {};
  const cats = lib.categories.filter(c => c.active).sort((a, b) => a.sort - b.sort); const live = new Set(cats.map(c => c.id));
  const posters = lib.posters.filter(p => p.active && live.has(p.category) && (!p.segments.length || p.segments.includes(dp.segment)));
  res.json({ categories: cats, segments: lib.segments.filter(x => x.active).sort((a, b) => a.sort - b.sort), posters });
}));
app.put('/api/sa/posterlib', auth, superOnly, wrap(async (req, res) => {
  const b = req.body || {};
  const categories = (Array.isArray(b.categories) ? b.categories : DEFAULT_PCATS).slice(0, 60).map((c, i) => ({ id: String(c.id).slice(0, 40), names: names3(c.names), tier: RANK[c.tier] ? c.tier : 'basic', active: c.active !== false, sort: Number(c.sort) || i + 1 }));
  const segments = (Array.isArray(b.segments) ? b.segments : DEFAULT_SEGS).slice(0, 60).map((c, i) => ({ id: String(c.id).slice(0, 40), names: names3(c.names), active: c.active !== false, sort: Number(c.sort) || i + 1 }));
  const posters = (Array.isArray(b.posters) ? b.posters : []).slice(0, 5000).map(cleanPoster);
  await platformSet('posterLib', { categories, segments, posters }); res.json({ ok: true });
}));
app.put('/api/sa/postercfg', auth, superOnly, wrap(async (req, res) => { await platformSet('posterCfg', { designerApprove: !!req.body?.designerApprove }); res.json({ ok: true }); }));
app.post('/api/sa/asset', auth, superOnly, wrap(async (req, res) => {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(req.body?.data || ''));
  if (!m) return err(res, 400, 'photo');
  const buf = Buffer.from(m[2], 'base64'); if (buf.length > 4 * 1024 * 1024) return err(res, 413, 'big');
  const id = newId();
  await q("INSERT INTO photos (id, tenant_id, car_id, mime, data, created_at) VALUES (?, '_platform', 'asset', ?, ?, ?)", [id, m[1], buf, Date.now()]);
  res.json({ ok: true, id });
}));
app.put('/api/sa/dealerposter/:tid', auth, superOnly, wrap(async (req, res) => {
  const tn = await getTenant(req.params.tid); if (!tn) return err(res, 404, 'nf');
  const b = req.body || {}; const all = await platformGet('dealerPoster', {}); const cur = all[tn.id] || { pattiStatus: 'pending', pattiImages: [null, null, null] };
  if (b.segment !== undefined) cur.segment = String(b.segment).slice(0, 40);
  if (Array.isArray(b.pattiImages)) cur.pattiImages = [0, 1, 2].map(i => (ID_RE.test(String(b.pattiImages[i] || '')) ? b.pattiImages[i] : null));
  if (['pending', 'approved', 'rejected'].includes(b.pattiStatus)) { cur.pattiStatus = b.pattiStatus; await logIt(req.user.name, 'पट्टी: ' + b.pattiStatus, tn.id); }
  all[tn.id] = cur; await platformSet('dealerPoster', all); res.json({ ok: true, poster: cur });
}));

app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ================= RC lookup (number plate → vehicle details) ================= */
// Provider is chosen by env: RC_PROVIDER = cashfree | surepass | generic | mock (mock = fake data, for development/tests only).
// cashfree: CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET, CASHFREE_ENV=production|sandbox (RC_API_URL overrides the URL).
// RC_API_KEY (secret), RC_API_URL (generic; optional for surepass), RC_API_KEY_HEADER (generic, default Authorization),
// RC_API_FIELD (generic: JSON body field for the number, default "vehicle_number"). Each plan has rcPerMonth (0 = off).
// A number already looked up by the same dealer in the last 30 days is answered from cache and not counted again.
const RC_RE = /^([A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}|\d{2}BH\d{4}[A-Z]{1,2})$/;
const normReg = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const rcProvider = () => String(process.env.RC_PROVIDER || '').trim().toLowerCase();
const rcConfigured = () => rcProvider() === 'mock'
  || (rcProvider() === 'cashfree' && !!process.env.CASHFREE_CLIENT_ID && !!process.env.CASHFREE_CLIENT_SECRET)
  || (['surepass', 'generic'].includes(rcProvider()) && !!process.env.RC_API_KEY && (rcProvider() === 'surepass' || !!process.env.RC_API_URL));
const rcLimit = plan => Number.isFinite(Number(plan.rcPerMonth)) && plan.rcPerMonth !== undefined ? Math.max(0, Number(plan.rcPerMonth)) : ((DEFAULT_PLANS.find(p => p.id === plan.id) || {}).rcPerMonth || 0);
const monthStart = () => { const d = new Date(Date.now() + TZ_MIN * 60e3); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - TZ_MIN * 60e3; };
async function rcUsed(tid) { const [[r]] = await q('SELECT COUNT(DISTINCT reg) AS n FROM rc_lookups WHERE tenant_id = ? AND at >= ?', [tid, monthStart()]); return Number(r.n) || 0; }
async function rcStatus(tn) { const limit = rcLimit(await planFor(tn)); return { enabled: rcConfigured() && limit > 0, limit, used: limit ? await rcUsed(tn.id) : 0 }; }

// Pick the first non-empty value among many possible key names (providers name fields differently).
function rcMap(raw) {
  const flat = {}; const walk = (o, depth) => { if (!o || typeof o !== 'object' || depth > 3) return; for (const [k, v] of Object.entries(o)) { if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, depth + 1); else if (v !== null && v !== '' && flat[k.toLowerCase()] === undefined) flat[k.toLowerCase()] = v; } };
  walk(raw, 0);
  const pick = (...ks) => { for (const k of ks) { const v = flat[k]; if (v !== undefined && String(v).trim() && !/^(na|n\/a|null|-)$/i.test(String(v).trim())) return String(v).trim(); } return ''; };
  const isoDate = v => { if (!v) return ''; let m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`; m = String(v).match(/^(\d{1,2})[-/. ](\d{1,2}|[A-Za-z]{3})[-/. ](\d{4})/); if (!m) return '';
    const mon = isNaN(m[2]) ? ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase()) + 1 : Number(m[2]); return mon ? `${m[3]}-${String(mon).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}` : ''; };
  const fuelRaw = pick('fuel_type', 'fueltype', 'fuel', 'fuel_descr', 'fueldesc', 'type').toLowerCase();
  const fuel = /electric|ev\b|battery/.test(fuelRaw) ? 'ev' : /cng|lpg/.test(fuelRaw) ? 'cng' : /diesel/.test(fuelRaw) ? 'diesel' : /petrol|gasoline/.test(fuelRaw) ? 'petrol' : '';
  const regDate = isoDate(pick('registration_date', 'reg_date', 'regdate', 'registrationdate', 'rc_regn_dt'));
  const mfg = pick('manufacturing_date_formatted', 'vehicle_manufacturing_month_year', 'manufacturing_date', 'manufacturingdate', 'mfg_date', 'manufacturing_year', 'mfgyear');
  const year = (String(mfg).match(/(19|20)\d{2}/) || [])[0] || (regDate ? regDate.slice(0, 4) : '');
  const financed = pick('financed', 'is_financed', 'hypothecation');
  const financer = pick('financer', 'financier', 'financer_name', 'financier_name', 'rc_financer', 'hypothecated_to');
  return {
    reg: normReg(pick('rc_number', 'registration_number', 'reg_no', 'regno', 'vehicle_number', 'rc_regn_no')),
    company: pick('maker_description', 'maker', 'make', 'manufacturer', 'vehicle_manufacturer_name', 'maker_name', 'rc_maker_desc'),
    model: pick('maker_model', 'model', 'vehicle_model', 'model_name', 'rc_maker_model'),
    year, color: pick('color', 'colour', 'vehicle_color', 'vehicle_colour', 'rc_color'), fuel,
    ownerNo: Number(pick('owner_number', 'owner_serial_number', 'owner_sr_no', 'ownerserialno', 'owner_count')) || '',
    owner: pick('owner_name', 'owner', 'ownername', 'rc_owner_name'),
    chassis: pick('vehicle_chasi_number', 'vehicle_chassis_number', 'chassis_number', 'chassis', 'chassis_no', 'rc_chasi_no'),
    engine: pick('vehicle_engine_number', 'engine_number', 'engine', 'engine_no', 'rc_eng_no'),
    insurance: isoDate(pick('insurance_upto', 'vehicle_insurance_upto', 'insurance_valid_upto', 'insurance_expiry', 'insuranceupto', 'rc_insurance_upto')),
    insurer: pick('insurance_company', 'vehicle_insurance_company_name', 'insurer', 'insurance_comp', 'rc_insurance_comp'),
    tax: pick('tax_upto', 'vehicle_tax_upto', 'tax_paid_upto', 'taxupto', 'rc_tax_upto'),
    finance: financer || (/^(true|yes|y|1)$/i.test(financed) ? 'Yes' : ''),
    regDate, rto: pick('registered_at', 'reg_authority', 'rto', 'office_name', 'rc_registered_at'),
    vehicleClass: pick('vehicle_category_description', 'vehicle_class', 'class', 'vehicle_class_desc', 'rc_vh_class_desc'),
    blacklisted: /^(true|yes|1|blacklisted)$/i.test(pick('blacklist_status', 'blacklisted', 'is_blacklisted')),
    rcStatus: pick('rc_status', 'rcstatus', 'status_message'),
  };
}
async function rcFetch(reg) {
  const prov = rcProvider();
  if (prov === 'mock') {
    if (reg.endsWith('0000')) return null;
    return { data: { rc_number: reg, owner_name: 'Test Owner', maker_description: 'MARUTI SUZUKI INDIA LTD', maker_model: 'SWIFT VXI', color: 'WHITE', fuel_type: 'PETROL',
      registration_date: '2019-03-14', manufacturing_date_formatted: '2019-02', owner_number: '1', vehicle_chasi_number: 'MA3XXXXXXXX12345', vehicle_engine_number: 'K12MXXXX6789',
      insurance_upto: '2026-03-13', financed: true, financer: 'HDFC BANK LTD', tax_upto: 'LTT', registered_at: 'AURANGABAD RTO, Maharashtra' } };
  }
  if (prov === 'cashfree') {
    const base = String(process.env.CASHFREE_ENV || '').toLowerCase() === 'sandbox' ? 'https://sandbox.cashfree.com' : 'https://api.cashfree.com';
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 20000);
    try {
      const r = await fetch(process.env.RC_API_URL || base + '/verification/vehicle-rc', { method: 'POST', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-client-id': String(process.env.CASHFREE_CLIENT_ID), 'x-client-secret': String(process.env.CASHFREE_CLIENT_SECRET) },
        body: JSON.stringify({ verification_id: ('sad-' + reg + '-' + newId()).slice(0, 50), vehicle_number: reg }) });
      const j = await r.json().catch(() => null);
      if (r.ok && j && String(j.status).toUpperCase() === 'INVALID') return null; // number not found / not valid
      if (!r.ok || !j) { const e = new Error(`cashfree HTTP ${r.status} ${(j && (j.code || '')) || ''} ${(j && j.message) || ''}`.trim()); e.balance = r.status === 422; throw e; }
      return j;
    } finally { clearTimeout(timer); }
  }
  const url = prov === 'surepass' ? (process.env.RC_API_URL || 'https://kyc-api.surepass.io/api/v1/rc/rc-full') : process.env.RC_API_URL;
  const hdr = prov === 'surepass' ? 'Authorization' : (process.env.RC_API_KEY_HEADER || 'Authorization');
  const key = String(process.env.RC_API_KEY);
  const val = prov === 'surepass' || (hdr.toLowerCase() === 'authorization' && !/\s/.test(key)) ? 'Bearer ' + key : key;
  const field = prov === 'surepass' ? 'id_number' : (process.env.RC_API_FIELD || 'vehicle_number');
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', [hdr]: val }, body: JSON.stringify({ [field]: reg }), signal: ctl.signal });
    const j = await r.json().catch(() => null);
    if (r.status === 404 || r.status === 422) return null;
    if (!r.ok || !j) throw new Error('rc provider HTTP ' + r.status);
    return j;
  } finally { clearTimeout(timer); }
}
app.get('/api/rc/status', auth, needTenant, wrap(async (req, res) => res.json(await rcStatus(req.tenant))));
app.post('/api/rc/lookup', auth, needTenant, writable, wrap(async (req, res) => {
  const reg = normReg(req.body?.reg);
  if (!RC_RE.test(reg)) return err(res, 400, 'rc_reg');
  if (!rcConfigured()) return err(res, 503, 'rc_off');
  const limit = rcLimit(await planFor(req.tenant)); if (!limit) return err(res, 403, 'rc_plan');
  const [[hit]] = await q('SELECT data FROM rc_lookups WHERE tenant_id = ? AND reg = ? AND at >= ? ORDER BY at DESC LIMIT 1', [req.tid, reg, Date.now() - 30 * 864e5]);
  if (hit) return res.json({ rc: JSON.parse(hit.data), cached: true, ...(await rcStatus(req.tenant)) });
  if ((await rcUsed(req.tid)) >= limit) return err(res, 403, 'rc_limit');
  let raw; try { raw = await rcFetch(reg); } catch (e) { console.error('RC lookup failed:', e.message); await logIt('RC', 'RC सेवा त्रुटी: ' + e.message.slice(0, 150), null); return err(res, 502, 'rc_fail'); }
  const rc = raw ? rcMap(raw) : null;
  if (!rc || !(rc.model || rc.company || rc.owner)) return err(res, 404, 'rc_nf');
  rc.reg = rc.reg || reg;
  await q('INSERT INTO rc_lookups (tenant_id, reg, at, data) VALUES (?,?,?,?)', [req.tid, reg, Date.now(), JSON.stringify(rc)]);
  await logIt(req.user.name, 'RC तपासले: ' + reg, req.tid);
  res.json({ rc, cached: false, ...(await rcStatus(req.tenant)) });
}));

/* number-plate OCR files (tesseract.js), served from our own server – fetched by the phone only when a dealer taps Scan */
const ocrDir = (pkg, sub = '') => path.join(path.dirname(require.resolve(pkg + '/package.json')), sub);
const ocrOpts = { maxAge: '30d', immutable: true };
try {
  app.use('/ocr/js', express.static(ocrDir('tesseract.js', 'dist'), ocrOpts));
  app.use('/ocr/core', express.static(ocrDir('tesseract.js-core'), ocrOpts));
  app.use('/ocr/lang', express.static(ocrDir('@tesseract.js-data/eng', '4.0.0_best_int'), ocrOpts));
  app.use('/ocr', (req, res) => err(res, 404, 'nf'));
} catch (e) { console.warn('OCR files not installed – plate scan will ask dealers to type the number', e.message); }

/* ================= app files ================= */
// Android app (TWA / APK): proves to Android that the APK and this website belong together, so the app opens full-screen
// without a browser bar. Set ANDROID_PACKAGE (e.g. in.smartautodeal.app) and ANDROID_SHA256 (signing-key fingerprint(s),
// comma-separated, "AA:BB:…") in the environment. See docs/ANDROID-APP.md.
app.get('/.well-known/assetlinks.json', (req, res) => {
  const pkg = String(process.env.ANDROID_PACKAGE || '').trim();
  const fps = String(process.env.ANDROID_SHA256 || '').split(',').map(s => s.trim().toUpperCase()).filter(s => /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(s));
  if (!pkg || !fps.length) return res.status(404).json({ error: 'android app not configured' });
  res.set('Cache-Control', 'public, max-age=3600');
  res.json([{ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: pkg, sha256_cert_fingerprints: fps } }]);
});
app.use(express.static(path.join(__dirname, 'public'), { setHeaders(res, file) { if (/(sw\.js|index\.html|app\.js|style\.css|\.json)$/.test(file)) res.set('Cache-Control', 'no-cache'); } }));
app.get(['/c/:tid', '/c/:tid/:id'], (req, res) => { res.set('Cache-Control', 'no-cache'); res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.use('/api', (req, res) => err(res, 404, 'not found'));
app.use((e, req, res, next) => { console.error(e); err(res, 500, 'server'); });

migrate()
  .then(() => app.listen(PORT, () => console.log('Smart AutoDeal chal raha hai, port', PORT)))
  .catch(e => { console.error('Database se jud nahi paya:', e.message); process.exit(1); });
