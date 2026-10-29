// FILE PATH: components/team/cms/modals/LivePreviewDrawer.tsx
'use client';

import React, { useState } from 'react';
import { X, Smartphone, Monitor, Tablet, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { ThemeType } from '@/lib/cms-types';

interface LivePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: 'dark-tech', name: 'Dark Tech', color: '#00ff66' },
  { id: 'minimal-clean', name: 'Minimal Clean', color: '#2563eb' },
  { id: 'bold-gradient', name: 'Bold Gradient', color: '#8b5cf6' },
  { id: 'neo-brutalism', name: 'Neo-Brutalism', color: '#f43f5e' },
];

export default function LivePreviewDrawer({ isOpen, onClose }: LivePreviewDrawerProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<ThemeType>('dark-tech');
  const [key, setKey] = useState(0);

  if (!isOpen) return null;

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm',
  };

  return (
    <div className="fixed inset-0 z-[9600] flex flex-col bg-black/90 backdrop-blur-md">
      {/* Header Bar */}
      <div className="h-14 border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[var(--accent)] uppercase">
            <Eye className="w-4 h-4" />
            <span>LIVE HOMEPAGE PREVIEW</span>
          </div>

          {/* Theme selector pills */}
          <div className="hidden sm:flex items-center space-x-1 pl-4 border-l border-[var(--border)]">
            {PREVIEW_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setPreviewTheme(t.id)}
                className={`px-2.5 py-1 rounded-[var(--radius)] font-mono text-[10px] uppercase font-bold flex items-center space-x-1.5 transition-all ${
                  previewTheme === t.id
                    ? 'border border-[var(--accent)] bg-[var(--surface)] text-[var(--text)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Device toggle & Actions */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] p-0.5">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'}`}
              title="Desktop viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded ${device === 'tablet' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'}`}
              title="Tablet viewport (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'}`}
              title="Mobile viewport (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setKey((k) => k + 1)}
            title="Refresh preview frame"
            className="p-2 border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="theme-btn-secondary px-3 py-1.5 text-xs font-semibold uppercase flex items-center space-x-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">OPEN NEW TAB</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius)] bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60">
        <div className={`h-full ${deviceWidths[device]} transition-all duration-300 shadow-2xl rounded-[var(--radius)] overflow-hidden border-2 border-[var(--border-strong)] bg-[#030712]`}>
          <iframe
            key={`${key}-${previewTheme}`}
            src={`/?previewTheme=${previewTheme}`}
            title="Homepage Live Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
