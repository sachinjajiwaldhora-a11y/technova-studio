// FILE PATH: components/team/cms/sections/ProcessEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ProcessContent, ProcessStep } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface ProcessEditorProps {
  data: ProcessContent;
  onChange: (updated: ProcessContent) => void;
  currentUser: StudioMember;
}

export default function ProcessEditor({ data, onChange }: ProcessEditorProps) {
  const update = (fields: Partial<ProcessContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateSteps = (steps: ProcessStep[]) => {
    onChange({ ...data, steps });
  };

  const handleAdd = () => {
    const nextStepNum = String(data.steps.length + 1).padStart(2, '0');
    const newStep: ProcessStep = {
      step: nextStepNum,
      title: 'OPTIMIZE & ITERATE',
      subtitle: 'Post-Launch Benchmark',
      description: 'Continuous monitoring, telemetry optimization, and agile enhancement.',
      icon: 'Activity',
      order: data.steps.length + 1,
    };
    updateSteps([...data.steps, newStep]);
  };

  const handleRemove = (index: number) => {
    const next = [...data.steps];
    next.splice(index, 1);
    next.forEach((item, i) => {
      item.order = i + 1;
      item.step = String(i + 1).padStart(2, '0');
    });
    updateSteps(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.steps.length) return;
    const next = [...data.steps];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => {
      item.order = i + 1;
      item.step = String(i + 1).padStart(2, '0');
    });
    updateSteps(next);
  };

  const handleFieldChange = (index: number, field: keyof ProcessStep, value: any) => {
    const next = [...data.steps];
    next[index] = { ...next[index], [field]: value };
    updateSteps(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 05 // SPRINT PROCESS
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure the 5-phase execution framework (Discover, Design, Build, Launch, Support).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="theme-button flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD SPRINT PHASE
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
        {data.steps.map((st, idx) => (
          <div
            key={st.step + idx}
            className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                  PHASE {st.step}
                </span>
                <span className="font-mono text-sm font-bold text-[var(--text)]">
                  {st.title}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  ({st.subtitle})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
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
                  disabled={idx === data.steps.length - 1}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  TITLE
                </label>
                <input
                  value={st.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  SUBTITLE (TIMELINE / FOCUS)
                </label>
                <input
                  value={st.subtitle}
                  onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                DESCRIPTION
              </label>
              <textarea
                rows={2}
                value={st.description}
                onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                className="theme-input font-mono text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
