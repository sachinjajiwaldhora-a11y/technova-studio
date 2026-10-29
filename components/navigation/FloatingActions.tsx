// FILE PATH: components/navigation/FloatingActions.tsx
'use client';

import React from 'react';
import { MessageSquare, Terminal } from 'lucide-react';
import RadialThemeDial from '@/components/theme/RadialThemeDial';

interface FloatingActionsProps {
  onOpenCmd: () => void;
}

export default function FloatingActions({ onOpenCmd }: FloatingActionsProps) {
  return (
    <>
      {/* 1. Theme Dial (Bottom-Left) */}
      <RadialThemeDial />

      {/* 2. Command Palette Quick Trigger (Desktop only, adjacent to theme dial) */}
      <div className="fixed bottom-6 left-48 z-40 hidden xl:flex items-center">
        <button
          onClick={onOpenCmd}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-sm font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>PRESS CTRL+K</span>
        </button>
      </div>

      {/* 3. Floating WhatsApp Direct Dispatch (Bottom-Right, neatly positioned above or left of AI launcher) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-24 z-40">
        <a
          href="https://wa.me/919810045567?text=Hello%20Technova%20Studio%20Team%2C%20I%20have%20a%20project%20inquiry."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Technova via WhatsApp"
          className="group flex items-center justify-center w-11 sm:w-auto sm:px-3.5 py-2.5 rounded-full border border-emerald-500/50 bg-emerald-600/20 backdrop-blur-md text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-lg transition-all"
          style={{
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
          }}
        >
          <MessageSquare className="w-4 h-4 shrink-0 sm:mr-1.5" />
          <span className="hidden sm:inline font-mono text-[11px] font-bold uppercase tracking-wider">
            WHATSAPP
          </span>
        </a>
      </div>
    </>
  );
}
