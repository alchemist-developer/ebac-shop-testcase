import { expect } from '@playwright/test'
import { StoreProduct } from '../api/StoreApi'
import { CartPage } from '../pages/CartPage'
import { CurrencyExpectation } from '../test-data/market'
import { parseMoneyToCents } from '../utils/discountCalculator'

export async function expectCartPage(cartPage: CartPage): Promise<void> {
  await expect(cartPage.page).toHaveURL(/\/carrinho\//)
  await expect(cartPage.cartItem).toBeVisible()
}

export async function expectCartItemMatchesProduct(
  cartPage: CartPage,
  product: StoreProduct,
  currency: CurrencyExpectation,
  quantity = 1
): Promise<void> {
  await expect(cartPage.productName).toContainText(product.name)

  const unitPriceCents = parseMoneyToCents(
    await cartPage.productPrice.innerText(),
    currency.decimalSeparator,
    currency.thousandsSeparator
  )
  expect(unitPriceCents).toBe(Number(product.prices.price))

  const subtotalCents = parseMoneyToCents(
    await cartPage.productSubtotal.innerText(),
    currency.decimalSeparator,
    currency.thousandsSeparator
  )
  expect(subtotalCents).toBe(Number(product.prices.price) * quantity)

  await expect(cartPage.productQuantity).toContainText(String(quantity))
}

export async function expectQuantityControl(cartPage: CartPage, product: StoreProduct): Promise<void> {
  await expect(cartPage.quantityInput).toHaveValue('1')

  if (product.sold_individually) {
    await expect(cartPage.quantityInput).toHaveAttribute('type', 'hidden')
    await expect(cartPage.quantityInput).not.toBeVisible()
  } else {
    await expect(cartPage.quantityInput).toBeVisible()
  }
}

export async function expectCheckoutNavigationAvailable(cartPage: CartPage): Promise<void> {
  await expect(cartPage.checkoutButton).toBeVisible()
}
