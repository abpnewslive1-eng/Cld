// API tests: start a real server against a throw-away MySQL database (name must end with _test).
// Run:  npm test      (needs MySQL – `npm run db:up` – and a .env.test file, see .env.test.example)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const mysql = require('mysql2/promise');

const root = new URL('../', import.meta.url);
const env = { ...process.env };
const envFile = new URL('.env.test', root);
if (existsSync(envFile)) for (const line of readFileSync(envFile, 'utf8').split('\n')) { const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && env[m[1]] === undefined) env[m[1]] = m[2]; }
if (!String(env.DB_NAME || '').endsWith('_test')) throw new Error('Refusing to run: DB_NAME must end with _test (these tests wipe the database).');
const PORT = env.TEST_PORT || '3999', BASE = `http://127.0.0.1:${PORT}`;
const SUPER = { username: 'super', password: 'superpass123' };
let server;

async function wipeDb() {
  const c = await mysql.createConnection({ host: env.DB_HOST, port: Number(env.DB_PORT || 3306), user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME });
  const [rows] = await c.query('SHOW TABLES'); await c.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const r of rows) await c.query(`DROP TABLE \`${Object.values(r)[0]}\``);
  await c.end();
}
async function sql(q, args) { const c = await mysql.createConnection({ host: env.DB_HOST, port: Number(env.DB_PORT || 3306), user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME }); const [r] = await c.query(q, args); await c.end(); return r; }

