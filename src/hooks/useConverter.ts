import { useMemo, useCallback } from 'react';
import {
  UnitCategory,
  Unit,
  UNITS,
  getUnitsByCategory as getUnitsByCategoryFromTypes,
} from '../types/index.js';
import {
  convertLength,
  LengthUnit,
  LengthConversionError,
} from '../utils/length.js';
import {
  convertWeight,
  WeightUnit,
  WeightConversionError,
} from '../utils/weight.js';
import {
  convertTemperature,
  TempUnit,
  TemperatureConversionError,
} from '../utils/temperature.js';
import {
  convertCurrency,
  CurrencyCode,
  CurrencyConversionError,
} from '../utils/currency.js';

/**
 * Union type for all unit types
 */
export type AnyUnit = LengthUnit | WeightUnit | TempUnit | CurrencyCode;

/**
 * Conversion result type
 */
export interface ConversionResult {
  value: number;
  result: number;
  from: AnyUnit;
  to: AnyUnit;
  category: UnitCategory;
}

/**
 * Conversion error type
 */
export interface ConversionError {
  message: string;
  code: string;
  value?: number;
  from?: AnyUnit;
  to?: AnyUnit;
}

/**
 * Custom error class for unified conversion errors
 */
export class ConverterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly category?: UnitCategory,
    public readonly value?: number,
    public readonly from?: AnyUnit,
    public readonly to?: AnyUnit
  ) {
    super(message);
    this.name = 'ConverterError';
  }
}

/**
 * Validates that a unit belongs to the specified category
 * @param unit - The unit to validate
 * @param category - The expected category
 * @returns true if valid, false otherwise
 */
function isValidUnitForCategory(unit: string, category: UnitCategory): boolean {
  const unitData = UNITS.find((u) => u.id === unit);
  return unitData !== undefined && unitData.category === category;
}

/**
 * Gets the appropriate conversion function for a category
 * @param category - The conversion category
 * @returns The conversion function
 */
function getConversionFunction(category: UnitCategory) {
  switch (category) {
    case UnitCategory.LENGTH:
      return convertLength;
    case UnitCategory.WEIGHT:
      return convertWeight;
    case UnitCategory.TEMPERATURE:
      return convertTemperature;
    case UnitCategory.CURRENCY:
      return convertCurrency;
    default:
      throw new ConverterError(
        `Unsupported category: ${category}`,
        'UNSUPPORTED_CATEGORY',
        category
      );
  }
}

/**
 * Hook return type
 */
export interface UseConverterReturn {
  /**
   * Convert a value from one unit to another within a category
   * @param value - The value to convert
   * @param from - The source unit
   * @param to - The target unit
   * @param category - The conversion category
   * @returns The converted value, or null if conversion fails
   * @throws ConverterError if category is unsupported
   */
  convert: (
    value: number,
    from: AnyUnit,
    to: AnyUnit,
    category: UnitCategory
  ) => number | null;

  /**
   * Convert a value safely, returning an error object instead of throwing
   * @param value - The value to convert
   * @param from - The source unit
   * @param to - The target unit
   * @param category - The conversion category
   * @returns Object with either result or error
   */
  convertSafe: (
    value: number,
    from: AnyUnit,
    to: AnyUnit,
    category: UnitCategory
  ) => { success: true; result: number } | { success: false; error: ConversionError };

  /**
   * All available units
   */
  availableUnits: Unit[];

  /**
   * Get units filtered by category
   * @param category - The category to filter by
   * @returns Array of units in that category
   */
  getUnitsByCategory: (category: UnitCategory) => Unit[];

  /**
   * Get all available categories
   * @returns Array of unit categories
   */
  getCategories: () => UnitCategory[];

  /**
   * Check if a unit is valid for a given category
   * @param unit - The unit to check
   * @param category - The category to check against
   * @returns true if valid, false otherwise
   */
  isValidUnit: (unit: string, category: UnitCategory) => boolean;
}

/**
 * Custom React hook that provides a unified interface for all conversion types
 * @returns UseConverterReturn object with convert function and unit helpers
 * 
 * @example
 * ```tsx
 * const { convert, availableUnits, getUnitsByCategory } = useConverter();
 * 
 * // Convert 100 km to miles
 * const miles = convert(100, 'km', 'mile', UnitCategory.LENGTH);
 * 
 * // Get all length units
 * const lengthUnits = getUnitsByCategory(UnitCategory.LENGTH);
 * ```
 */
