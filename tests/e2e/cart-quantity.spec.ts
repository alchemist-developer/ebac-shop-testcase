import { test } from '@playwright/test'
import { findPurchasableVariation } from '../../api/ProductCatalog'
import { expectCartItemMatchesProduct, expectCartPage, expectQuantityControl } from '../../assertions/cartAssertions'
import { CartPage } from '../../pages/CartPage'
import { ProductPage } from '../../pages/ProductPage'
import { cartQuantityFlow } from '../../test-data/cartQuantityFlow'
import { deriveCurrencyFromProduct } from '../../utils/currency'
import { pathFromUrl } from '../../utils/url'

/*
Feature: Alterar a quantidade do item no carrinho (passo 5 do fluxo obrigatório)

  A restrição de quantidade (input oculto, sempre 1) só existe em produtos
  sold_individually (6 dos 99 produtos do catálogo). Nos outros 93 (todos
  variáveis), o input é um <input type="number"> funcional. Ver "Limitações
  conhecidas" no README para o histórico dessa investigação.

  Scenario: [E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI
    Given um produto sem a restrição sold_individually foi adicionado ao carrinho
    When altero o valor do campo de quantidade e confirmo a atualização
    Then a alteração deve ser aceita e refletida no subtotal
*/

test('[E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI', async ({ page, request }) => {
  const productPage = new ProductPage(page)
  const cartPage = new CartPage(page)
  const { product, variation } = await findPurchasableVariation(request)
  const currency = deriveCurrencyFromProduct(product)

  await test.step('Selecionar uma variação e adicionar ao carrinho', async () => {
    await productPage.goto(pathFromUrl(product.permalink))

    for (const attribute of variation.attributes) {
      await productPage.selectVariationAttribute(attribute.name, attribute.value)
    }

    await productPage.addProductToCart()
  })

  await test.step('Confirmar que o controle de quantidade está disponível', async () => {
    await cartPage.goto()
    await expectCartPage(cartPage)
    await expectQuantityControl(cartPage, product)
  })

  await test.step('Alterar a quantidade pela UI', async () => {
    await cartPage.updateQuantity(String(cartQuantityFlow.targetQuantity))
  })

  await test.step('Validar quantidade e subtotal recalculados no carrinho', async () => {
    await expectCartItemMatchesProduct(cartPage, product, currency, cartQuantityFlow.targetQuantity)
  })
})
