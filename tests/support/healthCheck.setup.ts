import { expect, test as setup } from '@playwright/test'
import { environmentConfig } from '../../config/environment'

const HEALTH_CHECK_TIMEOUT_MS = 10_000

/*
Runs once as a dependency of every project that needs the real app
(chromium-e2e, chromium-api) — not of `unit`, which has no dependency on
this project and never triggers it. Its only job is to tell an unreachable
application apart from a broken test: without it, a down environment
surfaces as N unrelated-looking timeouts scattered across the report,
indistinguishable at a glance from N real product bugs. Failing here
instead produces one clear, top-level error before any test time is spent.
*/
setup('environment is reachable', async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS)
  let response: Response

  try {
    response = await fetch(environmentConfig.baseURL, { signal: controller.signal })
  } catch (error) {
    throw new Error(
      `Environment health check failed for ${environmentConfig.baseURL}: could not reach the ` +
        'application — this is an infrastructure issue, not a test failure. Fix connectivity/' +
        'availability before investigating individual test results.',
      { cause: error }
    )
  } finally {
    clearTimeout(timeout)
  }

  expect(
    response.ok,
    `Environment health check failed for ${environmentConfig.baseURL}: received HTTP ` +
      `${response.status}. This is an infrastructure issue, not a test failure. Fix ` +
      'connectivity/availability before investigating individual test results.'
  ).toBe(true)
})
