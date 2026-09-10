import { test } from "@playwright/test"
import {
    expectCartItem,
    expectCartPage,
    expectCheckoutNavigationAvailable,
    expectQuantityControlToBeReadOnly,
} from "../../assertions/cartAssertions"
import { expectCheckoutPage } from "../../assertions/checkoutAssertions"
import {
    expectProductDetailsPage,
    expectProductPurchaseControlUnavailable,
} from "../../assertions/productAssertions"
import { CartPage } from "../../pages/CartPage"
import { CheckoutPage } from "../../pages/CheckoutPage"
import { HomePage } from "../../pages/HomePage"
import { ProductPage } from "../../pages/ProductPage"
import { purchaseFlow } from "../../test-data/purchaseFlow"

test("valida o fluxo de compra até o checkout e registra a limitação de quantidade", async ({
  page,
}) => {
  const homePage = new HomePage(page, purchaseFlow.product.id)
  const productPage = new ProductPage(page)
  const cartPage = new CartPage(page)
  const checkoutPage = new CheckoutPage(page)
  let addToCartHref: string

  await test.step("Acessar a homepage e selecionar um produto simples", async () => {
    await homePage.goto()
    addToCartHref = await homePage.getObservedAddToCartHref()
    await homePage.selectProduct()
    await expectProductDetailsPage(
      productPage,
      purchaseFlow.product.detailsPath,
      purchaseFlow.product.detailsName,
    )
  })

  await test.step("Registrar a ausência do controle de compra no detalhe do produto", async () => {
    await expectProductPurchaseControlUnavailable(productPage)
  })

  await test.step("Adicionar o produto pelo href exposto pela vitrine", async () => {
    await productPage.addProductUsingObservedHref(addToCartHref)
  })

  await test.step("Validar produto, preço e quantidade observada no carrinho", async () => {
    await cartPage.goto()
    await expectCartPage(cartPage)
    await expectCartItem(cartPage, {
      name: purchaseFlow.product.cartName,
      unitPrice: purchaseFlow.product.unitPrice,
      subtotal: purchaseFlow.product.subtotal,
      quantity: purchaseFlow.product.quantity,
    })
    await expectQuantityControlToBeReadOnly(
      cartPage,
      purchaseFlow.product.quantity,
    )
  })

  await test.step("Avançar para o checkout e validar dados disponíveis", async () => {
    await expectCheckoutNavigationAvailable(cartPage)
    await cartPage.goToCheckout()
    await expectCheckoutPage(checkoutPage, {
      orderButtonText: purchaseFlow.checkout.orderButtonText,
      paymentMethods: purchaseFlow.checkout.paymentMethods,
    })
  })
})
