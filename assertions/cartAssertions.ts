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

  // expect.poll (não uma leitura única): a atualização de quantidade é assíncrona
  // (AJAX), então o subtotal pode levar um instante para refletir o novo valor.
  await expect
    .poll(async () =>
      parseMoneyToCents(await cartPage.productSubtotal.innerText(), currency.decimalSeparator, currency.thousandsSeparator)
    )
    .toBe(Number(product.prices.price) * quantity)

  // Não usa .product-quantity (texto renderizado): em itens sold_individually o
  // valor aparece como texto solto antes do input hidden, mas em itens com
  // quantidade editável ele só existe como value do <input type="number">
  // dentro de um stepper (-, input, +), sem texto correspondente no DOM.
  // O input em si (quantityInput) existe e reflete o valor real nos dois casos.
  await expect(cartPage.quantityInput).toHaveValue(String(quantity))
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
