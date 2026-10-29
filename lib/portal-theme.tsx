// FILE PATH: lib/portal-theme.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type PortalTheme = 'dark-tech' | 'pro-dark' | 'pro-light';

interface PortalThemeContextType {
  theme: PortalTheme;
  setTheme: (t: PortalTheme) => void;
  cycleTheme: () => void;
}

const PortalThemeContext = createContext<PortalThemeContextType>({
  theme: 'dark-tech',
  setTheme: () => {},
  cycleTheme: () => {},
});

const STORAGE_KEY = 'technova_portal_theme';
const THEMES: PortalTheme[] = ['dark-tech', 'pro-dark', 'pro-light'];

export function migratePortalTheme(storedValue: string | null): PortalTheme {
  if (!storedValue) return 'dark-tech';
  const val = storedValue.toLowerCase().trim();
  if (val === 'dark-tech') return 'dark-tech';
  if (val === 'pro-dark') return 'pro-dark';
  if (val === 'pro-light') return 'pro-light';
  // Safe migration of legacy portal theme values
  if (val === 'minimal-clean' || val === 'minimal' || val === 'clean' || val === 'light') {
    return 'pro-light';
  }
  if (val === 'bold-gradient' || val === 'gradient' || val === 'bold') {
    return 'pro-dark';
  }
  return 'dark-tech';
}

export function PortalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PortalTheme>('dark-tech');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const resolved = migratePortalTheme(raw);
      setThemeState(resolved);
      if (raw && raw !== resolved) {
        localStorage.setItem(STORAGE_KEY, resolved);
      }
    } catch (e) {
      // localStorage may fail in restricted sandboxes
    }
    setMounted(true);
  }, []);

  const setTheme = (t: PortalTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (e) {}
  };

  const cycleTheme = () => {
    const nextIdx = (THEMES.indexOf(theme) + 1) % THEMES.length;
    setTheme(THEMES[nextIdx]);
  };

  return (
    <PortalThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </PortalThemeContext.Provider>
  );
}

export function usePortalTheme() {
  return useContext(PortalThemeContext);
}
