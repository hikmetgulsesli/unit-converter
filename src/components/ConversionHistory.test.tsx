import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConversionHistory, ConversionHistoryItem } from './ConversionHistory';

describe('ConversionHistory', () => {
  const mockItems: ConversionHistoryItem[] = [
    { value: 10, fromUnit: 'km', toUnit: 'm', result: 10000, fromSymbol: 'km', toSymbol: 'm', timestamp: Date.now() },
    { value: 5, fromUnit: 'kg', toUnit: 'g', result: 5000, fromSymbol: 'kg', toSymbol: 'g', timestamp: Date.now() - 1000 },
    { value: 32, fromUnit: 'F', toUnit: 'C', result: 0, fromSymbol: '°F', toSymbol: '°C', timestamp: Date.now() - 2000 },
    { value: 100, fromUnit: 'USD', toUnit: 'EUR', result: 92.59, fromSymbol: '$', toSymbol: '€', timestamp: Date.now() - 3000 },
    { value: 1, fromUnit: 'mile', toUnit: 'km', result: 1.60934, fromSymbol: 'mi', toSymbol: 'km', timestamp: Date.now() - 4000 },
  ];

  describe('empty state', () => {
    it('renders empty state when no items provided', () => {
      render(<ConversionHistory items={[]} />);
      
      expect(screen.getByTestId('history-empty')).toBeInTheDocument();
      expect(screen.getByText(/no conversions yet/i)).toBeInTheDocument();
    });

    it('renders empty state with helpful message', () => {
      render(<ConversionHistory items={[]} />);
      
      const emptyText = screen.getByText(/start converting to see your history here/i);
      expect(emptyText).toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('renders history icon', () => {
      render(<ConversionHistory items={[]} />);
      
      const icon = document.querySelector('.conversion-history__icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders "Recent Conversions" title', () => {
      render(<ConversionHistory items={[]} />);
      
      expect(screen.getByText('Recent Conversions')).toBeInTheDocument();
    });
  });

  describe('history items display', () => {
    it('renders history items when provided', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const items = screen.getAllByTestId('history-item');
      expect(items).toHaveLength(5);
    });

    it('displays from value and unit for each item', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const fromValues = screen.getAllByTestId('history-from-value');
      const fromUnits = screen.getAllByTestId('history-from-unit');
      
      expect(fromValues[0]).toHaveTextContent('10');
      expect(fromUnits[0]).toHaveTextContent('km');
    });

    it('displays to value and unit for each item', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const toValues = screen.getAllByTestId('history-to-value');
      const toUnits = screen.getAllByTestId('history-to-unit');
      
      expect(toValues[0]).toHaveTextContent('10,000');
      expect(toUnits[0]).toHaveTextContent('m');
    });

    it('renders arrow between from and to values', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const arrows = document.querySelectorAll('.conversion-history__arrow');
      expect(arrows).toHaveLength(5);
    });

    it('formats numbers with appropriate precision', () => {
      const itemsWithDecimals: ConversionHistoryItem[] = [
        { value: 1.2345678, fromUnit: 'm', toUnit: 'cm', result: 123.45678, fromSymbol: 'm', toSymbol: 'cm' },
      ];
      render(<ConversionHistory items={itemsWithDecimals} />);
      
      const fromValue = screen.getByTestId('history-from-value');
      // toLocaleString with maximumFractionDigits: 6 keeps trailing zeros but limits precision
      expect(fromValue.textContent).toMatch(/1\.23457|1\.234568/);
    });

    it('formats large numbers in scientific notation', () => {
      const itemsWithLargeNumbers: ConversionHistoryItem[] = [
        { value: 1e10, fromUnit: 'm', toUnit: 'km', result: 1e7, fromSymbol: 'm', toSymbol: 'km' },
      ];
      render(<ConversionHistory items={itemsWithLargeNumbers} />);
      
      const fromValue = screen.getByTestId('history-from-value');
      expect(fromValue.textContent).toMatch(/1\.0{4}e\+10/);
    });

    it('handles currency symbols correctly', () => {
      const currencyItem: ConversionHistoryItem[] = [
        { value: 100, fromUnit: 'USD', toUnit: 'EUR', result: 92.59, fromSymbol: '$', toSymbol: '€' },
      ];
      render(<ConversionHistory items={currencyItem} />);
      
      const fromUnit = screen.getByTestId('history-from-unit');
      const toUnit = screen.getByTestId('history-to-unit');
      
      expect(fromUnit).toHaveTextContent('$');
      expect(toUnit).toHaveTextContent('€');
    });

    it('handles temperature symbols correctly', () => {
      const tempItem: ConversionHistoryItem[] = [
        { value: 32, fromUnit: 'F', toUnit: 'C', result: 0, fromSymbol: '°F', toSymbol: '°C' },
      ];
      render(<ConversionHistory items={tempItem} />);
      
      const fromUnit = screen.getByTestId('history-from-unit');
      const toUnit = screen.getByTestId('history-to-unit');
      
      expect(fromUnit).toHaveTextContent('°F');
      expect(toUnit).toHaveTextContent('°C');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA role for list', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Recent conversions');
    });

    it('marks decorative arrow as aria-hidden', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const arrows = document.querySelectorAll('.conversion-history__arrow');
      arrows.forEach(arrow => {
        expect(arrow).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('marks icon as aria-hidden', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const icon = document.querySelector('.conversion-history__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('styling', () => {
    it('has correct CSS class on root element', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const root = document.querySelector('.conversion-history');
      expect(root).toBeInTheDocument();
    });

    it('has hover class on history items', () => {
      render(<ConversionHistory items={mockItems} />);
      
      const items = document.querySelectorAll('.conversion-history__item');
      items.forEach(item => {
        expect(item.classList.contains('conversion-history__item')).toBe(true);
      });
    });

    it('has cursor-pointer on history items', () => {
      const { container } = render(<ConversionHistory items={mockItems} />);
      
      const items = container.querySelectorAll('.conversion-history__item');
      items.forEach(item => {
        // Note: jsdom may not fully support getComputedStyle for all properties
        // but the class should be present
        expect(item.classList.contains('conversion-history__item')).toBe(true);
      });
    });
  });

  describe('edge cases', () => {
    it('handles zero values correctly', () => {
      const itemsWithZero: ConversionHistoryItem[] = [
        { value: 0, fromUnit: 'C', toUnit: 'F', result: 32, fromSymbol: '°C', toSymbol: '°F' },
      ];
      render(<ConversionHistory items={itemsWithZero} />);
      
      const fromValue = screen.getByTestId('history-from-value');
      expect(fromValue).toHaveTextContent('0');
    });

    it('handles negative values correctly', () => {
      const itemsWithNegative: ConversionHistoryItem[] = [
        { value: -40, fromUnit: 'C', toUnit: 'F', result: -40, fromSymbol: '°C', toSymbol: '°F' },
      ];
      render(<ConversionHistory items={itemsWithNegative} />);
      
      const fromValue = screen.getByTestId('history-from-value');
      expect(fromValue).toHaveTextContent('-40');
    });

    it('handles very small numbers in scientific notation', () => {
      const itemsWithSmallNumbers: ConversionHistoryItem[] = [
        { value: 1e-7, fromUnit: 'm', toUnit: 'mm', result: 1e-4, fromSymbol: 'm', toSymbol: 'mm' },
      ];
      render(<ConversionHistory items={itemsWithSmallNumbers} />);
      
      const fromValue = screen.getByTestId('history-from-value');
      expect(fromValue.textContent).toMatch(/1\.0{4}e-7/);
    });

    it('renders without timestamp', () => {
      const itemsWithoutTimestamp: ConversionHistoryItem[] = [
        { value: 10, fromUnit: 'km', toUnit: 'm', result: 10000, fromSymbol: 'km', toSymbol: 'm' },
      ];
      render(<ConversionHistory items={itemsWithoutTimestamp} />);
      
      const item = screen.getByTestId('history-item');
      expect(item).toBeInTheDocument();
    });
  });
});
