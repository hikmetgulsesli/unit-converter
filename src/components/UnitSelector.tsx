import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Unit } from '../types';
import './UnitSelector.css';

export interface UnitSelectorProps {
  /** Available units to display in the dropdown */
  units: Unit[];
  /** Currently selected unit id */
  value: string;
  /** Callback when a unit is selected */
  onChange: (unitId: string) => void;
  /** Optional label for the selector */
  label?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional id for the select element */
  id?: string;
}

export function UnitSelector({
  units,
  value,
  onChange,
  label,
  disabled = false,
  id,
}: UnitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedUnit = units.find((u) => u.id === value);
  const selectedIndex = units.findIndex((u) => u.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update highlighted index when selected unit changes
  useEffect(() => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          onChange(units[highlightedIndex].id);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % units.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev - 1 + units.length) % units.length);
        }
        break;
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(units.length - 1);
        break;
    }
  };

  const handleSelect = (unitId: string) => {
    onChange(unitId);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="unit-selector" ref={containerRef}>
      {label && (
        <label className="unit-selector__label" htmlFor={id}>
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={`unit-selector__button ${isOpen ? 'unit-selector__button--open' : ''} ${disabled ? 'unit-selector__button--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${id}-label` : undefined}
      >
        <span className="unit-selector__value">
          {selectedUnit ? (
            <>
              <span className="unit-selector__symbol">{selectedUnit.symbol}</span>
              <span className="unit-selector__name">{selectedUnit.name}</span>
            </>
          ) : (
            <span className="unit-selector__placeholder">Select unit</span>
          )}
        </span>
        <ChevronDown 
          size={16} 
          className={`unit-selector__chevron ${isOpen ? 'unit-selector__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          className="unit-selector__dropdown"
          role="listbox"
          aria-activedescendant={`${id}-option-${units[highlightedIndex]?.id}`}
        >
          {units.map((unit, index) => {
            const isSelected = unit.id === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={unit.id}
                id={`${id}-option-${unit.id}`}
                className={`unit-selector__option ${isSelected ? 'unit-selector__option--selected' : ''} ${isHighlighted ? 'unit-selector__option--highlighted' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(unit.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="unit-selector__option-symbol">{unit.symbol}</span>
                <span className="unit-selector__option-name">{unit.name}</span>
                {isSelected && (
                  <Check size={16} className="unit-selector__check" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
