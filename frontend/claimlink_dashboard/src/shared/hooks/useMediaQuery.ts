import { useEffect, useState } from "react";

/**
 * Custom hook to track whether a media query matches
 * @param query - CSS media query string (e.g., "(min-width: 1024px)")
 * @returns boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is defined (SSR safety)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Return early if window is not defined
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Update state when media query match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

// Common breakpoint constants following Tailwind defaults
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

// Convenience hook for checking if viewport is desktop (lg and above)
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg);
}

// Convenience hook for checking if viewport is mobile (below lg)
export function useIsMobile(): boolean {
  const isDesktop = useIsDesktop();
  return !isDesktop;
}
