// FILE PATH: components/sections/ServicesSection.tsx
'use client';

import React from 'react';
import { Globe, Smartphone, Palette, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

const SERVICES = [
  {
    num: '01',
    icon: Globe,
    title: 'SPATIAL WEB & 3D ARCHITECTURES',
    description:
      'Immersive WebGL, Three.js, and WebGPU browser viewports locked at 120 FPS. We build digital monuments and interactive experiences that captivate investors and clients.',
    deliverables: [
      'Custom GLSL Fragment & Vertex Shaders',
      'Next.js 16 + React 19 App Pipelines',
      'Interactive 3D Product Viewers & Configs',
      'Zero Layout Shift & Lighthouse 95+ Tuning',
    ],
  },
  {
    num: '02',
    icon: Smartphone,
    title: 'MOBILE & PROGRESSIVE APPS',
    description:
      'High-performance cross-platform applications with native 60–120 FPS animations, offline-first syncing, and tactile micro-interactions that feel buttery smooth on iOS and Android.',
    deliverables: [
      'React Native & Flutter Native Kernels',
      'Offline-First Local Database Syncing',
      'Biometric Zero-Knowledge Auth Flows',
      'Low-Latency Push Telemetry & WebSockets',
    ],
  },
  {
    num: '03',
    icon: Palette,
    title: 'UI/UX & INTERACTION DESIGN',
    description:
      'Institutional-grade design systems built on rigorous typography, multi-theme design tokens, and fluid kinetic physics that position your studio light-years ahead of competitors.',
    deliverables: [
      'Comprehensive Design Token Engines',
      'Kinetic Motion Design & Micro-animations',
      'Interactive Figma Prototypes & Design Specs',
      'WCAG AA / AAA Accessibility Compliance',
    ],
  },
  {
    num: '04',
    icon: Cpu,
    title: 'BACKEND, APIS & FAST-TRACK MVPS',
    description:
      'Distributed cloud kernels, scalable MongoDB / PostgreSQL architectures, sub-millisecond API endpoints, and rapid MVP turnarounds ready for venture capital validation.',
    deliverables: [
      'Sub-20ms Edge & Serverless Endpoints',
      'Real-Time WebSocket & Telemetry Streams',
      'Production MongoDB & Database Sharding',
      '30-Day Concept to Production MVP Sprints',
    ],
  },
];

export default function ServicesSection({ onOpenBooking }: ServicesSectionProps) {
  return (
    <section id="services-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 border-t border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold">
            // ENGINEERING DISCIPLINES & CAPABILITIES
          </div>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--text)]">
            SERVICES ENGINEERED FOR SCALE
          </h2>
          <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
            We don&apos;t build generic websites. We assemble high-impact digital systems engineered from the ground up for performance, conversion, and architectural distinction.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="theme-card theme-card-hover p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <span className="font-mono text-sm font-bold text-[var(--accent)]">
                      {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-[var(--text)]">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
                    {s.description}
                  </p>

                  {/* Key Deliverables */}
                  <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-4">
                    <span className="font-mono text-[9px] font-bold text-[var(--accent-2)] uppercase tracking-widest block">
                      KEY DELIVERABLES:
                    </span>
                    <ul className="space-y-1.5 font-mono text-xs text-[var(--text-muted)]">
                      {s.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={onOpenBooking}
                    className="w-full flex items-center justify-between font-mono text-xs font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors group"
                  >
                    <span>COMMISSION THIS DISCIPLINE</span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
