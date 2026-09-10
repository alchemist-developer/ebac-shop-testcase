import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly summary: Locator;
  readonly cartForm: Locator;
  readonly addToCartButton: Locator;

  constructor(readonly page: Page) {
    this.summary = page.locator('.summary, .entry-summary').first();
    this.cartForm = page.locator('form.cart');
    this.addToCartButton = page.locator('.single_add_to_cart_button');
  }

  async addProductUsingObservedHref(href: string): Promise<void> {
    await this.page.goto(href);
  }
}
