// Type definitions for Unit Converter

export interface ConversionCategory {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
}

export interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}

export type CategoryType = 'length' | 'weight' | 'temperature' | 'currency';
