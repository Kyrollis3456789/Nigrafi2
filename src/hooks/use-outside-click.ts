import { useEffect, useRef } from 'react';

/**
 * Hook that detects clicks outside of a referenced element and calls the handler.
 * Consolidates the duplicated outside-click logic from Header, ContextMenu, LeftSidebar.
 */
export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  enabled: boolean = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler, enabled]);

  return ref;
}
