import { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly allCartItems: Locator
  readonly cartItem: Locator
  readonly productName: Locator
  readonly productPrice: Locator
  readonly productSubtotal: Locator
  readonly productQuantity: Locator
  readonly quantityInput: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.allCartItems = page.locator('.cart_item')
    this.cartItem = this.allCartItems.first()
    this.productName = this.cartItem.locator('.product-name')
    this.productPrice = this.cartItem.locator('.product-price')
    this.productSubtotal = this.cartItem.locator('.product-subtotal')
    this.productQuantity = this.cartItem.locator('.product-quantity')
    this.quantityInput = this.cartItem.locator('input[name$="[qty]"]')
    this.checkoutButton = page.getByRole('link', { name: 'Concluir Compra' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/carrinho/')
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click()
  }

  async emptyCart(): Promise<void> {
    await this.goto()

    while ((await this.allCartItems.count()) > 0) {
      const removeHref = await this.allCartItems.first().locator('.product-remove a.remove').getAttribute('href')

      if (!removeHref) {
        throw new Error('Cart item is missing a remove link; cannot guarantee an empty cart for the test')
      }

      await this.page.goto(removeHref)
    }
  }
}
