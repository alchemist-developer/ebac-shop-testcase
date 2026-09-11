import { expect } from '@playwright/test'
import { MyAccountPage } from '../pages/MyAccountPage'

export async function expectAuthenticatedAccount(accountPage: MyAccountPage): Promise<void> {
  const outcome = await Promise.race([
    accountPage.authenticatedMarker.waitFor({ state: 'visible' }).then(() => 'authenticated' as const),
    accountPage.errorMessage.waitFor({ state: 'visible' }).then(() => 'rejected' as const)
  ])

  if (outcome === 'rejected') {
    const message = await accountPage.errorMessage.innerText()
    throw new Error(`Authentication failed: ${message.trim()}`)
  }

  await expect(accountPage.page).toHaveURL(/\/minha-conta\//)
  await expect(accountPage.authenticatedMarker).toBeVisible()
}
