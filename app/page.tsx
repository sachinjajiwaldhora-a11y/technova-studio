// FILE PATH: app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ThemeBackground from '@/components/background/ThemeBackground';
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
import { CMSDataDictionary } from '@/lib/cms-types';
import { CMS_SEED_DEFAULTS } from '@/lib/cms';

export default function HomePage() {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'BRIEF' | 'CALL'>('BRIEF');
  const [joinOpen, setJoinOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState('');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmsConfig, setCmsConfig] = useState<StudioCMSConfig>(SEED_CMS);
  const [cmsContent, setCmsContent] = useState<CMSDataDictionary>(CMS_SEED_DEFAULTS);

  useEffect(() => {
    // 1. Hydrate CMS data from localStorage (or SEED fallback)
    const loaded = getStore<StudioCMSConfig>(STORAGE_KEYS.CMS, SEED_CMS);
    setCmsConfig(loaded);

    // 2. Fetch published content from MongoDB CMS API
    fetch('/api/cms/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.data) {
          setCmsContent((prev) => ({ ...prev, ...json.data }));
        }
      })
      .catch((e) => console.error('Error fetching live CMS content:', e));

    // 3. Check if already booted in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('technova_booted') === 'true') {
      setBootCompleted(true);
    }

    // 4. Global Cmd+K / Ctrl+K listener
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

      {/* ─── 2. THEME-SPECIFIC BACKGROUND SYSTEM (CSS/SVG Cross-fade) ─── */}
      <ThemeBackground />

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
          content={cmsContent.hero}
        />

        {/* 2. Trust Strip */}
        <TrustStrip content={cmsContent.trust_strip} />

        {/* 3. Featured Work + Live Showcase */}
        <FeaturedWorkSection
          projects={showcaseProjects}
          cmsData={cmsContent.featured_work}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 4. Services */}
        <ServicesSection
          content={cmsContent.services}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 5. Process (Timeline) */}
        <ProcessSection
          content={cmsContent.process}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
        />

        {/* 6. Stats (Counters) */}
        <StatsSection stats={about.stats} content={cmsContent.stats} />

        {/* 7. Testimonials */}
        <TestimonialsSection content={cmsContent.testimonials} />

        {/* 8. Studio Dossier & Manifesto */}
        <AboutManifestoSection
          about={about}
          cmsData={cmsContent.about}
          onOpenBooking={() => openBookingWithMode('BRIEF')}
          onOpenJoin={() => setJoinOpen(true)}
        />

        {/* 9. "Become a Technova Architect" (Protected Intake Form) */}
        <ArchitectSection content={cmsContent.architect} />

        {/* 10. CTA Banner */}
        <CtaBannerSection
          onOpenBooking={() => openBookingWithMode('BRIEF')}
          onOpenCall={() => openBookingWithMode('CALL')}
          contactEmail={about.contactEmail}
          contactData={cmsContent.contact}
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
        contactData={cmsContent.contact}
        footerData={cmsContent.footer}
      />

      {/* ─── 6. PERSISTENT FLOATING ACTIONS (Dial + WhatsApp + Cmd Hint) ─── */}
      <FloatingActions onOpenCmd={() => setCmdOpen(true)} contactData={cmsContent.contact} />

      {/* ─── 7. DOCKED ROBOTIC AI AGENT (Bottom-Right) ─── */}
      <RoboticAgent ready={bootCompleted} agentData={cmsContent.ai_agent} />

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
