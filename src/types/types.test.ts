import { describe, it, expect } from 'vitest';
import {
  UnitCategory,
  UNITS,
  CONVERSION_FACTORS,
  getUnitsByCategory,
  getUnitById,
  getAllCategories,
  type Unit,
  type ConversionFactors,
} from './index';

describe('UnitCategory enum', () => {
  it('should have all four categories', () => {
    expect(UnitCategory.LENGTH).toBe('length');
    expect(UnitCategory.WEIGHT).toBe('weight');
    expect(UnitCategory.TEMPERATURE).toBe('temperature');
    expect(UnitCategory.CURRENCY).toBe('currency');
  });

  it('should have exactly 4 categories', () => {
    const categories = Object.values(UnitCategory);
    expect(categories).toHaveLength(4);
  });
});

describe('UNITS constant', () => {
  it('should contain all 21 units', () => {
    expect(UNITS).toHaveLength(21);
  });

  it('should have 8 length units', () => {
    const lengthUnits = UNITS.filter((u) => u.category === UnitCategory.LENGTH);
    expect(lengthUnits).toHaveLength(8);
  });

  it('should have 5 weight units', () => {
    const weightUnits = UNITS.filter((u) => u.category === UnitCategory.WEIGHT);
    expect(weightUnits).toHaveLength(5);
  });

  it('should have 3 temperature units', () => {
    const tempUnits = UNITS.filter((u) => u.category === UnitCategory.TEMPERATURE);
    expect(tempUnits).toHaveLength(3);
  });

  it('should have 5 currency units', () => {
    const currencyUnits = UNITS.filter((u) => u.category === UnitCategory.CURRENCY);
    expect(currencyUnits).toHaveLength(5);
  });

  it('should have correct length unit metadata', () => {
    const km = UNITS.find((u) => u.id === 'km');
    expect(km).toBeDefined();
    expect(km?.name).toBe('Kilometer');
    expect(km?.symbol).toBe('km');
    expect(km?.category).toBe(UnitCategory.LENGTH);
  });

  it('should have correct weight unit metadata', () => {
    const kg = UNITS.find((u) => u.id === 'kg');
    expect(kg).toBeDefined();
    expect(kg?.name).toBe('Kilogram');
    expect(kg?.symbol).toBe('kg');
    expect(kg?.category).toBe(UnitCategory.WEIGHT);
  });

  it('should have correct temperature unit metadata', () => {
    const celsius = UNITS.find((u) => u.id === 'C');
    expect(celsius).toBeDefined();
    expect(celsius?.name).toBe('Celsius');
    expect(celsius?.symbol).toBe('°C');
    expect(celsius?.category).toBe(UnitCategory.TEMPERATURE);
  });

  it('should have correct currency unit metadata', () => {
    const usd = UNITS.find((u) => u.id === 'USD');
    expect(usd).toBeDefined();
    expect(usd?.name).toBe('US Dollar');
    expect(usd?.symbol).toBe('$');
    expect(usd?.category).toBe(UnitCategory.CURRENCY);
  });

  it('should have all required length units', () => {
    const lengthIds = ['km', 'm', 'cm', 'mm', 'mile', 'yard', 'feet', 'inch'];
    lengthIds.forEach((id) => {
      expect(UNITS.find((u) => u.id === id)).toBeDefined();
    });
  });

  it('should have all required weight units', () => {
    const weightIds = ['kg', 'g', 'mg', 'lb', 'oz'];
    weightIds.forEach((id) => {
      expect(UNITS.find((u) => u.id === id)).toBeDefined();
    });
  });

  it('should have all required temperature units', () => {
    const tempIds = ['C', 'F', 'K'];
    tempIds.forEach((id) => {
      expect(UNITS.find((u) => u.id === id)).toBeDefined();
    });
  });

  it('should have all required currency units', () => {
    const currencyIds = ['USD', 'EUR', 'GBP', 'TRY', 'JPY'];
    currencyIds.forEach((id) => {
      expect(UNITS.find((u) => u.id === id)).toBeDefined();
    });
  });
});

