// FILE PATH: components/sections/CtaBannerSection.tsx
'use client';

import React from 'react';
import {
  FileCode2, Calendar, MessageSquare, Phone, Mail, ArrowUpRight,
  ShieldCheck, Clock, Sparkles,
} from 'lucide-react';

interface CtaBannerSectionProps {
  onOpenBooking: () => void;
  onOpenCall: () => void;
  contactEmail?: string;
}

export default function CtaBannerSection({
  onOpenBooking,
  onOpenCall,
  contactEmail = 'ops@technovastudio.dev',
}: CtaBannerSectionProps) {
  return (
    <section id="contact-matrix" className="relative z-10 py-24 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="theme-card p-8 sm:p-14 relative overflow-hidden bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface-card)] to-[var(--surface)] border-2 border-[var(--border-strong)] shadow-2xl">
          {/* Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, var(--accent) 0%, var(--accent-2) 60%, transparent 80%)',
            }}
          />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 font-mono text-[10px] tracking-[0.35em] text-[var(--accent)] uppercase font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY TO DEPLOY THE IMPOSSIBLE?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[var(--text)] leading-tight">
              HAVE AN IDEA? <br />
              <span className="text-[var(--accent)]">LET&apos;S BUILD IT.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-light">
              Initiate a discovery briefing, submit your project specification, or reach our operations desk directly. Every technical inquiry receives a dedicated architect response within 24 hours.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {/* 1. Book Project */}
              <button
                onClick={onOpenBooking}
                className="theme-btn-primary px-7 py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                <FileCode2 className="w-4 h-4" />
                <span>BOOK A PROJECT // TRANSMIT BRIEF</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* 2. Schedule Call */}
              <button
                onClick={onOpenCall}
                className="theme-btn-secondary px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4 text-[var(--accent)]" />
                <span>SCHEDULE A CALL</span>
              </button>
            </div>

            {/* Direct Instant Channels: WhatsApp / Call / Email */}
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase font-bold mr-2">
                INSTANT DISPATCH:
              </span>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919810045567?text=Hello%20Technova%20Studio%20Team%2C%20I%20have%20a%20project%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-[var(--radius)] border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-mono text-xs transition-colors font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WHATSAPP CHAT</span>
              </a>

              {/* Direct Call */}
              <a
                href="tel:+919810045567"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] font-mono text-xs transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>+91 98100 45567</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] font-mono text-xs transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent-2)]" />
                <span>{contactEmail}</span>
              </a>
            </div>

            {/* Trust badge footer */}
            <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>ENTERPRISE NDA SIGNED ON DAY ZERO</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-2)]" />
                <span>RESPONSE GUARANTEED &lt; 24 HOURS</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
