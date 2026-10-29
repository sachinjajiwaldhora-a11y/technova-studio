// FILE PATH: lib/portal-theme.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type PortalTheme = 'dark-tech' | 'minimal-clean' | 'bold-gradient';

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
const THEMES: PortalTheme[] = ['dark-tech', 'minimal-clean', 'bold-gradient'];

export function PortalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PortalTheme>('dark-tech');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PortalTheme | null;
      if (saved && THEMES.includes(saved)) {
        setThemeState(saved);
      }
    } catch (e) {
      // localStorage may fail in restricted iframes
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
