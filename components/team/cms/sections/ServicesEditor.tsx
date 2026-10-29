// FILE PATH: components/team/cms/sections/ServicesEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Layers, Wrench, Sparkles } from 'lucide-react';
import { ServicesContent, ServiceItem } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface ServicesEditorProps {
  data: ServicesContent;
  onChange: (updated: ServicesContent) => void;
  currentUser: StudioMember;
}

export default function ServicesEditor({ data, onChange }: ServicesEditorProps) {
  const update = (fields: Partial<ServicesContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateServices = (services: ServiceItem[]) => {
    onChange({ ...data, services });
  };

  const handleAdd = () => {
    const nextNum = String(data.services.length + 1).padStart(2, '0');
    const newItem: ServiceItem = {
      id: `srv-${Date.now()}`,
      num: nextNum,
      title: 'SPECIALIZED ARCHITECTURE',
      description: 'Engineered digital capabilities tailored to mission-critical operational benchmarks.',
      deliverables: ['Custom Microservice Engine', 'Real-time Event Stream', 'Zero-Downtime Pipeline'],
      icon: 'Layers',
      visible: true,
      order: data.services.length + 1,
    };
    updateServices([...data.services, newItem]);
  };

  const handleRemove = (index: number) => {
    const next = [...data.services];
    next.splice(index, 1);
    next.forEach((item, i) => {
      item.order = i + 1;
      item.num = String(i + 1).padStart(2, '0');
    });
    updateServices(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.services.length) return;
    const next = [...data.services];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => {
      item.order = i + 1;
      item.num = String(i + 1).padStart(2, '0');
    });
    updateServices(next);
  };

  const handleFieldChange = (index: number, field: keyof ServiceItem, value: any) => {
    const next = [...data.services];
    next[index] = { ...next[index], [field]: value };
    updateServices(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 04 // CAPABILITIES & SERVICES
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure studio service pillars, technical deliverables, and visual representation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="theme-button flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD SERVICE PILLAR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION BADGE
          </label>
          <input
            value={data.badge}
            onChange={(e) => update({ badge: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION HEADING
          </label>
          <input
            value={data.heading}
            onChange={(e) => update({ heading: e.target.value })}
            className="theme-input font-mono text-xs font-bold"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SUBTEXT
          </label>
          <input
            value={data.subText}
            onChange={(e) => update({ subText: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        {data.services.map((srv, idx) => (
          <div
            key={srv.id}
            className={`p-4 rounded-lg border transition-all ${
              srv.visible
                ? 'border-[var(--border)] bg-[var(--surface)]'
                : 'border-dashed border-[var(--border)]/50 opacity-60 bg-[var(--surface-sunken)]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                  {srv.num}
                </span>
                <span className="font-mono text-sm font-bold text-[var(--text)]">
                  {srv.title}
                </span>
                {srv.visible ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    VISIBLE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    HIDDEN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFieldChange(idx, 'visible', !srv.visible)}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {srv.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === data.services.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  SERVICE TITLE
                </label>
                <input
                  value={srv.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  DESCRIPTION
                </label>
                <input
                  value={srv.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                DELIVERABLES (comma-separated list)
              </label>
              <input
                value={(srv.deliverables || []).join(', ')}
                onChange={(e) =>
                  handleFieldChange(
                    idx,
                    'deliverables',
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="High-load Architecture, Automated CI/CD, Next.js 15 PWA"
                className="theme-input font-mono text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
