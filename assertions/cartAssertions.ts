import { expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

export interface CartItemExpectation {
  name: string;
  unitPrice: string;
  subtotal: string;
  quantity: string;
}

export async function expectCartPage(cartPage: CartPage): Promise<void> {
  await expect(cartPage.page).toHaveURL(/\/carrinho\//);
  await expect(cartPage.cartItem).toBeVisible();
}

export async function expectCartItem(
  cartPage: CartPage,
  expected: CartItemExpectation
): Promise<void> {
  await expect(cartPage.productName).toContainText(expected.name);
  await expect(cartPage.productPrice).toContainText(expected.unitPrice);
  await expect(cartPage.productSubtotal).toContainText(expected.subtotal);
  await expect(cartPage.productQuantity).toContainText(expected.quantity);
}

export async function expectQuantityControlToBeReadOnly(
  cartPage: CartPage,
  expectedQuantity: string
): Promise<void> {
  await expect(cartPage.quantityInput).toHaveAttribute('type', 'hidden');
  await expect(cartPage.quantityInput).toHaveValue(expectedQuantity);
  await expect(cartPage.quantityInput).not.toBeVisible();
}

export async function expectCheckoutNavigationAvailable(cartPage: CartPage): Promise<void> {
  await expect(cartPage.checkoutButton).toBeVisible();
}
