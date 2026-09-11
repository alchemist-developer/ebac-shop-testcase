import { expect } from '@playwright/test'
import { CartPage } from '../pages/CartPage'
import { DiscountedProductCard } from '../pages/HomePage'
import { CurrencyExpectation } from '../test-data/market'
import { calculateDiscount, parseDiscountPercentage, parseMoneyToCents } from '../utils/discountCalculator'

export interface DiscountValidationResult {
  productName: string
  originalPriceCents: number
  salePriceCents: number
  displayedDiscountPercentage: number
  calculatedDiscountPercentage: number
}

export async function expectDiscountedProductCard(
  productCard: DiscountedProductCard,
  currency: CurrencyExpectation,
  precision = 0
): Promise<DiscountValidationResult> {
  await expect(productCard.card).toBeVisible()
  await expect(productCard.name).toBeVisible()
  await expect(productCard.originalPrice).toBeVisible()
  await expect(productCard.salePrice).toBeVisible()
  await expect(productCard.discountLabel).toBeVisible()

  const productName = await productCard.name.innerText()
  const originalPriceCents = parseMoneyToCents(
    await productCard.originalPrice.innerText(),
    currency.decimalSeparator,
    currency.thousandsSeparator
  )
  const salePriceCents = parseMoneyToCents(
    await productCard.salePrice.innerText(),
    currency.decimalSeparator,
    currency.thousandsSeparator
  )
  const displayedDiscountPercentage = parseDiscountPercentage(
    await productCard.discountLabel.innerText()
  )
  const discount = calculateDiscount(originalPriceCents, salePriceCents)
  const calculatedDiscountPercentage = Number(discount.discountPercentage.toFixed(precision))

  expect(salePriceCents).toBeLessThan(originalPriceCents)
  expect(calculatedDiscountPercentage).toBe(displayedDiscountPercentage)

  return {
    productName,
    originalPriceCents,
    salePriceCents,
    displayedDiscountPercentage,
    calculatedDiscountPercentage
  }
}

export async function expectCartSubtotalMatchesDiscountedPrice(
  cartPage: CartPage,
  expectedSalePriceCents: number,
  currency: CurrencyExpectation
): Promise<void> {
  const subtotalText = await cartPage.productSubtotal.innerText()
  const subtotalCents = parseMoneyToCents(
    subtotalText,
    currency.decimalSeparator,
    currency.thousandsSeparator
  )

  expect(subtotalCents).toBe(expectedSalePriceCents)
}