export function useConverter(): UseConverterReturn {
  // Memoize available units to prevent unnecessary recalculations
  const availableUnits = useMemo(() => UNITS, []);

  // Memoize categories
  const categories = useMemo(
    () => [UnitCategory.LENGTH, UnitCategory.WEIGHT, UnitCategory.TEMPERATURE, UnitCategory.CURRENCY],
    []
  );

  /**
   * Convert a value from one unit to another within a category
   * Returns null on error instead of throwing (for UI convenience)
   */
  const convert = useCallback(
    (value: number, from: AnyUnit, to: AnyUnit, category: UnitCategory): number | null => {
      try {
        // Validate value
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          return null;
        }

        // Validate units match the category
        if (!isValidUnitForCategory(from, category)) {
          return null;
        }
        if (!isValidUnitForCategory(to, category)) {
          return null;
        }

        // Get the appropriate conversion function and execute it
        const conversionFn = getConversionFunction(category);
        return conversionFn(value, from as never, to as never);
      } catch (error) {
        // Return null for any conversion error (graceful degradation)
        return null;
      }
    },
    []
  );

  /**
   * Convert a value safely, returning detailed error information
   */
  const convertSafe = useCallback(
    (
      value: number,
      from: AnyUnit,
      to: AnyUnit,
      category: UnitCategory
    ): { success: true; result: number } | { success: false; error: ConversionError } => {
      try {
        // Validate value
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          return {
            success: false,
            error: {
              message: 'Value must be a finite number',
              code: 'INVALID_VALUE',
              value,
              from,
              to,
            },
          };
        }

        // Validate from unit matches category
        if (!isValidUnitForCategory(from, category)) {
          return {
            success: false,
            error: {
              message: `Invalid unit '${from}' for category '${category}'`,
              code: 'INVALID_FROM_UNIT',
              value,
              from,
              to,
            },
          };
        }

        // Validate to unit matches category
        if (!isValidUnitForCategory(to, category)) {
          return {
            success: false,
            error: {
              message: `Invalid unit '${to}' for category '${category}'`,
              code: 'INVALID_TO_UNIT',
              value,
              from,
              to,
            },
          };
        }

        // Get the appropriate conversion function and execute it
        const conversionFn = getConversionFunction(category);
        const result = conversionFn(value, from as never, to as never);

        return { success: true, result };
      } catch (error) {
        // Handle specific conversion errors
        if (
          error instanceof LengthConversionError ||
          error instanceof WeightConversionError ||
          error instanceof TemperatureConversionError ||
          error instanceof CurrencyConversionError
        ) {
          return {
            success: false,
            error: {
              message: error.message,
              code: error.code,
              value: error.value,
              from: error.from as AnyUnit,
              to: error.to as AnyUnit,
            },
          };
        }

        if (error instanceof ConverterError) {
          return {
            success: false,
            error: {
              message: error.message,
              code: error.code,
              value: error.value,
              from: error.from,
              to: error.to,
            },
          };
        }

        // Generic error fallback
        return {
          success: false,
          error: {
            message: error instanceof Error ? error.message : 'Unknown conversion error',
            code: 'CONVERSION_ERROR',
            value,
            from,
            to,
          },
        };
      }
    },
    []
  );

  /**
   * Get units filtered by category (memoized)
   */
  const getUnitsByCategoryMemoized = useCallback(
    (category: UnitCategory): Unit[] => {
      return getUnitsByCategoryFromTypes(category);
    },
    []
  );

  /**
   * Get all available categories
   */
  const getCategories = useCallback((): UnitCategory[] => {
    return categories;
  }, [categories]);

  /**
   * Check if a unit is valid for a given category
   */
  const isValidUnit = useCallback((unit: string, category: UnitCategory): boolean => {
    return isValidUnitForCategory(unit, category);
  }, []);

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      convert,
      convertSafe,
      availableUnits,
      getUnitsByCategory: getUnitsByCategoryMemoized,
      getCategories,
      isValidUnit,
    }),
    [convert, convertSafe, availableUnits, getUnitsByCategoryMemoized, getCategories, isValidUnit]
  );
}

export default useConverter;
