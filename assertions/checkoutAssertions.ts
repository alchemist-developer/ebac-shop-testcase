import { expect } from '@playwright/test'
import { CheckoutPage } from '../pages/CheckoutPage'

export interface CheckoutExpectation {
  orderButtonText: string
}

export async function expectCheckoutPage(
  checkoutPage: CheckoutPage,
  expected: CheckoutExpectation
): Promise<void> {
  await expect(checkoutPage.page).toHaveURL(/\/checkout\//)
  await expect(checkoutPage.firstNameInput).toBeVisible()
  await expect(checkoutPage.emailInput).toBeVisible()
  await expect(checkoutPage.paymentSection).toBeVisible()
  await expect(checkoutPage.placeOrderButton).toContainText(expected.orderButtonText)

  const paymentMethodCount = await checkoutPage.paymentMethods.count()
  expect(paymentMethodCount).toBeGreaterThan(0)

  for (let index = 0; index < paymentMethodCount; index += 1) {
    await expect(checkoutPage.paymentMethods.nth(index)).toBeAttached()
  }
}
