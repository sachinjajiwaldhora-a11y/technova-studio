// FILE PATH: components/ui/RoboticAgent.tsx
'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

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

export default function RoboticAgent({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'NV-UNIT.01 ONLINE. Select a telemetry query below or type your question.',
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
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        ready ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      {/* Expanded Terminal Q&A Interface */}
      {open && (
        <div className="mb-3 w-80 sm:w-96 border border-red-500/50 bg-[#070707]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.25)] hud-clip overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-red-950/20 px-4 py-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                NV-UNIT.01 // STUDIO AI
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="p-4 h-60 overflow-y-auto space-y-3 font-mono text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 ${
                  m.sender === 'bot'
                    ? 'border-l-2 border-red-500 bg-white/[0.03] text-zinc-300'
                    : 'bg-red-600/20 border border-red-500/30 text-white ml-6'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {PREDEFINED_QA.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(item.q, item.a)}
                className="text-left font-mono text-[9px] border border-white/10 bg-white/[0.02] px-2 py-1 text-zinc-400 hover:border-red-500/50 hover:text-white transition-colors"
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleCustomSubmit}
            className="flex items-center border-t border-white/10 px-3 py-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NV-UNIT.01..."
              className="w-full bg-transparent font-mono text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
            <button type="submit" className="text-red-500 hover:text-red-400 p-1">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Docked Robotic Head Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        data-hud-interactive="true"
        className="group relative ml-auto w-14 h-14 border border-red-500/60 bg-[#070707]/90 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.3)] hover:border-red-400 transition-all hud-clip"
      >
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-red-500 shadow-[0_0_10px_#ef4444] skew-x-[-14deg] group-hover:scale-y-125 transition-transform" />
          <span className="w-3 h-1 bg-red-500 shadow-[0_0_10px_#ef4444] skew-x-[14deg] group-hover:scale-y-125 transition-transform" />
        </div>
        <span className="mt-1.5 font-mono text-[7px] tracking-widest text-zinc-400 group-hover:text-red-400">
          AI.HUD
        </span>
      </button>
    </div>
  );
}