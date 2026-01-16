import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './pwTests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: !!process.env.CI,  // 👈 true in CI, false locally
    launchOptions: {
      slowMo: process.env.CI ? 0 : 2000,
    },

  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
