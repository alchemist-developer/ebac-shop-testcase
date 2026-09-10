export interface DiscountResult {
  originalPriceCents: number
  salePriceCents: number
  discountCents: number
  discountPercentage: number
}

export function calculateDiscount(
  originalPriceCents: number,
  salePriceCents: number
): DiscountResult {
  if (originalPriceCents <= 0) {
    throw new Error('Original price must be greater than zero')
  }

  if (salePriceCents < 0 || salePriceCents > originalPriceCents) {
    throw new Error('Sale price must be between zero and the original price')
  }

  const discountCents = originalPriceCents - salePriceCents
  const discountPercentage = (discountCents / originalPriceCents) * 100

  return {
    originalPriceCents,
    salePriceCents,
    discountCents,
    discountPercentage
  }
}

export function parseDiscountPercentage(value: string): number {
  if (!/\d/.test(value)) {
    throw new Error(`Invalid discount percentage: ${value}`)
  }

  const percentage = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''))

  if (!Number.isFinite(percentage)) {
    throw new Error(`Invalid discount percentage: ${value}`)
  }

  return Math.abs(percentage)
}

export function parseMoneyToCents(
  value: string,
  decimalSeparator: string,
  thousandsSeparator: string
): number {
  if (!/\d/.test(value)) {
    throw new Error(`Invalid monetary value: ${value}`)
  }

  const numericValue = value
    .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
    .replace(decimalSeparator, '.')
    .replace(/[^\d.-]/g, '')
  const amount = Number(numericValue)

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid monetary value: ${value}`)
  }

  return Math.round(amount * 100)
}
