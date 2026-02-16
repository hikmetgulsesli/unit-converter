/**
 * Currency conversion utility tests
 */

import { describe, it, expect } from 'vitest';
import {
  convertCurrency,
  convertCurrencyRounded,
  toUSD,
  fromUSD,
  formatCurrency,
  isValidCurrencyCode,
  CurrencyConversionError,
  CURRENCY_CODES,
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  EXCHANGE_RATES,
  LAST_UPDATED,
  MOCK_RATES_DISCLAIMER,
  CurrencyCode,
} from './currency';

describe('Currency Conversion', () => {
  describe('Constants', () => {
    it('should have all 5 currency codes defined', () => {
      expect(CURRENCY_CODES).toHaveLength(5);
      expect(CURRENCY_CODES).toContain('USD');
      expect(CURRENCY_CODES).toContain('EUR');
      expect(CURRENCY_CODES).toContain('GBP');
      expect(CURRENCY_CODES).toContain('TRY');
      expect(CURRENCY_CODES).toContain('JPY');
    });

    it('should have correct currency names', () => {
      expect(CURRENCY_NAMES.USD).toBe('US Dollar');
      expect(CURRENCY_NAMES.EUR).toBe('Euro');
      expect(CURRENCY_NAMES.GBP).toBe('British Pound');
      expect(CURRENCY_NAMES.TRY).toBe('Turkish Lira');
      expect(CURRENCY_NAMES.JPY).toBe('Japanese Yen');
    });

    it('should have correct currency symbols', () => {
      expect(CURRENCY_SYMBOLS.USD).toBe('$');
      expect(CURRENCY_SYMBOLS.EUR).toBe('€');
      expect(CURRENCY_SYMBOLS.GBP).toBe('£');
      expect(CURRENCY_SYMBOLS.TRY).toBe('₺');
      expect(CURRENCY_SYMBOLS.JPY).toBe('¥');
    });

    it('should have correct mock exchange rates relative to USD', () => {
      expect(EXCHANGE_RATES.USD).toBe(1);
      expect(EXCHANGE_RATES.EUR).toBe(0.92);
      expect(EXCHANGE_RATES.GBP).toBe(0.79);
      expect(EXCHANGE_RATES.TRY).toBe(32.5);
      expect(EXCHANGE_RATES.JPY).toBe(150);
    });

    it('should have LAST_UPDATED timestamp constant', () => {
      expect(LAST_UPDATED).toBeDefined();
      expect(typeof LAST_UPDATED).toBe('string');
      expect(LAST_UPDATED).toBe('2024-02-17T00:00:00Z');
    });

    it('should have mock rates disclaimer', () => {
      expect(MOCK_RATES_DISCLAIMER).toBeDefined();
      expect(typeof MOCK_RATES_DISCLAIMER).toBe('string');
      expect(MOCK_RATES_DISCLAIMER).toContain('mock');
      expect(MOCK_RATES_DISCLAIMER).toContain('demonstration');
    });
  });

  describe('isValidCurrencyCode', () => {
    it('should return true for valid currency codes', () => {
      expect(isValidCurrencyCode('USD')).toBe(true);
      expect(isValidCurrencyCode('EUR')).toBe(true);
      expect(isValidCurrencyCode('GBP')).toBe(true);
      expect(isValidCurrencyCode('TRY')).toBe(true);
      expect(isValidCurrencyCode('JPY')).toBe(true);
    });

    it('should return false for invalid currency codes', () => {
      expect(isValidCurrencyCode('CAD')).toBe(false);
      expect(isValidCurrencyCode('AUD')).toBe(false);
      expect(isValidCurrencyCode('')).toBe(false);
      expect(isValidCurrencyCode('usd')).toBe(false); // case sensitive
    });
  });

  describe('convertCurrency - USD to EUR', () => {
    it('should convert 1 USD to EUR correctly', () => {
      const result = convertCurrency(1, 'USD', 'EUR');
      expect(result).toBeCloseTo(0.92, 4);
    });

    it('should convert 100 USD to EUR correctly', () => {
      const result = convertCurrency(100, 'USD', 'EUR');
      expect(result).toBeCloseTo(92, 4);
    });

    it('should convert 0 USD to 0 EUR', () => {
      expect(convertCurrency(0, 'USD', 'EUR')).toBe(0);
    });
  });

  describe('convertCurrency - EUR to GBP', () => {
    it('should convert EUR to GBP correctly', () => {
      // 1 EUR = 1/0.92 USD = 1.08696 USD
      // 1.08696 USD * 0.79 = 0.8587 GBP
      const result = convertCurrency(1, 'EUR', 'GBP');
      expect(result).toBeCloseTo(0.8587, 2);
    });

    it('should convert 100 EUR to GBP correctly', () => {
      const result = convertCurrency(100, 'EUR', 'GBP');
      expect(result).toBeCloseTo(85.87, 2);
    });
  });

  describe('convertCurrency - TRY to USD', () => {
    it('should convert 1 TRY to USD correctly', () => {
      // 1 TRY = 1/32.5 USD = 0.03077 USD
      const result = convertCurrency(1, 'TRY', 'USD');
      expect(result).toBeCloseTo(0.03077, 4);
    });

    it('should convert 100 TRY to USD correctly', () => {
      const result = convertCurrency(100, 'TRY', 'USD');
      expect(result).toBeCloseTo(3.077, 3);
    });

    it('should convert 325 TRY to 10 USD', () => {
      const result = convertCurrency(325, 'TRY', 'USD');
      expect(result).toBeCloseTo(10, 4);
    });
  });

  describe('convertCurrency - JPY conversions', () => {
    it('should convert 1 USD to JPY correctly', () => {
      const result = convertCurrency(1, 'USD', 'JPY');
      expect(result).toBe(150);
    });

    it('should convert 100 USD to JPY correctly', () => {
      const result = convertCurrency(100, 'USD', 'JPY');
      expect(result).toBe(15000);
    });

    it('should convert JPY to USD correctly', () => {
      // 150 JPY = 1 USD
      const result = convertCurrency(150, 'JPY', 'USD');
      expect(result).toBeCloseTo(1, 4);
    });

    it('should convert JPY to EUR correctly', () => {
      // 150 JPY = 1 USD = 0.92 EUR
      const result = convertCurrency(150, 'JPY', 'EUR');
      expect(result).toBeCloseTo(0.92, 4);
    });
  });

  describe('convertCurrency - same currency', () => {
    it('should return same value when converting to same currency', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100);
      expect(convertCurrency(50, 'EUR', 'EUR')).toBe(50);
      expect(convertCurrency(1000, 'JPY', 'JPY')).toBe(1000);
    });
  });

  describe('convertCurrency - error handling', () => {
    it('should throw error for invalid value (NaN)', () => {
      expect(() => convertCurrency(NaN, 'USD', 'EUR')).toThrow(CurrencyConversionError);
    });

    it('should throw error for invalid value (Infinity)', () => {
      expect(() => convertCurrency(Infinity, 'USD', 'EUR')).toThrow(CurrencyConversionError);
    });

    it('should throw error for invalid from currency', () => {
      expect(() => convertCurrency(100, 'CAD' as CurrencyCode, 'USD')).toThrow(CurrencyConversionError);
    });

    it('should throw error for invalid to currency', () => {
      expect(() => convertCurrency(100, 'USD', 'CAD' as CurrencyCode)).toThrow(CurrencyConversionError);
    });
  });

  describe('convertCurrencyRounded', () => {
    it('should round to 2 decimal places by default', () => {
      const result = convertCurrencyRounded(1, 'EUR', 'GBP');
      expect(result).toBe(0.86);
    });

    it('should round to specified decimal places', () => {
      const result = convertCurrencyRounded(1, 'EUR', 'GBP', 4);
      expect(result).toBe(0.8587);
    });
  });

  describe('toUSD', () => {
    it('should convert EUR to USD correctly', () => {
      const result = toUSD(0.92, 'EUR');
      expect(result).toBeCloseTo(1, 4);
    });

    it('should convert TRY to USD correctly', () => {
      const result = toUSD(32.5, 'TRY');
      expect(result).toBeCloseTo(1, 4);
    });
  });

  describe('fromUSD', () => {
    it('should convert USD to EUR correctly', () => {
      const result = fromUSD(1, 'EUR');
      expect(result).toBe(0.92);
    });

    it('should convert USD to JPY correctly', () => {
      const result = fromUSD(1, 'JPY');
      expect(result).toBe(150);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD with $ symbol', () => {
      expect(formatCurrency(100.50, 'USD')).toBe('$100.50');
    });

    it('should format EUR with € symbol', () => {
      expect(formatCurrency(100.50, 'EUR')).toBe('€100.50');
    });

    it('should format GBP with £ symbol', () => {
      expect(formatCurrency(100.50, 'GBP')).toBe('£100.50');
    });

    it('should format TRY with ₺ symbol', () => {
      expect(formatCurrency(100.50, 'TRY')).toBe('₺100.50');
    });

    it('should format JPY with ¥ symbol', () => {
      expect(formatCurrency(100.50, 'JPY')).toBe('¥100.50');
    });

    it('should respect custom decimal places', () => {
      expect(formatCurrency(100.555, 'USD', 1)).toBe('$100.6');
      expect(formatCurrency(100, 'USD', 0)).toBe('$100');
    });
  });
});
