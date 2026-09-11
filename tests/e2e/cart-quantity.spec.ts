import { test } from '@playwright/test'
import { findPurchasableSimpleProduct } from '../../api/ProductCatalog'
import { CartPage } from '../../pages/CartPage'
import { ProductPage } from '../../pages/ProductPage'
import { pathFromUrl } from '../../utils/url'

/*
Feature: Alterar a quantidade do item no carrinho (passo 5 do fluxo obrigatório)

  Scenario: [E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI
    Given um produto foi adicionado ao carrinho
    When tento alterar o valor do campo de quantidade
    Then a alteração deveria ser aceita e refletida no subtotal
*/

// eslint-disable-next-line playwright/expect-expect
test.fail(
  '[E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI',
  async ({ page, request }) => {
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)
    const product = await findPurchasableSimpleProduct(request)

    await productPage.goto(pathFromUrl(product.permalink))
    await productPage.addProductToCart()

    await cartPage.goto()
    await cartPage.quantityInput.fill('3', { timeout: 5000 })
  }
)
