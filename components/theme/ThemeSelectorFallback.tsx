// FILE PATH: components/theme/ThemeSelectorFallback.tsx
'use client';

import React from 'react';
import { useTheme, THEMES, ThemeType } from '@/lib/theme';
import { Check } from 'lucide-react';

interface ThemeSelectorFallbackProps {
  variant?: 'segmented' | 'dropdown' | 'compact';
  className?: string;
}

export default function ThemeSelectorFallback({
  variant = 'segmented',
  className = '',
}: ThemeSelectorFallbackProps) {
  const { theme, setTheme, themes } = useTheme();

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)] ${className}`}
        role="group"
        aria-label="Select Theme"
      >
        {themes.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'scale-110 shadow-sm ring-2 ring-[var(--accent)]'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: t.colors.accent }}
              title={`${t.name} (${t.tagline})`}
              aria-label={`Switch to ${t.name} theme`}
              aria-pressed={isActive}
            >
              {isActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm ${className}`}
      role="radiogroup"
      aria-label="Theme selector"
    >
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius)] transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
              style={{ backgroundColor: t.colors.accent }}
            />
            <span className="hidden sm:inline font-mono text-[11px]">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
