// FILE PATH: components/team/cms/sections/StatsEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Database } from 'lucide-react';
import { StatsContent, StatCounterItem } from '@/lib/cms-types';
import { StudioMember, StudioProject } from '@/lib/store';

interface StatsEditorProps {
  data: StatsContent;
  onChange: (updated: StatsContent) => void;
  currentUser: StudioMember;
  studioProjects?: StudioProject[];
}

export default function StatsEditor({
  data,
  onChange,
  studioProjects = [],
}: StatsEditorProps) {
  const completedCount = studioProjects.filter((p) => p.status === 'COMPLETED').length;

  const updateStats = (stats: StatCounterItem[]) => {
    onChange({ ...data, stats });
  };

  const handleAdd = () => {
    const newItem: StatCounterItem = {
      id: `stat-${Date.now()}`,
      label: 'NEW METRIC',
      value: '99',
      suffix: '%',
      autoCalculateFromDb: false,
      order: data.stats.length + 1,
    };
    updateStats([...data.stats, newItem]);
  };

  const handleRemove = (index: number) => {
    const next = [...data.stats];
    next.splice(index, 1);
    next.forEach((item, i) => (item.order = i + 1));
    updateStats(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.stats.length) return;
    const next = [...data.stats];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => (item.order = i + 1));
    updateStats(next);
  };

  const handleFieldChange = (index: number, field: keyof StatCounterItem, value: any) => {
    const next = [...data.stats];
    next[index] = { ...next[index], [field]: value };
    updateStats(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 06 // STATS & STUDIO METRICS
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure key proof counters and operational metrics. Supports live auto-calculation from completed projects.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="theme-button flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD STAT COUNTER
        </button>
      </div>

      <div className="space-y-3">
        {data.stats.map((st, idx) => (
          <div
            key={st.id}
            className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  LABEL
                </label>
                <input
                  value={st.label}
                  onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  VALUE
                </label>
                <input
                  disabled={st.autoCalculateFromDb}
                  value={st.autoCalculateFromDb ? String(completedCount) : st.value}
                  onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                  className="theme-input font-mono text-xs font-bold text-[var(--accent)] disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  SUFFIX (e.g. +, %, /10)
                </label>
                <input
                  value={st.suffix || ''}
                  onChange={(e) => handleFieldChange(idx, 'suffix', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div className="flex items-center pt-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[11px] text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!!st.autoCalculateFromDb}
                    onChange={(e) => handleFieldChange(idx, 'autoCalculateFromDb', e.target.checked)}
                    className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <Database className="w-3 h-3 text-[var(--accent)]" />
                  AUTO DB COUNT
                </label>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border)]/40">
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
                disabled={idx === data.stats.length - 1}
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
        ))}
      </div>
    </div>
  );
}

