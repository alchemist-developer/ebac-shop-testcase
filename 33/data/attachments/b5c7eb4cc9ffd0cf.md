# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/purchase-flow.spec.ts >> Purchase flow >> [E2E-PURCHASE-001] Comprar produto autenticado até o checkout
- Location: tests/e2e/purchase-flow.spec.ts:43:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.summary, .entry-summary').first()
Expected substring: "[66665692] Produto Lgc2"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('.summary, .entry-summary').first() with timeout 5000ms
  - waiting for locator('.summary, .entry-summary').first()

```

```yaml
- heading "502 Bad Gateway" [level=1]
- separator
- text: nginx/1.25.3
```

# Test source

```ts
  1  | import { expect } from '@playwright/test'
  2  | import { ProductPage } from '../pages/ProductPage'
  3  | 
  4  | export async function expectProductDetailsPage(
  5  |   productPage: ProductPage,
  6  |   expectedPath: string,
  7  |   expectedName: string
  8  | ): Promise<void> {
  9  |   await expect(productPage.page).toHaveURL(new RegExp(`${expectedPath.replaceAll('/', '\\/')}$`))
> 10 |   await expect(productPage.summary).toContainText(expectedName)
     |                                     ^ Error: expect(locator).toContainText(expected) failed
  11 | }
  12 | 
  13 | export async function expectProductPurchaseControlUnavailable(productPage: ProductPage): Promise<void> {
  14 |   await expect(productPage.cartForm).toHaveCount(0)
  15 |   await expect(productPage.addToCartButton).toHaveCount(0)
  16 | }
  17 | 
```