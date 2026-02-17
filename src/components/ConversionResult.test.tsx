import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConversionResult } from './ConversionResult';
import { Unit, UnitCategory } from '../types';

const mockUnit: Unit = {
  id: 'm',
  name: 'Meter',
  symbol: 'm',
  category: UnitCategory.LENGTH,
};

const mockCurrencyUnit: Unit = {
  id: 'USD',
  name: 'US Dollar',
  symbol: '$',
  category: UnitCategory.CURRENCY,
};

describe('ConversionResult', () => {
  it('renders formatted number with unit symbol', () => {
    render(
      <ConversionResult
        value={42.5}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('42.5');
    expect(screen.getByTestId('result-unit')).toHaveTextContent('m');
  });

  it('displays currency symbol correctly', () => {
    render(
      <ConversionResult
        value={100}
        unit={mockCurrencyUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('100');
    expect(screen.getByTestId('result-unit')).toHaveTextContent('$');
  });

  it('shows placeholder (em dash) when value is null', () => {
    render(
      <ConversionResult
        value={null}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('—');
    expect(screen.queryByTestId('result-unit')).not.toBeInTheDocument();
  });

  it('shows placeholder (em dash) when value is undefined', () => {
    render(
      <ConversionResult
        value={undefined}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('—');
    expect(screen.queryByTestId('result-unit')).not.toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        isLoading={true}
      />
    );

    expect(screen.getByText('Converting...')).toBeInTheDocument();
    expect(screen.queryByTestId('result-value')).not.toBeInTheDocument();
  });

  it('displays error message in error state', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        error="Conversion failed"
      />
    );

    expect(screen.getByText('Conversion failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByTestId('result-value')).not.toBeInTheDocument();
  });

  it('error state takes precedence over loading state', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        isLoading={true}
        error="Network error"
      />
    );

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.queryByText('Converting...')).not.toBeInTheDocument();
  });

  it('error state takes precedence over value', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        error="Invalid unit"
      />
    );

    expect(screen.getByText('Invalid unit')).toBeInTheDocument();
    expect(screen.queryByTestId('result-value')).not.toBeInTheDocument();
  });

  it('uses font-variant-numeric: tabular-nums for numbers', () => {
    render(
      <ConversionResult
        value={1234.56}
        unit={mockUnit}
      />
    );

    const valueElement = screen.getByTestId('result-value');
    // Check that the element has the class that applies tabular-nums
    expect(valueElement.className).toContain('conversion-result__value');
  });

  it('renders with custom label', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        label="Converted Value"
      />
    );

    expect(screen.getByText('Converted Value')).toBeInTheDocument();
  });

  it('uses default label "Result" when not specified', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
      />
    );

    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    render(
      <ConversionResult
        value={1234567.89}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('1,234,567.89');
  });

  it('formats very large numbers in scientific notation', () => {
    render(
      <ConversionResult
        value={1e10}
        unit={mockUnit}
      />
    );

    // Scientific notation format may include precision digits
    const valueText = screen.getByTestId('result-value').textContent;
    expect(valueText).toMatch(/1\.?0*e\+10/);
  });

  it('formats very small numbers in scientific notation', () => {
    render(
      <ConversionResult
        value={1e-7}
        unit={mockUnit}
      />
    );

    // Scientific notation format may include precision digits
    const valueText = screen.getByTestId('result-value').textContent;
    expect(valueText).toMatch(/1\.?0*e-7/);
  });

  it('handles zero value correctly', () => {
    render(
      <ConversionResult
        value={0}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('0');
    expect(screen.getByTestId('result-unit')).toHaveTextContent('m');
  });

  it('handles negative numbers correctly', () => {
    render(
      <ConversionResult
        value={-42.5}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('-42.5');
  });

  it('removes trailing zeros from decimal numbers', () => {
    render(
      <ConversionResult
        value={42.000}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('42');
  });

  it('has aria-busy attribute when loading', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        isLoading={true}
      />
    );

    const container = screen.getByText('Converting...').parentElement?.parentElement;
    expect(container).toHaveAttribute('aria-busy', 'true');
  });

  it('has aria-live="polite" for non-error states', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
      />
    );

    const container = screen.getByTestId('result-value').parentElement?.parentElement;
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-live="assertive" for error states', () => {
    render(
      <ConversionResult
        value={42}
        unit={mockUnit}
        error="Critical error"
      />
    );

    const container = screen.getByRole('alert');
    expect(container).toHaveAttribute('aria-live', 'assertive');
  });

  it('handles NaN value as placeholder', () => {
    render(
      <ConversionResult
        value={NaN}
        unit={mockUnit}
      />
    );

    expect(screen.getByTestId('result-value')).toHaveTextContent('—');
  });

  it('displays temperature symbol correctly', () => {
    const tempUnit: Unit = {
      id: 'C',
      name: 'Celsius',
      symbol: '°C',
      category: UnitCategory.TEMPERATURE,
    };

    render(
      <ConversionResult
        value={25}
        unit={tempUnit}
      />
    );

    expect(screen.getByTestId('result-unit')).toHaveTextContent('°C');
  });
});
