// FILE PATH: components/background/ThemeBackground.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeType } from '@/lib/theme';

export default function ThemeBackground() {
  const { theme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Detect mobile & track cursor position for Dark Tech spotlight
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (theme !== 'dark-tech') return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const xPct = Math.round((e.clientX / window.innerWidth) * 100);
        const yPct = Math.round((e.clientY / window.innerHeight) * 100);
        setMousePos({ x: xPct, y: yPct });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* THEME 1: DARK TECH (Hacker Terminal) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          theme === 'dark-tech' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* SVG Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(var(--accent) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Cursor-Following Spotlight Glow */}
        <div
          className="absolute inset-0 transition-all duration-150 ease-out"
          style={{
            background: isMobile
              ? 'radial-gradient(600px circle at 50% 25%, rgba(0, 255, 102, 0.12), transparent 70%)'
              : `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 255, 102, 0.14), transparent 65%)`,
          }}
        />

        {/* Faint Terminal / Code Snippet on Right Side (Desktop Only) */}
        {!isMobile && (
          <div className="absolute right-8 top-32 w-80 p-4 rounded border border-[var(--border)] bg-[#050b18]/40 backdrop-blur-sm opacity-20 font-mono text-[10px] text-[var(--accent)] space-y-1 transform rotate-1 pointer-events-none">
            <div className="text-[var(--text-dim)]">// TECHNOVA KERNEL TELEMETRY</div>
            <div>import &#123; createEngine &#125; from &apos;@technova/core&apos;;</div>
            <div>const pipeline = await createEngine(&#123;</div>
            <div className="pl-3">fpsTarget: 120,</div>
            <div className="pl-3">spatialMesh: &apos;zero-latency&apos;,</div>
            <div className="pl-3">encryption: &apos;zero-knowledge&apos;</div>
            <div>&#125;);</div>
            <div className="text-emerald-400 mt-2">// SYSTEM READY: 120 FPS LOCKED</div>
          </div>
        )}

        {/* Central Calm Mask (keeps headline 100% calm and readable) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, transparent 20%, rgba(3, 7, 18, 0.6) 80%)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* THEME 2: MINIMAL CLEAN (Swiss Style) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          theme === 'minimal-clean' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Subtle Grain / Noise Overlay via SVG filter */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <filter id="swiss-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#swiss-grain)" />
        </svg>

        {/* Faint Soft Gradient Accents */}
        <div
          className="absolute -top-24 right-1/4 w-[40rem] h-[40rem] rounded-full blur-[140px] opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(249, 115, 22, 0.08) 50%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-10 w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Floating Minimalist Browser Mockups (Desktop Only) */}
        {!isMobile && (
          <>
            {/* Top-Right Floating Mockup */}
            <div className="absolute right-12 top-24 w-72 rounded-lg border border-slate-200 bg-white/80 backdrop-blur-md shadow-lg p-3 opacity-30 transform rotate-2 animate-float-slow">
              <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[9px] font-mono text-slate-400 pl-2">aetherius.technovastudio.com</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-10 bg-slate-100 rounded flex items-center justify-center font-mono text-[8px] text-slate-400">
                  [120 FPS TELEMETRY VIEWPORT]
                </div>
                <div className="h-2 w-3/4 bg-slate-200 rounded" />
                <div className="h-2 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Bottom-Left Floating Mockup */}
            <div className="absolute left-8 bottom-36 w-64 rounded-lg border border-slate-200 bg-white/70 backdrop-blur-md shadow-md p-3 opacity-25 transform -rotate-2 animate-float-reverse">
              <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[9px] font-mono text-slate-400 pl-2">krypton.os</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-8 bg-blue-50 rounded flex items-center justify-center font-mono text-[8px] text-blue-400">
                  ZERO-KNOWLEDGE AUTH KERNEL
                </div>
                <div className="h-2 w-2/3 bg-slate-200 rounded" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* THEME 3: BOLD GRADIENT (Modern SaaS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          theme === 'bold-gradient' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* CSS-Only Slow Animated Aurora Blobs */}
        <div
          className={`absolute -top-32 -left-20 w-[42rem] h-[42rem] rounded-full blur-[140px] opacity-35 ${
            isMobile ? '' : 'animate-aurora-1'
          }`}
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #6366f1 50%, transparent 70%)',
          }}
        />

        <div
          className={`absolute top-1/4 -right-24 w-[38rem] h-[38rem] rounded-full blur-[140px] opacity-30 ${
            isMobile ? '' : 'animate-aurora-2'
          }`}
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, #a855f7 50%, transparent 70%)',
          }}
        />

        <div
          className={`absolute -bottom-20 left-1/3 w-[36rem] h-[36rem] rounded-full blur-[130px] opacity-25 ${
            isMobile ? '' : 'animate-aurora-3'
          }`}
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)',
          }}
        />

        {/* Central Soft Vignette to protect headline contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(9, 10, 26, 0.4) 0%, rgba(9, 10, 26, 0.85) 80%)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* THEME 4: NEO-BRUTALISM (Creative Studio) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          theme === 'neo-brutalism' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Flat Geometric Shapes with Thick Black Borders & Hard Shadows */}
        {/* Shape 1: Yellow Diamond / Square (Top-Left) */}
        <div
          className={`absolute top-20 left-8 sm:left-14 w-14 sm:w-20 h-14 sm:h-20 bg-[#facc15] border-[3px] border-black shadow-[4px_4px_0px_#000] rotate-12 opacity-80 ${
            isMobile ? '' : 'animate-brutal-wobble-1'
          }`}
        />

        {/* Shape 2: Hot Pink Pill (Top-Right) */}
        <div
          className={`absolute top-28 right-8 sm:right-20 px-4 py-2 bg-[#f43f5e] text-white font-mono text-[10px] font-black border-[3px] border-black shadow-[5px_5px_0px_#000] -rotate-6 opacity-85 ${
            isMobile ? '' : 'animate-brutal-wobble-2'
          }`}
        >
          // BUILD FAST
        </div>

        {/* Shape 3: Electric Cyan Circle (Bottom-Right) */}
        <div
          className={`absolute bottom-36 right-10 sm:right-24 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-[#06b6d4] border-[3px] border-black shadow-[5px_5px_0px_#000] opacity-80 ${
            isMobile ? '' : 'animate-brutal-wobble-1'
          }`}
        />

        {/* Shape 4: Lime Green Stamp (Bottom-Left) */}
        <div
          className={`absolute bottom-40 left-6 sm:left-16 p-2.5 bg-[#4ade80] border-[3px] border-black shadow-[4px_4px_0px_#000] rotate-6 font-mono text-[9px] font-black text-black opacity-85 ${
            isMobile ? '' : 'animate-brutal-wobble-2'
          }`}
        >
          ★ 120 FPS
        </div>

        {/* Calm Central Window so headline remains clean & readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255, 253, 240, 0.8) 0%, transparent 75%)',
          }}
        />
      </div>
    </div>
  );
}
