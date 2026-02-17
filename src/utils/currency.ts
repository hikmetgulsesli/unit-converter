/**
 * Currency conversion utility functions
 * Base currency: USD
 * 
 * NOTE: These are MOCK exchange rates for demonstration purposes only.
 * Real exchange rates will be integrated via API in a later story.
 */

/**
 * Currency code type - all supported currencies
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'TRY' | 'JPY';

/**
 * All supported currency codes
 */
export const CURRENCY_CODES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'TRY', 'JPY'];

/**
 * Currency display names
 */
export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  TRY: 'Turkish Lira',
  JPY: 'Japanese Yen',
};

/**
 * Currency symbols
 */
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  TRY: '₺',
  JPY: '¥',
};

/**
 * Mock exchange rates relative to USD (base currency)
 * NOTE: These are approximate mock rates for demonstration only
 */
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 32.5,
  JPY: 150,
};

/**
 * Timestamp indicating when these mock rates were last "updated"
 * NOTE: This is a static timestamp for the mock rates
 */
export const LAST_UPDATED = '2024-02-17T00:00:00Z';

/**
 * Disclaimer text for mock rates
 */
export const MOCK_RATES_DISCLAIMER = 
  'These are mock exchange rates for demonstration purposes only. Real-time rates will be available in a future update.';

/**
 * Custom error class for currency conversion errors
 */
export class CurrencyConversionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly value?: number,
    public readonly from?: CurrencyCode,
    public readonly to?: CurrencyCode
  ) {
    super(message);
    this.name = 'CurrencyConversionError';
  }
}

/**
 * Validates a currency code
 * @param code - The currency code to validate
 * @returns true if valid, false otherwise
 */
export function isValidCurrencyCode(code: string): code is CurrencyCode {
  return CURRENCY_CODES.includes(code as CurrencyCode);
}

/**
 * Converts a currency value from one currency to another
 * Uses USD as the intermediate base currency
 * 
 * @param value - The value to convert
 * @param from - The source currency code
 * @param to - The target currency code
 * @returns The converted value
 * @throws CurrencyConversionError if currency codes are invalid
 */
export function convertCurrency(value: number, from: CurrencyCode, to: CurrencyCode): number {
  // Validate value is a number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CurrencyConversionError(
      'Value must be a finite number',
      'INVALID_VALUE',
      value,
      from,
      to
    );
  }

  // Validate from currency
  if (!isValidCurrencyCode(from)) {
    throw new CurrencyConversionError(
      `Invalid source currency: ${from}. Valid currencies are: ${CURRENCY_CODES.join(', ')}`,
      'INVALID_FROM_CURRENCY',
      value,
      from,
      to
    );
  }

  // Validate to currency
  if (!isValidCurrencyCode(to)) {
    throw new CurrencyConversionError(
      `Invalid target currency: ${to}. Valid currencies are: ${CURRENCY_CODES.join(', ')}`,
      'INVALID_TO_CURRENCY',
      value,
      from,
      to
    );
  }

  // Same currency, no conversion needed
  if (from === to) {
    return value;
  }

  // Convert to USD first, then to target currency
  const valueInUSD = value / EXCHANGE_RATES[from];
  const result = valueInUSD * EXCHANGE_RATES[to];

  return result;
}

/**
 * Converts a currency value and formats it to a specified precision
 * @param value - The value to convert
 * @param from - The source currency code
 * @param to - The target currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns The converted value rounded to specified decimals
 */
export function convertCurrencyRounded(
  value: number,
  from: CurrencyCode,
  to: CurrencyCode,
  decimals: number = 2
): number {
  const result = convertCurrency(value, from, to);
  const factor = Math.pow(10, decimals);
  return Math.round(result * factor) / factor;
}

/**
 * Converts a currency value to USD
 * @param value - The value to convert
 * @param from - The source currency code
 * @returns The value in USD
 */
export function toUSD(value: number, from: CurrencyCode): number {
  return convertCurrency(value, from, 'USD');
}

/**
 * Converts a currency value from USD
 * @param value - The value in USD
 * @param to - The target currency code
 * @returns The converted value
 */
export function fromUSD(value: number, to: CurrencyCode): number {
  return convertCurrency(value, 'USD', to);
}

/**
 * Formats a currency value with its symbol
 * @param value - The value to format
 * @param currency - The currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with currency symbol
 */
export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  decimals: number = 2
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = value.toFixed(decimals);
  return `${symbol}${formatted}`;
}
