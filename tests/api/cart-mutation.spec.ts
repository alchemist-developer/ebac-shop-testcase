import { test } from '@playwright/test'
import { findPurchasableSimpleProduct, findPurchasableVariation } from '../../api/ProductCatalog'
import { StoreApi } from '../../api/StoreApi'
import { expectItemAddedWithQuantity, expectItemQuantityUpdated, expectSoldIndividuallyRejected } from '../../assertions/storeApiAssertions'

/*
Feature: Alterar quantidade de um item no carrinho via Store API

  Scenario: [API-WC-CART-UPDATE-ITEM-001] Atualizar quantidade de uma variação no carrinho
    Given um produto variável comprável com uma variação disponível
    When adiciono a variação com quantidade 1
    And atualizo a quantidade para 3
    Then a resposta reflete quantidade 3 e o subtotal recalculado

  Scenario: [API-WC-CART-SOLD-INDIVIDUALLY-001] Rejeitar atualização para quantidade > 1 em produto sold_individually
    Given um produto do tipo simples (sold_individually) já no carrinho com quantidade 1
    When tento atualizar a quantidade para 2
    Then a API rejeita com o código de erro esperado
*/

test('[API-WC-CART-UPDATE-ITEM-001] Atualizar quantidade de uma variação no carrinho', async ({ request }) => {
  const storeApi = new StoreApi(request)
  const { product, variation } = await findPurchasableVariation(request)

  const addResponse = await storeApi.addItem(product.id, 1, variation.attributes)
  const cartAfterAdd = await expectItemAddedWithQuantity(addResponse, variation.id, 1)
  const item = cartAfterAdd.items.find((candidate) => candidate.id === variation.id)

  if (!item) {
    throw new Error('Item was confirmed present by the assertion above but is missing here — cart response inconsistency')
  }

  const updateResponse = await storeApi.updateItemQuantity(item.key, 3)
  await expectItemQuantityUpdated(updateResponse, item.key, 3, Number(item.prices.price))
})

test('[API-WC-CART-SOLD-INDIVIDUALLY-001] Rejeitar atualização para quantidade > 1 em produto sold_individually', async ({ request }) => {
  const storeApi = new StoreApi(request)
  const product = await findPurchasableSimpleProduct(request)

  const addResponse = await storeApi.addItem(product.id, 1)
  const cart = await expectItemAddedWithQuantity(addResponse, product.id, 1)
  const item = cart.items.find((candidate) => candidate.id === product.id)

  if (!item) {
    throw new Error('Item was confirmed present by the assertion above but is missing here — cart response inconsistency')
  }

  const updateResponse = await storeApi.updateItemQuantity(item.key, 2)
  await expectSoldIndividuallyRejected(updateResponse)
})
