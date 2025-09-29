import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://playwright.dev/docs/test-configuration#launching-a-development-browser
 */
function getEnvVar(name: string) {
  const envVar = process.env[name];
  if (envVar) {
    return envVar;
  }
  // Fallback to the value from .env.local
  const fileContent = require('fs').readFileSync('.env.local', 'utf8');
  const lines = fileContent.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts[0].trim() === name) {
      return parts[1].trim();
    }
  }
  return undefined;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9002',
    trace: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports.
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    // Test against branded browsers.
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:9002',
    reuseExistingServer: !process.env.CI,
  },
});