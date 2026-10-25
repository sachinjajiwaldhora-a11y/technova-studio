// FILE PATH: app/track/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StatusTrackerModal from '@/components/modals/StatusTrackerModal';
import Scene3D from '@/components/canvas/Scene3D';
import { ArrowLeft, Terminal } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || searchParams.get('id') || '';

  return (
    <main className="relative min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-4">
      <Scene3D />
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 border border-white/20 bg-black/60 px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white hover:border-red-500 transition-colors hud-clip"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
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
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 font-mono text-xs">INITIALIZING SPRINT TELEMETRY...</div>}>
      <TrackContent />
    </Suspense>
  );
}
