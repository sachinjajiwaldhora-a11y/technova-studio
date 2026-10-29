// FILE PATH: components/team/cms/sections/ArchitectEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, UserCheck, Shield } from 'lucide-react';
import { ArchitectContent } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface ArchitectEditorProps {
  data: ArchitectContent;
  onChange: (updated: ArchitectContent) => void;
  currentUser: StudioMember;
}

export default function ArchitectEditor({ data, onChange }: ArchitectEditorProps) {
  const update = (fields: Partial<ArchitectContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateDisciplines = (availableDisciplines: string[]) => {
    onChange({ ...data, availableDisciplines });
  };

  const handleAddDiscipline = () => {
    updateDisciplines([...(data.availableDisciplines || []), 'NEW DISCIPLINE / SPECIALTY']);
  };

  const handleRemoveDiscipline = (index: number) => {
    const next = [...(data.availableDisciplines || [])];
    next.splice(index, 1);
    updateDisciplines(next);
  };

  const handleDisciplineChange = (index: number, val: string) => {
    const next = [...(data.availableDisciplines || [])];
    next[index] = val;
    updateDisciplines(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 09 // BECOME A TECHNOVA ARCHITECT
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure recruitment copy, compensation promises, squad perks, and discipline options for join requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[var(--text)]">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            SECTION ACTIVE
          </label>
        </div>
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
            EDITORIAL COPY / MISSION DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Squad Benefit */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="font-mono text-xs font-bold uppercase text-[var(--text)] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[var(--accent)]" />
            SQUAD AUTONOMY & PERKS
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              BENEFIT TITLE
            </label>
            <input
              value={data.squadBenefitTitle}
              onChange={(e) => update({ squadBenefitTitle: e.target.value })}
              className="theme-input font-mono text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              BENEFIT DETAILS
            </label>
            <textarea
              rows={2}
              value={data.squadBenefitDesc}
              onChange={(e) => update({ squadBenefitDesc: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        {/* Compensation Guarantee */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="font-mono text-xs font-bold uppercase text-[var(--text)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            COMPENSATION & SPRINT EQUITY
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              COMPENSATION TITLE
            </label>
            <input
              value={data.compensationTitle}
              onChange={(e) => update({ compensationTitle: e.target.value })}
              className="theme-input font-mono text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              COMPENSATION DETAILS
            </label>
            <textarea
              rows={2}
              value={data.compensationDesc}
              onChange={(e) => update({ compensationDesc: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Available Disciplines Selection */}
      <div className="space-y-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              DISCIPLINES ACCEPTING APPLICATIONS
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              These populate the dropdown in the 'Become a Technova Architect' modal.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddDiscipline}
            className="theme-button flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD DISCIPLINE
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.availableDisciplines || []).map((disc, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={disc}
                onChange={(e) => handleDisciplineChange(idx, e.target.value)}
                className="theme-input font-mono text-xs flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveDiscipline(idx)}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
