// FILE PATH: components/team/cms/sections/FormsConfigEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, Sliders, CheckCircle } from 'lucide-react';
import { FormsConfigContent } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface FormsConfigEditorProps {
  data: FormsConfigContent;
  onChange: (updated: FormsConfigContent) => void;
  currentUser: StudioMember;
}

export default function FormsConfigEditor({ data, onChange }: FormsConfigEditorProps) {
  const update = (fields: Partial<FormsConfigContent>) => {
    onChange({ ...data, ...fields });
  };

  const handleArrayChange = (field: keyof FormsConfigContent, index: number, value: string) => {
    const list = [...(data[field] as string[])];
    list[index] = value;
    onChange({ ...data, [field]: list });
  };

  const handleArrayAdd = (field: keyof FormsConfigContent, defaultValue: string) => {
    const list = [...(data[field] as string[]), defaultValue];
    onChange({ ...data, [field]: list });
  };

  const handleArrayRemove = (field: keyof FormsConfigContent, index: number) => {
    const list = [...(data[field] as string[])];
    list.splice(index, 1);
    onChange({ ...data, [field]: list });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 11 // FORMS & INTERACTIVE MODAL CONFIGURATION
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure copy, selectable scopes, budget tiers, timelines, and call slots for the Book a Project and Schedule Call modals.
        </p>
      </div>

      {/* Modal Titles & Subtitles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-3">
          <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
            PROJECT BRIEF MODAL HEADERS
          </h4>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              TITLE
            </label>
            <input
              value={data.briefTitle}
              onChange={(e) => update({ briefTitle: e.target.value })}
              className="theme-input font-mono text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SUBTITLE
            </label>
            <input
              value={data.briefSubtitle}
              onChange={(e) => update({ briefSubtitle: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SUCCESS CONFIRMATION MESSAGE
            </label>
            <textarea
              rows={2}
              value={data.successMessageBrief}
              onChange={(e) => update({ successMessageBrief: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-3">
          <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
            SCHEDULE CALL MODAL HEADERS
          </h4>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              TITLE
            </label>
            <input
              value={data.callTitle}
              onChange={(e) => update({ callTitle: e.target.value })}
              className="theme-input font-mono text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SUBTITLE
            </label>
            <input
              value={data.callSubtitle}
              onChange={(e) => update({ callSubtitle: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SUCCESS CONFIRMATION MESSAGE
            </label>
            <textarea
              rows={2}
              value={data.successMessageCall}
              onChange={(e) => update({ successMessageCall: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Selectable Scopes & Budget Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scopes */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
              AVAILABLE PROJECT SCOPES
            </h4>
            <button
              type="button"
              onClick={() => handleArrayAdd('availableScopes', 'New Custom Scope')}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD SCOPE
            </button>
          </div>
          <div className="space-y-2">
            {(data.availableScopes || []).map((scope, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={scope}
                  onChange={(e) => handleArrayChange('availableScopes', idx, e.target.value)}
                  className="theme-input font-mono text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('availableScopes', idx)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Ranges */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
              BUDGET TIERS (DROPDOWN)
            </h4>
            <button
              type="button"
              onClick={() => handleArrayAdd('availableBudgetRanges', '$50,000+')}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD TIER
            </button>
          </div>
          <div className="space-y-2">
            {(data.availableBudgetRanges || []).map((b, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={b}
                  onChange={(e) => handleArrayChange('availableBudgetRanges', idx, e.target.value)}
                  className="theme-input font-mono text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('availableBudgetRanges', idx)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timelines and Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timelines */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
              AVAILABLE TIMELINES
            </h4>
            <button
              type="button"
              onClick={() => handleArrayAdd('availableTimelines', '3-6 Months')}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD TIMELINE
            </button>
          </div>
          <div className="space-y-2">
            {(data.availableTimelines || []).map((tl, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={tl}
                  onChange={(e) => handleArrayChange('availableTimelines', idx, e.target.value)}
                  className="theme-input font-mono text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('availableTimelines', idx)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call Slots */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold uppercase text-[var(--text)]">
              CALL TIME SLOTS
            </h4>
            <button
              type="button"
              onClick={() => handleArrayAdd('availableCallSlots', '14:00 - 15:00 UTC')}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD SLOT
            </button>
          </div>
          <div className="space-y-2">
            {(data.availableCallSlots || []).map((slot, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={slot}
                  onChange={(e) => handleArrayChange('availableCallSlots', idx, e.target.value)}
                  className="theme-input font-mono text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('availableCallSlots', idx)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

