import { Locator, Page } from '@playwright/test'

export class ProductPage {
  readonly summary: Locator
  readonly cartForm: Locator
  readonly addToCartButton: Locator
  readonly quantityInput: Locator

  constructor(readonly page: Page) {
    this.summary = page.locator('.summary, .entry-summary').first()
    this.cartForm = page.locator('form.cart')
    this.addToCartButton = page.locator('.single_add_to_cart_button')
    this.quantityInput = this.cartForm.locator('input[name="quantity"]')
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path)
  }

  /**
   * O <select> nativo do WooCommerce existe no DOM mas fica oculto (classe
   * "hide"): o plugin de swatches desta loja substitui a interação por uma
   * lista de <li data-value="..."> sincronizada via JS. Clicar no swatch,
   * não no select, é o caminho que um usuário real percorre.
   */
  async selectVariationAttribute(attributeName: string, value: string): Promise<void> {
    const attributeSlug = `attribute_${attributeName.toLowerCase()}`
    await this.cartForm.locator(`[data-attribute_name="${attributeSlug}"] [data-value="${value}"]`).click()
  }

  async setQuantity(value: string): Promise<void> {
    await this.quantityInput.fill(value)
  }

  async addProductToCart(): Promise<void> {
    await this.addToCartButton.click()
  }
}
