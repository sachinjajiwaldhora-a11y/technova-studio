// FILE PATH: components/team/cms/sections/TrustStripEditor.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Upload, Globe } from 'lucide-react';
import { TrustStripContent, TrustClientItem } from '@/lib/cms-types';
import MediaUploaderModal from '../modals/MediaUploaderModal';
import { StudioMember } from '@/lib/store';

interface TrustStripEditorProps {
  data: TrustStripContent;
  onChange: (updated: TrustStripContent) => void;
  currentUser: StudioMember;
}

export default function TrustStripEditor({ data, onChange, currentUser }: TrustStripEditorProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const updateClients = (clients: TrustClientItem[]) => {
    onChange({ ...data, clients });
  };

  const handleAdd = () => {
    const newItem: TrustClientItem = {
      id: `cl-${Date.now()}`,
      name: 'NEW ENTERPRISE CLIENT',
      category: 'FinTech / AI',
      visible: true,
      order: data.clients.length + 1,
    };
    updateClients([...data.clients, newItem]);
  };

  const handleRemove = (index: number) => {
    const next = [...data.clients];
    next.splice(index, 1);
    updateClients(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.clients.length) return;
    const next = [...data.clients];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    // normalize order
    next.forEach((item, i) => (item.order = i + 1));
    updateClients(next);
  };

  const handleFieldChange = (index: number, field: keyof TrustClientItem, value: any) => {
    const next = [...data.clients];
    next[index] = { ...next[index], [field]: value };
    updateClients(next);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 02 // TRUST STRIP & CLIENT LOGOS
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage enterprise client cards, validation titles, links, and display order.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="theme-btn-primary px-3 py-1.5 text-xs font-bold uppercase flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD CLIENT</span>
        </button>
      </div>

      <div>
        <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
          HEADER BADGE TEXT *
        </label>
        <input
          value={data.titleBadge}
          onChange={(e) => onChange({ ...data, titleBadge: e.target.value })}
          className="theme-input font-mono text-xs"
        />
      </div>

      <div className="space-y-3">
        {data.clients.map((client, idx) => (
          <div
            key={client.id}
            className={`p-4 rounded-[var(--radius)] border bg-[var(--surface)] transition-all ${
              client.visible ? 'border-[var(--border)]' : 'border-[var(--border)]/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <div>
                  <label className="block font-mono text-[9px] text-[var(--text-muted)] uppercase mb-0.5">
                    CLIENT NAME
                  </label>
                  <input
                    value={client.name}
                    onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-[var(--text-muted)] uppercase mb-0.5">
                    DOMAIN / INDUSTRY
                  </label>
                  <input
                    value={client.category}
                    onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-[var(--text-muted)] uppercase mb-0.5">
                    EXTERNAL LINK (OPTIONAL)
                  </label>
                  <input
                    value={client.link || ''}
                    onChange={(e) => handleFieldChange(idx, 'link', e.target.value)}
                    placeholder="https://..."
                    className="theme-input font-mono text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveItemIndex(idx);
                    setUploaderOpen(true);
                  }}
                  title="Upload Logo"
                  className="p-2 rounded border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange(idx, 'visible', !client.visible)}
                  title={client.visible ? 'Hide from public' : 'Show on public'}
                  className={`p-2 rounded border ${client.visible ? 'border-[var(--border)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-dim)]'}`}
                >
                  {client.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === data.clients.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaUploaderModal
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        currentUser={currentUser}
        onUploaded={(url) => {
          if (activeItemIndex !== null) {
            handleFieldChange(activeItemIndex, 'logoUrl', url);
          }
        }}
      />
    </div>
  );
}

