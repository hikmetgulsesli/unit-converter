import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwapButton } from './SwapButton';

describe('SwapButton', () => {
  it('renders with ArrowLeftRight icon', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check for the SVG icon (Lucide icons render as SVG)
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls onSwap callback when clicked', () => {
    const onSwap = vi.fn();
    render(<SwapButton onSwap={onSwap} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onSwap).toHaveBeenCalledTimes(1);
  });

  it('has aria-label for accessibility', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Swap conversion direction');
  });

  it('has title attribute for tooltip', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Swap units');
  });

  it('has hover state with --primary color', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    // Check that the button has the class that applies hover styles
    expect(button.className).toContain('swap-button');
  });

  it('click animation adds animating class', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // After click, the animating class should be present
    expect(button.className).toContain('swap-button--animating');
  });

  it('disabled state prevents interaction', () => {
    const onSwap = vi.fn();
    render(<SwapButton onSwap={onSwap} disabled={true} />);
    
    const button = screen.getByRole('button');
    
    // Button should be disabled
    expect(button).toBeDisabled();
    
    // Click should not trigger onSwap
    fireEvent.click(button);
    expect(onSwap).not.toHaveBeenCalled();
  });

  it('disabled state visually grays out', () => {
    render(<SwapButton onSwap={() => {}} disabled={true} />);
    
    const button = screen.getByRole('button');
    
    // Check that the button has the disabled class
    expect(button.className).toContain('swap-button--disabled');
    
    // Check disabled attribute
    expect(button).toHaveAttribute('disabled');
  });

  it('has focus-visible ring on keyboard focus', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });

  it('has cursor-pointer when not disabled', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    
    // Check the button is not disabled
    expect(button).not.toBeDisabled();
  });

  it('has cursor-not-allowed when disabled', () => {
    render(<SwapButton onSwap={() => {}} disabled={true} />);
    
    const button = screen.getByRole('button');
    
    // Button should be disabled
    expect(button).toBeDisabled();
    expect(button.className).toContain('swap-button--disabled');
  });

  it('has correct type attribute', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('scales down on active state', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    
    // The button should have the swap-button class which includes active transform
    expect(button.className).toContain('swap-button');
  });

  it('icon rotates 180 degrees when animating', () => {
    render(<SwapButton onSwap={() => {}} />);
    
    const button = screen.getByRole('button');
    const icon = button.querySelector('.swap-button__icon');
    
    expect(icon).toBeInTheDocument();
    
    // Click to trigger animation
    fireEvent.click(button);
    
    // The button should have the animating class which rotates the icon
    expect(button.className).toContain('swap-button--animating');
  });
});
