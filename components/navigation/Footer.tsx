// FILE PATH: components/navigation/Footer.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Activity, ArrowUpRight, Mail, Phone, MessageSquare,
  Globe, Share2, Code2, Heart, Terminal,
} from 'lucide-react';
import ThemeSelectorFallback from '@/components/theme/ThemeSelectorFallback';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenJoin: () => void;
  contactEmail?: string;
}

export default function Footer({
  onOpenBooking,
  onOpenTracker,
  onOpenJoin,
  contactEmail = 'ops@technovastudio.dev',
}: FooterProps) {
  const router = useRouter();

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--surface-elevated)] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border)]">
          {/* Col 1: Studio Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--surface)] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              </div>
              <span className="font-bold text-lg tracking-[0.2em] uppercase text-[var(--text)]">
                TECHNOVA STUDIO
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed font-light">
              An elite collective of high-end systems architects, shader engineers, and creative technologists engineering flagship web platforms, real-time 3D environments, and custom AI systems.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                PRODUCTION KERNEL // 120 FPS // VERIFIED
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
              NAVIGATION
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#work-matrix" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Featured Work
                </a>
              </li>
              <li>
                <a href="#services-matrix" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Studio Services
                </a>
              </li>
              <li>
                <a href="#process-matrix" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Sprint Methodology
                </a>
              </li>
              <li>
                <a href="#about-matrix" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Studio Manifesto
                </a>
              </li>
              <li>
                <a href="#testimonials-matrix" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Client Endorsements
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Protected Portals & Tools */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
              PORTALS & ACCESS
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center space-x-1.5 text-[var(--text)] hover:text-[var(--accent)] transition-colors font-bold uppercase"
                >
                  <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Team Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="flex items-center space-x-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Track Sprint Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenJoin}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  Become an Architect
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  Initiate Project Brief
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Channels */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
              DIRECT DISPATCH
            </div>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center space-x-2 hover:text-[var(--accent)] transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span className="truncate">{contactEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919810045567"
                  className="flex items-center space-x-2 hover:text-[var(--accent)] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>+91 98100 45567</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919810045567?text=Hello%20Technova%20Studio%20Team%2C%20I%20would%20like%20to%20inquire%20about%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-emerald-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials, Theme Switcher Fallback */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-[var(--text-muted)]">
          <div>
            &copy; {new Date().getFullYear()} TECHNOVA STUDIO. ALL RIGHTS RESERVED. // ENTERPRISE ARCHITECTURE
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSelectorFallback variant="compact" />
            <a
              href="https://github.com/technovastudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-[var(--text)] transition-colors flex items-center space-x-1"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline text-[9px]">GITHUB</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-[var(--text)] transition-colors flex items-center space-x-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-[9px]">TWITTER</span>
            </a>
            <a
              href="https://technovastudio.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Network"
              className="hover:text-[var(--text)] transition-colors flex items-center space-x-1"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline text-[9px]">GLOBAL</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
