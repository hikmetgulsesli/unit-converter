/**
 * Unit tests for weight conversion utilities
 */
import { describe, it, expect } from 'vitest';
import {
  convertWeight,
  convertWeightRounded,
  toGrams,
  fromGrams,
  isValidWeightUnit,
  WEIGHT_UNITS,
  WEIGHT_TO_GRAMS,
  WeightConversionError,
} from './weight';

describe('Weight Conversion Utilities', () => {
  describe('isValidWeightUnit', () => {
    it('returns true for all valid weight units', () => {
      for (const unit of WEIGHT_UNITS) {
        expect(isValidWeightUnit(unit)).toBe(true);
      }
    });

    it('returns false for invalid units', () => {
      expect(isValidWeightUnit('invalid')).toBe(false);
      expect(isValidWeightUnit('')).toBe(false);
      expect(isValidWeightUnit('kilogram')).toBe(false);
      expect(isValidWeightUnit('pound')).toBe(false);
    });
  });

  describe('convertWeight - Basic conversions', () => {
    it('converts kg to g correctly', () => {
      expect(convertWeight(1, 'kg', 'g')).toBe(1000);
      expect(convertWeight(2.5, 'kg', 'g')).toBe(2500);
      expect(convertWeight(0.5, 'kg', 'g')).toBe(500);
    });

    it('converts g to mg correctly', () => {
      expect(convertWeight(1, 'g', 'mg')).toBe(1000);
      expect(convertWeight(2.5, 'g', 'mg')).toBe(2500);
      expect(convertWeight(0.5, 'g', 'mg')).toBe(500);
    });

    it('converts lb to kg correctly', () => {
      // 1 lb = 453.59237 g = 0.45359237 kg
      expect(convertWeight(1, 'lb', 'kg')).toBe(0.45359237);
      expect(convertWeight(2, 'lb', 'kg')).toBe(0.90718474);
    });

    it('converts oz to g correctly', () => {
      // 1 oz = 28.34952 g
      expect(convertWeight(1, 'oz', 'g')).toBe(28.34952);
      expect(convertWeight(2, 'oz', 'g')).toBe(56.69904);
    });
  });

  describe('convertWeight - Reverse conversions', () => {
    it('converts g to kg correctly', () => {
      expect(convertWeight(1000, 'g', 'kg')).toBe(1);
      expect(convertWeight(2500, 'g', 'kg')).toBe(2.5);
    });

    it('converts mg to g correctly', () => {
      expect(convertWeight(1000, 'mg', 'g')).toBe(1);
      expect(convertWeight(500, 'mg', 'g')).toBe(0.5);
    });

    it('converts kg to lb correctly', () => {
      // 1 kg = 1000 / 453.59237 lb ≈ 2.20462 lb
      expect(convertWeight(0.45359237, 'kg', 'lb')).toBeCloseTo(1, 10);
      expect(convertWeight(1, 'kg', 'lb')).toBeCloseTo(2.20462, 5);
    });

    it('converts g to oz correctly', () => {
      // 28.34952 g = 1 oz
      expect(convertWeight(28.34952, 'g', 'oz')).toBeCloseTo(1, 10);
      expect(convertWeight(56.69904, 'g', 'oz')).toBeCloseTo(2, 10);
    });
  });

  describe('convertWeight - Edge cases', () => {
    it('handles zero values correctly', () => {
      for (const from of WEIGHT_UNITS) {
        for (const to of WEIGHT_UNITS) {
          expect(convertWeight(0, from, to)).toBe(0);
        }
      }
    });

    it('handles negative values correctly', () => {
      expect(convertWeight(-1, 'kg', 'g')).toBe(-1000);
      expect(convertWeight(-5, 'g', 'mg')).toBe(-5000);
      expect(convertWeight(-10, 'lb', 'g')).toBeCloseTo(-4535.9237, 10);
    });

    it('handles very large numbers correctly', () => {
      const largeValue = 1e12; // 1 trillion kg
      const result = convertWeight(largeValue, 'kg', 'g');
      expect(result).toBe(1e15);
    });

    it('handles very small numbers correctly', () => {
      const smallValue = 1e-10; // Very small mg
      const result = convertWeight(smallValue, 'mg', 'g');
      expect(result).toBeCloseTo(1e-13, 15);
    });

    it('returns same value when converting to same unit', () => {
      for (const unit of WEIGHT_UNITS) {
        expect(convertWeight(100, unit, unit)).toBe(100);
        expect(convertWeight(0, unit, unit)).toBe(0);
        expect(convertWeight(-50, unit, unit)).toBe(-50);
      }
    });
  });

  describe('convertWeight - Error handling', () => {
    it('throws error for invalid value types', () => {
      expect(() => convertWeight(NaN, 'g', 'kg')).toThrow(WeightConversionError);
      expect(() => convertWeight(Infinity, 'g', 'kg')).toThrow(WeightConversionError);
      expect(() => convertWeight(-Infinity, 'g', 'kg')).toThrow(WeightConversionError);
    });

    it('throws error for invalid from unit', () => {
      expect(() => convertWeight(100, 'invalid' as any, 'g')).toThrow(WeightConversionError);
    });

    it('throws error for invalid to unit', () => {
      expect(() => convertWeight(100, 'g', 'invalid' as any)).toThrow(WeightConversionError);
    });
  });

  describe('convertWeightRounded', () => {
    it('rounds to specified decimal places', () => {
      const result = convertWeightRounded(1, 'lb', 'kg', 2);
      expect(result).toBe(0.45);
    });

    it('uses default 6 decimal places', () => {
      const result = convertWeightRounded(1, 'lb', 'kg');
      expect(result).toBe(0.453592);
    });
  });

  describe('toGrams', () => {
    it('converts various units to grams', () => {
      expect(toGrams(1, 'kg')).toBe(1000);
      expect(toGrams(1, 'g')).toBe(1);
      expect(toGrams(1000, 'mg')).toBe(1);
      expect(toGrams(1, 'lb')).toBe(453.59237);
      expect(toGrams(1, 'oz')).toBe(28.34952);
    });
  });

  describe('fromGrams', () => {
    it('converts grams to various units', () => {
      expect(fromGrams(1000, 'kg')).toBe(1);
      expect(fromGrams(1, 'g')).toBe(1);
      expect(fromGrams(1, 'mg')).toBe(1000);
      expect(fromGrams(453.59237, 'lb')).toBe(1);
      expect(fromGrams(28.34952, 'oz')).toBe(1);
    });
  });

  describe('Conversion factors accuracy', () => {
    it('has correct conversion factors to grams', () => {
      expect(WEIGHT_TO_GRAMS.kg).toBe(1000);
      expect(WEIGHT_TO_GRAMS.g).toBe(1);
      expect(WEIGHT_TO_GRAMS.mg).toBe(0.001);
      expect(WEIGHT_TO_GRAMS.lb).toBe(453.59237);
      expect(WEIGHT_TO_GRAMS.oz).toBe(28.34952);
    });
  });
});
