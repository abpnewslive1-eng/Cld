# Smart AutoDeal
Multi-dealer management software for used-vehicle dealers (stock, customers, receipts, posters, catalogue, WhatsApp).

```bash
npm install
npm run db:up                 # MySQL in Docker
cp .env.example .env && cp .env.test.example .env.test
npm run dev                   # http://localhost:3000
npm test                      # API tests
npx playwright install chromium && npm run test:e2e   # browser tests
```
See **CLAUDE.md** for architecture and rules, **docs/DEPLOY-HOSTINGER.md** for going live.