describe('CONVERSION_FACTORS', () => {
  it('should have conversion factors for length', () => {
    expect(CONVERSION_FACTORS[UnitCategory.LENGTH]).toBeDefined();
    expect(CONVERSION_FACTORS[UnitCategory.LENGTH].baseUnit).toBe('m');
    expect(CONVERSION_FACTORS[UnitCategory.LENGTH].factors).toBeDefined();
  });

  it('should have conversion factors for weight', () => {
    expect(CONVERSION_FACTORS[UnitCategory.WEIGHT]).toBeDefined();
    expect(CONVERSION_FACTORS[UnitCategory.WEIGHT].baseUnit).toBe('g');
    expect(CONVERSION_FACTORS[UnitCategory.WEIGHT].factors).toBeDefined();
  });

  it('should have conversion factors for currency', () => {
    expect(CONVERSION_FACTORS[UnitCategory.CURRENCY]).toBeDefined();
    expect(CONVERSION_FACTORS[UnitCategory.CURRENCY].baseUnit).toBe('USD');
    expect(CONVERSION_FACTORS[UnitCategory.CURRENCY].factors).toBeDefined();
  });

  it('should have all length conversion factors', () => {
    const lengthFactors = CONVERSION_FACTORS[UnitCategory.LENGTH].factors;
    expect(Object.keys(lengthFactors)).toHaveLength(8);
    expect(lengthFactors.km).toBe(1000);
    expect(lengthFactors.m).toBe(1);
    expect(lengthFactors.cm).toBe(0.01);
    expect(lengthFactors.mm).toBe(0.001);
  });

  it('should have all weight conversion factors', () => {
    const weightFactors = CONVERSION_FACTORS[UnitCategory.WEIGHT].factors;
    expect(Object.keys(weightFactors)).toHaveLength(5);
    expect(weightFactors.kg).toBe(1000);
    expect(weightFactors.g).toBe(1);
    expect(weightFactors.mg).toBe(0.001);
  });

  it('should have all currency conversion factors', () => {
    const currencyFactors = CONVERSION_FACTORS[UnitCategory.CURRENCY].factors;
    expect(Object.keys(currencyFactors)).toHaveLength(5);
    expect(currencyFactors.USD).toBe(1);
  });
});

describe('Helper functions', () => {
  describe('getUnitsByCategory', () => {
    it('should return all length units', () => {
      const units = getUnitsByCategory(UnitCategory.LENGTH);
      expect(units).toHaveLength(8);
      expect(units.every((u) => u.category === UnitCategory.LENGTH)).toBe(true);
    });

    it('should return all weight units', () => {
      const units = getUnitsByCategory(UnitCategory.WEIGHT);
      expect(units).toHaveLength(5);
      expect(units.every((u) => u.category === UnitCategory.WEIGHT)).toBe(true);
    });

    it('should return all temperature units', () => {
      const units = getUnitsByCategory(UnitCategory.TEMPERATURE);
      expect(units).toHaveLength(3);
      expect(units.every((u) => u.category === UnitCategory.TEMPERATURE)).toBe(true);
    });

    it('should return all currency units', () => {
      const units = getUnitsByCategory(UnitCategory.CURRENCY);
      expect(units).toHaveLength(5);
      expect(units.every((u) => u.category === UnitCategory.CURRENCY)).toBe(true);
    });
  });

  describe('getUnitById', () => {
    it('should return the correct unit for valid id', () => {
      const km = getUnitById('km');
      expect(km).toBeDefined();
      expect(km?.name).toBe('Kilometer');
    });

    it('should return undefined for invalid id', () => {
      const invalid = getUnitById('invalid');
      expect(invalid).toBeUndefined();
    });
  });

  describe('getAllCategories', () => {
    it('should return all 4 categories', () => {
      const categories = getAllCategories();
      expect(categories).toHaveLength(4);
      expect(categories).toContain(UnitCategory.LENGTH);
      expect(categories).toContain(UnitCategory.WEIGHT);
      expect(categories).toContain(UnitCategory.TEMPERATURE);
      expect(categories).toContain(UnitCategory.CURRENCY);
    });
  });
});

describe('Type exports', () => {
  it('Unit type should be usable', () => {
    const testUnit: Unit = {
      id: 'test',
      name: 'Test Unit',
      symbol: 'tu',
      category: UnitCategory.LENGTH,
    };
    expect(testUnit.id).toBe('test');
    expect(testUnit.name).toBe('Test Unit');
    expect(testUnit.symbol).toBe('tu');
    expect(testUnit.category).toBe(UnitCategory.LENGTH);
  });

  it('ConversionFactors type should be usable', () => {
    const factors: ConversionFactors = {
      baseUnit: 'm',
      factors: {
        km: 1000,
        m: 1,
      },
    };
    expect(factors.baseUnit).toBe('m');
    expect(factors.factors.km).toBe(1000);
  });
});
