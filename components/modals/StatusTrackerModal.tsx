// FILE PATH: components/modals/StatusTrackerModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Search, CheckCircle2, Clock, Terminal, Activity,
  ArrowRight, ExternalLink, ShieldCheck, Mail, Sparkles,
  GitBranch, Layers, CheckSquare, Square, RefreshCw, AlertCircle,
} from 'lucide-react';
import {
  ClientInquiry, StudioProject, STORAGE_KEYS, getStore,
  SEED_INQUIRIES, SEED_PROJECTS, getProjectProgress,
} from '@/lib/store';

interface StatusTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export default function StatusTrackerModal({
  isOpen,
  onClose,
  initialCode = '',
}: StatusTrackerModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [searched, setSearched] = useState(false);
  const [matchedInquiry, setMatchedInquiry] = useState<ClientInquiry | null>(null);
  const [matchedProject, setMatchedProject] = useState<StudioProject | null>(null);
  const [cachedSession, setCachedSession] = useState<{
    name?: string;
    email?: string;
    sessionCode?: string;
    kind?: string;
  } | null>(null);

  // Load initial code or stored session on open
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('technova_client_session');
          if (raw) {
            const parsed = JSON.parse(raw);
            setCachedSession(parsed);
            if (!initialCode && parsed.sessionCode) {
              performSearch(parsed.sessionCode);
              return;
            }
          }
        } catch {
          // ignore
        }
      }

      if (initialCode) {
        setSearchQuery(initialCode);
        performSearch(initialCode);
      }
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  function performSearch(queryToUse?: string) {
    const q = (queryToUse ?? searchQuery).trim().toLowerCase();
    if (!q) return;

    setSearched(true);
    const inquiries = getStore<ClientInquiry[]>(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
    const projects = getStore<StudioProject[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);

    // 1. Try matching inquiry by trackingCode, email, or id
    const foundInq = inquiries.find(
      (i) =>
        (i.trackingCode && i.trackingCode.toLowerCase() === q) ||
        (i.id && i.id.toLowerCase() === q) ||
        (i.email && i.email.toLowerCase() === q)
    );

    // 2. Try matching project by trackingCode, client contact email, or id
    let foundPrj = projects.find(
      (p) =>
        (p.trackingCode && p.trackingCode.toLowerCase() === q) ||
        (p.clientInfo?.trackingCode && p.clientInfo.trackingCode.toLowerCase() === q) ||
        (p.id && p.id.toLowerCase() === q) ||
        (p.clientInfo?.contact && p.clientInfo.contact.toLowerCase() === q)
    );

    // If an inquiry was found and it links to a project, resolve that project
    if (foundInq?.convertedToProjectId && !foundPrj) {
      foundPrj = projects.find((p) => p.id === foundInq.convertedToProjectId);
    }

    // Vice versa: if project found, check if it maps to an inquiry
    if (foundPrj && !foundInq) {
      const mappedInq = inquiries.find(
        (i) => i.convertedToProjectId === foundPrj?.id || (foundPrj?.trackingCode && i.trackingCode === foundPrj.trackingCode)
      );
      if (mappedInq) setMatchedInquiry(mappedInq);
    }

    setMatchedInquiry(foundInq || null);
    setMatchedProject(foundPrj || null);
  }

  // Calculate life-cycle step
  // 1: INTAKE_RECEIVED, 2: SCOPING, 3: PROPOSAL/LOCK, 4: ACTIVE_DEV, 5: COMPLETED
  let currentStep = 1;
  if (matchedProject) {
    if (matchedProject.status === 'COMPLETED' || matchedProject.status === 'ARCHIVED') {
      currentStep = 5;
    } else if (matchedProject.status === 'REVIEW') {
      currentStep = 5;
    } else if (matchedProject.status === 'ACTIVE') {
      currentStep = 4;
    } else if (matchedProject.status === 'SCOPING') {
      currentStep = 3;
    }
  } else if (matchedInquiry) {
    if (matchedInquiry.status === 'LOCKED_DEAL') {
      currentStep = 3;
    } else if (matchedInquiry.status === 'PROPOSAL_SENT') {
      currentStep = 3;
    } else if (matchedInquiry.status === 'CALL_SCHEDULED') {
      currentStep = 2;
    } else {
      currentStep = 1;
    }
  }

  const projectPct = matchedProject ? getProjectProgress(matchedProject) : (currentStep * 20);

  const steps = [
    { num: '01', title: 'TRANSMITTED', desc: 'Inquiry Queued in Intake Matrix' },
    { num: '02', title: 'SCOPING & ARCHITECTURE', desc: 'Discovery Call & Tech Specs' },
    { num: '03', title: 'PROPOSAL LOCKED', desc: 'Sprint Roadmap & Engagement Signed' },
    { num: '04', title: 'ACTIVE DEV BUILD', desc: 'Core Engineering & Shader Pass' },
    { num: '05', title: 'DEPLOYED / LIVE', desc: 'Final Audit & Production Release' },
  ];

  return (
    <div
      className="fixed inset-0 z-[8600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl theme-card bg-[var(--surface-elevated)] p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Client Sprint Status Radar"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Telemetry Header */}
        <div className="flex items-center space-x-2 text-[var(--accent)] font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>CLIENT SPRINT RADAR // LIVE TELEMETRY</span>
        </div>

        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text)] uppercase">
          TRACK INQUIRY & SPRINT PROGRESS
        </h3>
        <p className="mt-1 text-xs text-[var(--text-muted)] font-light">
          Enter your Session Tracking Code or Email to inspect real-time intake status, engineering milestones, and live preview deployments.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            performSearch();
          }}
          className="mt-5 space-y-2"
        >
          <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 rounded-[var(--radius)] focus-within:border-[var(--accent)] transition-colors">
            <Search className="w-4 h-4 text-[var(--accent)] shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. NV-INQ-1042 or your email address"
              className="w-full bg-transparent font-mono text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none py-2"
            />
            <button
              type="submit"
              className="shrink-0 font-mono text-[10px] theme-btn-primary px-4 py-2 uppercase tracking-wider"
            >
              LOCATE
            </button>
          </div>

          {/* Quick shortcuts / hints */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[9px] text-[var(--text-muted)]">
            <span>DEMO SHORTCUTS:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('NV-INQ-1042');
                performSearch('NV-INQ-1042');
              }}
              className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 rounded text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              NV-INQ-1042 (Live Project)
            </button>
            {cachedSession?.sessionCode && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(cachedSession.sessionCode!);
                  performSearch(cachedSession.sessionCode!);
                }}
                className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 rounded text-[var(--accent-2)] hover:border-[var(--accent-2)] transition-colors"
              >
                LAST SESSION ({cachedSession.sessionCode})
              </button>
            )}
          </div>
        </form>

        {/* Results Display */}
        {searched && (
          <div className="mt-6 space-y-6">
            {!matchedInquiry && !matchedProject ? (
              <div className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center space-y-2 rounded-[var(--radius)]">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-mono text-xs text-[var(--text)] uppercase tracking-wider font-bold">
                  NO TRANSMISSION RECORD FOUND
                </p>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  No active inquiry or project matched &quot;{searchQuery}&quot;. Please verify your tracking code or contact studio operations directly.
                </p>
              </div>
            ) : (
              <>
                {/* Dossier Card */}
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <div>
                      <span className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest font-bold">
                        CLIENT DOSSIER
                      </span>
                      <h4 className="text-lg font-bold text-[var(--text)]">
                        {matchedInquiry?.company || matchedProject?.clientInfo?.company || 'Confidential Client'}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        Lead: {matchedInquiry?.clientName || matchedProject?.clientInfo?.clientName} //{' '}
                        {matchedInquiry?.email || matchedProject?.clientInfo?.contact}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest block">
                        SESSION CODE
                      </span>
                      <span className="font-mono text-sm font-bold text-[var(--accent)]">
                        {matchedInquiry?.trackingCode || matchedProject?.trackingCode || searchQuery.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-[9px]">
                    <div>
                      <span className="text-[var(--text-muted)] block">SCOPE</span>
                      <span className="text-[var(--text)] font-bold truncate block">
                        {matchedInquiry?.scope || matchedProject?.type || 'Custom Engineering'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">BUDGET TIER</span>
                      <span className="text-[var(--text)] font-bold block">
                        {matchedInquiry?.budget || matchedProject?.clientInfo?.budget || 'Tier 1'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">SUBMITTED</span>
                      <span className="text-[var(--text)] block">
                        {matchedInquiry?.submittedAt
                          ? new Date(matchedInquiry.submittedAt).toLocaleDateString()
                          : 'Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">EST. DELIVERY</span>
                      <span className="text-[var(--accent-2)] font-bold block">
                        {matchedProject?.dueDate || matchedInquiry?.preferredCallDate || '30 Days'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5-Step Lifecycle Stepper */}
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                      PIPELINE LIFECYCLE TRACKER
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      STAGE 0{currentStep} // {steps[currentStep - 1].title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {steps.map((st, idx) => {
                      const stepIndex = idx + 1;
                      const isComplete = stepIndex < currentStep;
                      const isCurrent = stepIndex === currentStep;

                      return (
                        <div
                          key={st.num}
                          className={`border p-2.5 rounded-[var(--radius)] transition-all ${
                            isCurrent
                              ? 'border-[var(--accent)] bg-[var(--surface-elevated)] shadow-sm'
                              : isComplete
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-[var(--border)]/40 opacity-40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[9px] text-[var(--text-muted)] font-bold">
                              {st.num}
                            </span>
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                            ) : null}
                          </div>
                          <p
                            className={`font-mono text-[9px] font-bold uppercase leading-tight ${
                              isCurrent ? 'text-[var(--text)]' : isComplete ? 'text-emerald-400' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {st.title}
                          </p>
                          <p className="text-[8px] text-[var(--text-muted)] font-light mt-1 line-clamp-2">
                            {st.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Active Project Sprint Status */}
                {matchedProject ? (
                  <div className="border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 rounded-[var(--radius)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-[var(--accent)]" />
                        <h5 className="font-mono text-sm font-bold text-[var(--text)] uppercase">
                          ACTIVE SPRINT ENGINE: {matchedProject.title}
                        </h5>
                      </div>
                      <span className="theme-badge">
                        {matchedProject.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
                      {matchedProject.description}
                    </p>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                        <span className="text-[var(--text-muted)]">OVERALL SPRINT COMPLETION</span>
                        <span className="font-bold text-[var(--accent)]">
                          {projectPct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full bg-[var(--accent)] transition-all duration-700 ease-out"
                          style={{ width: `${projectPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    {matchedProject.milestones && matchedProject.milestones.length > 0 && (
                      <div className="border-t border-[var(--border)] pt-3">
                        <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                          VERIFIED MILESTONES
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchedProject.milestones.map((ms) => (
                            <div
                              key={ms.id}
                              className={`flex items-center space-x-2 text-xs p-2 rounded-[var(--radius)] border ${
                                ms.completed
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-[var(--text)]'
                                  : 'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                              }`}
                            >
                              {ms.completed ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
                              )}
                              <span className={ms.completed ? '' : 'line-through opacity-70'}>
                                {ms.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Preview Button */}
                    {matchedProject.liveUrl && (
                      <div className="pt-2">
                        <a
                          href={matchedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn-primary px-5 py-2.5 text-xs font-bold uppercase inline-flex"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>ACCESS LIVE PREVIEW ENGINE</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Inquiry awaiting project conversion */
                  <div className="border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 rounded-[var(--radius)]">
                    <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs font-bold uppercase">
                      <Clock className="w-4 h-4" />
                      <span>INTAKE REVIEW & SCOPING IN PROGRESS</span>
                    </div>
                    <p className="text-xs text-[var(--text)] font-light leading-relaxed">
                      Your inquiry is being evaluated by our systems architects. A technical scoping call or customized engineering roadmap is being sequenced. You will receive an encrypted communication shortly.
                    </p>
                  </div>
                )}

                {/* Direct Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">
                  <a
                    href={`mailto:ops@technovastudio.dev?subject=Inquiry%20Status%20Update%20//%20${matchedInquiry?.trackingCode || searchQuery}`}
                    className="theme-btn-secondary px-4 py-2 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>CONTACT SPRINT LEAD</span>
                  </a>
                  <button
                    onClick={() => {
                      setSearched(false);
                      setSearchQuery('');
                      setMatchedInquiry(null);
                      setMatchedProject(null);
                    }}
                    className="text-[var(--text-muted)] hover:text-[var(--text)] underline text-[10px]"
                  >
                    SEARCH ANOTHER CODE
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
