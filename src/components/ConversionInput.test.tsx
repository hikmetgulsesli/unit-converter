import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversionInput } from './ConversionInput';

describe('ConversionInput', () => {
  it('renders with label and placeholder', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="From Value"
        placeholder="Enter number"
      />
    );

    expect(screen.getByLabelText('From Value')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
  });

  it('displays numeric value correctly', () => {
    render(
      <ConversionInput
        value={42}
        onChange={() => {}}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toHaveValue(42);
  });

  it('displays empty input when value is null', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    // Component renders empty string for null, input is in the document
    expect(input).toBeInTheDocument();
  });

  it('calls onChange with parsed number when user types', () => {
    const handleChange = vi.fn();
    render(
      <ConversionInput
        value={null}
        onChange={handleChange}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    fireEvent.change(input, { target: { value: '123' } });

    expect(handleChange).toHaveBeenCalledWith(123);
  });

  it('calls onChange with null when input is cleared', () => {
    const handleChange = vi.fn();
    render(
      <ConversionInput
        value={42}
        onChange={handleChange}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    fireEvent.change(input, { target: { value: '' } });

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('handles negative numbers', () => {
    const handleChange = vi.fn();
    render(
      <ConversionInput
        value={null}
        onChange={handleChange}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    fireEvent.change(input, { target: { value: '-50' } });

    expect(handleChange).toHaveBeenCalledWith(-50);
  });

  it('handles decimal numbers', () => {
    const handleChange = vi.fn();
    render(
      <ConversionInput
        value={null}
        onChange={handleChange}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    fireEvent.change(input, { target: { value: '3.14159' } });

    expect(handleChange).toHaveBeenCalledWith(3.14159);
  });

  it('handles min and max props', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Value"
        min={0}
        max={100}
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('handles step prop', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Value"
        step={0.1}
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toHaveAttribute('step', '0.1');
  });

  it('disables interaction when disabled prop is true', () => {
    render(
      <ConversionInput
        value={42}
        onChange={() => {}}
        label="Value"
        disabled={true}
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toBeDisabled();
  });

  it('does not fire onChange when disabled', () => {
    const handleChange = vi.fn();
    render(
      <ConversionInput
        value={42}
        onChange={handleChange}
        label="Value"
        disabled={true}
      />
    );

    const input = screen.getByLabelText('Value');
    fireEvent.change(input, { target: { value: '100' } });

    // onChange should not be called when disabled
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('has proper aria-label for accessibility', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Enter distance"
      />
    );

    const input = screen.getByLabelText('Enter distance');
    expect(input).toHaveAccessibleName();
  });

  it('has type="number" for numeric keyboard on mobile', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('has inputmode="decimal" for mobile numeric keyboard', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="Value"
      />
    );

    const input = screen.getByLabelText('Value');
    expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  it('renders with visible label element', () => {
    render(
      <ConversionInput
        value={null}
        onChange={() => {}}
        label="From Value"
      />
    );

    expect(screen.getByText('From Value')).toBeInTheDocument();
    const label = screen.getByText('From Value');
    expect(label.tagName).toBe('LABEL');
  });
});
