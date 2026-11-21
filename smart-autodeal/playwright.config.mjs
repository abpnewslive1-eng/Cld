import { defineConfig, devices } from '@playwright/test';
// Browser tests run against dist/smart-autodeal-demo.html (built by `npm run build:demo`):
// the whole app with an in-memory fake server, so no database is needed.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
