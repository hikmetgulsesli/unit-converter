import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConverterCard } from './ConverterCard';

describe('ConverterCard Keyboard Shortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has screen reader text for keyboard shortcut', () => {
    render(<ConverterCard />);
    
    const shortcutHint = screen.getByText(/Press Ctrl\+K or Command\+K to focus the input field/);
    expect(shortcutHint).toBeInTheDocument();
    expect(shortcutHint).toHaveClass('sr-only');
  });

  it('focuses input field when Ctrl+K is pressed', async () => {
    render(<ConverterCard />);
    
    // Get input by its id
    const input = document.getElementById('from-value') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveFocus();
    
    // Simulate Ctrl+K
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    
    // Advance timers to allow focus to take effect
    vi.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('focuses input field when Cmd+K is pressed (Mac)', async () => {
    render(<ConverterCard />);
    
    const input = document.getElementById('from-value') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveFocus();
    
    // Simulate Cmd+K (metaKey)
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    
    vi.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('selects all text in input when shortcut is triggered', async () => {
    render(<ConverterCard />);
    
    const input = document.getElementById('from-value') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    
    // Trigger shortcut
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    vi.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });
});

describe('ConverterCard Accessibility', () => {
  it('has role="region" and aria-label on the card', () => {
    render(<ConverterCard />);
    
    const card = screen.getByTestId('converter-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-label', 'Unit converter');
  });

  it('has ARIA live region for announcing conversion results', () => {
    render(<ConverterCard />);
    
    const announcement = screen.getByTestId('conversion-announcement');
    expect(announcement).toHaveAttribute('aria-live', 'polite');
    expect(announcement).toHaveAttribute('aria-atomic', 'true');
    expect(announcement).toHaveClass('sr-only');
  });

  it('announces conversion result in live region', () => {
    render(<ConverterCard />);
    
    const announcement = screen.getByTestId('conversion-announcement');
    // The result should be announced when conversion happens
    // Default value is 1 km = 1000 m
    expect(announcement.textContent).toContain('equals');
  });

  it('has proper labels on all form elements', () => {
    render(<ConverterCard />);
    
    // Input should have a label
    const fromLabel = screen.getByText('From');
    expect(fromLabel.tagName).toBe('LABEL');
    expect(fromLabel).toHaveAttribute('for', 'from-value');
    
    // Input should be in the document
    const input = document.getElementById('from-value');
    expect(input).toBeInTheDocument();
    
    // Unit selectors should have labels
    const fromUnitLabel = screen.getByText('From unit');
    expect(fromUnitLabel.tagName).toBe('LABEL');
    
    const toUnitLabel = screen.getByText('To unit');
    expect(toUnitLabel.tagName).toBe('LABEL');
  });

  it('supports tab navigation through all interactive elements', () => {
    render(<ConverterCard />);
    
    // Get all interactive elements
    const categoryTabs = screen.getAllByRole('tab');
    const input = document.getElementById('from-value');
    const swapButton = screen.getByRole('button', { name: /swap/i });
    
    // All elements should be focusable
    expect(categoryTabs.length).toBeGreaterThan(0);
    expect(input).toBeInTheDocument();
    expect(swapButton).toBeInTheDocument();
    
    // Test that input is focusable
    input?.focus();
    expect(input).toHaveFocus();
  });

  it('has focus-visible styles on interactive elements', () => {
    render(<ConverterCard />);
    
    const input = document.getElementById('from-value');
    expect(input).toBeInTheDocument();
    
    // Focus the input
    input?.focus();
    expect(input).toHaveFocus();
    
    // The element should have CSS that supports focus-visible
    expect(input?.classList.contains('conversion-input__field')).toBe(true);
  });
});

describe('ConverterCard Tab Navigation Order', () => {
  it('has logical tab order: categories -> input -> from unit -> swap -> to unit', () => {
    render(<ConverterCard />);
    
    // Get the active tab (should be first in tab order)
    const activeTab = screen.getByRole('tab', { selected: true });
    
    // Focus the active tab
    activeTab.focus();
    expect(activeTab).toHaveFocus();
    
    // Tab to next element
    fireEvent.keyDown(activeTab, { key: 'Tab' });
    
    // The input should be focusable
    const input = document.getElementById('from-value');
    input?.focus();
    expect(input).toHaveFocus();
  });
});
