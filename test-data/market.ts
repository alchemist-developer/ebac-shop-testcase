export interface CurrencyExpectation {
  code: string;
  symbol: string;
}

export function getCurrencyForBaseUrl(baseUrl: string | undefined): CurrencyExpectation {
  if (!baseUrl) {
    throw new Error('BASE_URL must be configured to derive the market currency');
  }

  const hostname = new URL(baseUrl).hostname.toLowerCase();

  return hostname.endsWith('.br')
    ? { code: 'BRL', symbol: 'R$' }
    : { code: 'USD', symbol: '$' };
}
