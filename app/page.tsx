// FILE PATH: app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import BootSequence from '@/components/entry/BootSequence';
import Scene3D from '@/components/canvas/Scene3D';
import FloatingHUD from '@/components/navigation/FloatingHUD';
import RoboticAgent from '@/components/ui/RoboticAgent';
import BookingModal from '@/components/modals/BookingModal';
import JoinUsModal from '@/components/modals/JoinUsModal';
import StatusTrackerModal from '@/components/modals/StatusTrackerModal';
import {
  ArrowUpRight, ExternalLink, Sparkles, Terminal, Activity,
  Globe, Shield, Cpu, ChevronRight, Layers, Lock, CheckCircle2,
  Calendar, FileCode2,
} from 'lucide-react';
import {
  StudioCMSConfig, PortfolioShowcaseItem,
  STORAGE_KEYS, getStore, SEED_CMS,
} from '@/lib/store';

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [bootCompleted, setBootCompleted] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'BRIEF' | 'CALL'>('BRIEF');
  const [joinOpen, setJoinOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [activeSandbox, setActiveSandbox] = useState<string | null>(null);
  const [cmsConfig, setCmsConfig] = useState<StudioCMSConfig>(SEED_CMS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FEATURED'>('ALL');

  useEffect(() => {
    // Hydrate CMS data from localStorage so edits from the Admin Dashboard reflect live
    const loaded = getStore<StudioCMSConfig>(STORAGE_KEYS.CMS, SEED_CMS);
    setCmsConfig(loaded);

    // If already booted in this session, mark completed immediately on mount
    if (typeof window !== 'undefined' && sessionStorage.getItem('technova_booted') === 'true') {
      setBootCompleted(true);
    }
  }, []);

  const showcaseProjects = cmsConfig?.portfolioShowcase?.length
    ? cmsConfig.portfolioShowcase
    : SEED_CMS.portfolioShowcase;

  const filteredProjects = activeFilter === 'FEATURED'
    ? showcaseProjects.filter((p) => p.featured)
    : showcaseProjects;

  const about = cmsConfig?.aboutUs || SEED_CMS.aboutUs;

  function openBookingWithMode(mode: 'BRIEF' | 'CALL') {
    setBookingMode(mode);
    setBookingOpen(true);
  }

  return (
    <main className="relative min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* 1. Cinematic 1-Sec Eyes -> Robotic Head Boot Sequence (self-terminates if already booted) */}
      <BootSequence onComplete={() => setBootCompleted(true)} />

      {/* 2. Background 3D Transparent Wireframe Core + Shifting Crimson Gradients */}
      <Scene3D />

      {/* 3. Navbar-less Floating Architectural HUD Nodes */}
      <FloatingHUD
        ready={bootCompleted}
        onOpenBooking={() => openBookingWithMode('BRIEF')}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
      />

      {/* 4. Docked Robotic Q&A Assistant in Bottom-Right Corner */}
      <RoboticAgent ready={bootCompleted} />

      {/* 5. Call & Inquiry Terminal Modal */}
      <BookingModal
        isOpen={bookingOpen}
        defaultMode={bookingMode}
        onClose={() => setBookingOpen(false)}
        onOpenTracker={(code) => {
          setTrackerInitialCode(code);
          setTrackerOpen(true);
        }}
      />

      {/* 6. Client Inquiry & Project Status Tracker Modal */}
      <StatusTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        initialCode={trackerInitialCode}
      />

      {/* 7. Talent Candidacy / Join Us Modal */}
      <JoinUsModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION: Smooth Physics Entrance After Boot */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-6 sm:px-16 lg:px-28 pt-20">
        <div
          className={`max-w-5xl transition-all duration-1000 ease-out ${
            bootCompleted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="inline-flex items-center space-x-3 border border-red-500/40 bg-red-950/20 px-3.5 py-1.5 backdrop-blur-md hud-clip">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-red-400 uppercase">
              WE ARE TECHNOVA STUDIO // ELITE ENGINEERING COLLECTIVE
            </span>
          </div>

          <h1 className="mt-6 text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[0.94] uppercase">
            {about.heroTagline.split(' ')[0] || 'WE'}{' '}
            {about.heroTagline.split(' ')[1] || 'BUILD'} <br />
            <span className="bg-gradient-to-r from-white via-red-200 to-red-600 bg-clip-text text-transparent">
              {about.heroTagline.split(' ').slice(2).join(' ') || 'BEYOND DIGITAL'}
            </span>{' '}
            <br />
            EXPERIENCES.
          </h1>

          <p className="mt-6 max-w-xl text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            {about.subTagline ||
              'An organization of high-end systems architects and creative technologists crafting digital monuments that make engineers inspect the source code in disbelief.'}
          </p>

          {/* HUD Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById('work-matrix')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              data-hud-interactive="true"
              className="group relative border border-red-500 bg-red-600/20 px-8 py-4 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-600 transition-all hud-clip shadow-[0_0_35px_rgba(220,38,38,0.25)]"
            >
              <span>EXPLORE LIVE PORTFOLIO</span>
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('about-matrix')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              data-hud-interactive="true"
              className="group relative border border-white/20 bg-white/[0.03] backdrop-blur-md px-8 py-4 font-mono text-xs tracking-[0.25em] text-zinc-200 uppercase hover:border-red-500/70 hover:text-white transition-all hud-clip"
            >
              <span>STUDIO MANIFESTO</span>
            </button>

            <button
              onClick={() => openBookingWithMode('BRIEF')}
              data-hud-interactive="true"
              className="group relative border border-red-500/60 bg-black/60 backdrop-blur-md px-8 py-4 font-mono text-xs tracking-[0.25em] text-red-300 uppercase hover:bg-red-950/40 hover:text-white transition-all hud-clip"
            >
              <span>TRANSMIT BRIEF</span>
            </button>

            <button
              onClick={() => openBookingWithMode('CALL')}
              data-hud-interactive="true"
              className="group relative border border-violet-500/60 bg-violet-950/20 backdrop-blur-md px-6 py-4 font-mono text-xs tracking-[0.25em] text-violet-300 uppercase hover:bg-violet-600/20 hover:text-white transition-all hud-clip"
            >
              <span>SCHEDULE CALL</span>
            </button>
          </div>
        </div>

        {/* Service Pillars Bar */}
        <div
          className={`mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-4xl transition-all duration-1000 delay-300 ${
            bootCompleted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { num: '01', title: 'SPATIAL WEBGL & 3D ARCHITECTURES' },
            { num: '02', title: 'HIGH-FREQUENCY FULLSTACK KERNELS' },
            { num: '03', title: 'BESPOKE AI & TELEMETRY INTERFACES' },
          ].map((pillar) => (
            <div key={pillar.num} className="flex items-start space-x-3">
              <span className="font-mono text-xs text-red-500 font-bold">
                {pillar.num}
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-zinc-300">
                {pillar.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* WORK / PORTFOLIO LIVE BOXES ENGINE (Managed via CMS Tab) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        id="work-matrix"
        className="relative z-10 px-6 sm:px-16 lg:px-28 py-28 border-t border-white/10 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#030303]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.35em] text-red-500 uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>LIVE HIGHLIGHTED PROJECTS // CMS MANAGED</span>
            </div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight uppercase">
              PORTFOLIO SHOWCASE
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Filter Pills */}
            <div className="inline-flex border border-white/10 bg-black/60 p-1">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeFilter === 'ALL'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ALL ({showcaseProjects.length})
              </button>
              <button
                onClick={() => setActiveFilter('FEATURED')}
                className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeFilter === 'FEATURED'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                FEATURED ONLY
              </button>
            </div>
            <p className="font-mono text-xs text-zinc-400 max-w-xs">
              Live websites, completed builds, and telemetry verified by Technova Studio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isSelected = activeSandbox === project.id;
            return (
              <motion.div
                key={project.id}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 72, rotateX: 8, scale: 0.96 }
                }
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 85,
                        damping: 18,
                        delay: index * 0.12,
                      }
                }
                className="group relative border border-white/15 bg-[#070707]/90 backdrop-blur-xl p-7 hover:border-red-500/80 transition-all duration-300 hud-clip flex flex-col justify-between"
                style={{ transformOrigin: 'center bottom' }}
              >
                {/* Hover Glow */}
                <div
                  className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${project.thumbnailColor || '#dc2626'}22 0%, transparent 70%)`,
                  }}
                />

                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                    <span className="text-red-400 font-bold">{project.code}</span>
                    <span className="border border-white/10 px-2 py-0.5 text-zinc-300 bg-black/40">
                      {project.metrics}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                    {project.category}
                  </p>

                  <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[9px] px-2 py-0.5 border border-white/10 text-zinc-400 bg-black/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactive Sandbox Preview */}
                  {isSelected && (
                    <div className="mt-5 border border-red-500/40 bg-black/95 p-4 font-mono text-[10px] text-red-400 space-y-2">
                      <div className="flex justify-between items-center text-white">
                        <span>LIVE KERNEL TELEMETRY</span>
                        <span className="text-emerald-400 font-bold">DEPLOYED // VERIFIED</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full w-4/5 animate-pulse" />
                      </div>
                      <div className="text-zinc-400 space-y-0.5 text-[9px]">
                        <div>ENDPOINT: {project.liveUrl}</div>
                        <div>PERFORMANCE: 120 FPS LOCKED // ZERO LATENCY</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 space-y-2.5">
                  {/* Primary Action: Direct Live Website Link */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between border border-red-500/60 bg-red-950/20 px-3.5 py-2 font-mono text-[10px] tracking-widest text-red-300 hover:bg-red-600 hover:text-white transition-all uppercase"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Globe className="w-3 h-3" />
                        <span>OPEN LIVE PRODUCTION WEBSITE</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Secondary Action: Inspect Telemetry Sandbox */}
                  <button
                    onClick={() => setActiveSandbox(isSelected ? null : project.id)}
                    className="w-full flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>{isSelected ? 'CLOSE TELEMETRY' : 'INSPECT ARCHITECTURE'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ABOUT US / STUDIO MANIFESTO & TRUST ARCHITECTURE (Managed via CMS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        id="about-matrix"
        className="relative z-10 px-6 sm:px-16 lg:px-28 py-28 border-t border-white/10 bg-[#040404]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.35em] text-red-500 uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>STUDIO DOSSIER // COLLECTIVE PHILOSOPHY & TRUST ARCHITECTURE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Manifesto & Identity */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[1.05]">
                {about.heroTagline}
              </h2>

              <p className="font-mono text-xs text-red-400 tracking-wider uppercase">
                // {about.subTagline}
              </p>

              <div className="border-l-2 border-red-500 pl-6 py-2">
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                  {about.manifesto}
                </p>
              </div>

              {/* Core Trust Pillars: Vision, Methodology, Security */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/10 bg-black/60 p-4 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-red-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>OUR MISSION & VISION</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {about.vision || 'Pioneering zero-latency spatial web architectures and mission-critical digital interfaces.'}
                  </p>
                </div>

                <div className="border border-white/10 bg-black/60 p-4 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <Shield className="w-3 h-3" />
                    <span>ENGINEERING STANDARDS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {about.methodology || 'Bespoke GLSL shaders, strict TypeScript, zero-knowledge security, and verified 120 FPS standards.'}
                  </p>
                </div>
              </div>

              {/* Security & NDA Trust Proof */}
              <div className="border border-white/10 bg-black/60 p-4 flex items-start space-x-3">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    ENTERPRISE INTEGRITY & NDA GUARANTEE
                  </span>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {about.securityGuarantee || 'Enterprise NDA enforced on day zero. Isolated client staging environments and dedicated clearance.'}
                  </p>
                </div>
              </div>

              {/* Quote callout */}
              <div className="border border-white/10 bg-black/40 p-5 font-mono text-xs space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase tracking-widest">
                  SPECIALIZED ARCHITECTURE HIGHLIGHT
                </div>
                <p className="text-zinc-200">
                  &ldquo;{about.teamHighlight}&rdquo;
                </p>
              </div>

              {/* Identity Meta Badges */}
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="border border-white/10 bg-[#080808] px-4 py-2 font-mono text-[10px]">
                  <span className="text-zinc-500">FOUNDED: </span>
                  <span className="text-white font-bold">{about.foundedYear}</span>
                </div>
                <div className="border border-white/10 bg-[#080808] px-4 py-2 font-mono text-[10px]">
                  <span className="text-zinc-500">LOCATION: </span>
                  <span className="text-white font-bold">{about.location}</span>
                </div>
                <div className="border border-white/10 bg-[#080808] px-4 py-2 font-mono text-[10px]">
                  <span className="text-zinc-500">DISPATCH: </span>
                  <span className="text-red-400 font-bold">{about.contactEmail}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Stat Cards & JOIN US Candidate Intake Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(about.stats && about.stats.length > 0 ? about.stats : SEED_CMS.aboutUs.stats).map(
                  (stat, idx) => (
                    <div
                      key={idx}
                      className="border border-white/10 bg-[#080808] p-5 hud-clip hover:border-red-500/50 transition-all group"
                    >
                      <div className="font-mono text-3xl font-extrabold text-white group-hover:text-red-400 transition-colors">
                        {stat.value}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* JOIN US / TALENT CANDIDACY BOX (Replaced old box as requested) */}
              <div className="border border-red-500/40 bg-gradient-to-br from-red-950/30 via-[#070707] to-black p-6 hud-clip space-y-4 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                <div className="flex items-center space-x-2 text-red-400 font-mono text-[10px] tracking-widest uppercase">
                  <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>CANDIDACY TRANSMISSION // JOIN US</span>
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">
                  BECOME A TECHNOVA ARCHITECT
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  We are actively recruiting exceptional WebGL developers, AI systems architects, and creative technologists. Submit your dossier to enter our direct onboarding intake pipeline.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setJoinOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 border border-red-500 bg-red-600/30 px-4 py-3 font-mono text-xs text-white uppercase tracking-wider hover:bg-red-600 transition-all hud-clip shadow-[0_0_25px_rgba(220,38,38,0.25)]"
                  >
                    <span>JOIN THE COLLECTIVE // APPLY NOW</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Call / Brief Triggers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => openBookingWithMode('CALL')}
                  className="flex items-center justify-center space-x-1.5 border border-white/20 bg-white/[0.02] p-3 font-mono text-[10px] text-zinc-300 hover:border-red-500 hover:text-white transition-colors uppercase"
                >
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  <span>SCHEDULE CALL</span>
                </button>
                <button
                  onClick={() => openBookingWithMode('BRIEF')}
                  className="flex items-center justify-center space-x-1.5 border border-white/20 bg-white/[0.02] p-3 font-mono text-[10px] text-zinc-300 hover:border-red-500 hover:text-white transition-colors uppercase"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SUBMIT BRIEF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* R&D LAB & CONVERSION SECTION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        id="lab-matrix"
        className="relative z-10 px-6 sm:px-16 lg:px-28 py-28 border-t border-white/10"
      >
        <div className="border border-red-500/40 bg-gradient-to-br from-[#0a0303] via-[#050505] to-[#120404] p-8 sm:p-14 hud-clip">
          <div className="max-w-3xl">
            <span className="font-mono text-[10px] tracking-[0.35em] text-red-500 uppercase">
              READY TO DEPLOY THE UNIMAGINABLE?
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
              COMMISSION TECHNOVA STUDIO FOR YOUR NEXT FLAGSHIP.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Initiate a call request or transmit your technical brief directly into our engineering command board. Response guaranteed within {cmsConfig?.bookingSettings?.responseTime || '< 24 hours'}.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => openBookingWithMode('BRIEF')}
                data-hud-interactive="true"
                className="border border-red-500 bg-red-600 px-8 py-4 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-500 transition-all hud-clip shadow-[0_0_40px_rgba(220,38,38,0.35)]"
              >
                SUBMIT PROJECT BRIEF
              </button>
              <button
                onClick={() => openBookingWithMode('CALL')}
                data-hud-interactive="true"
                className="border border-white/20 bg-white/[0.04] px-8 py-4 font-mono text-xs tracking-[0.25em] text-zinc-200 uppercase hover:border-violet-500 hover:text-white transition-all hud-clip"
              >
                SCHEDULE DISCOVERY CALL
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}