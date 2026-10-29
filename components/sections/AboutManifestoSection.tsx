// FILE PATH: components/sections/AboutManifestoSection.tsx
'use client';

import React from 'react';
import { Shield, Cpu, Lock, Sparkles, Terminal, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { StudioCMSConfig } from '@/lib/store';
import { AboutContent } from '@/lib/cms-types';

interface AboutManifestoSectionProps {
  about?: StudioCMSConfig['aboutUs'] | AboutContent;
  cmsData?: AboutContent;
  onOpenBooking: () => void;
  onOpenJoin: () => void;
}

export default function AboutManifestoSection({
  about: legacyAbout,
  cmsData,
  onOpenBooking,
  onOpenJoin,
}: AboutManifestoSectionProps) {
  const activeAbout = cmsData || (legacyAbout as any) || {};
  return (
    <section id="about-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>STUDIO DOSSIER // MANIFESTO & TRUST ARCHITECTURE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Manifesto & Identity */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight text-[var(--text)]">
              {activeAbout.heroTagline || 'WE BUILD BEYOND DIGITAL'}
            </h2>

            <p className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider">
              // {activeAbout.subTagline || 'An elite collective of systems architects.'}
            </p>

            <div className="border-l-2 border-[var(--accent)] pl-6 py-2">
              <p className="text-[var(--text)] text-sm sm:text-base leading-relaxed font-light">
                {activeAbout.manifesto ||
                  'Technova Studio is not an agency. We are an engineering collective — a unit of high-caliber architects who craft digital experiences that defy conventional browser limits.'}
              </p>
            </div>

            {/* Core Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="theme-card p-5 space-y-2">
                <div className="flex items-center space-x-1.5 text-[var(--accent)] font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>MISSION & VISION</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">
                  {activeAbout.vision || 'Pioneering zero-latency spatial web architectures and mission-critical digital interfaces.'}
                </p>
              </div>

              <div className="theme-card p-5 space-y-2">
                <div className="flex items-center space-x-1.5 text-[var(--accent-2)] font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>ENGINEERING STANDARDS</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">
                  {activeAbout.methodology || 'Bespoke GLSL shaders, strict TypeScript, zero-knowledge security, and verified 120 FPS standards.'}
                </p>
              </div>
            </div>

            {/* Enterprise Security Guarantee */}
            <div className="theme-card p-5 flex items-start space-x-3.5">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  ENTERPRISE INTEGRITY & NDA GUARANTEE
                </span>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed font-light">
                  {activeAbout.securityGuarantee || 'Enterprise NDA enforced on day zero. Isolated client staging environments and dedicated clearance.'}
                </p>
              </div>
            </div>

            {/* Studio Highlight Quote */}
            <div className="theme-card p-5 font-mono text-xs space-y-1 bg-[var(--surface)]">
              <div className="text-[var(--accent-2)] text-[10px] uppercase tracking-widest font-bold">
                SPECIALIZED ARCHITECTURE HIGHLIGHT:
              </div>
              <p className="text-[var(--text)] italic">
                &ldquo;{activeAbout.teamHighlight || 'Zero compromises on compute latency.'}&rdquo;
              </p>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3 pt-2 font-mono text-[10px]">
              <div className="px-3.5 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-[var(--text-muted)]">ESTABLISHED: </span>
                <span className="text-[var(--text)] font-bold">{activeAbout.foundedYear || '2024'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-[var(--text-muted)]">OPERATIONS: </span>
                <span className="text-[var(--text)] font-bold">{activeAbout.location || 'GLOBAL // DISTRIBUTED'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-[var(--text-muted)]">DISPATCH: </span>
                <span className="text-[var(--accent)] font-bold">{activeAbout.contactEmail || 'ops@technova.dev'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Tenets & Quick Commission Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="theme-card p-6 sm:p-8 space-y-5">
              <div className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                // THE TECHNOVA CODE
              </div>

              {[
                { title: 'Zero Framework Dogmatism', desc: 'We select the optimal tool for the objective — from raw WebGL shaders to distributed Node graphs.' },
                { title: 'Locked 120 FPS Benchmark', desc: 'No frame drops, no jank, and zero cumulative layout shifts across all devices.' },
                { title: 'Zero-Knowledge Security', desc: 'Hardened cryptographic authentication and isolated staging clusters for all client builds.' },
                { title: 'Direct Engineering Access', desc: 'Clients collaborate directly with lead architects, not account middlemen.' },
              ].map((tenet, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[var(--text)] block">{tenet.title}</span>
                    <span className="text-[var(--text-muted)] font-light leading-relaxed">{tenet.desc}</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2.5">
                <button
                  onClick={onOpenBooking}
                  className="theme-btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider"
                >
                  <span>START A SPRINT WITH TECHNOVA</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenJoin}
                  className="theme-btn-secondary w-full py-2.5 text-xs font-semibold uppercase"
                >
                  <span>APPLY TO JOIN THE COLLECTIVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

