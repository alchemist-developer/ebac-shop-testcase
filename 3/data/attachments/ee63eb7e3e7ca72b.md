# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/cart-quantity.spec.ts >> [E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI
- Location: tests/e2e/cart-quantity.spec.ts:17:6

# Error details

```
TimeoutError: locator.fill: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('.cart_item').first().locator('input[name$="[qty]"]')
    - locator resolved to <input value="1" type="hidden" name="cart[2e255d2d6bf9bb33030246d31f1a79ca][qty]"/>
    - fill("3")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    10 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e2]:
    - text:           
    - banner [ref=f2e3]:
      - generic [ref=f2e7]:
        - generic [ref=f2e8]:
          - 'button " Cart : R$1.000,00 1" [expanded] [ref=f2e12] [cursor=pointer]':
            - generic [ref=f2e13]: 
            - generic [ref=f2e15]:
              - text: "Cart :"
              - generic [ref=f2e16]: R$1.000,00
            - generic [ref=f2e18]: "1"
          - link "0" [ref=f2e20] [cursor=pointer]:
            - /url: http://lojaebac.ebaconline.art.br/lista-de-desejos/
            - generic [aria-hidden] [ref=f2e21]: 
        - list [ref=f2e23]:
          - listitem [ref=f2e24]:
            - generic [ref=f2e25]: 
            - link "Sign up" [ref=f2e26] [cursor=pointer]:
              - /url: http://lojaebac.ebaconline.art.br/minha-conta/
          - listitem [ref=f2e27]:
            - link "Login" [ref=f2e28] [cursor=pointer]:
              - /url: http://lojaebac.ebaconline.art.br/minha-conta/
      - generic [ref=f2e32]:
        - link [ref=f2e35] [cursor=pointer]:
          - /url: http://lojaebac.ebaconline.art.br/
          - img "EBAC – Shop" [ref=f2e36]
        - generic [ref=f2e41]:
          - generic [ref=f2e43]:
            - combobox [ref=f2e44] [cursor=pointer]:
              - option "Selecione uma categoria" [selected]
              - option "Clothing"
              - option "Men"
              - option "Bottoms"
              - option "Pants|Clothing"
              - option "Promotions"
              - option "Pants|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Erin Recommends|Clothing"
              - option "New Luma Yoga Collection|Clothing"
              - option "Collections"
              - option "Erin Recommends|Clothing"
              - option "Performance Fabrics|Clothing"
              - option "Shorts"
              - option "Shorts|Clothing"
              - option "Collections"
              - option "Erin Recommends|Clothing"
              - option "New Luma Yoga Collection|Clothing"
              - option "Performance Fabrics|Clothing"
              - option "Promotions"
              - option "Men Sale|Clothing"
              - option "Collections"
              - option "Erin Recommends|Clothing"
              - option "Tops"
              - option "Hoodies & Sweatshirts"
              - option "Hoodies & Sweatshirts|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Jackets"
              - option "Jackets|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Tanks"
              - option "Tanks|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Tees"
              - option "Tees|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Women"
              - option "Tops"
              - option "Bras & Tanks"
              - option "Bras & Tanks|Clothing"
              - option "Collections"
              - option "New Luma Yoga Collection|Clothing"
              - option "Collections"
              - option "Performance Fabrics|Clothing"
              - option "Promotions"
              - option "Women Sale|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Hoodies & Sweatshirts"
              - option "Hoodies & Sweatshirts|Clothing"
              - option "Collections"
              - option "Eco Friendly|Clothing"
              - option "Erin Recommends|Clothing"
              - option "New Luma Yoga Collection|Clothing"
              - option "Collections"
              - option "Erin Recommends|Clothing"
              - option "Performance Fabrics|Clothing"
              - option "Promotions"
              - option "Women Sale|Clothing"
              - option "Collections"
              - option "Performance Fabrics|Clothing"
              - option "Jackets"
              - option "Jackets|Clothing"
              - option "Collections"
              - option "New Luma Yoga Collection|Clothing"
              - option "Collections"
              - option "Erin Recommends|Clothing"
              - option "Performance Fabrics|Clothing"
              - option "Promotions"
              - option "Women Sale|Clothing"
              - option "Uncategorized"
            - paragraph [ref=f2e45]:
              - generic [ref=f2e46] [cursor=pointer]: Selecione uma categoria
          - textbox "Enter your search ..." [ref=f2e49]
          - button "Search " [ref=f2e51] [cursor=pointer]:
            - text: Search
            - generic [ref=f2e52]: 
          - generic [ref=f2e53] [cursor=pointer]
      - generic [ref=f2e55]:
        - generic [ref=f2e57]:
          - heading " All Categories" [level=3] [ref=f2e58] [cursor=pointer]
          - text:     
        - navigation [ref=f2e59]:
          - list [ref=f2e61]:
            - listitem [ref=f2e62]:
              - link "Home" [ref=f2e63] [cursor=pointer]:
                - /url: http://lojaebac.ebaconline.art.br/home/
            - listitem [ref=f2e65]:
              - link "Comprar" [ref=f2e66] [cursor=pointer]:
                - /url: http://lojaebac.ebaconline.art.br/produtos/
                - generic [ref=f2e67]: 
                - text: Comprar
            - listitem [ref=f2e68]:
              - link "Blog" [ref=f2e69] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=f2e71]:
              - link "Categorias" [ref=f2e72] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=f2e73]:
              - link "Mais vendidos" [ref=f2e74] [cursor=pointer]:
                - /url: "#"
    - generic [ref=f2e75]:
      - list [ref=f2e79]:
        - listitem [ref=f2e80]:
          - link "Home" [ref=f2e81] [cursor=pointer]:
            - /url: http://lojaebac.ebaconline.art.br
          - text: /
        - listitem [ref=f2e82]: Carrinho
      - main [ref=f2e86]:
        - heading "Carrinho" [level=1] [ref=f2e88]
        - generic [ref=f2e89]:
          - table [ref=f2e93]:
            - rowgroup [ref=f2e94]:
              - row [ref=f2e95]:
                - columnheader "Image" [ref=f2e96]
                - columnheader "Product" [ref=f2e97]
                - columnheader "Price" [ref=f2e98]
                - columnheader "Quantity" [ref=f2e99]
                - columnheader "Total" [ref=f2e100]
                - columnheader "Remove" [ref=f2e101]
            - rowgroup [ref=f2e102]:
              - row [ref=f2e103]:
                - cell [ref=f2e104]:
                  - link [ref=f2e105] [cursor=pointer]:
                    - /url: http://lojaebac.ebaconline.art.br/product/66665692-produto-lgc2/
                    - img "Padrão" [ref=f2e106]
                - cell [ref=f2e107]:
                  - link "[66665692] Produto Lgc2" [ref=f2e108] [cursor=pointer]:
                    - /url: http://lojaebac.ebaconline.art.br/product/66665692-produto-lgc2/
                - cell "R$1.000,00" [ref=f2e109]
                - cell "1" [ref=f2e112]
                - cell "R$1.000,00" [ref=f2e113]
                - cell [ref=f2e116]:
                  - link "Remove this item" [ref=f2e117] [cursor=pointer]:
                    - /url: http://lojaebac.ebaconline.art.br/carrinho/?remove_item=2e255d2d6bf9bb33030246d31f1a79ca&_wpnonce=0796c565c9
                    - generic [aria-hidden] [ref=f2e118]: 
              - row [ref=f2e119]:
                - cell [ref=f2e120]:
                  - generic [ref=f2e121]:
                    - generic [ref=f2e122]:
                      - textbox "Coupon:" [ref=f2e123]:
                        - /placeholder: Coupon code
                      - button "Apply Coupon" [ref=f2e124] [cursor=pointer]
                    - generic [ref=f2e125]:
                      - button "Update Cart" [disabled]
          - generic [ref=f2e127]:
            - heading "Total no carrinho" [level=2] [ref=f2e128]
            - table [ref=f2e129]:
              - rowgroup [ref=f2e130]:
                - row [ref=f2e131]:
                  - rowheader "Subtotal" [ref=f2e132]
                  - cell "R$1.000,00" [ref=f2e133]
                - row [ref=f2e136]:
                  - rowheader "Total" [ref=f2e137]
                  - cell "R$1.000,00" [ref=f2e138]:
                    - strong [ref=f2e139]:
                      - generic [ref=f2e140]: R$1.000,00
            - link "Concluir compra" [ref=f2e143] [cursor=pointer]:
              - /url: http://lojaebac.ebaconline.art.br/checkout/
    - contentinfo
    - text:     
  - text: 
```

