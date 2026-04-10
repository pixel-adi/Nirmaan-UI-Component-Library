import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Types ──
export type NirTheme = 'light' | 'dark' | 'high-contrast';
export type NirDensity = 'default' | 'compact' | 'spacious';
export type NirBrand = 'nirman' | 'central-govt' | 'kerala' | 'tamilnadu' | 'up' | string;

export interface NirmanContextType {
  theme: NirTheme;
  setTheme: (t: NirTheme) => void;
  toggleTheme: () => void;
  density: NirDensity;
  setDensity: (d: NirDensity) => void;
  brand: NirBrand;
  setBrand: (b: NirBrand) => void;
}

export interface NirmanProviderProps {
  children: React.ReactNode;
  /** Initial appearance mode */
  defaultTheme?: NirTheme;
  /** Initial density */
  defaultDensity?: NirDensity;
  /** Initial brand identity */
  defaultBrand?: NirBrand;
  /** Root element to apply data attributes to. Defaults to documentElement */
  rootElement?: HTMLElement | null;
}

const NirmanContext = createContext<NirmanContextType | null>(null);

/**
 * NirmanProvider — Wraps your app with theme, density, and brand context.
 *
 * Sets `data-theme`, `data-density`, `data-brand` on the root element,
 * which CSS custom properties resolve against.
 *
 * @example
 * ```tsx
 * <NirmanProvider defaultTheme="light" defaultBrand="kerala">
 *   <App />
 * </NirmanProvider>
 * ```
 */
export function NirmanProvider({
  children,
  defaultTheme = 'light',
  defaultDensity = 'default',
  defaultBrand = 'nirman',
  rootElement,
}: NirmanProviderProps) {
  const [theme, setTheme] = useState<NirTheme>(defaultTheme);
  const [density, setDensity] = useState<NirDensity>(defaultDensity);
  const [brand, setBrand] = useState<NirBrand>(defaultBrand);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Apply data attributes to root element for CSS variable resolution
  useEffect(() => {
    const root = rootElement || document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-density', density);
    root.setAttribute('data-brand', brand);

    return () => {
      // Cleanup only if we're unmounting the provider
      root.removeAttribute('data-theme');
      root.removeAttribute('data-density');
      root.removeAttribute('data-brand');
    };
  }, [theme, density, brand, rootElement]);

  // Respect prefers-color-scheme if no explicit theme set
  useEffect(() => {
    if (defaultTheme) return; // User set explicit default, don't override
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    if (mq.matches) setTheme('dark');
    return () => mq.removeEventListener('change', handler);
  }, [defaultTheme]);

  return (
    <NirmanContext.Provider
      value={{ theme, setTheme, toggleTheme, density, setDensity, brand, setBrand }}
    >
      {children}
    </NirmanContext.Provider>
  );
}

/**
 * useNirman — Access theme, density, and brand context.
 *
 * @example
 * ```tsx
 * const { theme, setTheme, brand } = useNirman();
 * ```
 */
export function useNirman(): NirmanContextType {
  const ctx = useContext(NirmanContext);
  if (!ctx) {
    throw new Error(
      'useNirman() must be used within a <NirmanProvider>. ' +
      'Wrap your app root with <NirmanProvider> to use Nirman theme context.'
    );
  }
  return ctx;
}
