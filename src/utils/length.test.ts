/**
 * Unit tests for length conversion utilities
 */
import { describe, it, expect } from 'vitest';
import {
  convertLength,
  convertLengthRounded,
  toMeters,
  fromMeters,
  isValidLengthUnit,
  LENGTH_UNITS,
  LENGTH_TO_METERS,
  LengthConversionError,
} from './length';

describe('Length Conversion Utilities', () => {
  describe('isValidLengthUnit', () => {
    it('returns true for all valid length units', () => {
      for (const unit of LENGTH_UNITS) {
        expect(isValidLengthUnit(unit)).toBe(true);
      }
    });

    it('returns false for invalid units', () => {
      expect(isValidLengthUnit('invalid')).toBe(false);
      expect(isValidLengthUnit('')).toBe(false);
      expect(isValidLengthUnit('kilometer')).toBe(false);
    });
  });

  describe('convertLength - Basic conversions', () => {
    it('converts km to m correctly', () => {
      expect(convertLength(1, 'km', 'm')).toBe(1000);
      expect(convertLength(2.5, 'km', 'm')).toBe(2500);
      expect(convertLength(0.5, 'km', 'm')).toBe(500);
    });

    it('converts m to cm correctly', () => {
      expect(convertLength(1, 'm', 'cm')).toBe(100);
      expect(convertLength(2.5, 'm', 'cm')).toBe(250);
      expect(convertLength(0.5, 'm', 'cm')).toBe(50);
    });

    it('converts mile to km correctly', () => {
      // 1 mile = 1609.344 meters = 1.609344 km
      expect(convertLength(1, 'mile', 'km')).toBe(1.609344);
      expect(convertLength(5, 'mile', 'km')).toBe(8.04672);
    });

    it('converts inch to cm correctly', () => {
      // 1 inch = 0.0254 meters = 2.54 cm
      expect(convertLength(1, 'inch', 'cm')).toBe(2.54);
      expect(convertLength(12, 'inch', 'cm')).toBeCloseTo(30.48, 10);
    });
  });

  describe('convertLength - Reverse conversions', () => {
    it('converts m to km correctly', () => {
      expect(convertLength(1000, 'm', 'km')).toBe(1);
      expect(convertLength(2500, 'm', 'km')).toBe(2.5);
    });

    it('converts cm to m correctly', () => {
      expect(convertLength(100, 'cm', 'm')).toBe(1);
      expect(convertLength(50, 'cm', 'm')).toBe(0.5);
    });

    it('converts km to mile correctly', () => {
      // 1 km = 1000 / 1609.344 miles
      expect(convertLength(1.609344, 'km', 'mile')).toBe(1);
    });

    it('converts cm to inch correctly', () => {
      // 2.54 cm = 1 inch
      expect(convertLength(2.54, 'cm', 'inch')).toBeCloseTo(1, 15);
    });
  });

  describe('convertLength - Edge cases', () => {
    it('handles zero values correctly', () => {
      for (const from of LENGTH_UNITS) {
        for (const to of LENGTH_UNITS) {
          expect(convertLength(0, from, to)).toBe(0);
        }
      }
    });

    it('handles negative values correctly', () => {
      expect(convertLength(-1, 'km', 'm')).toBe(-1000);
      expect(convertLength(-5, 'm', 'cm')).toBe(-500);
      expect(convertLength(-10, 'inch', 'cm')).toBe(-25.4);
    });

    it('handles very large numbers correctly', () => {
      const largeValue = 1e15; // 1 quadrillion km
      const result = convertLength(largeValue, 'km', 'm');
      expect(result).toBe(1e18);
    });

    it('handles very small numbers correctly', () => {
      const smallValue = 1e-10; // Very small km
      const result = convertLength(smallValue, 'km', 'm');
      expect(result).toBeCloseTo(1e-7, 15);
    });

    it('returns same value when converting to same unit', () => {
      for (const unit of LENGTH_UNITS) {
        expect(convertLength(100, unit, unit)).toBe(100);
        expect(convertLength(0, unit, unit)).toBe(0);
        expect(convertLength(-50, unit, unit)).toBe(-50);
      }
    });
  });

  describe('convertLength - Error handling', () => {
    it('throws error for invalid value types', () => {
      expect(() => convertLength(NaN, 'm', 'km')).toThrow(LengthConversionError);
      expect(() => convertLength(Infinity, 'm', 'km')).toThrow(LengthConversionError);
      expect(() => convertLength(-Infinity, 'm', 'km')).toThrow(LengthConversionError);
    });

    it('throws error for invalid from unit', () => {
      expect(() => convertLength(100, 'invalid' as any, 'm')).toThrow(LengthConversionError);
    });

    it('throws error for invalid to unit', () => {
      expect(() => convertLength(100, 'm', 'invalid' as any)).toThrow(LengthConversionError);
    });
  });

  describe('convertLengthRounded', () => {
    it('rounds to specified decimal places', () => {
      const result = convertLengthRounded(1, 'mile', 'km', 2);
      expect(result).toBe(1.61);
    });

    it('uses default 6 decimal places', () => {
      const result = convertLengthRounded(1, 'mile', 'km');
      expect(result).toBe(1.609344);
    });
  });

  describe('toMeters', () => {
    it('converts various units to meters', () => {
      expect(toMeters(1, 'km')).toBe(1000);
      expect(toMeters(1, 'm')).toBe(1);
      expect(toMeters(100, 'cm')).toBe(1);
      expect(toMeters(1, 'mile')).toBe(1609.344);
    });
  });

  describe('fromMeters', () => {
    it('converts meters to various units', () => {
      expect(fromMeters(1000, 'km')).toBe(1);
      expect(fromMeters(1, 'm')).toBe(1);
      expect(fromMeters(1, 'cm')).toBe(100);
      expect(fromMeters(1609.344, 'mile')).toBe(1);
    });
  });

  describe('Conversion factors accuracy', () => {
    it('has correct conversion factors to meters', () => {
      expect(LENGTH_TO_METERS.km).toBe(1000);
      expect(LENGTH_TO_METERS.m).toBe(1);
      expect(LENGTH_TO_METERS.cm).toBe(0.01);
      expect(LENGTH_TO_METERS.mm).toBe(0.001);
      expect(LENGTH_TO_METERS.mile).toBe(1609.344);
      expect(LENGTH_TO_METERS.yard).toBe(0.9144);
      expect(LENGTH_TO_METERS.feet).toBe(0.3048);
      expect(LENGTH_TO_METERS.inch).toBe(0.0254);
    });
  });
});
