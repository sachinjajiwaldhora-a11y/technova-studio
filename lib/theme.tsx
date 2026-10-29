// FILE PATH: lib/theme.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'dark-tech' | 'minimal-clean' | 'bold-gradient' | 'neo-brutalism';

export interface ThemeMeta {
  id: ThemeType;
  name: string;
  tagline: string;
  colors: {
    bg: string;
    accent: string;
    accent2: string;
    border: string;
  };
}

export const THEMES: Record<ThemeType, ThemeMeta> = {
  'dark-tech': {
    id: 'dark-tech',
    name: 'Dark Tech',
    tagline: 'Hacker Terminal // Cyber Neon',
    colors: {
      bg: '#050811',
      accent: '#00ff66',
      accent2: '#00f0ff',
      border: 'rgba(0, 255, 102, 0.3)',
    },
  },
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    tagline: 'Swiss Style // High Whitespace',
    colors: {
      bg: '#fcfcfd',
      accent: '#2563eb',
      accent2: '#f97316',
      border: '#e2e8f0',
    },
  },
  'bold-gradient': {
    id: 'bold-gradient',
    name: 'Bold Gradient',
    tagline: 'Modern SaaS // Glassmorphic',
    colors: {
      bg: '#0b0c1e',
      accent: '#8b5cf6',
      accent2: '#ec4899',
      border: 'rgba(165, 180, 252, 0.25)',
    },
  },
  'neo-brutalism': {
    id: 'neo-brutalism',
    name: 'Neo-Brutalism',
    tagline: 'Creative Studio // Hard Shadows',
    colors: {
      bg: '#fffbeb',
      accent: '#f43f5e',
      accent2: '#06b6d4',
      border: '#000000',
    },
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  cycleTheme: () => void;
  themes: ThemeMeta[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'technova_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('dark-tech');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Read existing saved theme or system preference
    let initial: ThemeType = 'dark-tech';
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeType;
      if (saved && THEMES[saved]) {
        initial = saved;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        initial = 'minimal-clean';
      }
    } catch {
      // safe fallback
    }

    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
    setMounted(true);
  }, []);

  const setTheme = (nextTheme: ThemeType) => {
    if (!THEMES[nextTheme]) return;
    setThemeState(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // safe fallback
    }
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const cycleTheme = () => {
    const list: ThemeType[] = ['dark-tech', 'minimal-clean', 'bold-gradient', 'neo-brutalism'];
    const idx = list.indexOf(theme);
    const next = list[(idx + 1) % list.length];
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
        themes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
