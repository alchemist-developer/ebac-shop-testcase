import { Locator, Page } from '@playwright/test'

export class MyAccountPage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly rememberMeCheckbox: Locator
  readonly loginButton: Locator
  readonly registerEmailInput: Locator
  readonly registerPasswordInput: Locator
  readonly registerButton: Locator
  readonly authenticatedMarker: Locator
  readonly errorMessage: Locator

  constructor(readonly page: Page) {
    this.usernameInput = page.locator('#username')
    this.passwordInput = page.locator('#password')
    this.rememberMeCheckbox = page.locator('#rememberme')
    this.loginButton = page.locator('input[name="login"]')
    this.registerEmailInput = page.locator('#reg_email')
    this.registerPasswordInput = page.locator('#reg_password')
    this.registerButton = page.locator('input[name="register"]')
    this.authenticatedMarker = page.getByText(/Sair|Logout/).first()
    this.errorMessage = page.locator('.woocommerce-error')
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

  async register(email: string, password: string): Promise<void> {
    await this.registerEmailInput.fill(email)
    await this.registerPasswordInput.fill(password)
    await this.registerButton.click()
  }
}
