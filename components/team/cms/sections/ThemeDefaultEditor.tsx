// FILE PATH: components/team/cms/sections/ThemeDefaultEditor.tsx
'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { ThemeDefaultContent, ThemeType } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface ThemeDefaultEditorProps {
  data: ThemeDefaultContent;
  onChange: (updated: ThemeDefaultContent) => void;
  currentUser: StudioMember;
}

const THEME_OPTIONS: { id: ThemeType; name: string; desc: string; previewClass: string }[] = [
  {
    id: 'dark-tech',
    name: 'DARK TECH (CYBERPUNK)',
    desc: 'OLED blacks, neon cyan accents, monospace metrics, and dot-grid spotlight background.',
    previewClass: 'bg-[#0a0a0c] border-cyan-500/40 text-cyan-400',
  },
  {
    id: 'minimal-clean',
    name: 'MINIMAL CLEAN',
    desc: 'Pure crisp paper canvas, Swiss typography, architectural geometry, and subtle grain.',
    previewClass: 'bg-[#fafafa] border-neutral-300 text-neutral-900',
  },
  {
    id: 'bold-gradient',
    name: 'BOLD GRADIENT (AURORA)',
    desc: 'Deep violet space, dynamic aurora mesh gradients, and iridescent glass accents.',
    previewClass: 'bg-[#0f0c1b] border-purple-500/40 text-purple-300',
  },
  {
    id: 'neo-brutalism',
    name: 'NEO-BRUTALISM',
    desc: 'High-contrast canary yellow accents, bold 3px borders, hard drop shadows, and raw typography.',
    previewClass: 'bg-[#fffdf0] border-black text-black',
  },
];

export default function ThemeDefaultEditor({ data, onChange }: ThemeDefaultEditorProps) {
  const update = (defaultTheme: ThemeType) => {
    onChange({ defaultTheme });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 14 // DEFAULT PUBLIC THEME SYSTEM
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Choose the default visual theme loaded for first-time visitors on the public homepage. Visitors can still use the Radial Dial or Command Palette to switch anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = data.defaultTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => update(theme.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--surface-sunken)] shadow-lg'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                  {theme.name}
                </span>
                {isSelected ? (
                  <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                    <Check className="w-3.5 h-3.5" />
                    DEFAULT LIVE
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    SELECT
                  </span>
                )}
              </div>

              <p className="text-xs text-[var(--text-muted)] mb-4">
                {theme.desc}
              </p>

              {/* Theme Mini Swatch Preview */}
              <div className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${theme.previewClass}`}>
                <span>PREVIEW PALETTE</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Aa 123</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
