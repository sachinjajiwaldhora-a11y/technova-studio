// FILE PATH: components/sections/FeaturedWorkSection.tsx
'use client';

import React, { useState } from 'react';
import {
  ExternalLink, Globe, Activity, Eye, EyeOff, Layers, CheckCircle2,
  Sparkles, Terminal, ArrowUpRight, AlertCircle, RefreshCw,
} from 'lucide-react';
import { PortfolioShowcaseItem } from '@/lib/store';
import { FeaturedWorkContent, FeaturedProjectItem } from '@/lib/cms-types';

interface FeaturedWorkSectionProps {
  projects: (PortfolioShowcaseItem | FeaturedProjectItem)[];
  onOpenBooking: () => void;
  cmsData?: FeaturedWorkContent;
}

interface CaseStudyDetails {
  problem: string;
  solution: string;
  result: string;
}

const CASE_STUDY_METAS: Record<string, CaseStudyDetails> = {
  'port-01': {
    problem: 'Massive satellite orbital telemetry choked standard browser rendering with severe frame drops below 24 FPS.',
    solution: 'Engineered custom GLSL instanced particle shaders and a Rust WASM kernel processing 1.4M points on GPU.',
    result: '120 FPS locked // 0.02s sync latency // 85% reduced CPU memory load',
  },
  'port-02': {
    problem: 'Institutional algorithmic traders required spatial liquidity visualization with zero-knowledge clearance.',
    solution: 'Developed zero-knowledge client authentication and hardware-accelerated micro-interactions.',
    result: '0.02s execution // 99.999% uptime // 0 security vulnerabilities in 3 audits',
  },
  'port-03': {
    problem: 'Distributed tensor graphs were opaque, making multi-layer neural model inspection impossible in real time.',
    solution: 'Designed an interactive 3D neural topology mapper rendering 50,000+ live tensor nodes with interactive slicing.',
    result: '4x faster model debugging // 99.99% compute uptime // 50,000+ live nodes',
  },
};

