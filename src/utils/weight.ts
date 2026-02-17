/**
 * Weight conversion utility functions
 * Base unit: grams
 */

/**
 * Weight unit type - all supported weight units
 */
export type WeightUnit = 'kg' | 'g' | 'mg' | 'lb' | 'oz';

/**
 * Conversion factors to grams (base unit)
 */
export const WEIGHT_TO_GRAMS: Record<WeightUnit, number> = {
  kg: 1000,
  g: 1,
  mg: 0.001,
  lb: 453.59237,
  oz: 28.34952,
};

/**
 * All supported weight units
 */
export const WEIGHT_UNITS: WeightUnit[] = ['kg', 'g', 'mg', 'lb', 'oz'];

/**
 * Weight unit display names
 */
export const WEIGHT_UNIT_NAMES: Record<WeightUnit, string> = {
  kg: 'Kilogram',
  g: 'Gram',
  mg: 'Milligram',
  lb: 'Pound',
  oz: 'Ounce',
};

/**
 * Weight unit symbols
 */
export const WEIGHT_UNIT_SYMBOLS: Record<WeightUnit, string> = {
  kg: 'kg',
  g: 'g',
  mg: 'mg',
  lb: 'lb',
  oz: 'oz',
};

/**
 * Custom error class for weight conversion errors
 */
export class WeightConversionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly value?: number,
    public readonly from?: WeightUnit,
    public readonly to?: WeightUnit
  ) {
    super(message);
    this.name = 'WeightConversionError';
  }
}

/**
 * Validates a weight unit
 * @param unit - The unit to validate
 * @returns true if valid, false otherwise
 */
export function isValidWeightUnit(unit: string): unit is WeightUnit {
  return WEIGHT_UNITS.includes(unit as WeightUnit);
}

/**
 * Converts a weight value from one unit to another
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @returns The converted value
 * @throws WeightConversionError if units are invalid
 */
export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  // Validate value is a number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new WeightConversionError(
      'Value must be a finite number',
      'INVALID_VALUE',
      value,
      from,
      to
    );
  }

  // Validate from unit
  if (!isValidWeightUnit(from)) {
    throw new WeightConversionError(
      `Invalid source unit: ${from}. Valid units are: ${WEIGHT_UNITS.join(', ')}`,
      'INVALID_FROM_UNIT',
      value,
      from,
      to
    );
  }

  // Validate to unit
  if (!isValidWeightUnit(to)) {
    throw new WeightConversionError(
      `Invalid target unit: ${to}. Valid units are: ${WEIGHT_UNITS.join(', ')}`,
      'INVALID_TO_UNIT',
      value,
      from,
      to
    );
  }

  // Same unit, no conversion needed
  if (from === to) {
    return value;
  }

  // Convert to grams first, then to target unit
  const valueInGrams = value * WEIGHT_TO_GRAMS[from];
  const result = valueInGrams / WEIGHT_TO_GRAMS[to];

  return result;
}

/**
 * Converts a weight value and formats it to a specified precision
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @param decimals - Number of decimal places (default: 6)
 * @returns The converted value rounded to specified decimals
 */
export function convertWeightRounded(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
  decimals: number = 6
): number {
  const result = convertWeight(value, from, to);
  const factor = Math.pow(10, decimals);
  return Math.round(result * factor) / factor;
}

/**
 * Converts a weight value to grams
 * @param value - The value to convert
 * @param from - The source unit
 * @returns The value in grams
 */
export function toGrams(value: number, from: WeightUnit): number {
  return convertWeight(value, from, 'g');
}

/**
 * Converts a weight value from grams
 * @param value - The value in grams
 * @param to - The target unit
 * @returns The converted value
 */
export function fromGrams(value: number, to: WeightUnit): number {
  return convertWeight(value, 'g', to);
}
