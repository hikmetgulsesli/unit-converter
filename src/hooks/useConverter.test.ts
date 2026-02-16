import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useConverter,
  ConverterError,
  AnyUnit,
} from './useConverter.js';
import { UnitCategory, UNITS } from '../types/index.js';

describe('useConverter', () => {
  describe('Hook initialization', () => {
    it('should initialize without errors', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current).toBeDefined();
    });

    it('should return all required functions', () => {
      const { result } = renderHook(() => useConverter());
      expect(typeof result.current.convert).toBe('function');
      expect(typeof result.current.convertSafe).toBe('function');
      expect(typeof result.current.getUnitsByCategory).toBe('function');
      expect(typeof result.current.getCategories).toBe('function');
      expect(typeof result.current.isValidUnit).toBe('function');
    });

    it('should return availableUnits array', () => {
      const { result } = renderHook(() => useConverter());
      expect(Array.isArray(result.current.availableUnits)).toBe(true);
      expect(result.current.availableUnits.length).toBe(21); // 8 length + 5 weight + 3 temp + 5 currency
    });
  });

  describe('availableUnits', () => {
    it('should return all 21 units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.availableUnits).toEqual(UNITS);
    });

    it('should include all length units', () => {
      const { result } = renderHook(() => useConverter());
      const lengthUnits = result.current.availableUnits.filter(
        (u) => u.category === UnitCategory.LENGTH
      );
      expect(lengthUnits.length).toBe(8);
      expect(lengthUnits.map((u) => u.id)).toContain('km');
      expect(lengthUnits.map((u) => u.id)).toContain('m');
      expect(lengthUnits.map((u) => u.id)).toContain('cm');
      expect(lengthUnits.map((u) => u.id)).toContain('mm');
      expect(lengthUnits.map((u) => u.id)).toContain('mile');
      expect(lengthUnits.map((u) => u.id)).toContain('yard');
      expect(lengthUnits.map((u) => u.id)).toContain('feet');
      expect(lengthUnits.map((u) => u.id)).toContain('inch');
    });

    it('should include all weight units', () => {
      const { result } = renderHook(() => useConverter());
      const weightUnits = result.current.availableUnits.filter(
        (u) => u.category === UnitCategory.WEIGHT
      );
      expect(weightUnits.length).toBe(5);
      expect(weightUnits.map((u) => u.id)).toContain('kg');
      expect(weightUnits.map((u) => u.id)).toContain('g');
      expect(weightUnits.map((u) => u.id)).toContain('mg');
      expect(weightUnits.map((u) => u.id)).toContain('lb');
      expect(weightUnits.map((u) => u.id)).toContain('oz');
    });

    it('should include all temperature units', () => {
      const { result } = renderHook(() => useConverter());
      const tempUnits = result.current.availableUnits.filter(
        (u) => u.category === UnitCategory.TEMPERATURE
      );
      expect(tempUnits.length).toBe(3);
      expect(tempUnits.map((u) => u.id)).toContain('C');
      expect(tempUnits.map((u) => u.id)).toContain('F');
      expect(tempUnits.map((u) => u.id)).toContain('K');
    });

    it('should include all currency units', () => {
      const { result } = renderHook(() => useConverter());
      const currencyUnits = result.current.availableUnits.filter(
        (u) => u.category === UnitCategory.CURRENCY
      );
      expect(currencyUnits.length).toBe(5);
      expect(currencyUnits.map((u) => u.id)).toContain('USD');
      expect(currencyUnits.map((u) => u.id)).toContain('EUR');
      expect(currencyUnits.map((u) => u.id)).toContain('GBP');
      expect(currencyUnits.map((u) => u.id)).toContain('TRY');
      expect(currencyUnits.map((u) => u.id)).toContain('JPY');
    });
  });

  describe('getUnitsByCategory', () => {
    it('should return length units for LENGTH category', () => {
      const { result } = renderHook(() => useConverter());
      const units = result.current.getUnitsByCategory(UnitCategory.LENGTH);
      expect(units.length).toBe(8);
      expect(units.every((u) => u.category === UnitCategory.LENGTH)).toBe(true);
    });

    it('should return weight units for WEIGHT category', () => {
      const { result } = renderHook(() => useConverter());
      const units = result.current.getUnitsByCategory(UnitCategory.WEIGHT);
      expect(units.length).toBe(5);
      expect(units.every((u) => u.category === UnitCategory.WEIGHT)).toBe(true);
    });

    it('should return temperature units for TEMPERATURE category', () => {
      const { result } = renderHook(() => useConverter());
      const units = result.current.getUnitsByCategory(UnitCategory.TEMPERATURE);
      expect(units.length).toBe(3);
      expect(units.every((u) => u.category === UnitCategory.TEMPERATURE)).toBe(true);
    });

    it('should return currency units for CURRENCY category', () => {
      const { result } = renderHook(() => useConverter());
      const units = result.current.getUnitsByCategory(UnitCategory.CURRENCY);
      expect(units.length).toBe(5);
      expect(units.every((u) => u.category === UnitCategory.CURRENCY)).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return all 4 categories', () => {
      const { result } = renderHook(() => useConverter());
      const categories = result.current.getCategories();
      expect(categories.length).toBe(4);
      expect(categories).toContain(UnitCategory.LENGTH);
      expect(categories).toContain(UnitCategory.WEIGHT);
      expect(categories).toContain(UnitCategory.TEMPERATURE);
      expect(categories).toContain(UnitCategory.CURRENCY);
    });
  });

  describe('isValidUnit', () => {
    it('should return true for valid length units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.isValidUnit('km', UnitCategory.LENGTH)).toBe(true);
      expect(result.current.isValidUnit('m', UnitCategory.LENGTH)).toBe(true);
      expect(result.current.isValidUnit('cm', UnitCategory.LENGTH)).toBe(true);
      expect(result.current.isValidUnit('mile', UnitCategory.LENGTH)).toBe(true);
    });

    it('should return false for invalid length units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.isValidUnit('kg', UnitCategory.LENGTH)).toBe(false);
      expect(result.current.isValidUnit('C', UnitCategory.LENGTH)).toBe(false);
      expect(result.current.isValidUnit('USD', UnitCategory.LENGTH)).toBe(false);
      expect(result.current.isValidUnit('invalid', UnitCategory.LENGTH)).toBe(false);
    });

    it('should return true for valid weight units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.isValidUnit('kg', UnitCategory.WEIGHT)).toBe(true);
      expect(result.current.isValidUnit('g', UnitCategory.WEIGHT)).toBe(true);
      expect(result.current.isValidUnit('lb', UnitCategory.WEIGHT)).toBe(true);
    });

    it('should return true for valid temperature units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.isValidUnit('C', UnitCategory.TEMPERATURE)).toBe(true);
      expect(result.current.isValidUnit('F', UnitCategory.TEMPERATURE)).toBe(true);
      expect(result.current.isValidUnit('K', UnitCategory.TEMPERATURE)).toBe(true);
    });

    it('should return true for valid currency units', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.isValidUnit('USD', UnitCategory.CURRENCY)).toBe(true);
      expect(result.current.isValidUnit('EUR', UnitCategory.CURRENCY)).toBe(true);
      expect(result.current.isValidUnit('JPY', UnitCategory.CURRENCY)).toBe(true);
    });
  });

  describe('convert - Length conversions', () => {
    it('should convert km to m', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(1, 'km', 'm', UnitCategory.LENGTH)).toBe(1000);
    });

    it('should convert m to cm', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(1, 'm', 'cm', UnitCategory.LENGTH)).toBe(100);
    });

    it('should convert mile to km', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(1, 'mile', 'km', UnitCategory.LENGTH);
      expect(converted).toBeCloseTo(1.60934, 4);
    });

    it('should convert inch to cm', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(1, 'inch', 'cm', UnitCategory.LENGTH);
      expect(converted).toBeCloseTo(2.54, 2);
    });

    it('should return same value for same unit conversion', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(100, 'm', 'm', UnitCategory.LENGTH)).toBe(100);
    });
  });

  describe('convert - Weight conversions', () => {
    it('should convert kg to g', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(1, 'kg', 'g', UnitCategory.WEIGHT)).toBe(1000);
    });

    it('should convert g to mg', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(1, 'g', 'mg', UnitCategory.WEIGHT)).toBe(1000);
    });

    it('should convert lb to kg', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(1, 'lb', 'kg', UnitCategory.WEIGHT);
      expect(converted).toBeCloseTo(0.45359, 4);
    });

    it('should convert oz to g', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(1, 'oz', 'g', UnitCategory.WEIGHT);
      expect(converted).toBeCloseTo(28.3495, 3);
    });
  });

  describe('convert - Temperature conversions', () => {
    it('should convert Celsius to Fahrenheit', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(0, 'C', 'F', UnitCategory.TEMPERATURE)).toBe(32);
      expect(result.current.convert(100, 'C', 'F', UnitCategory.TEMPERATURE)).toBe(212);
    });

    it('should convert Fahrenheit to Celsius', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(32, 'F', 'C', UnitCategory.TEMPERATURE)).toBe(0);
      expect(result.current.convert(212, 'F', 'C', UnitCategory.TEMPERATURE)).toBe(100);
    });

    it('should convert Celsius to Kelvin', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(0, 'C', 'K', UnitCategory.TEMPERATURE)).toBe(273.15);
      expect(result.current.convert(-273.15, 'C', 'K', UnitCategory.TEMPERATURE)).toBe(0);
    });

    it('should convert Kelvin to Celsius', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(273.15, 'K', 'C', UnitCategory.TEMPERATURE)).toBe(0);
      expect(result.current.convert(0, 'K', 'C', UnitCategory.TEMPERATURE)).toBe(-273.15);
    });

    it('should convert Fahrenheit to Kelvin', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(32, 'F', 'K', UnitCategory.TEMPERATURE);
      expect(converted).toBeCloseTo(273.15, 2);
    });

    it('should handle -40° intersection', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(-40, 'C', 'F', UnitCategory.TEMPERATURE)).toBe(-40);
      expect(result.current.convert(-40, 'F', 'C', UnitCategory.TEMPERATURE)).toBe(-40);
    });
  });

  describe('convert - Currency conversions', () => {
    it('should convert USD to EUR', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(100, 'USD', 'EUR', UnitCategory.CURRENCY);
      expect(converted).toBeCloseTo(92, 0); // 100 * 0.92
    });

    it('should convert EUR to GBP', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(100, 'EUR', 'GBP', UnitCategory.CURRENCY);
      // EUR -> USD -> GBP: 100 / 0.92 * 0.79
      expect(converted).toBeCloseTo(85.87, 1);
    });

    it('should convert TRY to USD', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(100, 'TRY', 'USD', UnitCategory.CURRENCY);
      // 100 / 32.5
      expect(converted).toBeCloseTo(3.08, 1);
    });

    it('should convert JPY to USD', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(1000, 'JPY', 'USD', UnitCategory.CURRENCY);
      // 1000 / 150
      expect(converted).toBeCloseTo(6.67, 1);
    });

    it('should return same value for same currency conversion', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(100, 'USD', 'USD', UnitCategory.CURRENCY)).toBe(100);
    });
  });

  describe('convert - Error handling', () => {
    it('should return null for invalid value (NaN)', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(NaN, 'km', 'm', UnitCategory.LENGTH)).toBeNull();
    });

    it('should return null for invalid value (Infinity)', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(Infinity, 'km', 'm', UnitCategory.LENGTH)).toBeNull();
    });

    it('should return null for unit in wrong category', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(100, 'kg', 'm', UnitCategory.LENGTH)).toBeNull();
      expect(result.current.convert(100, 'km', 'kg', UnitCategory.LENGTH)).toBeNull();
    });

    it('should return null for invalid unit', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(100, 'invalid' as AnyUnit, 'm', UnitCategory.LENGTH)).toBeNull();
    });

    it('should handle temperature below absolute zero gracefully', () => {
      const { result } = renderHook(() => useConverter());
      // Negative Kelvin should return null in convert() (graceful degradation)
      expect(result.current.convert(-1, 'K', 'C', UnitCategory.TEMPERATURE)).toBeNull();
    });
  });

  describe('convertSafe - Success cases', () => {
    it('should return success result for valid conversion', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(1, 'km', 'm', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(true);
      if (outcome.success) {
        expect(outcome.result).toBe(1000);
      }
    });

    it('should return success for temperature conversion', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(0, 'C', 'F', UnitCategory.TEMPERATURE);
      
      expect(outcome.success).toBe(true);
      if (outcome.success) {
        expect(outcome.result).toBe(32);
      }
    });

    it('should return success for currency conversion', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(100, 'USD', 'EUR', UnitCategory.CURRENCY);
      
      expect(outcome.success).toBe(true);
      if (outcome.success) {
        expect(outcome.result).toBeCloseTo(92, 0);
      }
    });
  });

  describe('convertSafe - Error cases', () => {
    it('should return error for NaN value', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(NaN, 'km', 'm', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.code).toBe('INVALID_VALUE');
        expect(outcome.error.message).toContain('finite number');
      }
    });

    it('should return error for Infinity value', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(Infinity, 'km', 'm', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.code).toBe('INVALID_VALUE');
      }
    });

    it('should return error for invalid from unit', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(100, 'kg', 'm', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.code).toBe('INVALID_FROM_UNIT');
        expect(outcome.error.message).toContain('kg');
      }
    });

    it('should return error for invalid to unit', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(100, 'km', 'kg', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.code).toBe('INVALID_TO_UNIT');
        expect(outcome.error.message).toContain('kg');
      }
    });

    it('should return error for temperature below absolute zero', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(-1, 'K', 'C', UnitCategory.TEMPERATURE);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.code).toBe('BELOW_ABSOLUTE_ZERO');
      }
    });

    it('should include value, from, and to in error', () => {
      const { result } = renderHook(() => useConverter());
      const outcome = result.current.convertSafe(NaN, 'km', 'm', UnitCategory.LENGTH);
      
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error.value).toBe(NaN);
        expect(outcome.error.from).toBe('km');
        expect(outcome.error.to).toBe('m');
      }
    });
  });

  describe('Memoization', () => {
    it('should return same availableUnits reference on re-renders', () => {
      const { result, rerender } = renderHook(() => useConverter());
      const firstRef = result.current.availableUnits;
      rerender();
      const secondRef = result.current.availableUnits;
      expect(firstRef).toBe(secondRef);
    });

    it('should return same function references on re-renders', () => {
      const { result, rerender } = renderHook(() => useConverter());
      
      const firstConvert = result.current.convert;
      const firstConvertSafe = result.current.convertSafe;
      const firstGetUnits = result.current.getUnitsByCategory;
      const firstGetCategories = result.current.getCategories;
      const firstIsValidUnit = result.current.isValidUnit;
      
      rerender();
      
      expect(result.current.convert).toBe(firstConvert);
      expect(result.current.convertSafe).toBe(firstConvertSafe);
      expect(result.current.getUnitsByCategory).toBe(firstGetUnits);
      expect(result.current.getCategories).toBe(firstGetCategories);
      expect(result.current.isValidUnit).toBe(firstIsValidUnit);
    });

    it('should return consistent results for multiple calls with same inputs', () => {
      const { result } = renderHook(() => useConverter());
      
      const result1 = result.current.convert(100, 'km', 'm', UnitCategory.LENGTH);
      const result2 = result.current.convert(100, 'km', 'm', UnitCategory.LENGTH);
      const result3 = result.current.convert(100, 'km', 'm', UnitCategory.LENGTH);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(100000);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero values', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(0, 'km', 'm', UnitCategory.LENGTH)).toBe(0);
      expect(result.current.convert(0, 'kg', 'g', UnitCategory.WEIGHT)).toBe(0);
      expect(result.current.convert(0, 'C', 'F', UnitCategory.TEMPERATURE)).toBe(32);
      expect(result.current.convert(0, 'USD', 'EUR', UnitCategory.CURRENCY)).toBe(0);
    });

    it('should handle negative values (except temperature)', () => {
      const { result } = renderHook(() => useConverter());
      expect(result.current.convert(-100, 'km', 'm', UnitCategory.LENGTH)).toBe(-100000);
      expect(result.current.convert(-5, 'kg', 'g', UnitCategory.WEIGHT)).toBe(-5000);
      expect(result.current.convert(-100, 'USD', 'EUR', UnitCategory.CURRENCY)).toBeCloseTo(-92, 0);
    });

    it('should handle very large numbers', () => {
      const { result } = renderHook(() => useConverter());
      const largeValue = 1e10;
      const converted = result.current.convert(largeValue, 'km', 'm', UnitCategory.LENGTH);
      expect(converted).toBe(largeValue * 1000);
    });

    it('should handle very small numbers', () => {
      const { result } = renderHook(() => useConverter());
      const smallValue = 1e-10;
      const converted = result.current.convert(smallValue, 'm', 'km', UnitCategory.LENGTH);
      expect(converted).toBe(smallValue / 1000);
    });

    it('should handle decimal precision', () => {
      const { result } = renderHook(() => useConverter());
      const converted = result.current.convert(0.001, 'km', 'm', UnitCategory.LENGTH);
      expect(converted).toBe(1);
    });
  });
});

describe('ConverterError', () => {
  it('should create error with all properties', () => {
    const error = new ConverterError(
      'Test error',
      'TEST_CODE',
      UnitCategory.LENGTH,
      100,
      'km',
      'm'
    );
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.category).toBe(UnitCategory.LENGTH);
    expect(error.value).toBe(100);
    expect(error.from).toBe('km');
    expect(error.to).toBe('m');
    expect(error.name).toBe('ConverterError');
  });

  it('should be an instance of Error', () => {
    const error = new ConverterError('Test', 'CODE');
    expect(error).toBeInstanceOf(Error);
  });
});
