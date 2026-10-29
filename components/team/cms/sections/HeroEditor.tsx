// FILE PATH: components/team/cms/sections/HeroEditor.tsx
'use client';

import React from 'react';
import { HeroSectionContent } from '@/lib/cms-types';

interface HeroEditorProps {
  data: HeroSectionContent;
  onChange: (updated: HeroSectionContent) => void;
}

export default function HeroEditor({ data, onChange }: HeroEditorProps) {
  const update = (fields: Partial<HeroSectionContent>) => {
    onChange({ ...data, ...fields });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 01 // HERO BANNER
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Controls the primary headline, highlighted gradient text, value proposition subtext, status badge, and dual call-to-action buttons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            HEADLINE PREFIX *
          </label>
          <input
            value={data.headlinePrefix}
            onChange={(e) => update({ headlinePrefix: e.target.value })}
            placeholder="e.g. WE ENGINEER"
            className="theme-input font-mono text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--accent)] uppercase mb-1 font-bold">
            HIGHLIGHTED GRADIENT WORDS *
          </label>
          <input
            value={data.highlightWords}
            onChange={(e) => update({ highlightWords: e.target.value })}
            placeholder="e.g. FLAGSHIP DIGITAL PRODUCTS"
            className="theme-input font-mono text-xs border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            HEADLINE SUFFIX *
          </label>
          <input
            value={data.headlineSuffix}
            onChange={(e) => update({ headlineSuffix: e.target.value })}
            placeholder="e.g. THAT DEFY CONVENTIONS."
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
          VALUE PROPOSITION SUBTEXT *
        </label>
        <textarea
          rows={3}
          value={data.subText}
          onChange={(e) => update({ subText: e.target.value })}
          placeholder="Brief 1-2 sentence description of studio capabilities..."
          className="theme-input font-mono text-xs resize-none"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
          AVAILABILITY BADGE TEXT *
        </label>
        <input
          value={data.availabilityBadge}
          onChange={(e) => update({ availabilityBadge: e.target.value })}
          placeholder="e.g. AVAILABLE FOR Q2 & Q3 COMMISSIONS // 120 FPS VERIFIED"
          className="theme-input font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
        <div className="space-y-3">
          <div className="font-mono text-xs font-bold text-[var(--accent)] uppercase">
            PRIMARY CALL TO ACTION (CTA 1)
          </div>
          <div>
            <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              BUTTON LABEL *
            </label>
            <input
              value={data.primaryCtaLabel}
              onChange={(e) => update({ primaryCtaLabel: e.target.value })}
              placeholder="e.g. START A PROJECT"
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              TARGET ANCHOR / ROUTE
            </label>
            <input
              value={data.primaryCtaTarget}
              onChange={(e) => update({ primaryCtaTarget: e.target.value })}
              placeholder="#book or /book"
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-mono text-xs font-bold text-[var(--text)] uppercase">
            SECONDARY CALL TO ACTION (CTA 2)
          </div>
          <div>
            <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              BUTTON LABEL *
            </label>
            <input
              value={data.secondaryCtaLabel}
              onChange={(e) => update({ secondaryCtaLabel: e.target.value })}
              placeholder="e.g. VIEW FEATURED WORK"
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              TARGET ANCHOR / ROUTE
            </label>
            <input
              value={data.secondaryCtaTarget}
              onChange={(e) => update({ secondaryCtaTarget: e.target.value })}
              placeholder="#work-matrix"
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
