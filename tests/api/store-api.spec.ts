import { expect, test } from "@playwright/test"
import { StoreApi, StoreCart, StoreProduct } from "../../api/StoreApi"
import { getCurrencyForBaseUrl } from "../../test-data/market"

/*
Feature: Consultar dados públicos da Store API
*/

/*
  Scenario: [API-WC-STORE-PRODUCTS-001] Consultar produtos disponíveis
    Given que a Store API está acessível
    When eu consulto a lista paginada de produtos
    Then a resposta deve ser HTTP 200 em JSON
    And cada produto deve respeitar o contrato mínimo observado
*/

test.describe("Store API", () => {
  test("[API-WC-STORE-PRODUCTS-001] Consultar produtos disponíveis", async ({
    request,
  }) => {
    const storeApi = new StoreApi(request)
    const currency = getCurrencyForBaseUrl(process.env.BASE_URL)
    const response = await storeApi.getProducts()

    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toContain("application/json")

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
  })

  /*
    Scenario: [API-WC-STORE-CART-001] Consultar um carrinho novo
    Given que inicio uma nova sessão de API
    When eu consulto o carrinho
    Then a resposta deve ser HTTP 200 em JSON
    And o carrinho deve estar sem itens e com totais zerados
    */

  test("[API-WC-STORE-CART-001] Consultar um carrinho novo", async ({
    request,
  }) => {
    const storeApi = new StoreApi(request)
    const currency = getCurrencyForBaseUrl(process.env.BASE_URL)
    const response = await storeApi.getCart()

    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toContain("application/json")

    const cart = (await response.json()) as StoreCart
    expect(cart.items).toEqual([])
    expect(Number(cart.totals.total_items)).toBe(0)
    expect(Number(cart.totals.total_price)).toBe(0)
    expect(cart.totals.currency_code).toBe(currency.code)
    expect(cart.totals.currency_symbol).toBe(currency.symbol)
  })
})
