import { test as base } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { authStateFileForWorker } from '../../config/auth'
import { environmentConfig } from '../../config/environment'
import { expectAuthenticatedAccount } from '../../assertions/accountAssertions'
import { MyAccountPage } from '../../pages/MyAccountPage'
import { withLoginLock } from '../../utils/loginLock'

/*
One authenticated session is created per parallel worker (not one shared
global session) and cached to disk for the worker's lifetime. This keeps
login cost amortized across every authenticated test that worker runs,
while guaranteeing each worker's cart lives in its own server-side session
— no two authenticated tests can ever race on the same cart, regardless of
how many authenticated spec files exist or how many times a test repeats.

The login itself is additionally serialized across workers via a file lock
(utils/loginLock.ts): this app doesn't reliably handle several concurrent
logins of the same shared test account (observed intermittent timeouts
under parallel workers). Serializing only the login keeps startup safe
without giving up per-worker cart isolation afterward.
*/

export const test = base.extend<object, { workerStorageState: string }>({
  storageState: async ({ workerStorageState }, use) => {
    await use(workerStorageState)
  },

  workerStorageState: [
    async ({ browser }, use, workerInfo): Promise<void> => {
      const stateFile = authStateFileForWorker(workerInfo.workerIndex)

      if (fs.existsSync(stateFile)) {
        await use(stateFile)
        return
      }

      const username = process.env.TEST_USER
      const password = process.env.TEST_PASSWORD

      if (!username || !password) {
        throw new Error(
          'TEST_USER and TEST_PASSWORD must be configured in the selected environment file.'
        )
      }

      await withLoginLock(async () => {
        const page = await browser.newPage({ baseURL: environmentConfig.baseURL })
        const accountPage = new MyAccountPage(page)
        await accountPage.goto()
        await accountPage.login(username, password)
        await expectAuthenticatedAccount(accountPage)

        fs.mkdirSync(path.dirname(stateFile), { recursive: true })
        await page.context().storageState({ path: stateFile })
        await page.close()
      })

      await use(stateFile)
    },
    { scope: 'worker' }
  ]
})

export { expect } from '@playwright/test'
