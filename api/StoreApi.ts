import { APIRequestContext, APIResponse } from '@playwright/test'

export interface StoreProduct {
  id: number
  name: string
  type: string
  permalink: string
  prices: {
    price: string
    regular_price: string
    sale_price: string
    currency_code: string
    currency_symbol: string
    currency_minor_unit: number
    currency_decimal_separator: string
    currency_thousand_separator: string
  }
  is_purchasable: boolean
  is_in_stock: boolean
  sold_individually: boolean
  add_to_cart: {
    text: string
    url: string
  }
}

export interface StoreProductVariation {
  id: number
  attributes: Array<{ name: string; value: string }>
}

export interface StoreProductDetail extends StoreProduct {
  has_options: boolean
  variations: StoreProductVariation[]
}

export interface StoreCartItem {
  key: string
  id: number
  quantity: number
  prices: {
    price: string
  }
  totals: {
    line_total: string
  }
}

export interface StoreCart {
  items: StoreCartItem[]
  totals: {
    total_items: string
    total_price: string
    currency_code: string
    currency_symbol: string
  }
}

export class StoreApi {
  constructor(private readonly request: APIRequestContext) {}

  getProducts(perPage = 2): Promise<APIResponse> {
    return this.request.get(`/wp-json/wc/store/products?per_page=${perPage}`)
  }

  getProduct(id: number): Promise<APIResponse> {
    return this.request.get(`/wp-json/wc/store/products/${id}`)
  }

  getProductsSchema(): Promise<APIResponse> {
    return this.request.fetch('/wp-json/wc/store/products', { method: 'OPTIONS' })
  }

  getCart(): Promise<APIResponse> {
    return this.request.get('/wp-json/wc/store/cart')
  }

  private async getNonce(): Promise<string> {
    const response = await this.getCart()
    const nonce = response.headers()['x-wc-store-api-nonce']

    if (!nonce) {
      throw new Error('Store API did not return an X-WC-Store-API-Nonce header on GET /cart')
    }

    return nonce
  }

  async addItem(
    id: number,
    quantity: number,
    variation?: Array<{ name: string; value: string }>
  ): Promise<APIResponse> {
    const nonce = await this.getNonce()
    const variationPayload = variation?.map(({ name, value }) => ({ attribute: name, value }))

    return this.request.post('/wp-json/wc/store/cart/add-item', {
      headers: { 'X-WC-Store-API-Nonce': nonce },
      data: variationPayload ? { id, quantity, variation: variationPayload } : { id, quantity }
    })
  }

  async updateItemQuantity(key: string, quantity: number): Promise<APIResponse> {
    const nonce = await this.getNonce()

    return this.request.post('/wp-json/wc/store/cart/update-item', {
      headers: { 'X-WC-Store-API-Nonce': nonce },
      data: { key, quantity }
    })
  }
}
