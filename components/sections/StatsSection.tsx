// FILE PATH: components/sections/StatsSection.tsx
'use client';

import React from 'react';
import { Activity, Shield, Award, Users } from 'lucide-react';
import { StatsContent } from '@/lib/cms-types';

interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

interface StatsSectionProps {
  stats?: StatItem[];
  content?: StatsContent;
}

export default function StatsSection({ stats, content }: StatsSectionProps) {
  const displayStats = content?.stats?.length
    ? content.stats.map((s) => ({
        label: s.label,
        value: `${s.value}${s.suffix || ''}`,
      }))
    : stats && stats.length > 0
    ? stats
    : [
        { label: 'FPS LOCKED BENCHMARK', value: '120' },
        { label: 'FLAGSHIPS SHIPPED', value: '12+' },
        { label: 'PLATFORM UPTIME', value: '99.99%' },
        { label: 'GLOBAL JURISDICTIONS', value: '8+' },
      ];

  return (
    <section id="stats-matrix" className="relative z-10 py-20 px-4 sm:px-8 lg:px-16 border-y border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((st, idx) => (
            <div
              key={idx}
              className="theme-card p-6 text-center hover:border-[var(--accent)] transition-all group"
            >
              <div className="font-mono text-3xl sm:text-5xl font-black text-[var(--accent)] group-hover:scale-105 transition-transform">
                {st.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-2 font-bold">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

