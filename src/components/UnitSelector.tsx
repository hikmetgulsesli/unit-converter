import { Unit } from '../types';
import './UnitSelector.css';

export interface UnitSelectorProps {
  units: Unit[];
  value: string;
  onChange: (unitId: string) => void;
  label: string;
  disabled?: boolean;
}

export function UnitSelector({ units, value, onChange, label, disabled = false }: UnitSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="unit-selector">
      <label htmlFor={`unit-select-${label.toLowerCase()}`} className="unit-selector__label">
        {label}
      </label>
      <div className="unit-selector__wrapper">
        <select
          id={`unit-select-${label.toLowerCase()}`}
          className="unit-selector__select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-label={`${label} unit`}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.symbol} - {unit.name}
            </option>
          ))}
        </select>
        <span className="unit-selector__arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
