import { test } from "@playwright/test"
import { StoreApi } from "../../api/StoreApi"
import { expectEmptyCartResponse, expectProductsResponse } from "../../assertions/storeApiAssertions"
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

    await expectProductsResponse(response, currency)
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

    await expectEmptyCartResponse(response, currency)
  })
})
