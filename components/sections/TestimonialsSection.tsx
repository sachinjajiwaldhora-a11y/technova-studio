// FILE PATH: components/sections/TestimonialsSection.tsx
'use client';

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Technova engineered our orbital telemetry engine at locked 120 FPS when three previous agencies told us it was technically impossible in a web browser. Outstanding technical rigor and zero compromises on speed.',
    author: 'Vikramaditya Rao',
    role: 'Founder & CEO',
    company: 'Aetherius Quantum Systems',
    clearance: 'VERIFIED CLIENT // MISSION TELEMETRY',
  },
  {
    quote:
      'Zero-knowledge client architecture delivered two weeks ahead of schedule. Their attention to defense-grade security protocols, strict TypeScript, and kinetic UI choreography is light-years ahead of the industry.',
    author: 'Elena Rostova',
    role: 'VP of Engineering',
    company: 'Krypton Defense AI',
    clearance: 'VERIFIED CLIENT // ENTERPRISE CLEARANCE',
  },
  {
    quote:
      'Our institutional sales conversion tripled after deploying Technova’s real-time 3D dashboard. Enterprise leads immediately recognize they are interacting with an institutional-grade platform.',
    author: 'Siddharth Mehra',
    role: 'Lead Architect',
    company: 'NovaPulse Analytics',
    clearance: 'VERIFIED CLIENT // HIGH-GROWTH SAAS',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold">
            // CLIENT VALIDATION & DIRECT ENDORSEMENTS
          </div>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--text)]">
            PROOF OF EXCELLENCE
          </h2>
          <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
            Read what technical founders and enterprise engineering directors say after deploying Technova Studio architectures.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="theme-card p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
                  <div className="flex space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[var(--text-dim)]" />
                </div>

                <p className="text-sm text-[var(--text)] leading-relaxed font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border)]">
                <div className="font-mono text-sm font-bold text-[var(--text)]">
                  {t.author}
                </div>
                <div className="font-mono text-[11px] text-[var(--accent)] mt-0.5">
                  {t.role} // {t.company}
                </div>
                <div className="font-mono text-[8px] tracking-wider text-[var(--text-muted)] mt-1 uppercase flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{t.clearance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
