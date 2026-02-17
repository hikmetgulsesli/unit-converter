import { History } from 'lucide-react';
import './ConversionHistory.css';

export interface ConversionHistoryItem {
  /** The input value */
  value: number;
  /** The unit being converted from */
  fromUnit: string;
  /** The unit being converted to */
  toUnit: string;
  /** The conversion result */
  result: number;
  /** The from unit symbol */
  fromSymbol: string;
  /** The to unit symbol */
  toSymbol: string;
  /** Optional timestamp */
  timestamp?: number;
}

export interface ConversionHistoryProps {
  /** Array of conversion history items (last 5) */
  items: ConversionHistoryItem[];
}

/**
 * Formats a number for display with appropriate precision
 */
function formatNumber(value: number): string {
  // For very large or very small numbers, use scientific notation
  if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(4);
  }
  
  // For regular numbers, limit decimal places but keep precision
  const formatted = value.toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
  
  return formatted;
}

/**
 * ConversionHistory component displays the last 5 conversions
 * Each item shows: value fromUnit → result toUnit
 */
export function ConversionHistory({ items }: ConversionHistoryProps) {
  const hasItems = items.length > 0;

  return (
    <div className="conversion-history" data-testid="conversion-history">
      <div className="conversion-history__header">
        <History size={18} className="conversion-history__icon" aria-hidden="true" />
        <h3 className="conversion-history__title">Recent Conversions</h3>
      </div>

      {!hasItems ? (
        <div className="conversion-history__empty" data-testid="history-empty">
          <p className="conversion-history__empty-text">
            No conversions yet. Start converting to see your history here.
          </p>
        </div>
      ) : (
        <ul 
          className="conversion-history__list" 
          role="list"
          aria-label="Recent conversions"
        >
          {items.map((item, index) => (
            <li 
              key={item.timestamp || index}
              className="conversion-history__item"
              data-testid="history-item"
            >
              <span className="conversion-history__from">
                <span className="conversion-history__value" data-testid="history-from-value">
                  {formatNumber(item.value)}
                </span>
                <span className="conversion-history__unit" data-testid="history-from-unit">
                  {item.fromSymbol}
                </span>
              </span>
              <span className="conversion-history__arrow" aria-hidden="true">
                →
              </span>
              <span className="conversion-history__to">
                <span className="conversion-history__value" data-testid="history-to-value">
                  {formatNumber(item.result)}
                </span>
                <span className="conversion-history__unit" data-testid="history-to-unit">
                  {item.toSymbol}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