/** Tiny cookie-keeping HTTP client. */
function client() {
  let cookie = '';
  const call = async (method, path, body) => {
    const r = await fetch(BASE + path, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    let json = null; try { json = await r.json(); } catch (e) {}
    return { status: r.status, body: json };
  };
  return { get: p => call('GET', p), post: (p, b) => call('POST', p, b || {}), put: (p, b) => call('PUT', p, b), patch: (p, b) => call('PATCH', p, b), del: p => call('DELETE', p) };
}
async function login(username, password) { const c = client(); const r = await c.post('/api/login', { username, password }); assert.equal(r.status, 200, `login ${username}: ${JSON.stringify(r.body)}`); return c; }

before(async () => {
  await wipeDb();
  server = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...env, PORT, JWT_SECRET: 'test-secret-test-secret-test-secret-1234', SUPER_USERNAME: SUPER.username, SUPER_PASSWORD: SUPER.password, SUPPORT_PHONE: '9822000000' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = ''; server.stdout.on('data', d => (log += d)); server.stderr.on('data', d => (log += d));
  for (let i = 0; i < 60; i++) { try { const r = await fetch(BASE + '/api/health'); if (r.ok) return; } catch (e) {} await new Promise(r => setTimeout(r, 250)); }
  throw new Error('server did not start:\n' + log);
});
after(() => { if (server) server.kill(); });

let sa, A, B;
test('super admin logs in and sees the platform', async () => {
  sa = await login(SUPER.username, SUPER.password);
  const me = await sa.get('/api/me'); assert.equal(me.body.user.role, 'super'); assert.equal(me.body.tenant, null);
  const o = await sa.get('/api/sa/overview'); assert.equal(o.status, 200); assert.ok(Array.isArray(o.body.plans) && o.body.plans.length >= 3);
  assert.equal((await sa.get('/api/data')).status, 403, 'super without a dealer has no dealer data');
});
test('super admin creates dealers (duplicate username rejected)', async () => {
  const mk = b => sa.post('/api/sa/tenants', { city: 'Paithan', trialDays: 14, ...b });
  assert.equal((await mk({ name: 'Dealer A', ownerName: 'Amit', phone: '9822001100', username: 'dealera', password: 'pass1234', plan: 'basic' })).status, 200);
  assert.equal((await mk({ name: 'Dealer B', ownerName: 'Bala', phone: '9822001101', username: 'dealerb', password: 'pass1234', plan: 'pro' })).status, 200);
  assert.equal((await mk({ name: 'Dup', ownerName: 'X', phone: '9822001102', username: 'dealera', password: 'pass1234' })).status, 409);
  assert.equal((await mk({ name: 'Bad', ownerName: 'X', phone: '12', username: 'zz', password: '1' })).status, 400);
});
test('dealer data is isolated, even with the same document id', async () => {
  A = await login('dealera', 'pass1234'); B = await login('dealerb', 'pass1234');
  assert.equal((await A.put('/api/docs/cars/c1', { data: { reg: 'MH20 AA 1', model: 'Alto', status: 'stock' } })).status, 200);
  assert.equal((await B.put('/api/docs/cars/c1', { data: { reg: 'MH21 BB 2', model: 'Swift', status: 'stock', askPrice: 450000 } })).status, 200);
  const a = (await A.get('/api/data')).body.rows.filter(r => r.col === 'cars'), b = (await B.get('/api/data')).body.rows.filter(r => r.col === 'cars');
  assert.equal(a.length, 1); assert.equal(a[0].data.model, 'Alto'); assert.equal(b.length, 1); assert.equal(b[0].data.model, 'Swift');
});
test('dealers cannot use super admin endpoints', async () => {
  assert.equal((await A.get('/api/sa/overview')).status, 403);
  assert.equal((await A.put('/api/sa/posterlib', { posters: [] })).status, 403);
  assert.equal((await A.put('/api/sa/dealerposter/dealera', { pattiStatus: 'approved' })).status, 403);
});
test('public catalogue follows the plan feature (basic = off, pro = on) and QR leads land in the right dealer', async () => {
  assert.equal((await client().get('/api/public/dealera/catalog')).status, 404);
  const cat = await client().get('/api/public/dealerb/catalog'); assert.equal(cat.status, 200); assert.equal(cat.body.cars.length, 1);
  assert.match(cat.body.cars[0].reg, /\*\*/, 'registration number is masked');
  const lead = await client().post('/api/public/dealerb/lead', { name: 'Vishal', phone: '9876511223', location: 'Paithan', carId: 'c1' }); assert.equal(lead.status, 200);
  const leads = (await B.get('/api/data')).body.rows.filter(r => r.col === 'leads'); assert.equal(leads.length, 1); assert.equal(leads[0].data.source, 'qr');
  assert.equal((await A.get('/api/data')).body.rows.filter(r => r.col === 'leads').length, 0);
});
test('expired plan is read-only until a payment is recorded', async () => {
  await sql("UPDATE tenants SET expiry = '2020-01-01' WHERE id = 'dealera'");
  assert.equal((await A.put('/api/docs/cars/c2', { data: { model: 'X' } })).status, 402);
  assert.equal((await A.get('/api/me')).body.tenant.status, 'expired');
  const pay = await sa.patch('/api/sa/tenants/dealera', { payment: { months: 3, amount: 2997, note: 'UPI' } }); assert.equal(pay.status, 200);
  assert.ok(pay.body.expiry > new Date().toISOString().slice(0, 10));
  assert.equal((await A.put('/api/docs/cars/c2', { data: { model: 'X' } })).status, 200);
  assert.equal((await A.get('/api/me')).body.tenant.status, 'active');
});
test('suspended dealer cannot log in or read data', async () => {
  await sa.patch('/api/sa/tenants/dealera', { suspended: true });
  assert.equal((await client().post('/api/login', { username: 'dealera', password: 'pass1234' })).status, 403);
  assert.equal((await A.get('/api/data')).status, 403);
  await sa.patch('/api/sa/tenants/dealera', { suspended: false });
  assert.equal((await A.get('/api/data')).status, 200);
});
test('super admin can open a dealer account and come back', async () => {
  assert.equal((await sa.post('/api/sa/impersonate/dealerb')).status, 200);
  const me = await sa.get('/api/me'); assert.equal(me.body.user.role, 'admin'); assert.equal(me.body.tenant.id, 'dealerb'); assert.equal(me.body.tenant.impersonating, true);
  assert.equal((await sa.get('/api/data')).body.rows.filter(r => r.col === 'cars')[0].data.model, 'Swift');
  await sa.post('/api/sa/exit'); assert.equal((await sa.get('/api/me')).body.user.role, 'super');
  const logs = (await sa.get('/api/sa/overview')).body.logs; assert.ok(logs.some(l => l.tenant === 'dealerb' && /उघडले/.test(l.what)), 'impersonation is logged');
});
test('plan limits: staff and cars', async () => {
  // basic plan: maxStaff 2 (owner counts)
  assert.equal((await A.post('/api/users', { name: 'S1', username: 'astaff1', password: 'pass1234', role: 'staff' })).status, 200);
  assert.equal((await A.post('/api/users', { name: 'S2', username: 'astaff2', password: 'pass1234', role: 'staff' })).status, 403);
  const plans = (await sa.get('/api/sa/overview')).body.plans.map(p => (p.id === 'basic' ? { ...p, maxCars: 2 } : p));
  await sa.put('/api/sa/plans', { plans });
  assert.equal((await A.put('/api/docs/cars/c3', { data: { model: 'Y' } })).status, 403, 'third car blocked on a 2-car plan');
  assert.equal((await A.put('/api/docs/cars/c1', { data: { model: 'Alto edited' } })).status, 200, 'editing an existing car is still allowed');
});
test('staff cannot see expenses or delete', async () => {
  const S = await login('astaff1', 'pass1234');
  await A.put('/api/docs/expenses/e1', { data: { category: 'rent', amount: 15000 } });
  assert.equal((await S.get('/api/data')).body.rows.filter(r => r.col === 'expenses').length, 0);
  assert.equal((await S.put('/api/docs/expenses/e2', { data: { amount: 1 } })).status, 403);
  assert.equal((await S.del('/api/docs/cars/c1')).status, 403);
});
test('poster library: categories, dealer-type filter, designer patti approval', async () => {
  const lib = { categories: [{ id: 'festival', names: { en: 'Festivals' }, tier: 'basic', active: true, sort: 1 }, { id: 'offer', names: { en: 'Offers' }, tier: 'pro', active: true, sort: 2 }, { id: 'hidden', names: { en: 'Hidden' }, tier: 'basic', active: false, sort: 3 }],
    segments: [{ id: 'cars', names: { en: 'Cars' }, active: true, sort: 1 }, { id: 'bikes', names: { en: 'Bikes' }, active: true, sort: 2 }],
    posters: [{ id: 'p1', title: 'Diwali', category: 'festival' }, { id: 'p2', title: 'Car offer', category: 'offer', segments: ['cars'] }, { id: 'p3', title: 'Bike offer', category: 'offer', segments: ['bikes'] }, { id: 'p4', title: 'Draft', category: 'festival', active: false }, { id: 'p5', title: 'In hidden cat', category: 'hidden' }] };
  assert.equal((await sa.put('/api/sa/posterlib', lib)).status, 200);
  await sa.put('/api/sa/dealerposter/dealerb', { segment: 'cars' });
  const got = (await B.get('/api/posters')).body; assert.deepEqual(got.posters.map(p => p.title).sort(), ['Car offer', 'Diwali']);
  assert.equal(got.categories.find(c => c.id === 'offer').tier, 'pro');
  await sa.put('/api/sa/postercfg', { designerApprove: true });
  let me = (await B.get('/api/me')).body.tenant.poster; assert.equal(me.designerApprove, true); assert.equal(me.pattiStatus, 'pending');
  await sa.put('/api/sa/dealerposter/dealerb', { pattiStatus: 'approved' });
  me = (await B.get('/api/me')).body.tenant.poster; assert.equal(me.pattiStatus, 'approved');
});
test('backup and restore stay inside one dealer', async () => {
  const bk = await B.get('/api/backup'); assert.equal(bk.status, 200); assert.equal(bk.body.app, 'smart-autodeal'); assert.equal(bk.body.cars.length, 1);
  const r = await A.post('/api/restore', { app: 'smart-autodeal', cars: [{ id: 'imp1', model: 'Imported' }] }); assert.equal(r.status, 200);
  assert.ok((await A.get('/api/data')).body.rows.some(x => x.id === 'imp1'));
  assert.ok(!(await B.get('/api/data')).body.rows.some(x => x.id === 'imp1'));
});
