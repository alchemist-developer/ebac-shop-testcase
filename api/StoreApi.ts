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

export interface StoreCart {
  items: unknown[]
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

  getCart(): Promise<APIResponse> {
    return this.request.get('/wp-json/wc/store/cart')
  }
}
