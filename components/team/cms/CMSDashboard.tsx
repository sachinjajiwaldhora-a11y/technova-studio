// FILE PATH: components/team/cms/CMSDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Shield,
  Sparkles,
  Layers,
  Activity,
  TrendingUp,
  MessageSquare,
  Users,
  UserCheck,
  Phone,
  Sliders,
  Globe,
  Search,
  Palette,
  Bot,
  Save,
  Send,
  History,
  FileText,
  Eye,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react';
import {
  CMSSectionKey,
  CMSDataDictionary,
  CMSVersion,
  CMSAuditLogEntry,
} from '@/lib/cms-types';
import { CMS_SEED_DEFAULTS } from '@/lib/cms';
import { StudioMember, StudioProject } from '@/lib/store';

// Import Section Editors
import HeroEditor from './sections/HeroEditor';
import TrustStripEditor from './sections/TrustStripEditor';
import FeaturedWorkEditor from './sections/FeaturedWorkEditor';
import ServicesEditor from './sections/ServicesEditor';
import ProcessEditor from './sections/ProcessEditor';
import StatsEditor from './sections/StatsEditor';
import TestimonialsEditor from './sections/TestimonialsEditor';
import AboutTeamEditor from './sections/AboutTeamEditor';
import ArchitectEditor from './sections/ArchitectEditor';
import ContactEditor from './sections/ContactEditor';
import FormsConfigEditor from './sections/FormsConfigEditor';
import FooterEditor from './sections/FooterEditor';
import SeoEditor from './sections/SeoEditor';
import ThemeDefaultEditor from './sections/ThemeDefaultEditor';
import AiAgentEditor from './sections/AiAgentEditor';

// Import Modals
import VersionHistoryModal from './modals/VersionHistoryModal';
import AuditLogModal from './modals/AuditLogModal';
import LivePreviewDrawer from './modals/LivePreviewDrawer';

interface CMSDashboardProps {
  currentUser: StudioMember;
  studioProjects?: StudioProject[];
  studioMembers?: StudioMember[];
}

const SECTION_MENU: {
  key: CMSSectionKey;
  num: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'hero', num: '01', label: 'Hero Banner', icon: Layout },
  { key: 'trust_strip', num: '02', label: 'Trust Strip', icon: Shield },
  { key: 'featured_work', num: '03', label: 'Featured Work', icon: Sparkles },
  { key: 'services', num: '04', label: 'Services & Specs', icon: Layers },
  { key: 'process', num: '05', label: 'Sprint Process', icon: Activity },
  { key: 'stats', num: '06', label: 'Stats & Counters', icon: TrendingUp },
  { key: 'testimonials', num: '07', label: 'Testimonials', icon: MessageSquare },
  { key: 'about', num: '08', label: 'About & Squad', icon: Users },
  { key: 'architect', num: '09', label: 'Join Architect', icon: UserCheck },
  { key: 'contact', num: '10', label: 'CTA & Contacts', icon: Phone },
  { key: 'forms', num: '11', label: 'Forms & Modals', icon: Sliders },
  { key: 'footer', num: '12', label: 'Footer & Status', icon: Globe },
  { key: 'seo', num: '13', label: 'SEO & Broadcast', icon: Search },
  { key: 'theme_default', num: '14', label: 'Default Theme', icon: Palette },
  { key: 'ai_agent', num: '15', label: 'AI Agent Chat', icon: Bot },
];

