import { test as base } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { authStateFileForWorker, pooledUserFileForWorker } from '../../config/auth'
import { environmentConfig } from '../../config/environment'
import { expectAuthenticatedAccount } from '../../assertions/accountAssertions'
import { MyAccountPage } from '../../pages/MyAccountPage'
import { generateTestUser } from '../../utils/testUser'
import { readPooledTestUser, savePooledTestUser } from '../../utils/testUserPool'

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

      const poolFile = pooledUserFileForWorker(workerInfo.workerIndex)
      const pooledUser = readPooledTestUser(poolFile)
      // precisa resolver antes do goto: o import dinâmico do faker atrasa o event loop
      // o suficiente pra atropelar o refresh de fragmentos que a página dispara ao carregar
      const newUser = pooledUser ?? (await generateTestUser(workerInfo.workerIndex))

      const page = await browser.newPage({ baseURL: environmentConfig.baseURL })
      const accountPage = new MyAccountPage(page)
      await accountPage.goto()

      if (pooledUser) {
        await accountPage.login(pooledUser.email, pooledUser.password)
      } else {
        await accountPage.register(newUser.email, newUser.password)
      }

      await expectAuthenticatedAccount(accountPage)

      if (!pooledUser) {
        savePooledTestUser(poolFile, newUser)
      }

      fs.mkdirSync(path.dirname(stateFile), { recursive: true })
      await page.context().storageState({ path: stateFile })
      await page.close()

      await use(stateFile)
    },
    { scope: 'worker' }
  ]
})

export { expect } from '@playwright/test'
