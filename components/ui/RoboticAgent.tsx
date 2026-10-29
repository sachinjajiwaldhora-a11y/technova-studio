// FILE PATH: components/ui/RoboticAgent.tsx
'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, MessageSquare } from 'lucide-react';
import { AiAgentContent } from '@/lib/cms-types';

const PREDEFINED_QA = [
  {
    q: 'What does Technova Studio engineer?',
    a: 'We architect ultra-high-performance WebGL platforms, custom AI systems, distributed cloud kernels, and bespoke digital experiences that defy standard browser limits.',
  },
  {
    q: 'How do we initiate a project or book a call?',
    a: 'Click "INITIATE BRIEF" or press CMD+K and type /book. Once you submit your scope, our system auto-provisions a client session for you.',
  },
  {
    q: 'How does Team Portal clearance work?',
    a: 'Technova Admins onboard members via email with a fixed encryption key. Working Members access full telemetry & data sheets; new Members have restricted clearance.',
  },
];

interface RoboticAgentProps {
  ready?: boolean;
  agentData?: AiAgentContent;
}

export default function RoboticAgent({ ready = true, agentData }: RoboticAgentProps) {
  if (agentData && agentData.enabled === false) {
    return null;
  }

  const agentName = agentData?.agentName || 'NV-UNIT.01';
  const greeting =
    agentData?.greetingText ||
    `${agentName} ONLINE. Select a telemetry query below or type your question.`;
  const questionsList = agentData?.suggestedQuestions?.length
    ? agentData.suggestedQuestions
    : PREDEFINED_QA;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: greeting,
    },
  ]);
  const [input, setInput] = useState('');

  const handleAsk = (question: string, answer?: string) => {
    const reply =
      answer ||
      'Query logged. For custom architecture specifications, please trigger the [INITIATE BRIEF] terminal on the main screen.';
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: reply },
    ]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const match = PREDEFINED_QA.find((item) =>
      item.q.toLowerCase().includes(input.toLowerCase())
    );
    handleAsk(input, match?.a);
    setInput('');
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none transition-all duration-500 ${
        ready ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="Studio AI Agent"
    >
      {/* Expanded Terminal Q&A Interface */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="NV-UNIT.01 Studio AI Assistant"
          className="mb-3 w-80 sm:w-96 theme-card overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
          style={{
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)] animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--text)] uppercase">
                {agentName} // STUDIO AI
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
              className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 font-mono text-xs bg-[var(--surface)]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-[var(--radius)] ${
                  m.sender === 'bot'
                    ? 'border-l-2 border-[var(--accent)] bg-[var(--surface-elevated)] text-[var(--text)]'
                    : 'bg-[var(--accent)] text-[var(--accent-contrast)] border border-[var(--border)] ml-6 font-semibold'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 pb-2 pt-1 bg-[var(--surface)] flex flex-wrap gap-1.5 border-t border-[var(--border)]/50">
            {questionsList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(item.q, item.a)}
                className="text-left font-mono text-[9px] border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 rounded-[var(--radius)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors"
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleCustomSubmit}
            className="flex items-center border-t border-[var(--border)] px-3 py-2 bg-[var(--surface-elevated)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NV-UNIT.01..."
              className="w-full bg-transparent font-mono text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send query"
              className="text-[var(--accent)] hover:opacity-80 p-1.5 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Docked AI Head Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle Studio AI Assistant"
        aria-expanded={open}
        className="group relative ml-auto w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-elevated)] flex flex-col items-center justify-center shadow-lg hover:border-[var(--accent)] hover:scale-105 transition-all"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 sm:w-3 h-1 rounded-full bg-[var(--accent)] skew-x-[-14deg] group-hover:scale-y-125 transition-transform" />
          <span className="w-2.5 sm:w-3 h-1 rounded-full bg-[var(--accent)] skew-x-[14deg] group-hover:scale-y-125 transition-transform" />
        </div>
        <span className="mt-1 font-mono text-[7px] font-bold tracking-widest text-[var(--text)] group-hover:text-[var(--accent)]">
          AI.HUD
        </span>
      </button>
    </div>
  );
}
