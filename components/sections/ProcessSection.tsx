// FILE PATH: components/sections/ProcessSection.tsx
'use client';

import React from 'react';
import { Search, Compass, Code, Rocket, LifeBuoy, ArrowRight, Activity } from 'lucide-react';
import { ProcessContent } from '@/lib/cms-types';

interface ProcessSectionProps {
  onOpenBooking: () => void;
  content?: ProcessContent;
}

const STAGES = [
  {
    step: '01',
    title: 'DISCOVER',
    icon: Search,
    subtitle: 'Telemetry & Tech Specs',
    description:
      'We deconstruct your technical objectives, user friction points, and competitive moats in a 45-minute discovery briefing. We deliver an immutable technical architecture roadmap.',
  },
  {
    step: '02',
    title: 'DESIGN',
    icon: Compass,
    subtitle: 'Kinetic & Token Systems',
    description:
      'We craft high-fidelity Figma components, design token tokens across light, dark, and specialized themes, and choreograph fluid micro-interactions before writing a single line of code.',
  },
  {
    step: '03',
    title: 'BUILD',
    icon: Code,
    subtitle: 'Core Kernel Development',
    description:
      'Engineered in strict TypeScript, raw GLSL shaders, and distributed MongoDB / API layers. Continuous client staging previews let you test live builds in real time.',
  },
  {
    step: '04',
    title: 'LAUNCH',
    icon: Rocket,
    subtitle: 'Production Benchmark QA',
    description:
      'Rigorous Lighthouse 95+ audit pass, cross-browser WebGL stress testing, security hardening, and global edge CDN distribution with zero layout shift.',
  },
  {
    step: '05',
    title: 'SUPPORT',
    icon: LifeBuoy,
    subtitle: 'Sprint Radar & SLAs',
    description:
      'Continuous telemetry health monitoring and milestone tracking through your dedicated client session tracking code, backed by enterprise NDAs and response guarantees.',
  },
];

export default function ProcessSection({ onOpenBooking, content }: ProcessSectionProps) {
  const badgeText = content?.badge || '// SPRINT LIFECYCLE & EXECUTION PROTOCOL';
  const headingText = content?.heading || 'HOW WE BUILD';
  const subText =
    content?.subText ||
    'A battle-tested 5-phase engineering protocol engineered to eliminate scope creep, protect intellectual property, and ship flagships on schedule.';

  const displayStages = content?.steps?.length
    ? content.steps.map((s, idx) => ({
        step: s.step || String(idx + 1).padStart(2, '0'),
        title: s.title,
        icon: STAGES[idx]?.icon || Activity,
        subtitle: s.subtitle,
        description: s.description,
      }))
    : STAGES;

  return (
    <section id="process-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold">
            {badgeText}
          </div>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--text)]">
            {headingText}
          </h2>
          <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
            {subText}
          </p>
        </div>

        {/* Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {displayStages.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="theme-card p-6 flex flex-col justify-between relative group hover:border-[var(--accent)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-black text-[var(--accent)]">
                      {st.step}
                    </span>
                    <div className="w-8 h-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-[var(--text)]">
                    {st.title}
                  </h3>
                  <div className="font-mono text-[9px] text-[var(--accent-2)] uppercase tracking-widest mt-0.5">
                    {st.subtitle}
                  </div>

                  <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed font-light">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center space-x-1.5 font-mono text-[9px] text-[var(--text-dim)]">
                  <span>STAGE 0{idx + 1} OF 05</span>
                  {idx < 4 && <ArrowRight className="w-3 h-3 text-[var(--accent)]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Bottom CTA */}
        <div className="mt-12 p-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-[var(--text)]">
              READY TO COMMENCE STAGE 01 // DISCOVER?
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Lock in your technical scoping call with our lead systems architects.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="theme-btn-primary px-6 py-2.5 text-xs font-bold uppercase whitespace-nowrap"
          >
            <span>INITIATE SPRINT</span>
          </button>
        </div>
      </div>
    </section>
  );
}

