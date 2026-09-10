import { test } from '@playwright/test'
import { findAnyProduct } from '../../api/ProductCatalog'
import { expectCartPage } from '../../assertions/cartAssertions'
import { expectCartSubtotalMatchesDiscountedPrice, expectDiscountedProductCard } from '../../assertions/discountAssertions'
import { CartPage } from '../../pages/CartPage'
import { HomePage } from '../../pages/HomePage'
import { ProductPage } from '../../pages/ProductPage'
import { discountFlow } from '../../test-data/discountFlow'
import { deriveCurrencyFromProduct } from '../../utils/currency'
import { pathFromUrl } from '../../utils/url'

/*
Feature: Validar descontos exibidos na vitrine

  Scenario: [E2E-DISCOUNT-001] Validar desconto aplicado no card do produto
    Given que a homepage está acessível
    And existe um card com preço original, preço promocional e percentual de desconto
    When eu consulto os valores do card do produto
    Then o preço promocional deve ser menor que o preço original
    And o percentual exibido deve corresponder ao desconto calculado

  Scenario: [E2E-DISCOUNT-002] Validar preço promocional cobrado no carrinho
    Given que existe um produto com desconto exibido na homepage
    When eu adiciono o produto ao carrinho
    Then o subtotal cobrado deve corresponder ao preço promocional exibido no card

  Estes cenários não usam sessão autenticada (nenhum storageState é
  aplicado), então cada teste recebe um contexto de browser novo com seu
  próprio cookie de sessão de convidado — o carrinho já nasce vazio e
  isolado por teste, sem necessidade de limpeza manual.
*/

test('[E2E-DISCOUNT-001] Validar desconto aplicado no card do produto', async ({ page, request }) => {
  const homePage = new HomePage(page)
  const currency = deriveCurrencyFromProduct(await findAnyProduct(request))
  let selectedProduct: Awaited<ReturnType<HomePage['selectRandomDiscountedProduct']>>

  await test.step('Acessar a homepage e localizar o card promocional', async () => {
    await homePage.goto()
    selectedProduct = await homePage.selectRandomDiscountedProduct()
  })

  await test.step('Calcular o desconto com os valores exibidos', async () => {
    const result = await expectDiscountedProductCard(
      selectedProduct,
      currency,
      discountFlow.discountPercentagePrecision
    )
    test.info().annotations.push({ type: 'selected-product', description: result.productName })
  })
})

test('[E2E-DISCOUNT-002] Validar preço promocional cobrado no carrinho', async ({ page, request }) => {
  const homePage = new HomePage(page)
  const productPage = new ProductPage(page)
  const cartPage = new CartPage(page)
  const currency = deriveCurrencyFromProduct(await findAnyProduct(request))
  let salePriceCents: number
  let productPath: string

  await test.step('Selecionar produto com desconto e calcular o preço promocional', async () => {
    await homePage.goto()
    const selectedProduct = await homePage.selectRandomDiscountedProduct()
    const productUrl = await selectedProduct.productLink.getAttribute('href')

    if (!productUrl) {
      throw new Error('Discounted product card is missing a link to its product page')
    }

    productPath = pathFromUrl(productUrl)
    const result = await expectDiscountedProductCard(
      selectedProduct,
      currency,
      discountFlow.discountPercentagePrecision
    )
    salePriceCents = result.salePriceCents
    test.info().annotations.push({ type: 'selected-product', description: result.productName })
  })

  await test.step('Adicionar o produto ao carrinho', async () => {
    await productPage.goto(productPath)
    await productPage.addProductToCart()
  })

  await test.step('Confirmar que o subtotal cobrado é o preço promocional', async () => {
    await cartPage.goto()
    await expectCartPage(cartPage)
    await expectCartSubtotalMatchesDiscountedPrice(cartPage, salePriceCents, currency)
  })
})
