// FILE PATH: components/navigation/CommandPalette.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Terminal, ArrowRight, Palette, Layers, ExternalLink } from 'lucide-react';
import { useTheme, ThemeType } from '@/lib/theme';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenJoin: () => void;
}

interface CommandItem {
  category: 'NAVIGATION' | 'ACTIONS' | 'TEAM' | 'THEMES';
  label: string;
  cmd: string;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenTracker,
  onOpenJoin,
}: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [query, setQuery] = useState('');

  // Global Keyboard Listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands: CommandItem[] = [
    // ─── ORIGINAL PROTECTED COMMANDS ───
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // HOME MATRIX',
      cmd: '/home',
      action: () => {
        router.push('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      category: 'ACTIONS',
      label: 'PUBLIC // TRACK INQUIRY & SPRINT STATUS',
      cmd: '/track',
      action: () => onOpenTracker(),
    },
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // SCROLL TO WORK ENGINE',
      cmd: '/work',
      action: () => document.getElementById('work-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // ABOUT TECHNOVA COLLECTIVE',
      cmd: '/about',
      action: () => document.getElementById('about-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'ACTIONS',
      label: 'PUBLIC // INITIATE CALL OR BRIEF',
      cmd: '/book',
      action: () => onOpenBooking(),
    },
    {
      category: 'TEAM',
      label: 'TEAM // ACCESS COMMAND TERMINAL',
      cmd: '/team',
      action: () => router.push('/team'),
    },
    {
      category: 'TEAM',
      label: 'TEAM // AUTHENTICATION GATEWAY',
      cmd: '/login',
      action: () => router.push('/login'),
    },

    // ─── NEW EXPANDED SECTION COMMANDS ───
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // ARCHITECTURAL SERVICES',
      cmd: '/services',
      action: () => document.getElementById('services-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // 5-STAGE SPRINT METHODOLOGY',
      cmd: '/process',
      action: () => document.getElementById('process-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // VERIFIED STUDIO TELEMETRY & STATS',
      cmd: '/stats',
      action: () => document.getElementById('stats-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'NAVIGATION',
      label: 'PUBLIC // CLIENT ENDORSEMENTS & TESTIMONIALS',
      cmd: '/testimonials',
      action: () => document.getElementById('testimonials-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      category: 'ACTIONS',
      label: 'TALENT // BECOME A TECHNOVA ARCHITECT',
      cmd: '/architect',
      action: () => onOpenJoin(),
    },
    {
      category: 'NAVIGATION',
      label: 'COMMUNICATION // DIRECT CONTACT & DISPATCH',
      cmd: '/contact',
      action: () => document.getElementById('contact-matrix')?.scrollIntoView({ behavior: 'smooth' }),
    },

    // ─── NEW THEME SWITCHER COMMANDS ───
    {
      category: 'THEMES',
      label: 'SWITCH THEME // DARK TECH (HACKER TERMINAL)',
      cmd: '/theme dark',
      action: () => setTheme('dark-tech'),
    },
    {
      category: 'THEMES',
      label: 'SWITCH THEME // MINIMAL CLEAN (SWISS STYLE)',
      cmd: '/theme minimal',
      action: () => setTheme('minimal-clean'),
    },
    {
      category: 'THEMES',
      label: 'SWITCH THEME // BOLD GRADIENT (MODERN SAAS)',
      cmd: '/theme gradient',
      action: () => setTheme('bold-gradient'),
    },
    {
      category: 'THEMES',
      label: 'SWITCH THEME // NEO-BRUTALISM (CREATIVE STUDIO)',
      cmd: '/theme brutalist',
      action: () => setTheme('neo-brutalism'),
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.cmd.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center pt-20 sm:pt-28 bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl theme-card overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Teleportation Palette"
      >
        {/* Search header */}
        <div className="flex items-center border-b border-[var(--border)] px-4 py-3 bg-[var(--surface-elevated)]">
          <Search className="w-4 h-4 text-[var(--accent)] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, route, or theme (e.g. /work, /theme dark, /track)..."
            className="w-full bg-transparent font-mono text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-[var(--border)]/30">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center font-mono text-xs text-[var(--text-muted)]">
              NO MATCHING COMMAND DETECTED
            </div>
          ) : (
            filteredCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onClose();
                  item.action();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-[var(--radius)] hover:bg-[var(--accent)]/15 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  {item.category === 'THEMES' ? (
                    <Palette className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  ) : item.category === 'TEAM' ? (
                    <Terminal className="w-3.5 h-3.5 text-[var(--accent-2)] shrink-0" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 group-hover:text-[var(--accent)]" />
                  )}
                  <span className="font-mono text-xs text-[var(--text)] group-hover:text-[var(--accent)] font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--accent)] border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 rounded-[var(--radius)]">
                  {item.cmd}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 font-mono text-[9px] text-[var(--text-muted)] bg-[var(--surface)]">
          <span>NAVIGATION: ↑ ↓ ARROWS</span>
          <span>SELECT: ENTER</span>
          <span>CLOSE: ESC</span>
        </div>
      </div>
    </div>
  );
}
