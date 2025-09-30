import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './pwtests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    launchOptions: {
      slowMo: 2000, // slow down actions by 500ms
    },

  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
