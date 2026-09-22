# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/cart-quantity.spec.ts >> [E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI
- Location: tests/e2e/cart-quantity.spec.ts:24:5

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
- banner:
  - 'button " Cart : R$0,00 0" [expanded]'
  - link "0":
    - /url: http://lojaebac.ebaconline.art.br/lista-de-desejos/
  - list:
    - listitem:
      - text: 
      - link "Sign up":
        - /url: http://lojaebac.ebaconline.art.br/minha-conta/
    - listitem:
      - link "Login":
        - /url: http://lojaebac.ebaconline.art.br/minha-conta/
  - link "EBAC – Shop":
    - /url: http://lojaebac.ebaconline.art.br/
    - img "EBAC – Shop"
  - combobox:
    - option "Selecione uma categoria" [selected]
    - option "Clothing"
    - option "Men"
    - option "Bottoms"
    - option "Pants|Clothing"
    - option "Promotions"
    - option "Pants|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Erin Recommends|Clothing"
    - option "New Luma Yoga Collection|Clothing"
    - option "Collections"
    - option "Erin Recommends|Clothing"
    - option "Performance Fabrics|Clothing"
    - option "Shorts"
    - option "Shorts|Clothing"
    - option "Collections"
    - option "Erin Recommends|Clothing"
    - option "New Luma Yoga Collection|Clothing"
    - option "Performance Fabrics|Clothing"
    - option "Promotions"
    - option "Men Sale|Clothing"
    - option "Collections"
    - option "Erin Recommends|Clothing"
    - option "Tops"
    - option "Hoodies & Sweatshirts"
    - option "Hoodies & Sweatshirts|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Jackets"
    - option "Jackets|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Tanks"
    - option "Tanks|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Tees"
    - option "Tees|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Women"
    - option "Tops"
    - option "Bras & Tanks"
    - option "Bras & Tanks|Clothing"
    - option "Collections"
    - option "New Luma Yoga Collection|Clothing"
    - option "Collections"
    - option "Performance Fabrics|Clothing"
    - option "Promotions"
    - option "Women Sale|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Hoodies & Sweatshirts"
    - option "Hoodies & Sweatshirts|Clothing"
    - option "Collections"
    - option "Eco Friendly|Clothing"
    - option "Erin Recommends|Clothing"
    - option "New Luma Yoga Collection|Clothing"
    - option "Collections"
    - option "Erin Recommends|Clothing"
    - option "Performance Fabrics|Clothing"
    - option "Promotions"
    - option "Women Sale|Clothing"
    - option "Collections"
    - option "Performance Fabrics|Clothing"
    - option "Jackets"
    - option "Jackets|Clothing"
    - option "Collections"
    - option "New Luma Yoga Collection|Clothing"
    - option "Collections"
    - option "Erin Recommends|Clothing"
    - option "Performance Fabrics|Clothing"
    - option "Promotions"
    - option "Women Sale|Clothing"
    - option "Uncategorized"
  - paragraph: Selecione uma categoria
  - textbox "Enter your search ..."
  - button "Search "
  - heading " All Categories" [level=3]
  - navigation:
    - list:
      - listitem:
        - link "Home":
          - /url: http://lojaebac.ebaconline.art.br/home/
      - listitem:
        - link "Comprar":
          - /url: http://lojaebac.ebaconline.art.br/produtos/
      - listitem:
        - link "Blog":
          - /url: "#"
      - listitem:
        - link "Categorias":
          - /url: "#"
      - listitem:
        - link "Mais vendidos":
          - /url: "#"
- list:
  - listitem:
    - link "Home":
      - /url: http://lojaebac.ebaconline.art.br
    - text: /
  - listitem: Carrinho
- main:
  - heading "Carrinho" [level=1]
  - paragraph:  Seu carrinho está vazio.
  - paragraph:
    - link " Retornar para a loja":
      - /url: http://lojaebac.ebaconline.art.br/produtos/
- contentinfo
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