// Regenerates i18n/source-strings.json (every UI string in English + Marathi) from the built demo.
// Run after adding/changing strings in T / OPT / BUY_SRC:  npm run build:demo && node scripts/extract-strings.mjs
// Then translate the new keys into public/lang/*.json and check with: node scripts/check-lang.mjs
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const demo = new URL('../dist/smart-autodeal-demo.html', import.meta.url);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await b.newPage(); await p.goto(demo.href); await p.waitForFunction(() => typeof T === 'object');
const d = await p.evaluate(() => {
  const pair = v => ({ en: v[1], mr: v[0] }), map = (o, f) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));
  return { T: map(T, pair), OPT: map(OPT, o => map(o, pair)), BUY_SRC: map(BUY_SRC, pair) };
});
await b.close();
writeFileSync(fileURLToPath(new URL('../i18n/source-strings.json', import.meta.url)), JSON.stringify(d, null, 1));
console.log(`i18n/source-strings.json: ${Object.keys(d.T).length} T keys`);
