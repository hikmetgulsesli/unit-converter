import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryTab } from './CategoryTab';
import { UnitCategory } from '../types';

// Import jest-dom matchers
import '@testing-library/jest-dom';

describe('CategoryTab', () => {
  const categories = [
    UnitCategory.LENGTH,
    UnitCategory.WEIGHT,
    UnitCategory.TEMPERATURE,
    UnitCategory.CURRENCY,
  ];

  it('renders all 4 categories with icons', () => {
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.LENGTH}
        onCategoryChange={() => {}}
      />
    );

    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
  });

  it('renders with correct active category', () => {
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.WEIGHT}
        onCategoryChange={() => {}}
      />
    );

    const weightTab = screen.getByRole('tab', { name: /weight/i });
    expect(weightTab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onCategoryChange when clicking a category', () => {
    const handleChange = vi.fn();
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.LENGTH}
        onCategoryChange={handleChange}
      />
    );

    const weightTab = screen.getByRole('tab', { name: /weight/i });
    fireEvent.click(weightTab);

    expect(handleChange).toHaveBeenCalledWith(UnitCategory.WEIGHT);
  });

  it('renders correct number of tabs', () => {
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.LENGTH}
        onCategoryChange={() => {}}
      />
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
  });

  it('has proper accessibility attributes', () => {
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.TEMPERATURE}
        onCategoryChange={() => {}}
      />
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAccessibleName('Conversion categories');

    const tempTab = screen.getByRole('tab', { name: /temperature/i });
    expect(tempTab).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation with Enter key', () => {
    const handleChange = vi.fn();
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.LENGTH}
        onCategoryChange={handleChange}
      />
    );

    const currencyTab = screen.getByRole('tab', { name: /currency/i });
    currencyTab.focus();
    fireEvent.keyDown(currencyTab, { key: 'Enter', code: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith(UnitCategory.CURRENCY);
  });

  it('supports keyboard navigation with Space key', () => {
    const handleChange = vi.fn();
    render(
      <CategoryTab
        categories={categories}
        activeCategory={UnitCategory.LENGTH}
        onCategoryChange={handleChange}
      />
    );

    const temperatureTab = screen.getByRole('tab', { name: /temperature/i });
    temperatureTab.focus();
    fireEvent.keyDown(temperatureTab, { key: ' ', code: 'Space' });

    expect(handleChange).toHaveBeenCalledWith(UnitCategory.TEMPERATURE);
  });
});
