import { Locator, Page } from '@playwright/test'

export interface DiscountedProductCard {
  card: Locator
  name: Locator
  originalPrice: Locator
  salePrice: Locator
  discountLabel: Locator
  productLink: Locator
}

export class HomePage {
  readonly page: Page
  readonly discountedProductCards: Locator

  constructor(page: Page) {
    this.page = page
    this.discountedProductCards = page.locator(
      '.product-block:has(.price del):has(.price ins):has(.saled)'
    )
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async selectRandomDiscountedProduct(): Promise<DiscountedProductCard> {
    const count = await this.discountedProductCards.count()
    const visibleCards: Locator[] = []

    for (let index = 0; index < count; index += 1) {
      const card = this.discountedProductCards.nth(index)

      if (await card.isVisible()) {
        visibleCards.push(card)
      }
    }

    if (visibleCards.length === 0) {
      throw new Error('No visible product card with price and discount was found')
    }

    const card = visibleCards[Math.floor(Math.random() * visibleCards.length)]

    return {
      card,
      name: card.locator('.name, .product-title, h3, h4').first(),
      originalPrice: card.locator('.price del .amount').first(),
      salePrice: card.locator('.price ins .amount').first(),
      discountLabel: card.locator('.saled').first(),
      productLink: card.locator('a.product-image').first()
    }
  }
}
