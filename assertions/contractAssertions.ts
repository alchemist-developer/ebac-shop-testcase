import { APIResponse, expect } from '@playwright/test'

export interface JsonSchemaProperty {
  type: string | string[]
  properties?: Record<string, JsonSchemaProperty>
}

interface JsonSchemaObject {
  properties: Record<string, JsonSchemaProperty>
}

const FIELDS_UNDER_CONTRACT = ['id', 'name', 'type', 'permalink', 'is_purchasable', 'is_in_stock', 'sold_individually'] as const

const PRICE_FIELDS_UNDER_CONTRACT = [
  'price',
  'regular_price',
  'sale_price',
  'currency_code',
  'currency_symbol',
  'currency_minor_unit',
  'currency_decimal_separator',
  'currency_thousand_separator'
] as const

function matchesSchemaType(value: unknown, schemaType: string | string[]): boolean {
  const types = Array.isArray(schemaType) ? schemaType : [schemaType]

  return types.some((type) => {
    switch (type) {
      case 'null':
        return value === null
      case 'integer':
      case 'number':
        return typeof value === 'number'
      case 'string':
        return typeof value === 'string'
      case 'boolean':
        return typeof value === 'boolean'
      case 'array':
        return Array.isArray(value)
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value)
      default:
        return false
    }
  })
}

export async function expectResponseMatchesDeclaredSchema(
  productsResponse: APIResponse,
  schemaResponse: APIResponse
): Promise<void> {
  const schemaBody = (await schemaResponse.json()) as { schema: JsonSchemaObject }
  const schema = schemaBody.schema
  const [product] = (await productsResponse.json()) as Array<Record<string, unknown>>

  expect(product, 'Contract test needs at least one product in the response to validate').toBeDefined()

  for (const field of FIELDS_UNDER_CONTRACT) {
    const propertySchema = schema.properties[field]
    expect(propertySchema, `Store API no longer declares a schema for "${field}"`).toBeDefined()
    expect(
      matchesSchemaType(product[field], propertySchema.type),
      `"${field}" = ${JSON.stringify(product[field])} does not match declared type ${JSON.stringify(propertySchema.type)}`
    ).toBe(true)
  }

  const pricesSchema = schema.properties.prices?.properties
  const prices = product.prices as Record<string, unknown>
  expect(pricesSchema, 'Store API no longer declares a schema for "prices"').toBeDefined()

  for (const field of PRICE_FIELDS_UNDER_CONTRACT) {
    const propertySchema = pricesSchema?.[field]
    expect(propertySchema, `Store API no longer declares a schema for "prices.${field}"`).toBeDefined()
    expect(
      matchesSchemaType(prices[field], propertySchema!.type),
      `"prices.${field}" = ${JSON.stringify(prices[field])} does not match declared type ${JSON.stringify(propertySchema!.type)}`
    ).toBe(true)
  }
}
