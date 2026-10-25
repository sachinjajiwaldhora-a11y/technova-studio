// FILE PATH: app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  StudioMember, STORAGE_KEYS, getStore, setStore, initStore, SEED_MEMBERS, supabase,
} from '@/lib/store';
import { Shield, ArrowLeft, Terminal, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<StudioMember[]>(SEED_MEMBERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initStore();
    async function fetchCloudMembers() {
      if (supabase) {
        try {
          const { data, error: sbError } = await supabase.from('studio_members').select('*');
          if (data && data.length > 0 && !sbError) {
            const mapped: StudioMember[] = data.map((d: any) => ({
              id: d.id,
              name: d.name,
              email: d.email,
              password: d.password,
              role: d.role,
              department: d.department,
              skills: d.skills || [],
              clearanceCode: d.clearance_code || d.clearanceCode || 'LVL-05',
              photoInitials: d.photo_initials || d.photoInitials || d.name.slice(0, 2).toUpperCase(),
              accentColor: d.accent_color || d.accentColor || '#dc2626',
              privateNotes: d.private_notes || '',
              managerNotes: d.manager_notes || '',
              activeProjectIds: d.active_project_ids || [],
              metrics: d.metrics || { tasksCompleted: 0, tasksOverdue: 0, avgCompletionDays: 0, hoursLoggedTotal: 0, deliveryRatePct: 100 },
              createdAt: d.created_at || new Date().toISOString(),
              lastActive: d.last_active || new Date().toISOString(),
            }));
            setMembers(mapped);
            setStore(STORAGE_KEYS.MEMBERS, mapped);
            return;
          }
        } catch (err) {
          console.warn('Supabase member load fallback:', err);
        }
      }
      setMembers(getStore(STORAGE_KEYS.MEMBERS, SEED_MEMBERS));
    }
    fetchCloudMembers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 1. If Supabase is connected, check cloud database first
    if (supabase) {
      try {
        const { data, error: sbError } = await supabase
          .from('studio_members')
          .select('*')
          .ilike('email', email.trim())
          .eq('password', password)
          .maybeSingle();

        if (data && !sbError) {
          const cloudMember: StudioMember = {
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            department: data.department,
            skills: data.skills || [],
            clearanceCode: data.clearance_code || data.clearanceCode || 'LVL-05',
            photoInitials: data.photo_initials || data.photoInitials || data.name.slice(0, 2).toUpperCase(),
            accentColor: data.accent_color || data.accentColor || '#dc2626',
            privateNotes: data.private_notes || '',
            managerNotes: data.manager_notes || '',
            activeProjectIds: data.active_project_ids || [],
            metrics: data.metrics || { tasksCompleted: 0, tasksOverdue: 0, avgCompletionDays: 0, hoursLoggedTotal: 0, deliveryRatePct: 100 },
            createdAt: data.created_at || new Date().toISOString(),
            lastActive: new Date().toISOString(),
          };
          setStore(STORAGE_KEYS.ACTIVE_USER, cloudMember);
          router.push('/team');
          return;
        }
      } catch (err) {
        console.warn('Supabase auth fallback:', err);
      }
    }

    // 2. Fallback to LocalStorage store
    setTimeout(() => {
      const matched = members.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (!matched) {
        setError('ACCESS DENIED // INVALID CREDENTIALS OR CLEARANCE KEY');
        setIsLoading(false);
        return;
      }

      setStore(STORAGE_KEYS.ACTIVE_USER, matched);
      router.push('/team');
    }, 400);
  };

  const quickFill = (m: StudioMember) => {
    setEmail(m.email);
    setPassword(m.password);
    setError('');
  };

  const ROLE_COLORS: Record<string, string> = {
    admin: 'text-red-400',
    manager: 'text-violet-400',
    working_member: 'text-cyan-400',
    member: 'text-emerald-400',
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-red-600/12 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-red-900/10 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center space-x-2 font-mono text-[10px] tracking-widest text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>RETURN TO PUBLIC MATRIX</span>
        </button>

        {/* Login Card */}
        <div className="border border-red-500/40 bg-[#070707]/90 backdrop-blur-xl p-8 hud-clip shadow-[0_0_60px_rgba(220,38,38,0.15)]">
          {/* Header */}
          <div className="flex items-center space-x-2 text-red-500 font-mono text-[10px] tracking-[0.25em] mb-2">
            <Shield className="w-4 h-4" />
            <span>TECHNOVA INTERNAL SECURITY GATEWAY</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight uppercase mb-1">
            AUTHORIZE TEAM SESSION
          </h1>
          <p className="font-mono text-[9px] text-zinc-500 tracking-widest mb-6">
            CLEARANCE VERIFICATION REQUIRED
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 border border-red-500 bg-red-950/40 p-3 font-mono text-[10px] text-red-300 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1.5">
                STUDIO EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@technovastudio.dev"
                className="w-full border border-white/15 bg-black px-3.5 py-3 text-sm text-white focus:border-red-500 focus:outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1.5">
                CLEARANCE PASSKEY
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-white/15 bg-black px-3.5 py-3 pr-10 text-sm text-white focus:border-red-500 focus:outline-none placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-red-500 bg-red-600/25 py-3.5 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-600 transition-all hud-clip disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                <span>DECRYPT & ENTER PORTAL</span>
              )}
            </button>
          </form>

          {/* Quick Credentials */}
          <div className="mt-8 pt-6 border-t border-white/8">
            <div className="flex items-center space-x-1.5 font-mono text-[9px] text-zinc-500 mb-3">
              <Terminal className="w-3.5 h-3.5 text-red-500" />
              <span>QUICK TEST CREDENTIALS (CLICK TO AUTO-FILL)</span>
            </div>
            <div className="space-y-1.5">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => quickFill(m)}
                  className="w-full flex items-center justify-between border border-white/8 bg-white/[0.02] px-3 py-2.5 text-left font-mono text-[9px] hover:border-red-500/40 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                      style={{ background: m.accentColor }}
                    >
                      {m.photoInitials}
                    </div>
                    <span className="text-zinc-300">{m.email}</span>
                  </div>
                  <span className={`uppercase ${ROLE_COLORS[m.role] || 'text-zinc-400'}`}>
                    {m.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}