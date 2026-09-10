import { expect } from '@playwright/test'
import { ProductPage } from '../pages/ProductPage'

export async function expectProductDetailsPage(
  productPage: ProductPage,
  expectedPath: string,
  expectedName: string
): Promise<void> {
  await expect(productPage.page).toHaveURL(new RegExp(`${expectedPath.replaceAll('/', '\\/')}$`))
  await expect(productPage.summary).toContainText(expectedName)
}

export async function expectProductPurchaseControlUnavailable(productPage: ProductPage): Promise<void> {
  await expect(productPage.cartForm).toHaveCount(0)
  await expect(productPage.addToCartButton).toHaveCount(0)
}
