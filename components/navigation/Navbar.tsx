// FILE PATH: components/navigation/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Activity, Terminal, Menu, X, ArrowUpRight, Sparkles, MessageSquare,
} from 'lucide-react';
import ThemeSelectorFallback from '@/components/theme/ThemeSelectorFallback';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenCmd: () => void;
}

export default function Navbar({
  onOpenBooking,
  onOpenTracker,
  onOpenCmd,
}: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'WORK', href: '#work-matrix' },
    { label: 'SERVICES', href: '#services-matrix' },
    { label: 'PROCESS', href: '#process-matrix' },
    { label: 'ABOUT', href: '#about-matrix' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[var(--surface-glass)] backdrop-blur-xl border-b border-[var(--border)] shadow-md'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* 1. BRAND LOGO */}
          <button
            onClick={() => {
              router.push('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center space-x-3 text-left"
            aria-label="Technova Studio Home"
          >
            <div className="relative w-8 h-8 rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--surface-elevated)] flex items-center justify-center overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent pointer-events-none" />
            </div>
            <div>
              <span className="block font-bold text-sm sm:text-base tracking-[0.2em] uppercase text-[var(--text)]">
                TECHNOVA
              </span>
              <span className="block font-mono text-[8px] tracking-[0.25em] text-[var(--accent)] font-semibold">
                STUDIO // KERNEL
              </span>
            </div>
          </button>

          {/* 2. DESKTOP CENTER NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center space-x-1 border border-[var(--border)]/70 bg-[var(--surface-glass)] backdrop-blur-md px-3 py-1.5 rounded-[var(--radius)] shadow-sm">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-1.5 font-mono text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)] rounded-[var(--radius)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3. DESKTOP RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* Theme Fallback Selector */}
            <ThemeSelectorFallback variant="compact" />

            {/* CMD+K trigger */}
            <button
              onClick={onOpenCmd}
              title="Open Command Teleportation (Ctrl+K / Cmd+K)"
              className="flex items-center space-x-1.5 border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 rounded-[var(--radius)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all font-mono text-[10px]"
            >
              <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>CMD+K</span>
            </button>

            {/* Track Sprint */}
            <button
              onClick={onOpenTracker}
              className="flex items-center space-x-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-[var(--radius)] text-[var(--text)] hover:border-[var(--accent)] transition-all font-mono text-xs font-medium"
              title="Track Client Inquiry & Sprint Progress"
            >
              <Activity className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
              <span className="tracking-wide">TRACK SPRINT</span>
            </button>

            {/* PROTECTED FEATURE 1: TEAM PORTAL Button */}
            <button
              onClick={() => router.push('/login')}
              className="group relative flex items-center space-x-1.5 border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-3 py-1.5 rounded-[var(--radius)] hover:border-[var(--accent)] transition-all font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]"
            >
              <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>TEAM PORTAL</span>
            </button>

            {/* PRIMARY CTA: "LET'S TALK" */}
            <button
              onClick={onOpenBooking}
              className="theme-btn-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <span>LET&apos;S TALK</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeSelectorFallback variant="compact" />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="p-2 border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] text-[var(--text)]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 5. MOBILE DRAWER / OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden pt-20"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full theme-card rounded-b-[var(--radius-lg)] p-6 space-y-5 animate-in slide-in-from-top-4 duration-200 border-b-2 border-[var(--border-strong)] bg-[var(--surface-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 font-mono text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--surface)] rounded-[var(--radius)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--border)] space-y-3">
              {/* Mobile Track Sprint */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenTracker();
                }}
                className="w-full flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 rounded-[var(--radius)] font-mono text-xs font-medium text-[var(--text)]"
              >
                <span className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[var(--accent)]" />
                  <span>TRACK SPRINT</span>
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Mobile Team Portal (PROTECTED) */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  router.push('/login');
                }}
                className="w-full flex items-center justify-between border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 rounded-[var(--radius)] font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]"
              >
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[var(--accent)]" />
                  <span>TEAM PORTAL</span>
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Mobile Cmd+K */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenCmd();
                }}
                className="w-full flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-4 py-2 rounded-[var(--radius)] font-mono text-xs text-[var(--text-muted)]"
              >
                <span className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>COMMAND PALETTE</span>
                </span>
                <span className="text-[10px] bg-[var(--surface-card)] px-1.5 py-0.5 border border-[var(--border)] rounded">
                  CMD+K
                </span>
              </button>

              {/* Mobile Primary CTA */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenBooking();
                }}
                className="w-full theme-btn-primary py-3 text-xs font-bold uppercase tracking-wider"
              >
                <span>LET&apos;S TALK // START A PROJECT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

