import { expect, test as setup } from '@playwright/test'
import { environmentConfig } from '../../config/environment'

const HEALTH_CHECK_TIMEOUT_MS = 10_000

setup('[ENV-HEALTH-CHECK-001] Confirmar que o ambiente está acessível', async () => {
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
