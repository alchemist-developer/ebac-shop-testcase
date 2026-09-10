import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productSubtotal: Locator;
  readonly productQuantity: Locator;
  readonly quantityInput: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item').first();
    this.productName = this.cartItem.locator('.product-name');
    this.productPrice = this.cartItem.locator('.product-price');
    this.productSubtotal = this.cartItem.locator('.product-subtotal');
    this.productQuantity = this.cartItem.locator('.product-quantity');
    this.quantityInput = this.cartItem.locator('input[name$="[qty]"]');
    this.checkoutButton = page.getByRole('link', { name: 'Concluir Compra' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/carrinho/');
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
