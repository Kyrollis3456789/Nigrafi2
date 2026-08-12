import { useState, useEffect } from 'react';

/**
 * Hook that tracks a CSS media query match state.
 * Consolidates the duplicated mobile detection from LeftSidebar and ContextMenu.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Convenience hook for mobile (coarse pointer) detection.
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

/**
 * Convenience hook for small screen (< 768px) detection.
 */
export function useIsSmallScreen(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
