// FILE PATH: components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { ArrowUpRight, Calendar, Sparkles, Terminal, Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { HeroSectionContent } from '@/lib/cms-types';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenCall: () => void;
  tagline?: string;
  subTagline?: string;
  content?: HeroSectionContent;
}

export default function HeroSection({
  onOpenBooking,
  onOpenCall,
  tagline = 'WE BUILD BEYOND DIGITAL EXPERIENCES',
  subTagline = 'An elite engineering collective crafting high-performance WebGL platforms, custom AI architectures, and flagship digital products.',
  content,
}: HeroSectionProps) {
  const headlinePrefix = content?.headlinePrefix || 'WE ENGINEER';
  const highlightWords = content?.highlightWords || 'FLAGSHIP DIGITAL PRODUCTS';
  const headlineSuffix = content?.headlineSuffix || 'THAT DEFY CONVENTIONS.';
  const displaySubtext = content?.subText || subTagline;
  const badgeText = content?.availabilityBadge || 'AVAILABLE FOR Q2 & Q3 COMMISSIONS // 120 FPS VERIFIED';
  const primaryBtnText = content?.primaryCtaLabel || 'START A SPRINT // TRANSMIT BRIEF';
  const secondaryBtnText = content?.secondaryCtaLabel || 'SCHEDULE DISCOVERY CALL';
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-8 lg:px-16 pt-28 pb-16 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full blur-[160px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, var(--accent-2) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Live Status Badge */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-glass)] backdrop-blur-md shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent)]">
            AVAILABLE FOR Q2 & Q3 COMMISSIONS // 120 FPS VERIFIED
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase leading-[0.98] text-[var(--text)]">
          {headlinePrefix} <br />
          <span className="bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            {highlightWords}
          </span>{' '}
          <br />
          {headlineSuffix}
        </h1>

        {/* Sub-text */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--text-muted)] font-light leading-relaxed">
          {displaySubtext}
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onOpenBooking}
            className="theme-btn-primary px-7 py-3.5 text-xs font-bold uppercase tracking-wider"
          >
            <span>{primaryBtnText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              document.getElementById('work-matrix')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="theme-btn-secondary px-7 py-3.5 text-xs font-bold uppercase tracking-wider"
          >
            <span>VIEW FEATURED WORK</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCall}
            className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-elevated)] font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all uppercase"
          >
            <Calendar className="w-4 h-4 text-[var(--accent)]" />
            <span>{secondaryBtnText}</span>
          </button>
        </div>

        {/* Trust micro-bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[var(--text-muted)] font-mono text-[11px]">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>ENTERPRISE NDA ENFORCED</span>
          </span>
          <span className="hidden sm:inline text-[var(--border)]">•</span>
          <span className="flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-[var(--accent-2)]" />
            <span>ZERO-LATENCY GUARANTEE</span>
          </span>
          <span className="hidden sm:inline text-[var(--border)]">•</span>
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>DIRECT ARCHITECT ACCESS</span>
          </span>
        </div>
      </div>
    </section>
  );
}

