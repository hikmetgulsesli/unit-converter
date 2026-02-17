import { ChangeEvent, useCallback, forwardRef } from 'react';
import './ConversionInput.css';

export interface ConversionInputProps {
  /** Current input value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Optional label for the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Optional id for the input element */
  id?: string;
  /** Error message to display */
  error?: string | null;
}

/**
 * Validates if a string is a valid numeric input
 * Allows: numbers, decimal point, negative sign
 */
function isValidNumericInput(value: string): boolean {
  if (value === '' || value === '-') return true;
  // Allow valid number patterns including decimals
  return /^-?\d*\.?\d*$/.test(value);
}

export const ConversionInput = forwardRef<HTMLInputElement, ConversionInputProps>(
  function ConversionInput({
    value,
    onChange,
    label,
    placeholder = '0',
    disabled = false,
    id,
    error = null,
  }, ref) {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        // Only allow valid numeric input
        if (isValidNumericInput(newValue)) {
          onChange(newValue);
        }
      },
      [onChange]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow common keyboard shortcuts including Ctrl+K
      if (e.ctrlKey || e.metaKey) return;
      
      // Prevent multiple decimal points
      if (e.key === '.') {
        if (value.includes('.')) {
          e.preventDefault();
        }
        return;
      }
      
      // Prevent multiple negative signs
      if (e.key === '-') {
        if (value.includes('-') && e.currentTarget.selectionStart !== 0) {
          e.preventDefault();
        }
        return;
      }
      
      // Allow navigation and editing keys
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'Tab',
        'Enter',
        'Escape',
      ];
      
      if (allowedKeys.includes(e.key)) return;
      
      // Allow digits
      if (/^\d$/.test(e.key)) return;
      
      // Prevent other keys
      e.preventDefault();
    };

    return (
      <div className="conversion-input">
        {label && (
          <label className="conversion-input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="conversion-input__wrapper">
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            className={`conversion-input__field ${error ? 'conversion-input__field--error' : ''}`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        {error && (
          <span id={`${id}-error`} className="conversion-input__error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);
