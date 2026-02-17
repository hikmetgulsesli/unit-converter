/**
 * Temperature conversion utility functions
 * Temperature requires formula-based conversion (not simple multiplication)
 * Absolute zero: 0K = -273.15°C = -459.67°F
 */

/**
 * Temperature unit type - all supported temperature units
 */
export type TempUnit = 'C' | 'F' | 'K';

/**
 * All supported temperature units
 */
export const TEMP_UNITS: TempUnit[] = ['C', 'F', 'K'];

/**
 * Temperature unit display names
 */
export const TEMP_UNIT_NAMES: Record<TempUnit, string> = {
  C: 'Celsius',
  F: 'Fahrenheit',
  K: 'Kelvin',
};

/**
 * Temperature unit symbols
 */
export const TEMP_UNIT_SYMBOLS: Record<TempUnit, string> = {
  C: '°C',
  F: '°F',
  K: 'K',
};

/**
 * Absolute zero in different units
 */
export const ABSOLUTE_ZERO: Record<TempUnit, number> = {
  C: -273.15,
  F: -459.67,
  K: 0,
};

/**
 * Custom error class for temperature conversion errors
 */
export class TemperatureConversionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly value?: number,
    public readonly from?: TempUnit,
    public readonly to?: TempUnit
  ) {
    super(message);
    this.name = 'TemperatureConversionError';
  }
}

/**
 * Validates a temperature unit
 * @param unit - The unit to validate
 * @returns true if valid, false otherwise
 */
export function isValidTempUnit(unit: string): unit is TempUnit {
  return TEMP_UNITS.includes(unit as TempUnit);
}

/**
 * Checks if a temperature value is below absolute zero
 * @param value - The temperature value
 * @param unit - The temperature unit
 * @returns true if below absolute zero, false otherwise
 */
export function isBelowAbsoluteZero(value: number, unit: TempUnit): boolean {
  return value < ABSOLUTE_ZERO[unit];
}

/**
 * Converts Celsius to Fahrenheit
 * Formula: (C × 9/5) + 32
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Converts Fahrenheit to Celsius
 * Formula: (F - 32) × 5/9
 * @param fahrenheit - Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Converts Celsius to Kelvin
 * Formula: C + 273.15
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Kelvin
 */
export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

/**
 * Converts Kelvin to Celsius
 * Formula: K - 273.15
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

/**
 * Converts Fahrenheit to Kelvin
 * Formula: ((F - 32) × 5/9) + 273.15
 * @param fahrenheit - Temperature in Fahrenheit
 * @returns Temperature in Kelvin
 */
export function fahrenheitToKelvin(fahrenheit: number): number {
  return fahrenheitToCelsius(fahrenheit) + 273.15;
}

/**
 * Converts Kelvin to Fahrenheit
 * Formula: ((K - 273.15) × 9/5) + 32
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Fahrenheit
 */
export function kelvinToFahrenheit(kelvin: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin));
}

/**
 * Converts a temperature value from one unit to another
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @returns The converted value
 * @throws TemperatureConversionError if units are invalid or value is below absolute zero
 */
export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  // Validate value is a number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TemperatureConversionError(
      'Value must be a finite number',
      'INVALID_VALUE',
      value,
      from,
      to
    );
  }

  // Validate from unit
  if (!isValidTempUnit(from)) {
    throw new TemperatureConversionError(
      `Invalid source unit: ${from}. Valid units are: ${TEMP_UNITS.join(', ')}`,
      'INVALID_FROM_UNIT',
      value,
      from,
      to
    );
  }

  // Validate to unit
  if (!isValidTempUnit(to)) {
    throw new TemperatureConversionError(
      `Invalid target unit: ${to}. Valid units are: ${TEMP_UNITS.join(', ')}`,
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

  // Check for absolute zero violation (only for Kelvin as source)
  if (from === 'K' && value < 0) {
    throw new TemperatureConversionError(
      `Temperature cannot be below absolute zero (0K). Got: ${value}K`,
      'BELOW_ABSOLUTE_ZERO',
      value,
      from,
      to
    );
  }

  // Perform conversion based on source and target units
  switch (from) {
    case 'C':
      switch (to) {
        case 'F':
          return celsiusToFahrenheit(value);
        case 'K':
          return celsiusToKelvin(value);
        default:
          return value;
      }
    case 'F':
      switch (to) {
        case 'C':
          return fahrenheitToCelsius(value);
        case 'K':
          return fahrenheitToKelvin(value);
        default:
          return value;
      }
    case 'K':
      switch (to) {
        case 'C':
          return kelvinToCelsius(value);
        case 'F':
          return kelvinToFahrenheit(value);
        default:
          return value;
      }
    default:
      return value;
  }
}

/**
 * Converts a temperature value and formats it to a specified precision
 * @param value - The value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @param decimals - Number of decimal places (default: 2)
 * @returns The converted value rounded to specified decimals
 */
export function convertTemperatureRounded(
  value: number,
  from: TempUnit,
  to: TempUnit,
  decimals: number = 2
): number {
  const result = convertTemperature(value, from, to);
  const factor = Math.pow(10, decimals);
  return Math.round(result * factor) / factor;
}

/**
 * Converts a temperature value to Celsius
 * @param value - The value to convert
 * @param from - The source unit
 * @returns The value in Celsius
 */
export function toCelsius(value: number, from: TempUnit): number {
  return convertTemperature(value, from, 'C');
}

/**
 * Converts a temperature value from Celsius
 * @param value - The value in Celsius
 * @param to - The target unit
 * @returns The converted value
 */
export function fromCelsius(value: number, to: TempUnit): number {
  return convertTemperature(value, 'C', to);
}
