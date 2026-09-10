import { defineConfig, devices } from '@playwright/test'
import { environmentConfig } from './config/environment'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
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
      // Not a dependency of `unit`: pure-function tests have no real
      // dependency on the app being up, and must stay runnable (e.g. in a
      // CI quality-gate job) without needing the app reachable at all.
      name: 'health-check',
      testMatch: /tests\/support\/healthCheck\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      // storageState is NOT set at the project level on purpose: most e2e
      // specs are guest flows and must get a fresh, isolated browser context
      // (and therefore an isolated server-side cart session) per test. Specs
      // that need authentication (tests/e2e/purchase-flow.spec.ts) import
      // `test` from tests/support/authFixtures.ts instead, which logs in
      // once per parallel worker rather than sharing one global session —
      // see that file for why a single shared session doesn't scale safely.
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
