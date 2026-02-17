// Type definitions for Unit Converter

/**
 * UnitCategory enum - defines all conversion categories
 */
export enum UnitCategory {
  LENGTH = 'length',
  WEIGHT = 'weight',
  TEMPERATURE = 'temperature',
  CURRENCY = 'currency',
}

/**
 * Unit type - represents a single unit of measurement
 */
export interface Unit {
  /** Unique identifier for the unit (e.g., 'km', 'kg', 'C') */
  id: string;
  /** Display name for the unit (e.g., 'Kilometer', 'Kilogram') */
  name: string;
  /** Symbol for the unit (e.g., 'km', 'kg', '°C') */
  symbol: string;
  /** Category this unit belongs to */
  category: UnitCategory;
}

/**
 * ConversionFactors interface - defines conversion factors for a category
 * For linear conversions: value * factor = base value
 * For temperature: special formulas required
 */
export interface ConversionFactors {
  /** Base unit id for this category */
  baseUnit: string;
  /** Map of unit id to conversion factor (relative to base unit) */
  factors: Record<string, number>;
}

/**
 * All units constant - contains all 21 units with metadata
 */
export const UNITS: Unit[] = [
  // Length units (8 units) - base: meter
  { id: 'km', name: 'Kilometer', symbol: 'km', category: UnitCategory.LENGTH },
  { id: 'm', name: 'Meter', symbol: 'm', category: UnitCategory.LENGTH },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', category: UnitCategory.LENGTH },
  { id: 'mm', name: 'Millimeter', symbol: 'mm', category: UnitCategory.LENGTH },
  { id: 'mile', name: 'Mile', symbol: 'mi', category: UnitCategory.LENGTH },
  { id: 'yard', name: 'Yard', symbol: 'yd', category: UnitCategory.LENGTH },
  { id: 'feet', name: 'Feet', symbol: 'ft', category: UnitCategory.LENGTH },
  { id: 'inch', name: 'Inch', symbol: 'in', category: UnitCategory.LENGTH },

  // Weight units (5 units) - base: gram
  { id: 'kg', name: 'Kilogram', symbol: 'kg', category: UnitCategory.WEIGHT },
  { id: 'g', name: 'Gram', symbol: 'g', category: UnitCategory.WEIGHT },
  { id: 'mg', name: 'Milligram', symbol: 'mg', category: UnitCategory.WEIGHT },
  { id: 'lb', name: 'Pound', symbol: 'lb', category: UnitCategory.WEIGHT },
  { id: 'oz', name: 'Ounce', symbol: 'oz', category: UnitCategory.WEIGHT },

  // Temperature units (3 units) - no linear base
  { id: 'C', name: 'Celsius', symbol: '°C', category: UnitCategory.TEMPERATURE },
  { id: 'F', name: 'Fahrenheit', symbol: '°F', category: UnitCategory.TEMPERATURE },
  { id: 'K', name: 'Kelvin', symbol: 'K', category: UnitCategory.TEMPERATURE },

  // Currency units (5 units) - base: USD (for reference)
  { id: 'USD', name: 'US Dollar', symbol: '$', category: UnitCategory.CURRENCY },
  { id: 'EUR', name: 'Euro', symbol: '€', category: UnitCategory.CURRENCY },
  { id: 'GBP', name: 'British Pound', symbol: '£', category: UnitCategory.CURRENCY },
  { id: 'TRY', name: 'Turkish Lira', symbol: '₺', category: UnitCategory.CURRENCY },
  { id: 'JPY', name: 'Japanese Yen', symbol: '¥', category: UnitCategory.CURRENCY },
] as const;

/**
 * Conversion factors for linear conversions
 * All factors are relative to the base unit
 */
export const CONVERSION_FACTORS: Record<UnitCategory.LENGTH | UnitCategory.WEIGHT | UnitCategory.CURRENCY, ConversionFactors> = {
  [UnitCategory.LENGTH]: {
    baseUnit: 'm',
    factors: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      feet: 0.3048,
      inch: 0.0254,
    },
  },
  [UnitCategory.WEIGHT]: {
    baseUnit: 'g',
    factors: {
      kg: 1000,
      g: 1,
      mg: 0.001,
      lb: 453.59237,
      oz: 28.34952,
    },
  },
  [UnitCategory.CURRENCY]: {
    baseUnit: 'USD',
    factors: {
      USD: 1,
      EUR: 1.08, // Approximate rates - will be updated via API
      GBP: 1.26,
      TRY: 0.031,
      JPY: 0.0067,
    },
  },
};

/**
 * Helper function to get units by category
 */
export function getUnitsByCategory(category: UnitCategory): Unit[] {
  return UNITS.filter((unit) => unit.category === category);
}

/**
 * Helper function to get a unit by its id
 */
export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}

/**
 * Helper function to get all categories
 */
export function getAllCategories(): UnitCategory[] {
  return Object.values(UnitCategory);
}

/**
 * Legacy types for backward compatibility
 * @deprecated Use UnitCategory enum instead
 */
export type CategoryType = 'length' | 'weight' | 'temperature' | 'currency';

/**
 * @deprecated Use Unit interface instead
 */
export interface ConversionCategory {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
}

/**
 * @deprecated Use Unit interface instead
 */
export interface LegacyUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
}

/**
 * @deprecated Will be replaced by conversion result type
 */
export interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}
