// FILE PATH: components/sections/ArchitectSection.tsx
'use client';

import React, { useState } from 'react';
import {
  Sparkles, UserPlus, CheckCircle2, ArrowRight, ShieldCheck,
  Code, Cpu, Layers, Terminal,
} from 'lucide-react';
import {
  Department, JoinRequest, STORAGE_KEYS, getStore, setStore, SEED_JOIN_REQUESTS,
} from '@/lib/store';
import { saveToMongo } from '@/lib/mongodb-client';
import { ArchitectContent } from '@/lib/cms-types';

const DEPARTMENTS: Department[] = [
  'WebGL & Graphics',
  'Fullstack Engineering',
  'AI & Systems',
  'Growth & Sales',
  'UI/UX Design',
];

interface ArchitectSectionProps {
  content?: ArchitectContent;
}

export default function ArchitectSection({ content }: ArchitectSectionProps) {
  if (content && content.enabled === false) {
    return null;
  }

  const badgeText = content?.badge || '// TALENT RECRUITMENT & COHORT CLEARANCE';
  const headingText = content?.heading || 'BECOME A TECHNOVA ARCHITECT';
  const descText =
    content?.description ||
    'We are actively recruiting exceptional WebGL shader engineers, AI systems architects, distributed cloud developers, and spatial UI designers.';
  const squadBenefitTitle = content?.squadBenefitTitle || 'DECENTRALIZED HIGH-IMPACT SQUAD';
  const squadBenefitDesc =
    content?.squadBenefitDesc ||
    'Work on production contracts with venture-backed AI labs, defense tech platforms, and high-frequency fintech ventures worldwide.';
  const compTitle = content?.compensationTitle || 'HIGH-COMPENSATION COMMISSION POOL';
  const compDesc =
    content?.compensationDesc ||
    'Direct revenue-sharing per commission with guaranteed milestone payouts and executive clearance levels.';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [department, setDepartment] = useState<Department>('WebGL & Graphics');
  const [skills, setSkills] = useState('');
  const [statement, setStatement] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    // 1. Save to LocalStorage store (guaranteed synchronous backup)
    const existing = getStore<JoinRequest[]>(STORAGE_KEYS.JOIN_REQUESTS, SEED_JOIN_REQUESTS);
    const filtered = existing.filter(
      (r) => r.email?.toLowerCase().trim() !== newRequest.email.toLowerCase().trim() && r.id !== newRequest.id
    );
    setStore(STORAGE_KEYS.JOIN_REQUESTS, [newRequest, ...filtered]);

    // 2. Dispatch to MongoDB Cloud Database
    try {
      await saveToMongo('join_requests', newRequest);
    } catch {
      // Safe fallback handled by local store
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="architect-matrix" className="relative z-10 py-28 px-4 sm:px-8 lg:px-16 border-t border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Dossier Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--text)] leading-tight">
              {headingText}
            </h2>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
              {descText}
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <div className="flex items-center space-x-2 text-[var(--accent)] font-mono text-xs font-bold uppercase">
                  <Terminal className="w-4 h-4" />
                  <span>{squadBenefitTitle}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">
                  {squadBenefitDesc}
                </p>
              </div>

              <div className="p-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <div className="flex items-center space-x-2 text-[var(--accent-2)] font-mono text-xs font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{compTitle}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-light">
                  {compDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Protected Intake Form */}
          <div className="lg:col-span-7">
            <div className="theme-card p-6 sm:p-8 shadow-xl">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center space-x-2 font-mono text-[10px] tracking-wider text-[var(--accent)] uppercase font-bold mb-2">
                    <UserPlus className="w-4 h-4" />
                    <span>CANDIDACY DOSSIER // DIRECT INTAKE</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-[var(--text)] mb-4">
                    SUBMIT APPLICATION
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                          FULL NAME *
                        </label>
                        <input
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ananya Deshmukh"
                          className="theme-input font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                          EMAIL ADDRESS *
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
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
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                          GITHUB / CODE PROFILE
                        </label>
                        <input
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="theme-input font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                          PRIMARY DISCIPLINE *
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
                        <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                          CORE SKILLS (COMMA-SEPARATED) *
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
                      <label className="block font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mb-1">
                        STATEMENT // HARDEST PROBLEM SOLVED *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        placeholder="Detail the most complex engineering challenge you conquered or what you want to construct with Technova Studio..."
                        className="theme-input font-mono text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="theme-btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider"
                    >
                      <span>{isSubmitting ? 'TRANSMITTING APPLICATION...' : 'TRANSMIT CANDIDACY APPLICATION'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
                  <h4 className="text-2xl font-extrabold uppercase text-[var(--text)]">
                    DOSSIER REGISTERED
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                    Your talent application has been entered into the Technova Onboarding Matrix. The engineering directors will inspect your portfolio and assign clearance.
                  </p>
                  <div className="p-3.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] font-mono text-xs max-w-sm mx-auto">
                    <div>DEPARTMENT: <span className="font-bold text-[var(--accent)]">{department}</span></div>
                    <div className="mt-1 text-[10px] text-[var(--text-muted)]">CANDIDATE: {email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setPortfolioUrl('');
                      setGithubUrl('');
                      setSkills('');
                      setStatement('');
                    }}
                    className="theme-btn-secondary px-6 py-2.5 text-xs font-semibold uppercase"
                  >
                    SUBMIT ANOTHER CANDIDACY
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

