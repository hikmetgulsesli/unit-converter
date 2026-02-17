import { ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import './SwapButton.css';

export interface SwapButtonProps {
  /** Callback fired when the swap button is clicked */
  onSwap: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export function SwapButton({ onSwap, disabled = false }: SwapButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    onSwap();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  return (
    <button
      type="button"
      className={`swap-button ${isAnimating ? 'swap-button--animating' : ''} ${disabled ? 'swap-button--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label="Swap conversion direction"
      title="Swap units"
    >
      <ArrowLeftRight 
        size={20} 
        className="swap-button__icon"
        aria-hidden="true"
      />
    </button>
  );
}
