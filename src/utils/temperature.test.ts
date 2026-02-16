import { describe, it, expect } from 'vitest';
import {
  convertTemperature,
  convertTemperatureRounded,
  celsiusToFahrenheit,
  celsiusToKelvin,
  fahrenheitToCelsius,
  fahrenheitToKelvin,
  kelvinToCelsius,
  kelvinToFahrenheit,
  toCelsius,
  fromCelsius,
  isValidTempUnit,
  isBelowAbsoluteZero,
  ABSOLUTE_ZERO,
  TEMP_UNITS,
  TEMP_UNIT_NAMES,
  TEMP_UNIT_SYMBOLS,
  TemperatureConversionError,
} from './temperature';

describe('Temperature Conversion Utilities', () => {
  describe('Unit constants', () => {
    it('should have all 3 temperature units', () => {
      expect(TEMP_UNITS).toHaveLength(3);
      expect(TEMP_UNITS).toContain('C');
      expect(TEMP_UNITS).toContain('F');
      expect(TEMP_UNITS).toContain('K');
    });

    it('should have correct unit names', () => {
      expect(TEMP_UNIT_NAMES.C).toBe('Celsius');
      expect(TEMP_UNIT_NAMES.F).toBe('Fahrenheit');
      expect(TEMP_UNIT_NAMES.K).toBe('Kelvin');
    });

    it('should have correct unit symbols', () => {
      expect(TEMP_UNIT_SYMBOLS.C).toBe('°C');
      expect(TEMP_UNIT_SYMBOLS.F).toBe('°F');
      expect(TEMP_UNIT_SYMBOLS.K).toBe('K');
    });

    it('should have correct absolute zero values', () => {
      expect(ABSOLUTE_ZERO.C).toBe(-273.15);
      expect(ABSOLUTE_ZERO.F).toBe(-459.67);
      expect(ABSOLUTE_ZERO.K).toBe(0);
    });
  });

  describe('isValidTempUnit', () => {
    it('should return true for valid units', () => {
      expect(isValidTempUnit('C')).toBe(true);
      expect(isValidTempUnit('F')).toBe(true);
      expect(isValidTempUnit('K')).toBe(true);
    });

    it('should return false for invalid units', () => {
      expect(isValidTempUnit('c')).toBe(false);
      expect(isValidTempUnit('f')).toBe(false);
      expect(isValidTempUnit('k')).toBe(false);
      expect(isValidTempUnit('celsius')).toBe(false);
      expect(isValidTempUnit('')).toBe(false);
      expect(isValidTempUnit('X')).toBe(false);
    });
  });

  describe('isBelowAbsoluteZero', () => {
    it('should return true for values below absolute zero', () => {
      expect(isBelowAbsoluteZero(-300, 'C')).toBe(true);
      expect(isBelowAbsoluteZero(-500, 'F')).toBe(true);
      expect(isBelowAbsoluteZero(-1, 'K')).toBe(true);
    });

    it('should return false for values at or above absolute zero', () => {
      expect(isBelowAbsoluteZero(-273.15, 'C')).toBe(false);
      expect(isBelowAbsoluteZero(-273, 'C')).toBe(false);
      expect(isBelowAbsoluteZero(0, 'C')).toBe(false);
      expect(isBelowAbsoluteZero(-459.67, 'F')).toBe(false);
      expect(isBelowAbsoluteZero(-400, 'F')).toBe(false);
      expect(isBelowAbsoluteZero(0, 'K')).toBe(false);
      expect(isBelowAbsoluteZero(273.15, 'K')).toBe(false);
    });
  });

  describe('Celsius to Fahrenheit conversions', () => {
    it('should convert 0°C to 32°F (freezing point of water)', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(convertTemperature(0, 'C', 'F')).toBe(32);
    });

    it('should convert 100°C to 212°F (boiling point of water)', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
      expect(convertTemperature(100, 'C', 'F')).toBe(212);
    });

    it('should convert -40°C to -40°F (intersection point)', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40);
      expect(convertTemperature(-40, 'C', 'F')).toBe(-40);
    });

    it('should convert 37°C to 98.6°F (body temperature)', () => {
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 1);
      expect(convertTemperature(37, 'C', 'F')).toBeCloseTo(98.6, 1);
    });

    it('should convert room temperature (20°C) correctly', () => {
      expect(celsiusToFahrenheit(20)).toBe(68);
      expect(convertTemperature(20, 'C', 'F')).toBe(68);
    });
  });

  describe('Fahrenheit to Celsius conversions', () => {
    it('should convert 32°F to 0°C (freezing point of water)', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(convertTemperature(32, 'F', 'C')).toBe(0);
    });

    it('should convert 212°F to 100°C (boiling point of water)', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
      expect(convertTemperature(212, 'F', 'C')).toBe(100);
    });

    it('should convert -40°F to -40°C (intersection point)', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
      expect(convertTemperature(-40, 'F', 'C')).toBe(-40);
    });

    it('should convert 98.6°F to 37°C (body temperature)', () => {
      expect(fahrenheitToCelsius(98.6)).toBeCloseTo(37, 1);
      expect(convertTemperature(98.6, 'F', 'C')).toBeCloseTo(37, 1);
    });
  });

  describe('Celsius to Kelvin conversions', () => {
    it('should convert 0°C to 273.15K', () => {
      expect(celsiusToKelvin(0)).toBe(273.15);
      expect(convertTemperature(0, 'C', 'K')).toBe(273.15);
    });

    it('should convert 100°C to 373.15K', () => {
      expect(celsiusToKelvin(100)).toBe(373.15);
      expect(convertTemperature(100, 'C', 'K')).toBe(373.15);
    });

    it('should convert -273.15°C to 0K (absolute zero)', () => {
      expect(celsiusToKelvin(-273.15)).toBe(0);
      expect(convertTemperature(-273.15, 'C', 'K')).toBe(0);
    });

    it('should convert -100°C to 173.15K', () => {
      expect(celsiusToKelvin(-100)).toBeCloseTo(173.15, 2);
      expect(convertTemperature(-100, 'C', 'K')).toBeCloseTo(173.15, 2);
    });
  });

  describe('Kelvin to Celsius conversions', () => {
    it('should convert 273.15K to 0°C', () => {
      expect(kelvinToCelsius(273.15)).toBe(0);
      expect(convertTemperature(273.15, 'K', 'C')).toBe(0);
    });

    it('should convert 373.15K to 100°C', () => {
      expect(kelvinToCelsius(373.15)).toBe(100);
      expect(convertTemperature(373.15, 'K', 'C')).toBe(100);
    });

    it('should convert 0K to -273.15°C (absolute zero)', () => {
      expect(kelvinToCelsius(0)).toBe(-273.15);
      expect(convertTemperature(0, 'K', 'C')).toBe(-273.15);
    });

    it('should convert 100K to -173.15°C', () => {
      expect(kelvinToCelsius(100)).toBeCloseTo(-173.15, 2);
      expect(convertTemperature(100, 'K', 'C')).toBeCloseTo(-173.15, 2);
    });
  });

  describe('Fahrenheit to Kelvin conversions', () => {
    it('should convert 32°F to 273.15K', () => {
      expect(fahrenheitToKelvin(32)).toBe(273.15);
      expect(convertTemperature(32, 'F', 'K')).toBe(273.15);
    });

    it('should convert 212°F to 373.15K', () => {
      expect(fahrenheitToKelvin(212)).toBe(373.15);
      expect(convertTemperature(212, 'F', 'K')).toBe(373.15);
    });

    it('should convert -459.67°F to 0K (absolute zero)', () => {
      expect(fahrenheitToKelvin(-459.67)).toBeCloseTo(0, 2);
      expect(convertTemperature(-459.67, 'F', 'K')).toBeCloseTo(0, 2);
    });
  });

  describe('Kelvin to Fahrenheit conversions', () => {
    it('should convert 273.15K to 32°F', () => {
      expect(kelvinToFahrenheit(273.15)).toBe(32);
      expect(convertTemperature(273.15, 'K', 'F')).toBe(32);
    });

    it('should convert 373.15K to 212°F', () => {
      expect(kelvinToFahrenheit(373.15)).toBe(212);
      expect(convertTemperature(373.15, 'K', 'F')).toBe(212);
    });

    it('should convert 0K to -459.67°F (absolute zero)', () => {
      expect(kelvinToFahrenheit(0)).toBeCloseTo(-459.67, 2);
      expect(convertTemperature(0, 'K', 'F')).toBeCloseTo(-459.67, 2);
    });
  });

  describe('Same unit conversions', () => {
    it('should return the same value when converting C to C', () => {
      expect(convertTemperature(25, 'C', 'C')).toBe(25);
      expect(convertTemperature(-10, 'C', 'C')).toBe(-10);
      expect(convertTemperature(0, 'C', 'C')).toBe(0);
    });

    it('should return the same value when converting F to F', () => {
      expect(convertTemperature(77, 'F', 'F')).toBe(77);
      expect(convertTemperature(-40, 'F', 'F')).toBe(-40);
      expect(convertTemperature(0, 'F', 'F')).toBe(0);
    });

    it('should return the same value when converting K to K', () => {
      expect(convertTemperature(300, 'K', 'K')).toBe(300);
      expect(convertTemperature(0, 'K', 'K')).toBe(0);
      expect(convertTemperature(1000, 'K', 'K')).toBe(1000);
    });
  });

  describe('Absolute zero edge cases', () => {
    it('should throw error when converting negative Kelvin values', () => {
      expect(() => convertTemperature(-1, 'K', 'C')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(-273.15, 'K', 'C')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(-100, 'K', 'F')).toThrow(TemperatureConversionError);
    });

    it('should allow converting from 0K (absolute zero)', () => {
      expect(convertTemperature(0, 'K', 'C')).toBe(-273.15);
      expect(convertTemperature(0, 'K', 'F')).toBeCloseTo(-459.67, 2);
    });

    it('should allow converting to Kelvin values below absolute zero in Celsius/Fahrenheit', () => {
      // These are physically impossible but mathematically valid
      // The conversion itself doesn't check physical constraints
      expect(convertTemperature(-300, 'C', 'K')).toBeCloseTo(-26.85, 2);
      expect(convertTemperature(-500, 'F', 'K')).toBeCloseTo(-22.41, 2);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero values', () => {
      expect(convertTemperature(0, 'C', 'F')).toBe(32);
      expect(convertTemperature(0, 'C', 'K')).toBe(273.15);
      expect(convertTemperature(0, 'F', 'C')).toBeCloseTo(-17.78, 2);
      expect(convertTemperature(0, 'K', 'C')).toBe(-273.15);
    });

    it('should handle negative values', () => {
      expect(convertTemperature(-10, 'C', 'F')).toBe(14);
      expect(convertTemperature(-10, 'F', 'C')).toBeCloseTo(-23.33, 2);
      expect(convertTemperature(-10, 'C', 'K')).toBe(263.15);
    });

    it('should handle very large values', () => {
      expect(convertTemperature(1000000, 'C', 'F')).toBe(1800032);
      expect(convertTemperature(1000000, 'C', 'K')).toBe(1000273.15);
    });

    it('should handle decimal values', () => {
      expect(convertTemperature(25.5, 'C', 'F')).toBeCloseTo(77.9, 1);
      expect(convertTemperature(98.6, 'F', 'C')).toBeCloseTo(37, 1);
      expect(convertTemperature(273.15, 'K', 'C')).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should throw error for NaN values', () => {
      expect(() => convertTemperature(NaN, 'C', 'F')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(NaN, 'C', 'F')).toThrow('Value must be a finite number');
    });

    it('should throw error for Infinity values', () => {
      expect(() => convertTemperature(Infinity, 'C', 'F')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(-Infinity, 'C', 'F')).toThrow(TemperatureConversionError);
    });

    it('should throw error for invalid from unit', () => {
      expect(() => convertTemperature(25, 'X' as 'C', 'F')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(25, 'celsius' as 'C', 'F')).toThrow(TemperatureConversionError);
    });

    it('should throw error for invalid to unit', () => {
      expect(() => convertTemperature(25, 'C', 'X' as 'C')).toThrow(TemperatureConversionError);
      expect(() => convertTemperature(25, 'C', 'fahrenheit' as 'F')).toThrow(TemperatureConversionError);
    });

    it('should include error code in thrown errors', () => {
      try {
        convertTemperature(NaN, 'C', 'F');
      } catch (error) {
        expect(error).toBeInstanceOf(TemperatureConversionError);
        expect((error as TemperatureConversionError).code).toBe('INVALID_VALUE');
      }
    });

    it('should include absolute zero error code', () => {
      try {
        convertTemperature(-1, 'K', 'C');
      } catch (error) {
        expect(error).toBeInstanceOf(TemperatureConversionError);
        expect((error as TemperatureConversionError).code).toBe('BELOW_ABSOLUTE_ZERO');
      }
    });
  });

  describe('Helper functions', () => {
    describe('toCelsius', () => {
      it('should convert to Celsius from any unit', () => {
        expect(toCelsius(32, 'F')).toBe(0);
        expect(toCelsius(273.15, 'K')).toBe(0);
        expect(toCelsius(100, 'C')).toBe(100);
      });
    });

    describe('fromCelsius', () => {
      it('should convert from Celsius to any unit', () => {
        expect(fromCelsius(0, 'F')).toBe(32);
        expect(fromCelsius(0, 'K')).toBe(273.15);
        expect(fromCelsius(100, 'C')).toBe(100);
      });
    });

    describe('convertTemperatureRounded', () => {
      it('should round to specified decimal places', () => {
        expect(convertTemperatureRounded(25, 'C', 'F', 0)).toBe(77);
        expect(convertTemperatureRounded(25, 'C', 'F', 1)).toBe(77.0);
        expect(convertTemperatureRounded(37, 'C', 'F', 2)).toBe(98.6);
      });

      it('should use default of 2 decimal places', () => {
        const result = convertTemperatureRounded(100, 'C', 'F');
        expect(result).toBe(212);
      });
    });
  });
});
