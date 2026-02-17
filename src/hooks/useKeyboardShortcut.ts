import { useEffect, useCallback } from 'react';

export interface KeyboardShortcutOptions {
  /** Key or key combination to trigger (e.g., 'k', 'ctrl+k', 'cmd+k') */
  key: string;
  /** Callback function to execute when shortcut is triggered */
  callback: () => void;
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Stop event propagation (default: false) */
  stopPropagation?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts
 * Supports: single keys, ctrl+key, cmd+key (meta), alt+key, shift+key
 * 
 * @example
 * useKeyboardShortcut({
 *   key: 'ctrl+k',
 *   callback: () => inputRef.current?.focus(),
 * });
 */
export function useKeyboardShortcut({
  key,
  callback,
  enabled = true,
  preventDefault = true,
  stopPropagation = false,
}: KeyboardShortcutOptions): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Parse the shortcut key
      const parts = key.toLowerCase().split('+');
      const targetKey = parts[parts.length - 1];
      
      // Check modifiers
      const needsCtrl = parts.includes('ctrl');
      const needsCmd = parts.includes('cmd') || parts.includes('meta');
      const needsAlt = parts.includes('alt');
      const needsShift = parts.includes('shift');

      // Check if modifiers match
      const ctrlOrCmdPressed = event.ctrlKey || event.metaKey;
      const hasModifier = needsCtrl || needsCmd || needsAlt || needsShift;
      
      // For shortcuts with ctrl/cmd, accept either (for cross-platform support)
      const modifierMatch = !hasModifier || (
        (needsCtrl || needsCmd ? ctrlOrCmdPressed : true) &&
        (needsAlt ? event.altKey : true) &&
        (needsShift ? event.shiftKey : true)
      );

      // Check if the key matches (case-insensitive)
      const keyMatch = event.key.toLowerCase() === targetKey;

      if (modifierMatch && keyMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback();
      }
    },
    [key, callback, enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Hook specifically for focusing an element with Ctrl/Cmd+K
 * 
 * @example
 * const inputRef = useFocusShortcut<HTMLInputElement>();
 * // Then: <input ref={inputRef} />
 */
export function useFocusShortcut<T extends HTMLElement>(): React.RefObject<T | null> {
  const elementRef = { current: null as T | null };

  useKeyboardShortcut({
    key: 'ctrl+k',
    callback: () => {
      elementRef.current?.focus();
      // Select all text in the input for easy replacement
      if (elementRef.current instanceof HTMLInputElement) {
        elementRef.current.select();
      }
    },
  });

  return elementRef;
}
