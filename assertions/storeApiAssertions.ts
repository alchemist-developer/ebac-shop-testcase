import { APIResponse, expect } from '@playwright/test'
import { StoreCart, StoreProduct } from '../api/StoreApi'
import { CurrencyExpectation } from '../test-data/market'

function expectJsonOk(response: APIResponse): void {
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
}

export async function expectProductsResponse(
  response: APIResponse,
  currency: CurrencyExpectation
): Promise<StoreProduct[]> {
  expectJsonOk(response)
  const products = (await response.json()) as StoreProduct[]

  expect(products.length).toBeGreaterThan(0)

  for (const product of products) {
    expect(product.id).toEqual(expect.any(Number))
    expect(product.name).toEqual(expect.any(String))
    expect(product.type).toEqual(expect.any(String))
    expect(product.permalink).toMatch(/^https?:\/\//)
    expect(product.prices.currency_code).toBe(currency.code)
    expect(product.prices.currency_symbol).toBe(currency.symbol)
    expect(product.is_purchasable).toEqual(expect.any(Boolean))
    expect(product.is_in_stock).toEqual(expect.any(Boolean))
    expect(product.add_to_cart.text).toEqual(expect.any(String))
    expect(product.add_to_cart.url).toMatch(/^https?:\/\//)
  }

  return products
}

export async function expectEmptyCartResponse(
  response: APIResponse,
  currency: CurrencyExpectation
): Promise<StoreCart> {
  expectJsonOk(response)
  const cart = (await response.json()) as StoreCart

  expect(cart.items).toEqual([])
  expect(Number(cart.totals.total_items)).toBe(0)
  expect(Number(cart.totals.total_price)).toBe(0)
  expect(cart.totals.currency_code).toBe(currency.code)
  expect(cart.totals.currency_symbol).toBe(currency.symbol)

  return cart
}
