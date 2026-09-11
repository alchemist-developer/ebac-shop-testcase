import { findNonPurchasableProduct, findPurchasableSimpleProduct } from '../../api/ProductCatalog'
import { StoreProduct } from '../../api/StoreApi'
import { expectAuthenticatedAccount } from '../../assertions/accountAssertions'
import {
  expectCartItemMatchesProduct,
  expectCartPage,
  expectCheckoutNavigationAvailable,
  expectQuantityControl
} from '../../assertions/cartAssertions'
import { expectCheckoutPage } from '../../assertions/checkoutAssertions'
import { expectProductDetailsPage, expectProductPurchaseControlUnavailable } from '../../assertions/productAssertions'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'
import { MyAccountPage } from '../../pages/MyAccountPage'
import { ProductPage } from '../../pages/ProductPage'
import { test } from '../support/authFixtures'
import { purchaseFlow } from '../../test-data/purchaseFlow'
import { deriveCurrencyFromProduct } from '../../utils/currency'
import { pathFromUrl } from '../../utils/url'

/*
Feature: Validar fluxo de compra da EBAC Shop

  O produto usado em cada cenário é obtido dinamicamente via Store API
  (não fixado em test-data), para não depender do catálogo permanecer
  estático entre execuções.

  Scenario: [E2E-PURCHASE-001] Comprar produto autenticado até o checkout
    Given que existe uma sessão autenticada persistida
    And o carrinho está vazio
    And a Store API retorna um produto comprável do tipo simples
    When eu clico em COMPRAR
    And acesso o carrinho e avanço para o checkout
    Then o preço e a quantidade exibidos no carrinho devem corresponder ao preço retornado pela API
    And os meios de pagamento disponíveis devem ser apresentados

  Scenario: [E2E-PURCHASE-002] Validar produto sem controle de compra
    Given que a Store API retorna um produto não comprável
    Then o controle de compra não deve existir na página do produto
*/

test.describe('Purchase flow', () => {
  test('[E2E-PURCHASE-001] Comprar produto autenticado até o checkout', async ({ page, request }) => {
    const accountPage = new MyAccountPage(page)
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)
    const checkoutPage = new CheckoutPage(page)
    let product: StoreProduct

    await test.step('Confirmar sessão autenticada persistida', async () => {
      await accountPage.goto()
      await expectAuthenticatedAccount(accountPage)
    })

    await test.step('Garantir carrinho vazio antes do teste', async () => {
      await cartPage.emptyCart()
    })

    await test.step('Selecionar produto comprável via Store API', async () => {
      product = await findPurchasableSimpleProduct(request)
    })

    await test.step('Acessar o produto e clicar em COMPRAR', async () => {
      await productPage.goto(pathFromUrl(product.permalink))
      await expectProductDetailsPage(productPage, pathFromUrl(product.permalink), product.name)
      await productPage.addProductToCart()
    })

    await test.step('Validar item e quantidade no carrinho contra o preço retornado pela API', async () => {
      const currency = deriveCurrencyFromProduct(product)

      await cartPage.goto()
      await expectCartPage(cartPage)
      await expectCartItemMatchesProduct(cartPage, product, currency)
      await expectQuantityControl(cartPage, product)
    })

    await test.step('Avançar para o checkout', async () => {
      await expectCheckoutNavigationAvailable(cartPage)
      await cartPage.goToCheckout()
      await expectCheckoutPage(checkoutPage, { orderButtonText: purchaseFlow.checkout.orderButtonText })
    })
  })

  test('[E2E-PURCHASE-002] Validar produto sem controle de compra', async ({ page, request }) => {
    const productPage = new ProductPage(page)
    let product: StoreProduct

    await test.step('Selecionar produto não comprável via Store API', async () => {
      product = await findNonPurchasableProduct(request)
    })

    await test.step('Acessar o produto negativo', async () => {
      await productPage.goto(pathFromUrl(product.permalink))
      await expectProductDetailsPage(productPage, pathFromUrl(product.permalink), product.name)
    })

    await test.step('Confirmar ausência do controle de compra', async () => {
      await expectProductPurchaseControlUnavailable(productPage)
    })
  })
})
