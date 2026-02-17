import { useRef, useCallback } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

export interface UseFocusShortcutOptions {
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Callback when focus is triggered (optional) */
  onFocus?: () => void;
}

/**
 * Hook for focusing an input element with Ctrl/Cmd+K keyboard shortcut
 * Returns a ref to attach to the element that should receive focus
 * 
 * @example
 * function MyComponent() {
 *   const inputRef = useFocusShortcut<HTMLInputElement>();
 *   return <input ref={inputRef} />;
 * }
 */
export function useFocusShortcut<T extends HTMLElement>(
  options: UseFocusShortcutOptions = {}
): React.RefObject<T | null> {
  const { enabled = true, onFocus } = options;
  const elementRef = useRef<T>(null);

  const handleFocus = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.focus();
      // Select all text in input elements for easy replacement
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.select();
      }
      onFocus?.();
    }
  }, [onFocus]);

  useKeyboardShortcut({
    key: 'ctrl+k',
    callback: handleFocus,
    enabled,
  });

  return elementRef;
}
