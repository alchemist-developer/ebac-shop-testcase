import { StoreProduct } from "../api/StoreApi"
import { CurrencyExpectation } from "../test-data/market"

export function deriveCurrencyFromProduct(
  product: StoreProduct,
): CurrencyExpectation {
  return {
    code: product.prices.currency_code,
    symbol: product.prices.currency_symbol,
    decimalSeparator: product.prices.currency_decimal_separator,
    thousandsSeparator: product.prices.currency_thousand_separator,
  }
}
