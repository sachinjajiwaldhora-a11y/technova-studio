// FILE PATH: components/team/cms/sections/AiAgentEditor.tsx
'use client';

import React from 'react';
import { Plus, Trash2, Bot, MessageSquare } from 'lucide-react';
import { AiAgentContent } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface AiAgentEditorProps {
  data: AiAgentContent;
  onChange: (updated: AiAgentContent) => void;
  currentUser: StudioMember;
}

export default function AiAgentEditor({ data, onChange }: AiAgentEditorProps) {
  const update = (fields: Partial<AiAgentContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateQuestions = (suggestedQuestions: { q: string; a: string }[]) => {
    onChange({ ...data, suggestedQuestions });
  };

  const handleAddQuestion = () => {
    updateQuestions([
      ...(data.suggestedQuestions || []),
      { q: 'What is your architectural timeline?', a: 'Standard production sprints range from 2 to 6 weeks.' },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const next = [...(data.suggestedQuestions || [])];
    next.splice(index, 1);
    updateQuestions(next);
  };

  const handleQuestionChange = (index: number, field: 'q' | 'a', value: string) => {
    const next = [...(data.suggestedQuestions || [])];
    next[index] = { ...next[index], [field]: value };
    updateQuestions(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 15 // AI ARCHITECT AGENT CHAT
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure the floating AI assistant, introductory greeting dialogue, and pre-prompted suggested question cards.
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[var(--text)]">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          AGENT ACTIVE ON SITE
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            AGENT CODENAME / DISPLAY NAME
          </label>
          <input
            value={data.agentName}
            onChange={(e) => update({ agentName: e.target.value })}
            className="theme-input font-mono text-xs font-bold"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            GREETING MESSAGE
          </label>
          <input
            value={data.greetingText}
            onChange={(e) => update({ greetingText: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      {/* Suggested Questions & Quick Answers */}
      <div className="space-y-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              SUGGESTED QUESTIONS & RESPONSES
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Visitors can click these one-tap chips inside the chat drawer to receive instantaneous answers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="theme-button flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD PROMPT CHIP
          </button>
        </div>

        <div className="space-y-3">
          {(data.suggestedQuestions || []).map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded border border-[var(--border)] bg-[var(--surface-sunken)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                  QUESTION #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">
                  USER QUESTION
                </label>
                <input
                  value={item.q}
                  onChange={(e) => handleQuestionChange(idx, 'q', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-wider text-[var(--text-muted)] uppercase mb-0.5">
                  AGENT INSTANT ANSWER
                </label>
                <textarea
                  rows={2}
                  value={item.a}
                  onChange={(e) => handleQuestionChange(idx, 'a', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
