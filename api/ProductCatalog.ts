import { APIRequestContext } from '@playwright/test'
import { StoreApi, StoreProduct } from './StoreApi'

const CATALOG_PAGE_SIZE = 100

async function fetchCatalog(request: APIRequestContext): Promise<StoreProduct[]> {
  const storeApi = new StoreApi(request)
  const response = await storeApi.getProducts(CATALOG_PAGE_SIZE)

  return (await response.json()) as StoreProduct[]
}

export async function findPurchasableSimpleProduct(request: APIRequestContext): Promise<StoreProduct> {
  const products = await fetchCatalog(request)
  const product = products.find(
    (candidate) => candidate.is_purchasable && candidate.is_in_stock && candidate.type === 'simple'
  )

  if (!product) {
    throw new Error(
      'No purchasable "simple" product found in the catalog. ' +
        'Variable products need variation selection, which ProductPage does not support yet.'
    )
  }

  return product
}

export async function findNonPurchasableProduct(request: APIRequestContext): Promise<StoreProduct> {
  const products = await fetchCatalog(request)
  const product = products.find((candidate) => !candidate.is_purchasable)

  if (!product) {
    throw new Error('No non-purchasable product found in the catalog to exercise the negative flow')
  }

  return product
}

export async function findAnyProduct(request: APIRequestContext): Promise<StoreProduct> {
  const storeApi = new StoreApi(request)
  const response = await storeApi.getProducts(1)
  const [product] = (await response.json()) as StoreProduct[]

  if (!product) {
    throw new Error('Store API returned no products to derive currency formatting from')
  }

  return product
}
