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
  const lang = page.locator('#main select.lang-select');
  await expect(lang.locator('option')).toHaveCount(12);
  await lang.selectOption('mr');
  await expect(side.getByRole('link', { name: 'सेटिंग' })).toBeVisible();
  await page.locator('#main select.lang-select').selectOption('en');
  await expect(side.getByRole('link', { name: 'Settings', exact: true })).toBeVisible();
});

test('every Indian language in the dropdown translates the app and survives a reload', async ({ page, isMobile }) => {
  await loginAs(page, 'Sevasai – Owner');
  if (isMobile) await page.locator('.tb-actions a[href="#settings"]').click(); else await page.locator('#side').getByRole('link', { name: 'Settings', exact: true }).click();
  const sel = page.locator('#main select.lang-select');
  const codes = await sel.locator('option').evaluateAll(o => o.map(x => x.value));
  expect(codes).toEqual(['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'or', 'pa', 'as']);
  for (const code of codes.filter(c => c !== 'en' && c !== 'mr')) {
    await sel.selectOption(code);
    await expect(page.locator('html')).toHaveAttribute('lang', code);
    await expect(page.locator('#main h1').first(), code).not.toHaveText('Settings');
  }
  await sel.selectOption('hi');
  await expect(page.locator('#main h1').first()).toHaveText('सेटिंग्स');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('select.lang-select').first()).toHaveValue('hi');
  await page.locator('select.lang-select').first().selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('long words in Indian languages never push the dashboard wider than the screen', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  for (const code of ['ta', 'ml', 'kn', 'te', 'bn', 'hi']) {
    await page.evaluate(c => setLang(c), code);
    await page.evaluate(() => { location.hash = 'dashboard'; });
    await expect(page.locator('html')).toHaveAttribute('lang', code);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over, code).toBeLessThanOrEqual(1);
  }
  await page.evaluate(() => setLang('en'));
});

test('phone Back button closes an open form instead of leaving the page', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  await page.evaluate(() => { location.hash = 'cars'; });
  await page.getByRole('button', { name: /Add car/ }).first().click();
  await expect(page.locator('#overlay')).toHaveClass(/open/);
  await page.goBack();
  await expect(page.locator('#overlay')).not.toHaveClass(/open/);
  await expect(page).toHaveURL(/#cars$/);
  // closing with Cancel/✕ leaves no extra Back step behind
  await page.getByRole('button', { name: /Add car/ }).first().click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveClass(/open/);
  await page.evaluate(() => { location.hash = 'leads'; });
  await page.goBack();
  await expect(page).toHaveURL(/#cars$/);
});

test('layout fits every screen from a small phone to a big monitor', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  for (const [width, height] of [[320, 640], [768, 1024], [1024, 768], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    for (const r of ['dashboard', 'cars', 'leads', 'deals', 'posters', 'settings']) {
      await page.evaluate(h => { location.hash = h; }, r);
      await expect(page.locator('#main')).not.toBeEmpty();
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(over, `${width}px ${r}`).toBeLessThanOrEqual(1);
    }
    // desktop shows the sidebar with names, phones/tablets the bottom bar
    if (width > 860) await expect(page.locator('#side .lbl').first()).toBeVisible(); else await expect(page.locator('#bottom')).toBeVisible();
  }
});

test('number plate text is read even with usual OCR mix-ups', async ({ page }) => {
  const r = await page.evaluate(() => [
    'IND MH 20 DV 4521', 'MH2O DV 452l', 'mh-20-dv-4521', 'KA 05 MN 1234', 'DL 3C AB 1234', 'TN 9 Z 0001', '22 BH 1234 AA', 'GJ01KA8888', 'random text 12', 'HELLO WORLD',
  ].map(plateFromText));
  expect(r).toEqual(['MH20 DV 4521', 'MH20 DV 4521', 'MH20 DV 4521', 'KA05 MN 1234', 'DL3C AB 1234', 'TN9 Z 0001', '22 BH 1234 AA', 'GJ01 KA 8888', '', '']);
});

test('scanning a number plate fills the new car form from RC', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  await page.evaluate(() => { location.hash = 'cars'; window.PLATE_OCR = async () => 'IND\nMH 2O DV 452l'; });
  await page.getByRole('button', { name: /Add car/ }).first().click();
  const sheet = page.locator('#sheet');
  await expect(sheet.getByText('Check on Parivahan')).toBeVisible();
  await sheet.locator('.rc-bar input[capture]').setInputFiles({ name: 'plate.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff]) });
  await expect(sheet.locator('#f_reg')).toHaveValue('MH20 DV 4521');
  await expect(sheet.locator('#f_model')).not.toHaveValue('');
  await expect(sheet.locator('#f_company')).not.toHaveValue('');
  await expect(sheet.locator('#f_year')).not.toHaveValue('');
  await expect(sheet.locator('#f_buyFrom')).not.toHaveValue('');
  await expect(sheet.locator('.rc-info')).toContainText('RC owner');
  await expect(sheet.locator('#rcStatus')).toContainText('lookups left this month');
  // a number that cannot be read asks the dealer to type it
  await page.evaluate(() => { window.PLATE_OCR = async () => 'blurry'; });
  await sheet.locator('.rc-bar input[capture]').setInputFiles({ name: 'p2.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff]) });
  await expect(page.locator('#toast')).toContainText('type it');
  await page.keyboard.press('Escape');
});

test('RC card text (smart card, mParivahan screenshot) is turned into car details', async ({ page }) => {
  const [card, mpv] = await page.evaluate(() => [
    rcFromText('Certificate of Registration\nRegn. Number   MH20DV4521        Date of Regn.  14/03/2019\nChassis Number  MA3EWDE1S00123456\nEngine / Motor Number  K12MN1234567\nOwner Name   SANJAY DESHMUKH\nFuel  PETROL       Emission Norms  BHARAT STAGE IV\nOwner Serial No  2\nVehicle Class  MOTOR CAR (LMV)\nMaker\'s Name  MARUTI SUZUKI INDIA LTD\nModel Name  SWIFT VXI\nColour  PEARL WHITE      Body Type  SALOON\nMonth - Yr of Mfg  02/2019\nFinancier  HDFC BANK LTD'),
    rcFromText('mParivahan\nRegistration No\nKAO5MN1234\nOwner Name\nRAJESH KULKARNI\nMaker / Model\nHYUNDAI MOTOR INDIA LTD / I20 SPORTZ\nVehicle Class\nMotor Car(LMV)\nFuel Type\nDIESEL\nRegistration Date\n05-Jul-2018\nInsurance Upto\n12-Aug-2026\nFinancier Name\nNA'),
  ]);
  expect(card).toMatchObject({ reg: 'MH20 DV 4521', company: 'MARUTI SUZUKI INDIA LTD', model: 'SWIFT VXI', year: '2019', color: 'PEARL WHITE', fuel: 'petrol', ownerNo: 2, owner: 'SANJAY DESHMUKH',
    chassis: 'MA3EWDE1S00123456', engine: 'K12MN1234567', finance: 'HDFC BANK LTD', regDate: '2019-03-14', vehicleClass: 'MOTOR CAR (LMV)' });
  expect(mpv).toMatchObject({ reg: 'KA05 MN 1234', company: 'HYUNDAI MOTOR INDIA LTD', model: 'I20 SPORTZ', year: '2018', fuel: 'diesel', owner: 'RAJESH KULKARNI', insurance: '2026-08-12', finance: '', regDate: '2018-07-05' });
});

test('free "Scan RC" fills the new car form without any API', async ({ page }) => {
  await loginAs(page, 'Sevasai – Owner');
  await page.evaluate(() => { location.hash = 'cars'; window.RC_OCR = async () => 'Regn. Number  MH20 EE 4455\nOwner Name  ANIL PATIL\nMaker\'s Name  TATA MOTORS LTD\nModel Name  NEXON XZ\nColour  FLAME RED\nFuel  DIESEL\nMonth - Yr of Mfg  06/2020\nFinancier  ICICI BANK'; });
  await page.getByRole('button', { name: /Add car/ }).first().click();
  const sheet = page.locator('#sheet');
  await sheet.locator('.rc-bar input[type=file][multiple]').setInputFiles([{ name: 'front.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff]) }, { name: 'back.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff]) }]);
  await expect(sheet.locator('#f_reg')).toHaveValue('MH20 EE 4455');
  await expect(sheet.locator('#f_company')).toHaveValue('Tata');
  await expect(sheet.locator('#f_model')).toHaveValue('NEXON XZ');
  await expect(sheet.locator('#f_year')).toHaveValue('2020');
  await expect(sheet.locator('#f_fuel')).toHaveValue('diesel');
  await expect(sheet.locator('#f_buyFrom')).toHaveValue('Anil Patil');
  await expect(sheet.locator('.rc-info')).toContainText('ICICI BANK');
  await expect(page.locator('#toast')).toContainText('from the RC');
  await page.keyboard.press('Escape');
});
