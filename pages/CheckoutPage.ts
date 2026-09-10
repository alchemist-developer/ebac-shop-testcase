import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly emailInput: Locator;
  readonly paymentSection: Locator;
  readonly placeOrderButton: Locator;
  readonly paymentMethods: Locator;

  constructor(readonly page: Page) {
    this.firstNameInput = page.locator('#billing_first_name');
    this.emailInput = page.locator('#billing_email');
    this.paymentSection = page.locator('#payment');
    this.placeOrderButton = page.locator('#place_order');
    this.paymentMethods = page.locator('input[name="payment_method"]');
  }
}
