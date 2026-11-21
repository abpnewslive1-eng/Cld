// Validates public/lang/<code>.json packs against i18n/source-strings.json:
// every key present, non-empty, same {placeholders} and same HTML tags as the English text.
// Usage: node scripts/check-lang.mjs [code ...]   (no args = all packs)
import { readFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const src = JSON.parse(readFileSync(new URL('i18n/source-strings.json', root), 'utf8'));
const codes = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(new URL('public/lang/', root)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
const ph = s => (String(s).match(/\{[a-z0-9_]+\}/gi) || []).sort().join(',');
const tags = s => (String(s).match(/<\/?[a-z][a-z0-9]*/gi) || []).map(x => x.toLowerCase()).sort().join(',');
let bad = 0;
for (const code of codes) {
  let pack; try { pack = JSON.parse(readFileSync(new URL(`public/lang/${code}.json`, root), 'utf8')); } catch (e) { console.log(`${code}: cannot read/parse – ${e.message}`); bad++; continue; }
  const errs = [];
  const cmp = (where, en, tr) => {
    if (typeof tr !== 'string' || !tr.trim()) { if (String(en).trim()) errs.push(`${where}: missing`); return; }
    if (ph(en) !== ph(tr)) errs.push(`${where}: placeholders ${ph(en)} ≠ ${ph(tr)}`);
    if (tags(en) !== tags(tr)) errs.push(`${where}: html tags differ`);
  };
  for (const [k, v] of Object.entries(src.T)) cmp(`T.${k}`, v.en, pack.T?.[k]);
  for (const [g, o] of Object.entries(src.OPT)) for (const [k, v] of Object.entries(o)) cmp(`OPT.${g}.${k}`, v.en, pack.OPT?.[g]?.[k]);
  for (const [k, v] of Object.entries(src.BUY_SRC)) cmp(`BUY_SRC.${k}`, v.en, pack.BUY_SRC?.[k]);
  const extra = Object.keys(pack.T || {}).filter(k => !(k in src.T));
  if (extra.length) errs.push(`unknown T keys: ${extra.slice(0, 10).join(', ')}`);
  console.log(`${code}: ${errs.length ? errs.length + ' problem(s)' : 'OK'}`); errs.slice(0, 40).forEach(e => console.log('  ' + e));
  if (errs.length) bad++;
}
process.exit(bad ? 1 : 0);
