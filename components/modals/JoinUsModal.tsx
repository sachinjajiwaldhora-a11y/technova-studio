// FILE PATH: components/modals/JoinUsModal.tsx
'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, ArrowRight, Shield, Code, Sparkles } from 'lucide-react';
import {
  Department, JoinRequest,
  STORAGE_KEYS, getStore, setStore, SEED_JOIN_REQUESTS,
} from '@/lib/store';
import { saveToMongo } from '@/lib/mongodb-client';

interface JoinUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS: Department[] = [
  'WebGL & Graphics',
  'Fullstack Engineering',
  'AI & Systems',
  'Growth & Sales',
  'UI/UX Design',
];

export default function JoinUsModal({ isOpen, onClose }: JoinUsModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [department, setDepartment] = useState<Department>('WebGL & Graphics');
  const [skills, setSkills] = useState('');
  const [statement, setStatement] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const newRequest: JoinRequest = {
      id: `join-${Date.now().toString(36)}`,
      fullName,
      email,
      portfolioUrl,
      githubUrl: githubUrl || undefined,
      department,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      statement,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    const existing = getStore<JoinRequest[]>(STORAGE_KEYS.JOIN_REQUESTS, SEED_JOIN_REQUESTS);
    setStore(STORAGE_KEYS.JOIN_REQUESTS, [newRequest, ...existing]);

    try {
      await saveToMongo('join_requests', newRequest);
    } catch {
      // safe fallback
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[8500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg theme-card bg-[var(--surface-elevated)] p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Talent Onboarding Application Terminal"
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center space-x-2 text-[var(--accent)] font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
              <UserPlus className="w-3.5 h-3.5" />
              <span>COLLECTIVE INTAKE // TALENT ONBOARDING</span>
            </div>

            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text)] uppercase">
              JOIN TECHNOVA COLLECTIVE
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed font-light">
              We recruit elite shader engineers, systems architects, and spatial designers. Submitting this application dispatches your dossier directly to our internal onboarding console.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    FULL NAME *
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Deshmukh"
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    WORK EMAIL *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@graphicslab.io"
                    className="theme-input font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    PORTFOLIO / DEMO REEL URL *
                  </label>
                  <input
                    required
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://ananya.art"
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    GITHUB / REPO PROFILE
                  </label>
                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="theme-input font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    PRIMARY DISCIPLINE
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="theme-input font-mono text-xs"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                    KEY SKILLS (COMMA-SEPARATED) *
                  </label>
                  <input
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Three.js, GLSL, WebGPU, Rust"
                    className="theme-input font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                  MISSION STATEMENT / WHY TECHNOVA? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Tell us about the hardest engineering problem you've solved or what you want to build with our collective..."
                  className="theme-input font-mono text-xs resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 border border-red-500/40 bg-red-950/20 text-red-300 font-mono text-xs">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="theme-btn-primary w-full mt-2 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? 'TRANSMITTING APPLICATION...' : 'TRANSMIT CANDIDACY APPLICATION'}</span>
                <ArrowRight className={`w-4 h-4 ${submitting ? 'animate-pulse' : ''}`} />
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
            <h4 className="text-2xl font-extrabold tracking-wide text-[var(--text)] uppercase">
              DOSSIER DISPATCHED
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Your candidacy application has been registered in the Studio Onboarding Matrix. The engineering leads will review your portfolio and assign clearance.
            </p>
            <div className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-[var(--radius)] font-mono text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              <div>DEPARTMENT: <span className="text-[var(--accent)] font-bold">{department}</span></div>
              <div className="mt-1 text-[10px]">APPLICANT: {email}</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="theme-btn-secondary px-8 py-3 text-xs font-semibold uppercase"
            >
              CLOSE TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
