// FILE PATH: components/team/cms/sections/FeaturedWorkEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  ExternalLink,
  Sparkles,
  CheckCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { FeaturedWorkContent, FeaturedProjectItem } from '@/lib/cms-types';
import MediaUploaderModal from '../modals/MediaUploaderModal';
import { StudioMember, StudioProject } from '@/lib/store';

interface FeaturedWorkEditorProps {
  data: FeaturedWorkContent;
  onChange: (updated: FeaturedWorkContent) => void;
  currentUser: StudioMember;
  studioProjects?: StudioProject[];
}

export default function FeaturedWorkEditor({
  data,
  onChange,
  currentUser,
  studioProjects = [],
}: FeaturedWorkEditorProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  const update = (fields: Partial<FeaturedWorkContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateProjects = (projects: FeaturedProjectItem[]) => {
    onChange({ ...data, projects });
  };

  // Fetch completed projects from /api/cms/featured
  const fetchCompleted = async () => {
    try {
      setLoadingCompleted(true);
      const res = await fetch('/api/cms/featured');
      if (res.ok) {
        const json = await res.json();
        const remoteProjects = json.projects || json.data || [];
        setCompletedProjects(
          json.fallback
            ? studioProjects.filter((project) => project.status === 'COMPLETED')
            : remoteProjects
        );
      }
    } catch (e) {
      console.error('Failed to fetch completed projects:', e);
    } finally {
      setLoadingCompleted(false);
    }
  };

  useEffect(() => {
    if (connectModalOpen) {
      fetchCompleted();
    }
  }, [connectModalOpen]);

  const handleAddNewManual = () => {
    const newItem: FeaturedProjectItem = {
      id: `p-${Date.now()}`,
      code: `TC-${String(data.projects.length + 1).padStart(2, '0')}`,
      title: 'NEW SHOWCASE PROJECT',
      tagline: 'High-performance digital flagship platform',
      category: 'Web Application',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      metrics: '99.9% UPTIME // 10X SPEED',
      description: 'Comprehensive overview of the engineered product.',
      problem: 'Legacy bottlenecks and slow conversion infrastructure.',
      solution: 'Custom micro-architecture with real-time sync.',
      result: '140% surge in qualified conversions within 30 days.',
      techStack: ['React', 'Node.js', 'MongoDB'],
      liveUrl: 'https://example.com',
      allowIframe: true,
      featured: true,
      order: data.projects.length + 1,
    };
    updateProjects([...data.projects, newItem]);
  };

  const handleConnectProject = (completedProj: any) => {
    // Check if already in projects
    const existingIndex = data.projects.findIndex(
      (p) => p.projectId === completedProj.id || p.id === completedProj.id
    );

    if (existingIndex >= 0) {
      alert('This project is already connected in your showcase list.');
      return;
    }

    const newItem: FeaturedProjectItem = {
      id: `proj-${completedProj.id}`,
      projectId: completedProj.id,
      code: completedProj.trackingCode || `TC-${String(data.projects.length + 1).padStart(2, '0')}`,
      title: completedProj.title,
      tagline: completedProj.tagline || 'Engineered flagship digital product',
      category: completedProj.category || 'Engineering',
      tags: completedProj.techStack || ['Fullstack', 'Web'],
      metrics: completedProj.metrics || 'HIGH PERFORMANCE',
      description: completedProj.description || '',
      problem: completedProj.problem || 'Complex engineering challenge solved.',
      solution: completedProj.solution || 'Architected modern resilient stack.',
      result: completedProj.result || 'Production-grade delivery on schedule.',
      techStack: completedProj.techStack || [],
      liveUrl: completedProj.liveUrl || '',
      allowIframe: true,
      featured: true,
      order: data.projects.length + 1,
    };

    updateProjects([...data.projects, newItem]);
    setConnectModalOpen(false);
  };

  const handleRemove = (index: number) => {
    const next = [...data.projects];
    next.splice(index, 1);
    next.forEach((item, i) => (item.order = i + 1));
    updateProjects(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.projects.length) return;
    const next = [...data.projects];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => (item.order = i + 1));
    updateProjects(next);
  };

  const handleFieldChange = (index: number, field: keyof FeaturedProjectItem, value: any) => {
    const next = [...data.projects];
    next[index] = { ...next[index], [field]: value };
    updateProjects(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 03 // FEATURED WORK & LIVE WEBSITE SHOWCASE
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage showcase projects, connect completed studio projects, configure live iframe previews, and set homepage limits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConnectModalOpen(true)}
            className="theme-button flex items-center gap-1.5 text-xs text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            CONNECT COMPLETED PROJECT
          </button>
          <button
            type="button"
            onClick={handleAddNewManual}
            className="theme-button flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD MANUAL ITEM
          </button>
        </div>
      </div>

      {/* Global Section Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION BADGE
          </label>
          <input
            value={data.badge}
            onChange={(e) => update({ badge: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION HEADING
          </label>
          <input
            value={data.heading}
            onChange={(e) => update({ heading: e.target.value })}
            className="theme-input font-mono text-xs font-bold"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--accent)] uppercase mb-1 font-bold">
            MAX DISPLAYED ON HOMEPAGE
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={data.maxHomeItems || 4}
            onChange={(e) => update({ maxHomeItems: parseInt(e.target.value) || 4 })}
            className="theme-input font-mono text-xs text-[var(--accent)] font-bold"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {data.projects.map((proj, idx) => (
          <div
            key={proj.id}
            className={`p-4 rounded-lg border transition-all ${
              proj.featured
                ? 'border-[var(--border)] bg-[var(--surface)]'
                : 'border-dashed border-[var(--border)]/50 opacity-60 bg-[var(--surface-sunken)]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                  #{idx + 1}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {proj.code}
                </span>
                <span className="font-mono text-sm font-bold text-[var(--text)]">
                  {proj.title}
                </span>
                {proj.projectId && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LINKED TO STUDIO PROJECT
                  </span>
                )}
                {proj.featured ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-bold">
                    FEATURED (LIVE)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    HIDDEN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFieldChange(idx, 'featured', !proj.featured)}
                  title={proj.featured ? 'Hide from public site' : 'Show on public site'}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {proj.featured ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === data.projects.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  CODE IDENTIFIER
                </label>
                <input
                  value={proj.code}
                  onChange={(e) => handleFieldChange(idx, 'code', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  TITLE
                </label>
                <input
                  value={proj.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  CATEGORY (e.g. Web / FinTech / AI)
                </label>
                <input
                  value={proj.category}
                  onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  TAGLINE
                </label>
                <input
                  value={proj.tagline || ''}
                  onChange={(e) => handleFieldChange(idx, 'tagline', e.target.value)}
                  placeholder="One sentence description"
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  METRICS (SURGE / IMPACT)
                </label>
                <input
                  value={proj.metrics}
                  onChange={(e) => handleFieldChange(idx, 'metrics', e.target.value)}
                  placeholder="e.g. +340% CONVERSIONS // 0.2S FCP"
                  className="theme-input font-mono text-xs text-[var(--accent)] font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  PROBLEM
                </label>
                <textarea
                  rows={2}
                  value={proj.problem}
                  onChange={(e) => handleFieldChange(idx, 'problem', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  SOLUTION
                </label>
                <textarea
                  rows={2}
                  value={proj.solution}
                  onChange={(e) => handleFieldChange(idx, 'solution', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  RESULT
                </label>
                <textarea
                  rows={2}
                  value={proj.result}
                  onChange={(e) => handleFieldChange(idx, 'result', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  TECH STACK (comma-separated)
                </label>
                <input
                  value={(proj.techStack || []).join(', ')}
                  onChange={(e) =>
                    handleFieldChange(
                      idx,
                      'techStack',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Next.js, Tailwind, WebGL, Node.js"
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  TAGS (comma-separated)
                </label>
                <input
                  value={(proj.tags || []).join(', ')}
                  onChange={(e) =>
                    handleFieldChange(
                      idx,
                      'tags',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Enterprise, High-Load, Interactive"
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Links and Previews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--border)]/40">
              <div className="md:col-span-2">
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  LIVE WEBSITE URL (FOR SHOWCASE & PREVIEWS)
                </label>
                <div className="flex gap-2">
                  <input
                    value={proj.liveUrl}
                    onChange={(e) => handleFieldChange(idx, 'liveUrl', e.target.value)}
                    placeholder="https://client-product.com"
                    className="theme-input font-mono text-xs flex-1"
                  />
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-button flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  COVER IMAGE URL
                </label>
                <div className="flex gap-2">
                  <input
                    value={proj.coverImage || ''}
                    onChange={(e) => handleFieldChange(idx, 'coverImage', e.target.value)}
                    placeholder="/uploads/... or https://..."
                    className="theme-input font-mono text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItemIndex(idx);
                      setUploaderOpen(true);
                    }}
                    className="theme-button flex items-center gap-1 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={proj.allowIframe}
                  onChange={(e) => handleFieldChange(idx, 'allowIframe', e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                ENABLE LIVE IFRAME EMBED PREVIEW
              </label>
              <span className="text-[11px] text-[var(--text-muted)]">
                (Sites with X-Frame-Options headers gracefully fall back to rich showcase cards with 'Open In New Tab')
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Completed Project Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h4 className="font-mono text-sm font-bold uppercase text-[var(--text)]">
                  CONNECT COMPLETED STUDIO PROJECT
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Completed projects from the Team Management system. Private financials and client data are sanitized.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1"
              >
                CLOSE
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {loadingCompleted ? (
                <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
                  FETCHING COMPLETED STUDIO PROJECTS...
                </div>
              ) : completedProjects.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    NO COMPLETED PROJECTS FOUND IN STUDIO DATABASE
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]/70">
                    Projects must have status 'COMPLETED' in the Team Portal Projects tab.
                  </p>
                </div>
              ) : (
                completedProjects.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-3 rounded border border-[var(--border)] bg-[var(--surface-sunken)] flex items-center justify-between hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--text)]">
                          {cp.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                        {cp.description || 'No description recorded'}
                      </p>
                      {cp.techStack && cp.techStack.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {cp.techStack.map((tech: string) => (
                            <span key={tech} className="text-[10px] font-mono px-1 rounded bg-[var(--surface)] text-[var(--text-muted)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleConnectProject(cp)}
                      className="theme-button text-xs font-mono text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)] flex items-center gap-1 shrink-0 ml-4"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      CONNECT
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Uploader Modal */}
      {uploaderOpen && (
        <MediaUploaderModal
          isOpen={uploaderOpen}
          onClose={() => {
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
          currentUser={currentUser}
          onUploaded={(url: string) => {
            if (activeItemIndex !== null) {
              handleFieldChange(activeItemIndex, 'coverImage', url);
            }
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
        />
      )}
    </div>
  );
}
