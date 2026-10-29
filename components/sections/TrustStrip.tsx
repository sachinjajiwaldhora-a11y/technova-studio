// FILE PATH: components/sections/TrustStrip.tsx
'use client';

import React from 'react';
import { Shield, Cpu, Activity, Globe, Lock, Terminal } from 'lucide-react';

const CLIENTS = [
  { name: 'AETHERIUS QUANTUM', category: 'Orbital Telemetry' },
  { name: 'KRYPTON DEFENSE', category: 'Mission Systems' },
  { name: 'VORTEX COMPUTE', category: 'Distributed AI' },
  { name: 'OBSIDIAN FINTECH', category: 'Algorithmic Liquidity' },
  { name: 'NOVAPULSE ANALYTICS', category: 'Data Visualizations' },
  { name: 'VERTEX CAPITAL', category: 'Investor Portals' },
];

export default function TrustStrip() {
  return (
    <section className="relative z-10 border-y border-[var(--border)] bg-[var(--surface-elevated)] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase font-bold mb-6">
          // TRUSTED BY VENTURE-BACKED FOUNDERS & MISSION-CRITICAL ENTERPRISES
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {CLIENTS.map((client, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-[var(--radius)] border border-[var(--border)]/60 bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-sm transition-all text-center group"
            >
              <div className="font-mono text-xs font-extrabold tracking-wider text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {client.name}
              </div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5">
                {client.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
