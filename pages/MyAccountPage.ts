import { Locator, Page } from '@playwright/test'

export class MyAccountPage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly rememberMeCheckbox: Locator
  readonly loginButton: Locator
  readonly authenticatedMarker: Locator
  readonly loginErrorMessage: Locator

  constructor(readonly page: Page) {
    this.usernameInput = page.locator('#username')
    this.passwordInput = page.locator('#password')
    this.rememberMeCheckbox = page.locator('#rememberme')
    this.loginButton = page.locator('input[name="login"]')
    this.authenticatedMarker = page.getByText(/Sair|Logout/).first()
    this.loginErrorMessage = page.locator('.woocommerce-error')
  }

  async goto(): Promise<void> {
    await this.page.goto('/minha-conta/')
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.rememberMeCheckbox.check()
    await this.loginButton.click()
  }
}