# Test source

```ts
  1  | import { test } from '@playwright/test'
  2  | import { findPurchasableSimpleProduct } from '../../api/ProductCatalog'
  3  | import { CartPage } from '../../pages/CartPage'
  4  | import { ProductPage } from '../../pages/ProductPage'
  5  | import { pathFromUrl } from '../../utils/url'
  6  | 
  7  | /*
  8  | Feature: Alterar a quantidade do item no carrinho (passo 5 do fluxo obrigatório)
  9  | 
  10 |   Scenario: [E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI
  11 |     Given um produto foi adicionado ao carrinho
  12 |     When tento alterar o valor do campo de quantidade
  13 |     Then a alteração deveria ser aceita e refletida no subtotal
  14 | */
  15 | 
  16 | // eslint-disable-next-line playwright/expect-expect
  17 | test.fail(
  18 |   '[E2E-CART-QUANTITY-001] Alterar quantidade do item no carrinho pela UI',
  19 |   async ({ page, request }) => {
  20 |     const productPage = new ProductPage(page)
  21 |     const cartPage = new CartPage(page)
  22 |     const product = await findPurchasableSimpleProduct(request)
  23 | 
  24 |     await productPage.goto(pathFromUrl(product.permalink))
  25 |     await productPage.addProductToCart()
  26 | 
  27 |     await cartPage.goto()
> 28 |     await cartPage.quantityInput.fill('3', { timeout: 5000 })
     |                                  ^ TimeoutError: locator.fill: Timeout 5000ms exceeded.
  29 |   }
  30 | )
  31 | 
```