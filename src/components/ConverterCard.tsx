import { useState, useCallback, useMemo, useEffect } from 'react';
import { CategoryTab } from './CategoryTab';
import { ConversionInput } from './ConversionInput';
import { UnitSelector } from './UnitSelector';
import { SwapButton } from './SwapButton';
import { ConversionResult } from './ConversionResult';
import { useConverter, useFocusShortcut } from '../hooks';
import { UnitCategory, getUnitsByCategory } from '../types';
import './ConverterCard.css';

export interface ConverterCardProps {
  /** Optional initial category */
  initialCategory?: UnitCategory;
  /** Optional callback when conversion changes */
  onConversionChange?: (from: string, to: string, value: number, result: number | null) => void;
}

/**
 * Main converter card component that composes all conversion UI elements
 * Manages state for category, units, input value, and conversion result
 */
export function ConverterCard({
  initialCategory = UnitCategory.LENGTH,
  onConversionChange,
}: ConverterCardProps) {
  const { convert, getCategories } = useConverter();
  
  // Ref for the input field to support Ctrl/Cmd+K keyboard shortcut
  const inputRef = useFocusShortcut<HTMLInputElement>();
  
  // State
  const [activeCategory, setActiveCategory] = useState<UnitCategory>(initialCategory);
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');

  // Get all categories
  const categories = useMemo(() => getCategories(), [getCategories]);

  // Get units for the active category
  const availableUnits = useMemo(() => {
    return getUnitsByCategory(activeCategory);
  }, [activeCategory]);

  // Initialize default units when category changes
  useEffect(() => {
    if (availableUnits.length >= 2) {
      setFromUnit(availableUnits[0].id);
      setToUnit(availableUnits[1].id);
    } else if (availableUnits.length === 1) {
      setFromUnit(availableUnits[0].id);
      setToUnit(availableUnits[0].id);
    }
  }, [activeCategory, availableUnits]);

  // Calculate conversion result
  const result = useMemo(() => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue) || !fromUnit || !toUnit) {
      return null;
    }
    return convert(numericValue, fromUnit as Parameters<typeof convert>[1], toUnit as Parameters<typeof convert>[2], activeCategory);
  }, [inputValue, fromUnit, toUnit, activeCategory, convert]);

  // Get unit objects for display
  const toUnitObj = useMemo(() => {
    return availableUnits.find((u) => u.id === toUnit);
  }, [availableUnits, toUnit]);

  // Handle category change
  const handleCategoryChange = useCallback((category: UnitCategory) => {
    setActiveCategory(category);
    setInputValue('1');
  }, []);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Handle from unit change
  const handleFromUnitChange = useCallback((unitId: string) => {
    setFromUnit(unitId);
    // If the new from unit is the same as to unit, swap them
    if (unitId === toUnit && availableUnits.length > 1) {
      setToUnit(fromUnit);
    }
  }, [toUnit, fromUnit, availableUnits.length]);

  // Handle to unit change
  const handleToUnitChange = useCallback((unitId: string) => {
    setToUnit(unitId);
    // If the new to unit is the same as from unit, swap them
    if (unitId === fromUnit && availableUnits.length > 1) {
      setFromUnit(toUnit);
    }
  }, [fromUnit, toUnit, availableUnits.length]);

  // Handle swap
  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  // Call onConversionChange callback when result changes
  useEffect(() => {
    if (onConversionChange && fromUnit && toUnit) {
      const numericValue = parseFloat(inputValue) || 0;
      onConversionChange(fromUnit, toUnit, numericValue, result);
    }
  }, [result, fromUnit, toUnit, inputValue, onConversionChange]);

  // Check if swap should be disabled
  const isSwapDisabled = useMemo(() => {
    return !fromUnit || !toUnit || fromUnit === toUnit || availableUnits.length < 2;
  }, [fromUnit, toUnit, availableUnits.length]);

  return (
    <div 
      className="converter-card" 
      data-testid="converter-card"
      role="region"
      aria-label="Unit converter"
    >
      {/* Keyboard shortcut hint - visually hidden but available to screen readers */}
      <div className="converter-card__shortcut-hint">
        <span className="sr-only">
          Press Ctrl+K or Command+K to focus the input field
        </span>
      </div>

      {/* Category Tabs */}
      <div className="converter-card__header">
        <CategoryTab
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Input Section */}
      <div className="converter-card__section converter-card__input-section">
        <ConversionInput
          ref={inputRef}
          id="from-value"
          label="From"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter value"
        />
        <UnitSelector
          id="from-unit"
          units={availableUnits}
          value={fromUnit}
          onChange={handleFromUnitChange}
          label="From unit"
        />
      </div>

      {/* Swap Button */}
      <div className="converter-card__swap-container">
        <SwapButton
          onSwap={handleSwap}
          disabled={isSwapDisabled}
        />
      </div>

      {/* Output Section */}
      <div className="converter-card__section converter-card__output-section">
        <ConversionResult
          value={result}
          unit={toUnitObj || { id: '', name: '', symbol: '', category: activeCategory }}
          label="To"
        />
        <UnitSelector
          id="to-unit"
          units={availableUnits}
          value={toUnit}
          onChange={handleToUnitChange}
          label="To unit"
        />
      </div>

      {/* ARIA live region for announcing conversion results to screen readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        data-testid="conversion-announcement"
      >
        {result !== null && !isNaN(result) && toUnitObj && (
          `${inputValue} ${fromUnit} equals ${result.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toUnitObj.symbol}`
        )}
      </div>
    </div>
  );
}
