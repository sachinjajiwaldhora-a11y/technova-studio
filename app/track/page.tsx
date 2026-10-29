// FILE PATH: app/track/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StatusTrackerModal from '@/components/modals/StatusTrackerModal';
import ThemeBackground from '@/components/background/ThemeBackground';
import { ArrowLeft } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || searchParams.get('id') || '';

  return (
    <main className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-4">
      <ThemeBackground />
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => router.push('/')}
          className="theme-btn-secondary px-4 py-2 font-mono text-xs uppercase inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>RETURN TO HOME MATRIX</span>
        </button>
      </div>

      <StatusTrackerModal
        isOpen={true}
        onClose={() => router.push('/')}
        initialCode={initialCode}
      />
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-8 font-mono text-xs">INITIALIZING SPRINT TELEMETRY...</div>}>
      <TrackContent />
    </Suspense>
  );
}
