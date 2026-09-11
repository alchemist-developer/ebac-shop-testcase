import { test } from '@playwright/test'
import { StoreApi } from '../../api/StoreApi'
import { expectResponseMatchesDeclaredSchema } from '../../assertions/contractAssertions'

/*
Feature: Contrato da Store API

  Scenario: [API-WC-STORE-PRODUCTS-CONTRACT-001] Resposta real respeita o schema declarado pela própria API
    Given a Store API declara seu schema via OPTIONS /wc/store/products
    When consulto a lista real de produtos
    Then os campos dos quais este projeto depende existem na resposta com o tipo declarado
*/

test('[API-WC-STORE-PRODUCTS-CONTRACT-001] Resposta real respeita o schema declarado pela própria API', async ({ request }) => {
  const storeApi = new StoreApi(request)

  const [productsResponse, schemaResponse] = await Promise.all([storeApi.getProducts(1), storeApi.getProductsSchema()])

  await expectResponseMatchesDeclaredSchema(productsResponse, schemaResponse)
})
