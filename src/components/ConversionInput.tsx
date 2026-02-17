import './ConversionInput.css';

export interface ConversionInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function ConversionInput({
  value,
  onChange,
  label,
  placeholder = 'Enter value',
  min,
  max,
  step,
  disabled = false,
}: ConversionInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const inputValue = e.target.value;

    // If empty, return null
    if (inputValue === '' || inputValue === '-') {
      onChange(null);
      return;
    }

    // Parse the number
    const parsedValue = parseFloat(inputValue);

    // If invalid number (non-numeric string like "abc"), return null
    // Note: parseFloat parses "123abc" as 123, so we check if entire string is valid
    if (isNaN(parsedValue)) {
      onChange(null);
      return;
    }
    
    // Check if input is a valid number format (not partial like just "-")
    const trimmedValue = inputValue.trim();
    if (trimmedValue === '' || trimmedValue === '-' || trimmedValue === '.') {
      onChange(null);
      return;
    }

    // Return the parsed number
    onChange(parsedValue);
  };

  const handleBlur = () => {
    // Round to reasonable precision on blur to avoid floating point issues
    if (value !== null && !isNaN(value)) {
      const rounded = parseFloat(value.toPrecision(12));
      onChange(rounded);
    }
  };

  // Format value for display in input
  const displayValue = value === null ? '' : String(value);

  return (
    <div className="conversion-input">
      <label htmlFor={`input-${label.toLowerCase()}`} className="conversion-input__label">
        {label}
      </label>
      <div className="conversion-input__wrapper">
        <input
          id={`input-${label.toLowerCase()}`}
          type="number"
          className="conversion-input__field"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={label}
          inputMode="decimal"
        />
      </div>
    </div>
  );
}
