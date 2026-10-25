// FILE PATH: components/navigation/FloatingHUD.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Shield, Cpu, ArrowUpRight, Layers, Search, X, Activity } from 'lucide-react';

interface FloatingHUDProps {
  onOpenBooking: () => void;
  onOpenTracker?: () => void;
  ready: boolean;
}

export default function FloatingHUD({ onOpenBooking, onOpenTracker, ready }: FloatingHUDProps) {
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K for Team Teleportation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { label: 'PUBLIC // HOME MATRIX', cmd: '/home', action: () => router.push('/') },
    { label: 'PUBLIC // TRACK INQUIRY & SPRINT STATUS', cmd: '/track', action: () => onOpenTracker ? onOpenTracker() : router.push('/track') },
    { label: 'PUBLIC // SCROLL TO WORK ENGINE', cmd: '/work', action: () => document.getElementById('work-matrix')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'PUBLIC // ABOUT TECHNOVA COLLECTIVE', cmd: '/about', action: () => document.getElementById('about-matrix')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'PUBLIC // INITIATE CALL OR BRIEF', cmd: '/book', action: () => onOpenBooking() },
    { label: 'TEAM // ACCESS COMMAND TERMINAL', cmd: '/team', action: () => router.push('/team') },
    { label: 'TEAM // AUTHENTICATION GATEWAY', cmd: '/login', action: () => router.push('/login') },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.cmd.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* TOP-LEFT HUD NODE: Brand Identity & Live Telemetry */}
      <div
        className={`fixed top-6 left-6 z-40 transition-all duration-700 ${
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <button
          onClick={() => router.push('/')}
          data-hud-interactive="true"
          className="group relative flex items-center space-x-3 border border-white/15 bg-[#060606]/80 backdrop-blur-md px-4 py-2.5 hud-clip hover:border-red-500/70 transition-all"
        >
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
          <div className="text-left">
            <span className="block text-xs font-bold tracking-[0.28em] text-white">
              TECHNOVA
            </span>
            <span className="block font-mono text-[8px] tracking-[0.2em] text-zinc-400 group-hover:text-red-400 transition-colors">
              STUDIO // SYS.60FPS
            </span>
          </div>
        </button>
      </div>

      {/* TOP-RIGHT HUD NODE: Command Shortcut & Team Access */}
      <div
        className={`fixed top-6 right-6 z-40 flex items-center space-x-3 transition-all duration-700 delay-100 ${
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <button
          onClick={() => setCmdOpen(true)}
          data-hud-interactive="true"
          className="hidden sm:flex items-center space-x-2 border border-white/15 bg-[#060606]/80 backdrop-blur-md px-3.5 py-2.5 hud-clip hover:border-red-500/60 transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-red-500" />
          <span className="font-mono text-[10px] tracking-widest text-zinc-300">
            CMD+K
          </span>
        </button>

        {onOpenTracker && (
          <button
            onClick={onOpenTracker}
            data-hud-interactive="true"
            className="flex items-center space-x-2 border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-md px-3.5 py-2.5 hud-clip hover:bg-emerald-600/20 hover:border-emerald-500 transition-all text-emerald-300"
            title="Track Client Inquiry & Sprint Progress"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase hidden md:inline">
              TRACK SPRINT
            </span>
          </button>
        )}

        <button
          onClick={() => router.push('/login')}
          data-hud-interactive="true"
          className="group relative flex items-center space-x-2 border border-red-500/40 bg-red-950/20 backdrop-blur-md px-4 py-2.5 hud-clip hover:bg-red-600/20 hover:border-red-500 transition-all"
        >
          <Shield className="w-3.5 h-3.5 text-red-500" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-200 uppercase">
            TEAM PORTAL
          </span>
        </button>
      </div>

      {/* BOTTOM-LEFT HUD NODE: Quick Spatial Anchors */}
      <div
        className={`fixed bottom-6 left-6 z-40 hidden md:flex items-center space-x-2 transition-all duration-700 delay-200 ${
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {[
          { label: '01 // WORK', id: 'work-matrix' },
          { label: '02 // ABOUT', id: 'about-matrix' },
          { label: '03 // R&D LAB', id: 'lab-matrix' },
          { label: '04 // TRACK SPRINT', action: onOpenTracker },
          { label: '05 // INITIATE BRIEF', action: onOpenBooking },
        ].map((item, idx) => (
          <button
            key={idx}
            data-hud-interactive="true"
            onClick={() =>
              item.action
                ? item.action()
                : document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' })
            }
            className="border border-white/10 bg-[#060606]/80 backdrop-blur-md px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] text-zinc-400 hover:text-white hover:border-red-500/60 transition-all hud-clip"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CMD+K TELEPORTATION TERMINAL MODAL */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[8000] flex items-start justify-center pt-28 bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl border border-red-500/50 bg-[#070707] shadow-[0_0_60px_rgba(220,38,38,0.2)] hud-clip overflow-hidden">
            <div className="flex items-center border-b border-white/10 px-4 py-3">
              <Search className="w-4 h-4 text-red-500 mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or route (e.g. /team, /work, /book)..."
                className="w-full bg-transparent font-mono text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                onClick={() => setCmdOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto divide-y divide-white/5">
              {filteredCommands.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCmdOpen(false);
                    item.action();
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-red-600/15 transition-colors group"
                >
                  <span className="font-mono text-xs text-zinc-300 group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5">
                    {item.cmd}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}