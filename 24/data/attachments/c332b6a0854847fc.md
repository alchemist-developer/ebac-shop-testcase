# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/cart-mutation.spec.ts >> [API-WC-CART-UPDATE-ITEM-001] Atualizar quantidade de uma variação no carrinho
- Location: tests/api/cart-mutation.spec.ts:21:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

# Test source

```ts
  1  | import { APIResponse, expect } from '@playwright/test'
  2  | import { StoreCart, StoreProduct } from '../api/StoreApi'
  3  | import { CurrencyExpectation } from '../test-data/market'
  4  | 
  5  | function expectJsonOk(response: APIResponse): void {
  6  |   expect(response.status()).toBe(200)
  7  |   expect(response.headers()['content-type']).toContain('application/json')
  8  | }
  9  | 
  10 | export async function expectProductsResponse(
  11 |   response: APIResponse,
  12 |   currency: CurrencyExpectation
  13 | ): Promise<StoreProduct[]> {
  14 |   expectJsonOk(response)
  15 |   const products = (await response.json()) as StoreProduct[]
  16 | 
  17 |   expect(products.length).toBeGreaterThan(0)
  18 | 
  19 |   for (const product of products) {
  20 |     expect(product.id).toEqual(expect.any(Number))
  21 |     expect(product.name).toEqual(expect.any(String))
  22 |     expect(product.type).toEqual(expect.any(String))
  23 |     expect(product.permalink).toMatch(/^https?:\/\//)
  24 |     expect(product.prices.currency_code).toBe(currency.code)
  25 |     expect(product.prices.currency_symbol).toBe(currency.symbol)
  26 |     expect(product.is_purchasable).toEqual(expect.any(Boolean))
  27 |     expect(product.is_in_stock).toEqual(expect.any(Boolean))
  28 |     expect(product.add_to_cart.text).toEqual(expect.any(String))
  29 |     expect(product.add_to_cart.url).toMatch(/^https?:\/\//)
  30 |   }
  31 | 
  32 |   return products
  33 | }
  34 | 
  35 | export async function expectEmptyCartResponse(
  36 |   response: APIResponse,
  37 |   currency: CurrencyExpectation
  38 | ): Promise<StoreCart> {
  39 |   expectJsonOk(response)
  40 |   const cart = (await response.json()) as StoreCart
  41 | 
  42 |   expect(cart.items).toEqual([])
  43 |   expect(Number(cart.totals.total_items)).toBe(0)
  44 |   expect(Number(cart.totals.total_price)).toBe(0)
  45 |   expect(cart.totals.currency_code).toBe(currency.code)
  46 |   expect(cart.totals.currency_symbol).toBe(currency.symbol)
  47 | 
  48 |   return cart
  49 | }
  50 | 
  51 | export async function expectItemAddedWithQuantity(
  52 |   response: APIResponse,
  53 |   itemId: number,
  54 |   expectedQuantity: number
  55 | ): Promise<StoreCart> {
> 56 |   expect(response.status()).toBe(201)
     |                             ^ Error: expect(received).toBe(expected) // Object.is equality
  57 |   const cart = (await response.json()) as StoreCart
  58 |   const item = cart.items.find((candidate) => candidate.id === itemId)
  59 | 
  60 |   expect(item, `Item ${itemId} was not found in the cart response`).toBeDefined()
  61 |   expect(item?.quantity).toBe(expectedQuantity)
  62 | 
  63 |   return cart
  64 | }
  65 | 
  66 | export async function expectItemQuantityUpdated(
  67 |   response: APIResponse,
  68 |   key: string,
  69 |   expectedQuantity: number,
  70 |   expectedUnitPriceCents: number
  71 | ): Promise<void> {
  72 |   expect(response.status()).toBe(200)
  73 |   const cart = (await response.json()) as StoreCart
  74 |   const item = cart.items.find((candidate) => candidate.key === key)
  75 | 
  76 |   expect(item, `Item with key ${key} was not found in the cart response`).toBeDefined()
  77 |   expect(item?.quantity).toBe(expectedQuantity)
  78 |   expect(Number(item?.totals.line_total)).toBe(expectedUnitPriceCents * expectedQuantity)
  79 | }
  80 | 
  81 | export async function expectSoldIndividuallyRejected(response: APIResponse): Promise<void> {
  82 |   expect(response.status()).toBe(400)
  83 |   const body = (await response.json()) as { code: string }
  84 | 
  85 |   expect(body.code).toBe('woocommerce_rest_cart_product_sold_individually')
  86 | }
  87 | 
```