/**
 * Length conversion utility functions
 * Base unit: meters
 */

/**
 * Length unit type - all supported length units
 */
export type LengthUnit = 'km' | 'm' | 'cm' | 'mm' | 'mile' | 'yard' | 'feet' | 'inch';

/**
 * Conversion factors to meters (base unit)
 */
export const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  feet: 0.3048,
  inch: 0.0254,
};

/**
 * All supported length units
 */
export const LENGTH_UNITS: LengthUnit[] = ['km', 'm', 'cm', 'mm', 'mile', 'yard', 'feet', 'inch'];

/**
 * Length unit display names
 */
export const LENGTH_UNIT_NAMES: Record<LengthUnit, string> = {
  km: 'Kilometer',
  m: 'Meter',
  cm: 'Centimeter',
  mm: 'Millimeter',
  mile: 'Mile',
  yard: 'Yard',
  feet: 'Feet',
  inch: 'Inch',
};

/**
 * Length unit symbols
 */
export const LENGTH_UNIT_SYMBOLS: Record<LengthUnit, string> = {
  km: 'km',
  m: 'm',
  cm: 'cm',
  mm: 'mm',
  mile: 'mi',
  yard: 'yd',
  feet: 'ft',
  inch: 'in',
};

/**
 * Custom error class for length conversion errors
 */
export class LengthConversionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly value?: number,
    public readonly from?: LengthUnit,
    public readonly to?: LengthUnit
  ) {
    super(message);
    this.name = 'LengthConversionError';
  }
}

/**
 * Validates a length unit
 * @param unit - The unit to validate
 * @returns true if valid, false otherwise
 */
export function isValidLengthUnit(unit: string): unit is LengthUnit {
  return LENGTH_UNITS.includes(unit as LengthUnit);
}

/**
 * Converts a length value from one unit to another
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @returns The converted value
 * @throws LengthConversionError if units are invalid
 */
export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  // Validate value is a number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new LengthConversionError(
      'Value must be a finite number',
      'INVALID_VALUE',
      value,
      from,
      to
    );
  }

  // Validate from unit
  if (!isValidLengthUnit(from)) {
    throw new LengthConversionError(
      `Invalid source unit: ${from}. Valid units are: ${LENGTH_UNITS.join(', ')}`,
      'INVALID_FROM_UNIT',
      value,
      from,
      to
    );
  }

  // Validate to unit
  if (!isValidLengthUnit(to)) {
    throw new LengthConversionError(
      `Invalid target unit: ${to}. Valid units are: ${LENGTH_UNITS.join(', ')}`,
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

  // Convert to meters first, then to target unit
  const valueInMeters = value * LENGTH_TO_METERS[from];
  const result = valueInMeters / LENGTH_TO_METERS[to];

  return result;
}

/**
 * Converts a length value and formats it to a specified precision
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @param decimals - Number of decimal places (default: 6)
 * @returns The converted value rounded to specified decimals
 */
export function convertLengthRounded(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
  decimals: number = 6
): number {
  const result = convertLength(value, from, to);
  const factor = Math.pow(10, decimals);
  return Math.round(result * factor) / factor;
}

/**
 * Converts a length value to meters
 * @param value - The value to convert
 * @param from - The source unit
 * @returns The value in meters
 */
export function toMeters(value: number, from: LengthUnit): number {
  return convertLength(value, from, 'm');
}

/**
 * Converts a length value from meters
 * @param value - The value in meters
 * @param to - The target unit
 * @returns The converted value
 */
export function fromMeters(value: number, to: LengthUnit): number {
  return convertLength(value, 'm', to);
}
