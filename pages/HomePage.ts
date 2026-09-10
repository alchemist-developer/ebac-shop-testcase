import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly simpleProductDetails: Locator;
  readonly simpleAddToCartLink: Locator;

  constructor(page: Page, productId: string) {
    this.page = page;
    this.simpleProductDetails = page.getByRole('link', { name: 'Leia mais' }).first();
    this.simpleAddToCartLink = page.locator(`a.add_to_cart_button[href*="add-to-cart=${productId}"]`).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async selectProduct(): Promise<void> {
    const productHref = await this.simpleProductDetails.getAttribute('href');
    if (!productHref) {
      throw new Error('Product details link was not found on the homepage');
    }
    await this.page.goto(productHref);
  }

  async getObservedAddToCartHref(): Promise<string> {
    const addToCartHref = await this.simpleAddToCartLink.getAttribute('href');
    if (!addToCartHref?.includes('add-to-cart=10988')) {
      throw new Error('Observed add-to-cart href was not found on the homepage');
    }
    return addToCartHref;
  }
}
