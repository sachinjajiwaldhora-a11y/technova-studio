// FILE PATH: app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Scene3D from '@/components/canvas/Scene3D';
import BootSequence from '@/components/entry/BootSequence';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import FloatingActions from '@/components/navigation/FloatingActions';
import CommandPalette from '@/components/navigation/CommandPalette';
import RoboticAgent from '@/components/ui/RoboticAgent';

import HeroSection from '@/components/sections/HeroSection';
import TrustStrip from '@/components/sections/TrustStrip';
import FeaturedWorkSection from '@/components/sections/FeaturedWorkSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import StatsSection from '@/components/sections/StatsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AboutManifestoSection from '@/components/sections/AboutManifestoSection';
import ArchitectSection from '@/components/sections/ArchitectSection';
import CtaBannerSection from '@/components/sections/CtaBannerSection';

import BookingModal from '@/components/modals/BookingModal';
import JoinUsModal from '@/components/modals/JoinUsModal';
import StatusTrackerModal from '@/components/modals/StatusTrackerModal';

import {
  StudioCMSConfig, PortfolioShowcaseItem,
  STORAGE_KEYS, getStore, SEED_CMS,
} from '@/lib/store';

export default function HomePage() {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'BRIEF' | 'CALL'>('BRIEF');
  const [joinOpen, setJoinOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmsConfig, setCmsConfig] = useState<StudioCMSConfig>(SEED_CMS);

  useEffect(() => {
    // 1. Hydrate CMS data from localStorage (or SEED fallback)
    const loaded = getStore<StudioCMSConfig>(STORAGE_KEYS.CMS, SEED_CMS);
    setCmsConfig(loaded);

    // 2. Check if already booted in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('technova_booted') === 'true') {
      setBootCompleted(true);
    }

    // 3. Global Cmd+K / Ctrl+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showcaseProjects: PortfolioShowcaseItem[] = cmsConfig?.portfolioShowcase?.length
    ? cmsConfig.portfolioShowcase
    : SEED_CMS.portfolioShowcase;

  const about = cmsConfig?.aboutUs || SEED_CMS.aboutUs;

  function openBookingWithMode(mode: 'BRIEF' | 'CALL') {
    setBookingMode(mode);
    setBookingOpen(true);
  }

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-[var(--bg)] selection:bg-[var(--accent)] selection:text-[var(--accent-contrast)] transition-colors duration-250">
      {/* ─── 1. BOOT SEQUENCE (Self-terminates if already booted in session) ─── */}
      <BootSequence onComplete={() => setBootCompleted(true)} />

      {/* ─── 2. BACKGROUND 3D WIREFRAME PARTICLES (Fixed Behind) ─── */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <Scene3D />
      </div>

      {/* ─── 3. STICKY NAVBAR ─── */}
      <Navbar
        onOpenBooking={() => openBookingWithMode('BRIEF')}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
        onOpenCmd={() => setCmdOpen(true)}
      />

      {/* ─── 4. MAIN CONTENT CONTAINER (Top-to-Bottom Layout) ─── */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenBooking={() => openBookingWithMode('BRIEF')}
          onOpenCall={() => openBookingWithMode('CALL')}
          tagline={about.heroTagline}
          subTagline={about.subTagline}
        />

        {/* 2. Trust Strip */}
        <TrustStrip />

        {/* 3. Featured Work + Live Showcase */}
        <FeaturedWorkSection
          projects={showcaseProjects}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 4. Services */}
        <ServicesSection
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 5. Process (Timeline) */}
        <ProcessSection
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 6. Stats (Counters) */}
        <StatsSection stats={about.stats} />

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 8. Studio Dossier & Manifesto */}
        <AboutManifestoSection
          about={about}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
          onOpenJoin={() => setJoinOpen(true)}
        />

        {/* 9. "Become a Technova Architect" (Protected Intake Form) */}
        <ArchitectSection />

        {/* 10. CTA Banner */}
        <CtaBannerSection
          onOpenBooking={() => openBookingWithMode('BRIEF')}
          onOpenCall={() => openBookingWithMode('CALL')}
          contactEmail={about.contactEmail}
        />
      </main>

      {/* ─── 5. UNIVERSAL FOOTER ─── */}
      <Footer
        onOpenBooking={() => openBookingWithMode('BRIEF')}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
        onOpenJoin={() => setJoinOpen(true)}
        contactEmail={about.contactEmail}
      />

      {/* ─── 6. PERSISTENT FLOATING ACTIONS (Dial + WhatsApp + Cmd Hint) ─── */}
      <FloatingActions onOpenCmd={() => setCmdOpen(true)} />

      {/* ─── 7. DOCKED ROBOTIC AI AGENT (Bottom-Right) ─── */}
      <RoboticAgent ready={bootCompleted} />

      {/* ─── 8. COMMAND PALETTE MODAL (Ctrl+K) ─── */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenBooking={() => openBookingWithMode('BRIEF')}
        onOpenTracker={() => {
          setTrackerInitialCode('');
          setTrackerOpen(true);
        }}
        onOpenJoin={() => setJoinOpen(true)}
      />

      {/* ─── 9. BOOKING / INQUIRY MODAL (PROTECTED) ─── */}
      <BookingModal
        isOpen={bookingOpen}
        defaultMode={bookingMode}
        onClose={() => setBookingOpen(false)}
        onOpenTracker={(code) => {
          setTrackerInitialCode(code);
          setTrackerOpen(true);
        }}
      />

      {/* ─── 10. CLIENT SPRINT TRACKER MODAL (PROTECTED) ─── */}
      <StatusTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        initialCode={trackerInitialCode}
      />

      {/* ─── 11. TALENT ONBOARDING MODAL (PROTECTED) ─── */}
      <JoinUsModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
      />
    </div>
  );
}
