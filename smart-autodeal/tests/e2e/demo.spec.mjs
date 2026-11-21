import { test, expect } from '@playwright/test';
import path from 'node:path';
const DEMO = 'file://' + path.resolve('dist/smart-autodeal-demo.html');
const signOut = async page => { await page.getByRole('button', { name: 'Sign out' }).first().click(); await expect(page.locator('#login')).toBeVisible(); };
const loginAs = async (page, label) => { await signOut(page); await page.getByRole('button', { name: label }).click(); await page.getByRole('button', { name: 'Sign in', exact: true }).click(); };

test.beforeEach(async ({ page }) => { await page.goto(DEMO); await expect(page.locator('#main')).not.toBeEmpty(); });

test('login page is always English', async ({ page }) => {
  await signOut(page);
  await expect(page.locator('.login-box')).toContainText('Smart AutoDeal');
  await expect(page.locator('.login-box h2')).toHaveText('Sign in');
  await page.fill('#lu', 'nobody'); await page.fill('#lp', 'wrong');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('#lerr')).toHaveText('Wrong username or password');
});

test('super admin creates a dealer and opens it as that dealer', async ({ page }) => {
  await page.goto(DEMO + '#sa-dealers');
  await page.getByRole('button', { name: /New dealer/ }).first().click();
  const f = page.locator('#ndForm');
  await f.locator('#f_name').fill('Test Motors'); await f.locator('#f_city').fill('Pune'); await f.locator('#f_ownerName').fill('Test Owner');
  await f.locator('#f_phone').fill('9822009999'); await f.locator('#f_username').fill('testmotors'); await f.locator('#f_password').fill('test12345');
  await page.getByRole('button', { name: 'Create dealer' }).click();
  await expect(page.locator('#toast')).toContainText('testmotors');
  await page.locator('tbody tr', { hasText: 'Test Motors' }).click();
  await page.getByRole('button', { name: /Open as dealer/ }).click();
  await expect(page.locator('.tbanner.imp')).toContainText('Test Motors');
  await page.getByRole('button', { name: 'Back to Super Admin' }).click();
  await expect(page).toHaveURL(/#sa/);
});

test('dealer sees daily posters with their patti', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  await page.goto(DEMO + '#posters');
  const thumbs = page.locator('img[data-pl]');
  await expect(thumbs.first()).toBeVisible();
  await expect.poll(async () => (await thumbs.first().getAttribute('src')) || '').toMatch(/^data:image/);
  await thumbs.first().click();
  await expect(page.locator('#plCv')).toBeVisible();
  await expect(page.getByRole('button', { name: /Download/ })).toBeEnabled();
});

test('bulk upload reads date and title from file names', async ({ page }) => {
  await page.goto(DEMO + '#sa-posters');
  await page.getByRole('button', { name: /Bulk upload/ }).click();
  // 1x1 PNG
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  await page.locator('.sheet input[type=file][multiple]').setInputFiles([
    { name: '2026-12-25_Christmas-Sale.png', mimeType: 'image/png', buffer: png },
    { name: '31-12-2026 New Year Eve.png', mimeType: 'image/png', buffer: png },
  ]);
  const rows = page.locator('.bu-list li');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator('input.search').first()).toHaveValue('Christmas Sale');
  await expect(rows.nth(0).locator('input[type=date]')).toHaveValue('2026-12-25');
  await expect(rows.nth(1).locator('input[type=date]')).toHaveValue('2026-12-31');
});

test('expired dealer is read-only', async ({ page }) => {
  await loginAs(page, 'Shri Ganesh (expired)');
  await expect(page.locator('.tbanner.red')).toContainText('Your plan has ended');
});

test('desktop sidebar shows full menu names, mobile uses bottom bar', async ({ page, isMobile }) => {
  await loginAs(page, 'Sevasai – Owner');
  if (isMobile) { await expect(page.locator('#side')).toBeHidden(); await expect(page.locator('#bottom')).toBeVisible(); return; }
  const side = page.locator('#side');
  for (const name of ['Dashboard', 'Cars', 'Customers', 'Settings']) await expect(side.getByRole('link', { name, exact: true }).locator('.lbl')).toBeVisible();
  await side.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.locator('#main .lang-switch').first()).toBeVisible();
  await page.locator('#main').getByRole('button', { name: 'मराठी' }).click();
  await expect(side.getByRole('link', { name: 'सेटिंग' })).toBeVisible();
  await page.locator('#main').getByRole('button', { name: 'English' }).click();
});
