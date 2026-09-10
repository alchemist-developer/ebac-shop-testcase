import { expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

export interface CheckoutExpectation {
  orderButtonText: string;
  paymentMethods: readonly string[];
}

export async function expectCheckoutPage(
  checkoutPage: CheckoutPage,
  expected: CheckoutExpectation
): Promise<void> {
  await expect(checkoutPage.page).toHaveURL(/\/checkout\//);
  await expect(checkoutPage.firstNameInput).toBeVisible();
  await expect(checkoutPage.emailInput).toBeVisible();
  await expect(checkoutPage.paymentSection).toBeVisible();
  await expect(checkoutPage.placeOrderButton).toContainText(expected.orderButtonText);

  for (const paymentMethod of expected.paymentMethods) {
    await expect(
      checkoutPage.page.locator(`input[name="payment_method"][value="${paymentMethod}"]`)
    ).toBeVisible();
  }
}
