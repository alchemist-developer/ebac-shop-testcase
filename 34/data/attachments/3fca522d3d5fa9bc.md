# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/purchase-flow.spec.ts >> Purchase flow >> [E2E-PURCHASE-001] Comprar produto autenticado até o checkout
- Location: tests/e2e/purchase-flow.spec.ts:43:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.cart_item').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.cart_item').first() with timeout 5000ms
  - waiting for locator('.cart_item').first()

```

```yaml
- heading "502 Bad Gateway" [level=1]
- separator
- text: nginx/1.25.3
```

# Test source

```ts
  1  | import { expect } from '@playwright/test'
  2  | import { StoreProduct } from '../api/StoreApi'
  3  | import { CartPage } from '../pages/CartPage'
  4  | import { CurrencyExpectation } from '../test-data/market'
  5  | import { parseMoneyToCents } from '../utils/discountCalculator'
  6  | 
  7  | export async function expectCartPage(cartPage: CartPage): Promise<void> {
  8  |   await expect(cartPage.page).toHaveURL(/\/carrinho\//)
> 9  |   await expect(cartPage.cartItem).toBeVisible()
     |                                   ^ Error: expect(locator).toBeVisible() failed
  10 | }
  11 | 
  12 | export async function expectCartItemMatchesProduct(
  13 |   cartPage: CartPage,
  14 |   product: StoreProduct,
  15 |   currency: CurrencyExpectation,
  16 |   quantity = 1
  17 | ): Promise<void> {
  18 |   await expect(cartPage.productName).toContainText(product.name)
  19 | 
  20 |   const unitPriceCents = parseMoneyToCents(
  21 |     await cartPage.productPrice.innerText(),
  22 |     currency.decimalSeparator,
  23 |     currency.thousandsSeparator
  24 |   )
  25 |   expect(unitPriceCents).toBe(Number(product.prices.price))
  26 | 
  27 |   // expect.poll (não uma leitura única): a atualização de quantidade é assíncrona
  28 |   // (AJAX), então o subtotal pode levar um instante para refletir o novo valor.
  29 |   await expect
  30 |     .poll(async () =>
  31 |       parseMoneyToCents(await cartPage.productSubtotal.innerText(), currency.decimalSeparator, currency.thousandsSeparator)
  32 |     )
  33 |     .toBe(Number(product.prices.price) * quantity)
  34 | 
  35 |   // Não usa .product-quantity (texto renderizado): em itens sold_individually o
  36 |   // valor aparece como texto solto antes do input hidden, mas em itens com
  37 |   // quantidade editável ele só existe como value do <input type="number">
  38 |   // dentro de um stepper (-, input, +), sem texto correspondente no DOM.
  39 |   // O input em si (quantityInput) existe e reflete o valor real nos dois casos.
  40 |   await expect(cartPage.quantityInput).toHaveValue(String(quantity))
  41 | }
  42 | 
  43 | export async function expectQuantityControl(cartPage: CartPage, product: StoreProduct): Promise<void> {
  44 |   await expect(cartPage.quantityInput).toHaveValue('1')
  45 | 
  46 |   if (product.sold_individually) {
  47 |     await expect(cartPage.quantityInput).toHaveAttribute('type', 'hidden')
  48 |     await expect(cartPage.quantityInput).not.toBeVisible()
  49 |   } else {
  50 |     await expect(cartPage.quantityInput).toBeVisible()
  51 |   }
  52 | }
  53 | 
  54 | export async function expectCheckoutNavigationAvailable(cartPage: CartPage): Promise<void> {
  55 |   await expect(cartPage.checkoutButton).toBeVisible()
  56 | }
  57 | 
```