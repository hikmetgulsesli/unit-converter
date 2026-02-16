import { Ruler, Weight, Thermometer, Banknote } from 'lucide-react';
import { UnitCategory } from '../types';
import './CategoryTab.css';

export interface CategoryTabProps {
  categories: UnitCategory[];
  activeCategory: UnitCategory;
  onCategoryChange: (category: UnitCategory) => void;
}

const iconMap: Record<UnitCategory, React.ReactNode> = {
  [UnitCategory.LENGTH]: <Ruler size={20} aria-hidden="true" />,
  [UnitCategory.WEIGHT]: <Weight size={20} aria-hidden="true" />,
  [UnitCategory.TEMPERATURE]: <Thermometer size={20} aria-hidden="true" />,
  [UnitCategory.CURRENCY]: <Banknote size={20} aria-hidden="true" />,
};

const labelMap: Record<UnitCategory, string> = {
  [UnitCategory.LENGTH]: 'Length',
  [UnitCategory.WEIGHT]: 'Weight',
  [UnitCategory.TEMPERATURE]: 'Temperature',
  [UnitCategory.CURRENCY]: 'Currency',
};

export function CategoryTab({ categories, activeCategory, onCategoryChange }: CategoryTabProps) {
  return (
    <div 
      role="tablist" 
      aria-label="Conversion categories"
      className="category-tab-container"
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${category}`}
            id={`tab-${category}`}
            tabIndex={isActive ? 0 : -1}
            className={`category-tab ${isActive ? 'category-tab--active' : ''}`}
            onClick={() => onCategoryChange(category)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCategoryChange(category);
              }
            }}
          >
            <span className="category-tab__icon">{iconMap[category]}</span>
            <span className="category-tab__label">{labelMap[category]}</span>
            {isActive && <span className="category-tab__indicator" />}
          </button>
        );
      })}
    </div>
  );
}
