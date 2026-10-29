// FILE PATH: components/theme/RadialThemeDial.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme, THEMES, ThemeType } from '@/lib/theme';
import { Compass, X, Check, Disc3 } from 'lucide-react';

interface QuadrantInfo {
  id: ThemeType;
  name: string;
  shortName: string;
  angle: number; // in degrees: 0 = Top, 90 = Right, 180 = Bottom, 270 = Left
  accent: string;
  bg: string;
  labelPosition: { x: number; y: number };
}

const QUADRANTS: QuadrantInfo[] = [
  {
    id: 'dark-tech',
    name: 'Dark Tech',
    shortName: 'TECH',
    angle: 0,
    accent: '#00ff66',
    bg: '#050811',
    labelPosition: { x: 110, y: 35 },
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    shortName: 'SWISS',
    angle: 90,
    accent: '#2563eb',
    bg: '#ffffff',
    labelPosition: { x: 185, y: 110 },
  },
  {
    id: 'bold-gradient',
    name: 'Bold Gradient',
    shortName: 'SAAS',
    angle: 180,
    accent: '#8b5cf6',
    bg: '#0b0c1e',
    labelPosition: { x: 110, y: 185 },
  },
  {
    id: 'neo-brutalism',
    name: 'Neo-Brutalism',
    shortName: 'STUDIO',
    angle: 270,
    accent: '#f43f5e',
    bg: '#fef08a',
    labelPosition: { x: 35, y: 110 },
  },
];

export default function RadialThemeDial() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active angle
  const currentQuadrant = QUADRANTS.find((q) => q.id === theme) || QUADRANTS[0];
  const handAngle = currentQuadrant.angle;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setTheme('dark-tech');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setTheme('minimal-clean');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setTheme('bold-gradient');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setTheme('neo-brutalism');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setTheme]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-50 select-none"
      aria-label="Theme Switcher Dial"
    >
      {/* ─── RADIAL WATCH-STYLE EXPANDED DIAL ─── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Radial Theme Bezel"
          className="absolute bottom-16 left-0 w-64 h-64 p-3 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-elevated)] backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-200"
          style={{
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 25px ${currentQuadrant.accent}33`,
          }}
        >
          {/* Watch Bezel Outer Ring */}
          <div className="relative w-full h-full rounded-full border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center overflow-hidden">
            {/* Bezel Hour Marks (12, 3, 6, 9) */}
            <div className="absolute top-1.5 w-1 h-3 bg-[var(--text-muted)] rounded-full" />
            <div className="absolute right-1.5 w-3 h-1 bg-[var(--text-muted)] rounded-full" />
            <div className="absolute bottom-1.5 w-1 h-3 bg-[var(--text-muted)] rounded-full" />
            <div className="absolute left-1.5 w-3 h-1 bg-[var(--text-muted)] rounded-full" />

            {/* Quadrant Clickable Regions */}
            {QUADRANTS.map((q) => {
              const isSelected = theme === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setTheme(q.id)}
                  aria-label={`Select ${q.name} theme`}
                  aria-pressed={isSelected}
                  className={`group absolute p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'scale-110 z-20 font-bold'
                      : 'opacity-70 hover:opacity-100 hover:scale-105 z-10'
                  }`}
                  style={{
                    left: `${q.labelPosition.x}px`,
                    top: `${q.labelPosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-offset-2 ring-offset-[var(--bg)] ring-[var(--accent)] scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: q.accent,
                      borderColor: isSelected ? '#ffffff' : 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                  </span>
                  <span
                    className="mt-1 font-mono text-[9px] tracking-wider uppercase"
                    style={{
                      color: isSelected ? q.accent : 'var(--text-muted)',
                    }}
                  >
                    {q.shortName}
                  </span>
                </button>
              );
            })}

            {/* Central Animated Watch Hand / Bezel Indicator */}
            <div
              className="absolute w-36 h-36 rounded-full pointer-events-none transition-transform duration-500 ease-out flex items-center justify-center"
              style={{
                transform: `rotate(${handAngle}deg)`,
              }}
            >
              {/* Watch Hand pointing to North (0 deg) */}
              <div
                className="absolute top-3 w-1.5 h-14 rounded-full shadow-md"
                style={{
                  backgroundColor: currentQuadrant.accent,
                  boxShadow: `0 0 12px ${currentQuadrant.accent}`,
                }}
              />
            </div>

            {/* Center Pivot Jewel */}
            <div
              className="relative z-30 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center shadow-inner"
              style={{
                backgroundColor: currentQuadrant.accent,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
            </div>

            {/* Close button in top-right corner of bezel */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close theme dial"
              className="absolute top-2 right-2 z-30 p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom helper text */}
          <div className="text-center mt-2 font-mono text-[9px] text-[var(--text-muted)]">
            USE ARROW KEYS OR CLICK DIAL
          </div>
        </div>
      )}

      {/* ─── DOCKED FLOATING BEZEL BUTTON (Watch Crown / Dial Trigger) ─── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Watch Theme Dial"
        aria-expanded={isOpen}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-lg hover:border-[var(--accent)] hover:scale-105 transition-all"
        style={{
          boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 15px ${currentQuadrant.accent}22`,
        }}
      >
        {/* Animated Dial Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Disc3
            className="w-5 h-5 animate-spin-slow transition-transform group-hover:rotate-90 duration-500"
            style={{ color: currentQuadrant.accent }}
          />
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: currentQuadrant.accent }}
          />
        </div>

        {/* Theme Name */}
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[var(--text)]">
          {currentQuadrant.name}
        </span>

        {/* Small Mode Pip */}
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: currentQuadrant.accent }}
        />
      </button>
    </div>
  );
}
