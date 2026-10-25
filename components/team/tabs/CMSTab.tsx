// FILE PATH: components/team/tabs/CMSTab.tsx
'use client';

import React, { useState } from 'react';
import {
  StudioCMSConfig, PortfolioShowcaseItem, StudioProject, RBACPermissions,
  STORAGE_KEYS, setStore,
} from '@/lib/store';
import {
  Plus, X, ExternalLink, Globe, BookOpen, Settings, Pencil, Save, Trash2,
  CheckCircle2, Star, Sparkles, Shield, Cpu, Activity,
} from 'lucide-react';

interface CMSTabProps {
  perms: RBACPermissions;
  cms: StudioCMSConfig;
  projects?: StudioProject[];
  onCMSChange: (cms: StudioCMSConfig) => void;
  onProjectsChange?: (projects: StudioProject[]) => void;
}

export default function CMSTab({
  perms, cms, projects = [], onCMSChange, onProjectsChange,
}: CMSTabProps) {
  const [activeSection, setActiveSection] = useState<'PORTFOLIO' | 'ABOUT' | 'BOOKING'>('PORTFOLIO');
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);

  // Portfolio form
  const [portForm, setPortForm] = useState<Partial<PortfolioShowcaseItem>>({});
  const [showAddPort, setShowAddPort] = useState(false);

  // About form
  const [aboutForm, setAboutForm] = useState({
    heroTagline: cms.aboutUs.heroTagline || '',
    subTagline: cms.aboutUs.subTagline || '',
    manifesto: cms.aboutUs.manifesto || '',
    vision: cms.aboutUs.vision || '',
    methodology: cms.aboutUs.methodology || '',
    securityGuarantee: cms.aboutUs.securityGuarantee || '',
    foundedYear: cms.aboutUs.foundedYear || '',
    location: cms.aboutUs.location || '',
    stats: cms.aboutUs.stats || [],
    teamHighlight: cms.aboutUs.teamHighlight || '',
    contactEmail: cms.aboutUs.contactEmail || '',
  });

  const [statsInput, setStatsInput] = useState(
    (cms.aboutUs.stats || []).map((s) => `${s.label}:${s.value}`).join('\n')
  );

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    enabled: cms.bookingSettings?.enabled ?? true,
    calendarLink: cms.bookingSettings?.calendarLink || '',
    responseTime: cms.bookingSettings?.responseTime || '< 24 hours',
    minimumBudget: cms.bookingSettings?.minimumBudget || '$15,000',
    availableScopes: cms.bookingSettings?.availableScopes || [],
    availableBudgetRanges: cms.bookingSettings?.availableBudgetRanges || [],
    availableCallSlots: cms.bookingSettings?.availableCallSlots || [],
    callMeetingPlatforms: cms.bookingSettings?.callMeetingPlatforms || [],
  });

  const [scopesInput, setScopesInput] = useState(
    (cms.bookingSettings?.availableScopes || []).join('\n')
  );
  const [budgetsInput, setBudgetsInput] = useState(
    (cms.bookingSettings?.availableBudgetRanges || []).join('\n')
  );
  const [callSlotsInput, setCallSlotsInput] = useState(
    (cms.bookingSettings?.availableCallSlots || []).join('\n')
  );
  const [platformsInput, setPlatformsInput] = useState(
    (cms.bookingSettings?.callMeetingPlatforms || []).join('\n')
  );
  const [editingBooking, setEditingBooking] = useState(false);

  function saveCMS(updated: StudioCMSConfig) {
    setStore(STORAGE_KEYS.CMS, updated);
    onCMSChange(updated);
  }

  // Portfolio CRUD
  function addPortfolioItem() {
    if (!portForm.title || !portForm.liveUrl) return;
    const newItem: PortfolioShowcaseItem = {
      id: `port-${Date.now()}`,
      code: portForm.code || `PRJ // ${portForm.title?.slice(0, 8).toUpperCase()}`,
      title: portForm.title || '',
      category: portForm.category || 'WEBGL / DISTRIBUTED',
      metrics: portForm.metrics || '120 FPS // VERIFIED',
      description: portForm.description || '',
      liveUrl: portForm.liveUrl || '',
      repoUrl: portForm.repoUrl,
      featured: portForm.featured ?? false,
      tags: (portForm as Record<string, unknown>)['tagsRaw']
        ? String((portForm as Record<string, unknown>)['tagsRaw']).split(',').map((t: string) => t.trim())
        : ['Production', 'Live'],
      thumbnailColor: portForm.thumbnailColor || '#dc2626',
    };
    const updated = { ...cms, portfolioShowcase: [...cms.portfolioShowcase, newItem] };
    saveCMS(updated);
    setShowAddPort(false);
    setPortForm({});
  }

  function toggleFeatured(itemId: string) {
    const updated = {
      ...cms,
      portfolioShowcase: cms.portfolioShowcase.map((p) =>
        p.id === itemId ? { ...p, featured: !p.featured } : p
      ),
    };
    saveCMS(updated);
  }

  function deletePortfolioItem(itemId: string) {
    const updated = {
      ...cms,
      portfolioShowcase: cms.portfolioShowcase.filter((p) => p.id !== itemId),
    };
    saveCMS(updated);
  }

  // Promote a completed project (internal or client) to public portfolio showcase
  function promoteProjectToShowcase(proj: StudioProject) {
    const existingIndex = cms.portfolioShowcase.findIndex(
      (item) => item.id === proj.id || item.title.toLowerCase() === proj.title.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Toggle featured
      toggleFeatured(cms.portfolioShowcase[existingIndex].id);
      return;
    }

    const newItem: PortfolioShowcaseItem = {
      id: proj.id,
      code: `PRJ // ${proj.type}`,
      title: proj.title,
      category: proj.tags?.join(' / ') || 'CUSTOM ARCHITECTURE',
      metrics: `${proj.actualHours || proj.estimatedHours || 120}H ENG // COMPLETED`,
      description: proj.description,
      liveUrl: proj.liveUrl || 'https://technovastudio.dev',
      repoUrl: proj.repoUrl,
      featured: true,
      tags: proj.tags && proj.tags.length > 0 ? proj.tags : ['Completed', proj.source],
      thumbnailColor: proj.source === 'CLIENT_INQUIRY' ? '#dc2626' : '#7c3aed',
    };

    saveCMS({
      ...cms,
      portfolioShowcase: [newItem, ...cms.portfolioShowcase],
    });
  }

  // Save About Us
  function saveAbout() {
    const parsedStats = statsInput
      .split('\n')
      .map((line) => {
        const [label, ...valParts] = line.split(':');
        return { label: label?.trim() || '', value: valParts.join(':').trim() || '' };
      })
      .filter((s) => s.label && s.value);

    const updated: StudioCMSConfig = {
      ...cms,
      aboutUs: {
        ...aboutForm,
        stats: parsedStats,
      },
    };
    saveCMS(updated);
    setEditingAbout(false);
  }

  // Save Booking Settings
  function saveBooking() {
    const parsedScopes = scopesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedBudgets = budgetsInput
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const parsedCallSlots = callSlotsInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const parsedPlatforms = platformsInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const updated: StudioCMSConfig = {
      ...cms,
      bookingSettings: {
        ...bookingForm,
        availableScopes: parsedScopes,
        availableBudgetRanges: parsedBudgets,
        availableCallSlots: parsedCallSlots,
        callMeetingPlatforms: parsedPlatforms,
      },
    };
    saveCMS(updated);
    setEditingBooking(false);
  }

  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">PUBLIC SITE MATRIX</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">PUBLIC CMS CONTROL</h2>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        {[
          { id: 'PORTFOLIO', label: 'PORTFOLIO SHOWCASE', icon: Globe },
          { id: 'ABOUT',     label: 'ABOUT US & TRUST ARCHITECTURE', icon: BookOpen },
          { id: 'BOOKING',   label: 'INQUIRY & CALL BOOKING SETTINGS', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as typeof activeSection)}
            className={`flex items-center space-x-2 px-5 py-3 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
              activeSection === id
                ? 'border-red-500 text-white font-bold bg-white/[0.02]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: PORTFOLIO SHOWCASE MANAGER */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeSection === 'PORTFOLIO' && (
        <div className="space-y-8">
          {/* A. COMPLETED PROJECTS INTEGRATION (Internal & Client) */}
          <div className="border border-white/10 bg-[#070707] p-6 hud-clip space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  COMPLETED PROJECTS POOL ({completedProjects.length})
                </span>
              </div>
              <span className="font-mono text-[9px] text-zinc-500">
                All internal builds and client deliverables with COMPLETED status
              </span>
            </div>

            {completedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedProjects.map((proj) => {
                  const isInShowcase = cms.portfolioShowcase.some(
                    (item) => item.id === proj.id || item.title.toLowerCase() === proj.title.toLowerCase()
                  );
                  const isFeatured = cms.portfolioShowcase.some(
                    (item) => (item.id === proj.id || item.title.toLowerCase() === proj.title.toLowerCase()) && item.featured
                  );

                  return (
                    <div
                      key={proj.id}
                      className="border border-white/10 bg-black/60 p-4 hud-clip space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between font-mono text-[9px]">
                          <span className="text-zinc-400">{proj.id}</span>
                          <span
                            className={`border px-1.5 py-0.2 ${
                              proj.source === 'CLIENT_INQUIRY'
                                ? 'border-red-500/40 text-red-300'
                                : 'border-violet-500/40 text-violet-300'
                            }`}
                          >
                            {proj.source === 'CLIENT_INQUIRY' ? 'CLIENT' : 'INTERNAL'}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-bold text-white line-clamp-1">{proj.title}</h4>
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{proj.description}</p>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center space-x-1 font-mono text-[9px] text-cyan-400 hover:underline"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>{proj.liveUrl}</span>
                          </a>
                        )}
                      </div>

                      <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                        <button
                          onClick={() => promoteProjectToShowcase(proj)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 font-mono text-[10px] uppercase border transition-all ${
                            isFeatured
                              ? 'border-red-500 bg-red-600/30 text-white font-bold'
                              : isInShowcase
                              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                              : 'border-white/20 bg-white/[0.03] text-zinc-300 hover:border-red-500 hover:text-white'
                          }`}
                        >
                          <Star className={`w-3 h-3 ${isFeatured ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                          <span>
                            {isFeatured ? 'FEATURED ON HOMEPAGE' : isInShowcase ? 'IN SHOWCASE (UNFEATURED)' : '+ FEATURE IN PORTFOLIO'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-mono text-xs text-zinc-500 py-4 text-center">
                NO COMPLETED PROJECTS YET. ADVANCE PROJECTS TO &ldquo;COMPLETED&rdquo; IN THE ENGINEERING HUB TO FEATURE THEM HERE.
              </p>
            )}
          </div>

          {/* B. CURRENT ACTIVE SHOWCASE ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase">
                  ACTIVE PUBLIC PORTFOLIO SHOWCASE ITEMS ({cms.portfolioShowcase.length})
                </h3>
                <p className="font-mono text-xs text-zinc-500">
                  Controls the live highlighted project boxes rendered on the public landing page.
                </p>
              </div>
              <button
                onClick={() => setShowAddPort(!showAddPort)}
                className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-4 py-2 font-mono text-xs text-white hover:bg-red-600 transition-colors hud-clip uppercase"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD CUSTOM SHOWCASE ITEM</span>
              </button>
            </div>

            {/* Add Custom Item Form */}
            {showAddPort && (
              <div className="border border-red-500/40 bg-[#080808] p-6 hud-clip space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">
                    CREATE CUSTOM PORTFOLIO SHOWCASE ITEM
                  </p>
                  <button onClick={() => setShowAddPort(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Display Code</label>
                    <input
                      value={portForm.code || ''}
                      onChange={(e) => setPortForm({ ...portForm, code: e.target.value })}
                      placeholder="PRJ // HYPERION-GL"
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Title *</label>
                    <input
                      value={portForm.title || ''}
                      onChange={(e) => setPortForm({ ...portForm, title: e.target.value })}
                      placeholder="AETHERIUS QUANTUM TELEMETRY"
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Category / Tech</label>
                    <input
                      value={portForm.category || ''}
                      onChange={(e) => setPortForm({ ...portForm, category: e.target.value })}
                      placeholder="CUSTOM GLSL SHADERS / NEXT.JS"
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Live Production URL *</label>
                    <input
                      value={portForm.liveUrl || ''}
                      onChange={(e) => setPortForm({ ...portForm, liveUrl: e.target.value })}
                      placeholder="https://aetherius.io"
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Metrics / Performance Badge</label>
                    <input
                      value={portForm.metrics || ''}
                      onChange={(e) => setPortForm({ ...portForm, metrics: e.target.value })}
                      placeholder="120 FPS LOCKED // 1.4M PARTICLES"
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Accent Glow Color</label>
                    <input
                      type="color"
                      value={portForm.thumbnailColor || '#dc2626'}
                      onChange={(e) => setPortForm({ ...portForm, thumbnailColor: e.target.value })}
                      className="w-full h-10 border border-white/15 bg-black px-2 py-1 cursor-pointer"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Description</label>
                    <textarea
                      rows={2}
                      value={portForm.description || ''}
                      onChange={(e) => setPortForm({ ...portForm, description: e.target.value })}
                      placeholder="Real-time spatial command interface rendering live satellite orbital mechanics..."
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={addPortfolioItem}
                  className="w-full border border-red-500 bg-red-600 py-3 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-500 transition-colors hud-clip"
                >
                  SAVE & PUBLISH TO WEBSITE PORTFOLIO
                </button>
              </div>
            )}

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cms.portfolioShowcase.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/10 bg-[#060606] p-5 hud-clip space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="text-red-400 font-bold">{item.code}</span>
                      <span className="border border-white/10 px-2 py-0.5 text-zinc-400">{item.metrics}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="font-mono text-[9px] text-zinc-400 uppercase">{item.category}</p>
                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{item.description}</p>

                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 font-mono text-[10px] text-red-400 hover:underline pt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{item.liveUrl}</span>
                      </a>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1 font-mono text-[10px] uppercase border transition-colors ${
                        item.featured
                          ? 'border-yellow-500/50 bg-yellow-950/20 text-yellow-300'
                          : 'border-white/10 text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${item.featured ? 'fill-yellow-400' : ''}`} />
                      <span>{item.featured ? 'FEATURED' : 'MARK FEATURED'}</span>
                    </button>

                    <button
                      onClick={() => deletePortfolioItem(item.id)}
                      className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: ABOUT US & TRUST ARCHITECTURE */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeSection === 'ABOUT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase">
                STUDIO MANIFESTO & TRUST BUILDER CMS
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                This content powers the Studio Manifesto section on the homepage visited via the &ldquo;STUDIO MANIFESTO&rdquo; button.
              </p>
            </div>
            {!editingAbout ? (
              <button
                onClick={() => setEditingAbout(true)}
                className="flex items-center space-x-2 border border-red-500/50 bg-red-950/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-600 hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>EDIT MANIFESTO & TRUST DOSSIER</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={saveAbout}
                  className="flex items-center space-x-2 border border-emerald-500 bg-emerald-600 px-4 py-2 font-mono text-xs text-white hover:bg-emerald-500 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE & PUBLISH TO WEBSITE</span>
                </button>
                <button
                  onClick={() => setEditingAbout(false)}
                  className="border border-white/20 px-4 py-2 font-mono text-xs text-zinc-400 hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>

          <div className="border border-white/10 bg-[#060606] p-6 hud-clip space-y-5">
            {editingAbout ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Hero Tagline
                    </label>
                    <input
                      value={aboutForm.heroTagline}
                      onChange={(e) => setAboutForm({ ...aboutForm, heroTagline: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Sub Tagline
                    </label>
                    <input
                      value={aboutForm.subTagline}
                      onChange={(e) => setAboutForm({ ...aboutForm, subTagline: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                    Studio Manifesto & Core Philosophy
                  </label>
                  <textarea
                    rows={4}
                    value={aboutForm.manifesto}
                    onChange={(e) => setAboutForm({ ...aboutForm, manifesto: e.target.value })}
                    className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Vision & Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.vision}
                      onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none resize-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Engineering Standards & Methodology (Trust Proof)
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.methodology}
                      onChange={(e) => setAboutForm({ ...aboutForm, methodology: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none resize-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Enterprise Security & NDA Guarantee
                    </label>
                    <input
                      value={aboutForm.securityGuarantee}
                      onChange={(e) => setAboutForm({ ...aboutForm, securityGuarantee: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Specialized Architecture Quote
                    </label>
                    <input
                      value={aboutForm.teamHighlight}
                      onChange={(e) => setAboutForm({ ...aboutForm, teamHighlight: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Founded Year
                    </label>
                    <input
                      value={aboutForm.foundedYear}
                      onChange={(e) => setAboutForm({ ...aboutForm, foundedYear: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Headquarters / Location
                    </label>
                    <input
                      value={aboutForm.location}
                      onChange={(e) => setAboutForm({ ...aboutForm, location: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Contact Email
                    </label>
                    <input
                      value={aboutForm.contactEmail}
                      onChange={(e) => setAboutForm({ ...aboutForm, contactEmail: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                    Live Stat Cards (Format: Label:Value, one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={statsInput}
                    onChange={(e) => setStatsInput(e.target.value)}
                    className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    placeholder="FPS Locked:120&#10;Projects Shipped:12+&#10;Uptime:99.99%&#10;Countries:8+"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="font-mono text-[9px] text-red-500 uppercase tracking-widest block">HERO TAGLINE</span>
                  <h3 className="text-2xl font-bold text-white uppercase mt-1">{cms.aboutUs.heroTagline}</h3>
                  <p className="font-mono text-xs text-zinc-400 mt-1">// {cms.aboutUs.subTagline}</p>
                </div>

                <div className="border-l-2 border-red-500 pl-4">
                  <p className="text-sm text-zinc-300 leading-relaxed font-light">{cms.aboutUs.manifesto}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-white/10 p-3 bg-black/40">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">CORE VISION</span>
                    <p className="text-xs text-zinc-300 mt-1">{cms.aboutUs.vision || 'Pioneering zero-latency spatial web architectures.'}</p>
                  </div>
                  <div className="border border-white/10 p-3 bg-black/40">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">TECHNICAL METHODOLOGY</span>
                    <p className="text-xs text-zinc-300 mt-1">{cms.aboutUs.methodology || 'GLSL shaders, locked 120 FPS standards, strict TypeScript.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(cms.aboutUs.stats || []).map((s, idx) => (
                    <div key={idx} className="border border-white/10 p-3 bg-black/60">
                      <div className="font-mono text-xl font-bold text-white">{s.value}</div>
                      <div className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: INQUIRY & CALL BOOKING SETTINGS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeSection === 'BOOKING' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase">
                INQUIRY & CALL BOOKING FORM CMS
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                Configure all options, scopes, budgets, and call slots rendered in the website brief & call modal.
              </p>
            </div>
            {!editingBooking ? (
              <button
                onClick={() => setEditingBooking(true)}
                className="flex items-center space-x-2 border border-red-500/50 bg-red-950/20 px-4 py-2 font-mono text-xs text-red-400 hover:bg-red-600 hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>EDIT BOOKING OPTIONS</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={saveBooking}
                  className="flex items-center space-x-2 border border-emerald-500 bg-emerald-600 px-4 py-2 font-mono text-xs text-white hover:bg-emerald-500 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE BOOKING OPTIONS</span>
                </button>
                <button
                  onClick={() => setEditingBooking(false)}
                  className="border border-white/20 px-4 py-2 font-mono text-xs text-zinc-400 hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>

          <div className="border border-white/10 bg-[#060606] p-6 hud-clip space-y-5">
            {editingBooking ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Response Time SLA
                    </label>
                    <input
                      value={bookingForm.responseTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, responseTime: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Minimum Budget Text
                    </label>
                    <input
                      value={bookingForm.minimumBudget}
                      onChange={(e) => setBookingForm({ ...bookingForm, minimumBudget: e.target.value })}
                      className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Intake Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, enabled: !bookingForm.enabled })}
                      className={`w-full py-2.5 font-mono text-xs uppercase border transition-colors ${
                        bookingForm.enabled
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                          : 'border-red-500 bg-red-950/30 text-red-300'
                      }`}
                    >
                      {bookingForm.enabled ? '● INTAKE: ACTIVE' : '○ INTAKE: PAUSED'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Available Architecture Scopes (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={scopesInput}
                      onChange={(e) => setScopesInput(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Available Budget Ranges (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={budgetsInput}
                      onChange={(e) => setBudgetsInput(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Available Discovery Call Time Slots (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={callSlotsInput}
                      onChange={(e) => setCallSlotsInput(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">
                      Meeting Platforms (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={platformsInput}
                      onChange={(e) => setPlatformsInput(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-white/10 p-3 bg-black/40">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">STATUS</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {cms.bookingSettings?.enabled ? 'ONLINE & ACCEPTING INTAKE' : 'PAUSED'}
                    </span>
                  </div>
                  <div className="border border-white/10 p-3 bg-black/40">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">RESPONSE SLA</span>
                    <span className="font-mono text-xs text-white font-bold">
                      {cms.bookingSettings?.responseTime || '< 24 hours'}
                    </span>
                  </div>
                  <div className="border border-white/10 p-3 bg-black/40">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">MINIMUM BUDGET</span>
                    <span className="font-mono text-xs text-white font-bold">
                      {cms.bookingSettings?.minimumBudget || '$15,000'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-white/10 p-4 bg-black/60">
                    <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest block mb-2">
                      ACTIVE ARCHITECTURE DOMAINS ({cms.bookingSettings?.availableScopes?.length || 0})
                    </span>
                    <div className="space-y-1">
                      {(cms.bookingSettings?.availableScopes || []).map((sc, i) => (
                        <div key={i} className="font-mono text-[10px] text-zinc-300">
                          &bull; {sc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-white/10 p-4 bg-black/60">
                    <span className="font-mono text-[9px] text-violet-400 uppercase tracking-widest block mb-2">
                      ACTIVE CALL SLOTS ({cms.bookingSettings?.availableCallSlots?.length || 0})
                    </span>
                    <div className="space-y-1">
                      {(cms.bookingSettings?.availableCallSlots || []).map((cs, i) => (
                        <div key={i} className="font-mono text-[10px] text-zinc-300">
                          &bull; {cs}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
