import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Unit } from '../types';
import './ConversionResult.css';

export interface ConversionResultProps {
  /** The numeric value to display, or null/undefined for placeholder */
  value: number | null | undefined;
  /** The unit to display with the value */
  unit: Unit;
  /** Whether the conversion is loading */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Optional label for the result */
  label?: string;
}

/**
 * Formats a number for display with appropriate precision
 * Uses tabular-nums for consistent alignment
 */
function formatNumber(value: number): string {
  // For very large or very small numbers, use scientific notation
  if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(4);
  }
  
  // For regular numbers, limit decimal places but keep precision
  // Remove trailing zeros after decimal point
  const formatted = value.toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
  
  return formatted;
}

export function ConversionResult({
  value,
  unit,
  isLoading = false,
  error = null,
  label = 'Result',
}: ConversionResultProps) {
  // Track previous value for fade transition
  const [displayValue, setDisplayValue] = useState<string>('—');
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef<number | null | undefined>(null);
  const isMountedRef = useRef(false);

  // Update display with fade transition when value changes
  useEffect(() => {
    const hasValue = value !== null && value !== undefined && !isNaN(value);
    const newDisplayValue = hasValue ? formatNumber(value) : '—';
    
    // Only animate if value actually changed (not on initial mount)
    if (isMountedRef.current && prevValueRef.current !== value && hasValue) {
      setIsUpdating(true);
      
      // Small delay to allow fade-out, then update value and fade-in
      const timer = setTimeout(() => {
        setDisplayValue(newDisplayValue);
        setIsUpdating(false);
      }, 75);
      
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(newDisplayValue);
      prevValueRef.current = value;
      isMountedRef.current = true;
    }
  }, [value]);
  // Error state takes precedence
  if (error) {
    return (
      <div className="conversion-result" role="alert" aria-live="assertive">
        {label && (
          <span className="conversion-result__label">{label}</span>
        )}
        <div className="conversion-result__error">
          <span className="conversion-result__error-text">{error}</span>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="conversion-result" aria-busy="true" aria-live="polite">
        {label && (
          <span className="conversion-result__label">{label}</span>
        )}
        <div className="conversion-result__loading">
          <Loader2 
            size={24} 
            className="conversion-result__spinner" 
            aria-hidden="true"
          />
          <span className="conversion-result__loading-text">Converting...</span>
        </div>
      </div>
    );
  }

  // Determine display value
  const hasValue = value !== null && value !== undefined && !isNaN(value);
  const displayUnit = hasValue ? unit.symbol : '';

  return (
    <div className="conversion-result" aria-live="polite">
      {label && (
        <span className="conversion-result__label">{label}</span>
      )}
      <div className={`conversion-result__value-container ${isUpdating ? 'conversion-result__value-container--updating' : ''}`}>
        <span 
          className={`conversion-result__value ${!hasValue ? 'conversion-result__value--placeholder' : ''}`}
          data-testid="result-value"
        >
          {displayValue}
        </span>
        {displayUnit && (
          <span className="conversion-result__unit" data-testid="result-unit">
            {displayUnit}
          </span>
        )}
      </div>
    </div>
  );
}