export default function FeaturedWorkSection({
  projects,
  onOpenBooking,
  cmsData,
}: FeaturedWorkSectionProps) {
  const [filter, setFilter] = useState<'ALL' | 'FEATURED' | 'WEBGL' | 'AI'>('ALL');
  const [activeIframe, setActiveIframe] = useState<string | null>(null);
  const [iframeFailed, setIframeFailed] = useState<Record<string, boolean>>({});

  const displayList = cmsData?.projects?.length
    ? cmsData.projects.filter((p) => p.featured).slice(0, cmsData.maxHomeItems || 4)
    : projects;

  const filteredProjects = displayList.filter((p) => {
    if (filter === 'FEATURED') return p.featured;
    if (filter === 'WEBGL') return p.tags.some((t) => t.toLowerCase().includes('webgl') || t.toLowerCase().includes('glsl'));
    if (filter === 'AI') return p.tags.some((t) => t.toLowerCase().includes('ai'));
    return true;
  });

  const handleIframeError = (id: string) => {
    setIframeFailed((prev) => ({ ...prev, [id]: true }));
  };

  const badgeText = cmsData?.badge || 'SELECTED PRODUCTIONS // VERIFIED BUILDS';
  const headingText = cmsData?.heading || 'FEATURED WORK';
  const subText = cmsData?.subText || 'Live websites, embedded spatial engines, and high-frequency systems engineered by Technova Studio.';

  return (
    <section id="work-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--text)]">
              {headingText}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] max-w-xl font-light">
              {subText}
              Live websites, embedded spatial engines, and high-frequency systems engineered by Technova Studio.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-elevated)]">
            {(['ALL', 'FEATURED', 'WEBGL', 'AI'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 font-mono text-xs font-semibold rounded-[var(--radius)] transition-all ${
                  filter === cat
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const isIframeOpen = activeIframe === project.id;
            const hasError = iframeFailed[project.id];
            const pAny = project as any;
            const meta = {
              problem: pAny.problem || CASE_STUDY_METAS[project.id]?.problem || 'High complexity architecture requiring bespoke engineering and verified low latency.',
              solution: pAny.solution || CASE_STUDY_METAS[project.id]?.solution || 'Engineered specialized Next.js platform with hardened enterprise endpoints.',
              result: pAny.result || CASE_STUDY_METAS[project.id]?.result || `${project.metrics || '120 FPS // VERIFIED PRODUCTION'}`,
            };

            return (
              <div
                key={project.id}
                className="theme-card theme-card-hover flex flex-col justify-between overflow-hidden p-6 sm:p-8"
              >
                <div>
                  {/* Top Metas */}
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      {project.code || `PRJ // ${project.id.toUpperCase()}`}
                    </span>
                    <span className="theme-badge">
                      {project.metrics}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text)]">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-wider text-[var(--accent-2)] uppercase mt-1">
                    {project.category}
                  </p>

                  <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
                    {project.description}
                  </p>

                  {/* Case Study Breakdown: Problem -> Solution -> Result */}
                  <div className="mt-5 space-y-2.5 p-3.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-xs">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-wider block">
                        THE CHALLENGE:
                      </span>
                      <p className="text-[var(--text-muted)] mt-0.5">{meta.problem}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block">
                        TECHNOVA ARCHITECTURE:
                      </span>
                      <p className="text-[var(--text-muted)] mt-0.5">{meta.solution}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">
                        VERIFIED RESULT:
                      </span>
                      <p className="font-mono text-[11px] font-bold text-[var(--text)] mt-0.5">
                        {meta.result}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* ─── LIVE WEBSITE SHOWCASE (PROTECTED FEATURE 7) ─── */}
                  {isIframeOpen && (
                    <div className="mt-5 border border-[var(--border-strong)] rounded-[var(--radius)] overflow-hidden bg-[var(--surface-elevated)] shadow-inner">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--surface)] font-mono text-[10px]">
                        <span className="flex items-center space-x-1.5 text-[var(--accent)] font-bold">
                          <Globe className="w-3.5 h-3.5" />
                          <span>LIVE EMBEDDED PREVIEW</span>
                        </span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-[var(--text-muted)] hover:text-[var(--accent)]"
                        >
                          <span>OPEN IN NEW TAB</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {hasError ? (
                        /* Graceful Fallback Card if site blocks iframe via X-Frame-Options */
                        <div className="p-8 text-center space-y-3">
                          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                          <div className="font-mono text-xs font-bold text-[var(--text)] uppercase">
                            DIRECT BROWSER SECURITY NOTICE
                          </div>
                          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                            This production domain enforces enterprise X-Frame-Options headers. Open directly in a new tab to experience the full live engine.
                          </p>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-btn-primary px-5 py-2 text-xs font-bold uppercase inline-flex"
                          >
                            <span>LAUNCH LIVE SITE</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="relative w-full h-72 bg-black">
                          <iframe
                            src={project.liveUrl}
                            title={project.title}
                            className="w-full h-full border-0"
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            onError={() => handleIframeError(project.id)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                  {/* Toggle Embedded Preview */}
                  <button
                    onClick={() => setActiveIframe(isIframeOpen ? null : project.id)}
                    className="inline-flex items-center space-x-1.5 font-mono text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    {isIframeOpen ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>CLOSE PREVIEW</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>EMBEDDED PREVIEW</span>
                      </>
                    )}
                  </button>

                  {/* Direct Production Link in New Tab */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-btn-secondary px-3.5 py-2 text-xs font-semibold uppercase"
                    >
                      <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>OPEN IN NEW TAB</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section bottom CTA */}
        <div className="mt-14 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)] mb-4">
            Need a custom WebGL benchmark, high-frequency dashboard, or bespoke system architecture?
          </p>
          <button
            onClick={onOpenBooking}
            className="theme-btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
          >
            <span>COMMISSION A CUSTOM BUILD</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

