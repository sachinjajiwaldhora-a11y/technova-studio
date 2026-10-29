// FILE PATH: app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  StudioMember, STORAGE_KEYS, setStore, initStore,
} from '@/lib/store';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initStore();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await res.json();

      if (res.ok && result.success && result.user) {
        setStore(STORAGE_KEYS.ACTIVE_USER, result.user);
        router.push('/team');
        return;
      }

      setError(result.error || 'ACCESS DENIED // INVALID CREDENTIALS OR CLEARANCE KEY');
    } catch {
      setError('AUTHENTICATION SERVICE UNAVAILABLE // PLEASE TRY AGAIN');
    } finally {
      setIsLoading(false);
    }
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

        </div>
      </div>
    </div>
  );
}