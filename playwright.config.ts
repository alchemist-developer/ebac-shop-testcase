import { defineConfig, devices } from '@playwright/test'
import { environmentConfig } from './config/environment'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }], ['./reporters/csvReporter.ts']],
  use: {
    baseURL: environmentConfig.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid'
  },
  projects: [
    {
      name: 'unit',
      testMatch: /tests\/unit\/.*\.spec\.ts/
    },
    {
      name: 'health-check',
      testMatch: /tests\/support\/healthCheck\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chromium-e2e',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      dependencies: ['health-check'],
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chromium-api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      dependencies: ['health-check'],
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
