// FILE PATH: components/modals/JoinUsModal.tsx
'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, ArrowRight, Shield, Code, Sparkles } from 'lucide-react';
import {
  Department, JoinRequest,
  STORAGE_KEYS, getStore, setStore, SEED_JOIN_REQUESTS,
} from '@/lib/store';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg border border-red-500/50 bg-[#060606] p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.25)] hud-clip my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center space-x-2 text-red-500 font-mono text-[10px] tracking-[0.25em] uppercase">
              <UserPlus className="w-3.5 h-3.5" />
              <span>COLLECTIVE INTAKE // TALENT ONBOARDING APPLICATION</span>
            </div>

            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white uppercase">
              JOIN TECHNOVA COLLECTIVE
            </h3>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              We recruit elite shader engineers, systems architects, and spatial designers. Submitting this application dispatches your dossier directly to our internal team onboarding console.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    FULL NAME *
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Deshmukh"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    WORK EMAIL *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@graphicslab.io"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    PORTFOLIO / DEMO REEL URL *
                  </label>
                  <input
                    required
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://ananya.art"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    GITHUB / REPO PROFILE
                  </label>
                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    PRIMARY DISCIPLINE
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    KEY SKILLS (COMMA-SEPARATED) *
                  </label>
                  <input
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Three.js, GLSL, WebGPU, Rust"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                  MISSION STATEMENT / WHY TECHNOVA? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Tell us about the hardest engineering problem you've solved or what you want to build with our collective..."
                  className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center space-x-2 border border-red-500 bg-red-600/30 py-3.5 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-600 transition-all hud-clip shadow-[0_0_30px_rgba(220,38,38,0.25)]"
              >
                <span>TRANSMIT CANDIDACY APPLICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
            <h4 className="text-2xl font-extrabold tracking-wide text-white uppercase">
              DOSSIER DISPATCHED
            </h4>
            <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
              Your candidacy application has been registered in the Studio Onboarding Matrix. The engineering leads will review your portfolio and assign clearance.
            </p>
            <div className="border border-white/10 bg-black/60 p-4 font-mono text-xs text-zinc-400 max-w-sm mx-auto">
              <div>DEPARTMENT: <span className="text-white font-bold">{department}</span></div>
              <div className="mt-1 text-[10px]">APPLICANT: {email}</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="border border-white/20 px-8 py-3 font-mono text-xs text-white hover:border-red-500 hover:bg-red-600/20 transition-all uppercase"
            >
              CLOSE TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
