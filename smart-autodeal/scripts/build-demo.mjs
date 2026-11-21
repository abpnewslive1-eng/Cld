// Builds dist/smart-autodeal-demo.html: ONE self-contained file (no server, no database).
// dev/demo-mock.js replaces window.fetch for /api/* with an in-memory fake server + sample data.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
const r = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
let html = r('public/index.html');
// language packs are fetched from /lang/*.json on a real server; the demo has no server, so inline them
const packs = Object.fromEntries(readdirSync(new URL('../public/lang/', import.meta.url)).filter(f => f.endsWith('.json')).map(f => [f.slice(0, -5), JSON.parse(r('public/lang/' + f))]));
const packJs = `window.LANG_PACKS = ${JSON.stringify(packs).replace(/</g, '\\u003c')};`;
const app = r('public/app.js').replace("if ('serviceWorker' in navigator && location.protocol.startsWith('http'))", 'if (false)');
html = html
  .replace(/<link rel="manifest"[^>]*>\n?/, '').replace(/<link rel="icon"[^>]*>\n?/, '').replace(/<link rel="apple-touch-icon"[^>]*>\n?/, '')
  .replace('<link rel="stylesheet" href="style.css">', () => `<style>\n${r('public/style.css')}\n</style>`)
  .replace('<script src="vendor/qrcode.min.js"></script>', () => `<script>\n${r('public/vendor/qrcode.min.js')}</script>`)
  .replace('<script src="app.js"></script>', () => `<script>\n${packJs}\n${r('dev/demo-mock.js')}\n${app}\n</script>`)
  .replace('<title>Smart AutoDeal</title>', '<title>Smart AutoDeal – Demo</title>');
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/smart-autodeal-demo.html', import.meta.url), html);
console.log('dist/smart-autodeal-demo.html built');