export default function CMSDashboard({
  currentUser,
  studioProjects = [],
  studioMembers = [],
}: CMSDashboardProps) {
  const [activeSection, setActiveSection] = useState<CMSSectionKey>('hero');
  const [content, setContent] = useState<CMSDataDictionary>(CMS_SEED_DEFAULTS);
  const [draftStatus, setDraftStatus] = useState<Record<CMSSectionKey, boolean>>({
    hero: false,
    trust_strip: false,
    featured_work: false,
    services: false,
    process: false,
    stats: false,
    testimonials: false,
    about: false,
    architect: false,
    contact: false,
    forms: false,
    footer: false,
    seo: false,
    theme_default: false,
    ai_agent: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [versions, setVersions] = useState<CMSVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<CMSAuditLogEntry[]>([]);

  // RBAC Permission check (Admin or manager with edit rights)
  const canPublish = currentUser.role === 'admin' || currentUser.role === 'manager';

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load published content from API
  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/content');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setContent((prev: CMSDataDictionary) => ({
            ...prev,
            ...json.data,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSectionDataChange = (updatedData: any) => {
    setContent((prev: CMSDataDictionary) => ({
      ...prev,
      [activeSection]: updatedData,
    }));
    setDraftStatus((prev) => ({
      ...prev,
      [activeSection]: true,
    }));
  };

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-id': currentUser.id,
          'x-author-role': currentUser.role,
          'x-author-name': currentUser.name,
        },
        body: JSON.stringify({
          sectionKey: activeSection,
          content: content[activeSection],
          action: 'save_draft',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save draft');
      }

      showToast(`Draft for ${activeSection.toUpperCase()} saved successfully.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Error saving draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Publish Live
  const handlePublish = async () => {
    if (!canPublish) {
      showToast('Insufficient clearance: only Admin and Manager can publish to live.', 'error');
      return;
    }

    try {
      setPublishing(true);
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-id': currentUser.id,
          'x-author-role': currentUser.role,
          'x-author-name': currentUser.name,
        },
        body: JSON.stringify({
          sectionKey: activeSection,
          content: content[activeSection],
          action: 'publish',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to publish content');
      }

      setDraftStatus((prev) => ({
        ...prev,
        [activeSection]: false,
      }));

      showToast(`Section ${activeSection.toUpperCase()} published LIVE successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error publishing content', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Discard draft
  const handleDiscard = async () => {
    if (!confirm('Discard all unsaved edits for this section and reload live version?')) return;
    await loadContent();
    setDraftStatus((prev) => ({
      ...prev,
      [activeSection]: false,
    }));
    showToast('Unsaved edits discarded.', 'info');
  };

  // Open Version History
  const handleOpenVersions = async () => {
    try {
      const res = await fetch(`/api/cms/versions?sectionKey=${activeSection}`);
      if (res.ok) {
        const json = await res.json();
        setVersions(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load version history:', err);
    }
    setVersionModalOpen(true);
  };

  // Open Audit Log
  const handleOpenAudit = async () => {
    try {
      const res = await fetch('/api/cms/audit');
      if (res.ok) {
        const json = await res.json();
        setAuditLogs(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
    setAuditModalOpen(true);
  };

  const isCurrentDraftModified = draftStatus[activeSection];
  const activeMenuObj = SECTION_MENU.find((s) => s.key === activeSection) || SECTION_MENU[0];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-lg border font-mono text-xs flex items-center gap-2 shadow-2xl transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500 text-rose-300'
              : 'bg-cyan-950/90 border-cyan-500 text-cyan-300'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Clock className="w-4 h-4 text-cyan-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main CMS Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                PUBLIC CMS V2
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
                15 SECTIONS
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Authorized content management for the public homepage and client inquiry interfaces.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 space-y-1">
            {SECTION_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              const hasDraft = draftStatus[item.key];

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[var(--accent)] text-black font-bold shadow-md'
                      : 'hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`font-mono text-[10px] ${
                        isActive ? 'text-black/80 font-bold' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {item.num}
                    </span>
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : ''}`} />
                    <span className="text-xs font-mono truncate">{item.label}</span>
                  </div>

                  {hasDraft && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded shrink-0 ${
                        isActive
                          ? 'bg-black text-[var(--accent)]'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      MODIFIED
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Access Tools */}
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
              STUDIO GOVERNANCE
            </span>
            <button
              type="button"
              onClick={handleOpenAudit}
              className="w-full theme-button flex items-center justify-center gap-1.5 text-xs font-mono"
            >
              <FileText className="w-3.5 h-3.5" />
              VIEW AUDIT LOG TRAIL
            </button>
          </div>
        </div>

        {/* Right Content Editor Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Sticky Action Bar */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                {activeMenuObj.num}
              </span>
              <div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  {activeMenuObj.label}
                  {isCurrentDraftModified ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      DRAFT EDITED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      LIVE IN PRODUCTION
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <span>Author: {currentUser.name}</span>
                  <span>•</span>
                  <span className="uppercase">Role: {currentUser.role}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                title="Live preview homepage with responsive mode & theme switcher"
                className="theme-button flex items-center gap-1.5 text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                PREVIEW
              </button>

              <button
                type="button"
                onClick={handleOpenVersions}
                title="View previous version snapshots and roll back"
                className="theme-button flex items-center gap-1.5 text-xs"
              >
                <History className="w-3.5 h-3.5" />
                HISTORY
              </button>

              {isCurrentDraftModified && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  title="Discard unsaved changes"
                  className="theme-button flex items-center gap-1.5 text-xs text-rose-400 hover:border-rose-400/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  DISCARD
                </button>
              )}

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveDraft}
                className="theme-button flex items-center gap-1.5 text-xs text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'SAVING...' : 'SAVE DRAFT'}
              </button>

              <button
                type="button"
                disabled={publishing || !canPublish}
                onClick={handlePublish}
                title={canPublish ? 'Publish live to production' : 'Admin or Manager clearance required to publish live'}
                className="theme-button-primary flex items-center gap-1.5 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                {publishing ? 'PUBLISHING...' : 'PUBLISH LIVE'}
              </button>
            </div>
          </div>

          {/* Section Form Component Container */}
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] min-h-[500px]">
            {loading ? (
              <div className="py-24 text-center font-mono text-xs text-[var(--text-muted)] space-y-2">
                <Clock className="w-5 h-5 mx-auto text-[var(--accent)] animate-spin" />
                <p>SYNCING SECURE CMS DATA FROM REPOSITORY...</p>
              </div>
            ) : (
              <>
                {activeSection === 'hero' && (
                  <HeroEditor
                    data={content.hero}
                    onChange={handleSectionDataChange}
                  />
                )}
                {activeSection === 'trust_strip' && (
                  <TrustStripEditor
                    data={content.trust_strip}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'featured_work' && (
                  <FeaturedWorkEditor
                    data={content.featured_work}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                    studioProjects={studioProjects}
                  />
                )}
                {activeSection === 'services' && (
                  <ServicesEditor
                    data={content.services}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'process' && (
                  <ProcessEditor
                    data={content.process}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'stats' && (
                  <StatsEditor
                    data={content.stats}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                    studioProjects={studioProjects}
                  />
                )}
                {activeSection === 'testimonials' && (
                  <TestimonialsEditor
                    data={content.testimonials}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'about' && (
                  <AboutTeamEditor
                    data={content.about}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                    studioMembers={studioMembers}
                  />
                )}
                {activeSection === 'architect' && (
                  <ArchitectEditor
                    data={content.architect}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'contact' && (
                  <ContactEditor
                    data={content.contact}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'forms' && (
                  <FormsConfigEditor
                    data={content.forms}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'footer' && (
                  <FooterEditor
                    data={content.footer}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'seo' && (
                  <SeoEditor
                    data={content.seo}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'theme_default' && (
                  <ThemeDefaultEditor
                    data={content.theme_default}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
                {activeSection === 'ai_agent' && (
                  <AiAgentEditor
                    data={content.ai_agent}
                    onChange={handleSectionDataChange}
                    currentUser={currentUser}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <VersionHistoryModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        sectionKey={activeSection}
        versions={versions}
        currentUser={currentUser}
        onReverted={() => {
          setVersionModalOpen(false);
          loadContent();
          showToast(`Reverted ${activeSection.toUpperCase()} successfully.`, 'success');
        }}
      />

      <AuditLogModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        logs={auditLogs}
      />

      <LivePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
