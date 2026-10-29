// FILE PATH: components/team/cms/modals/AuditLogModal.tsx
'use client';

import React from 'react';
import { X, Shield, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { CMSAuditLogEntry } from '@/lib/cms-types';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: CMSAuditLogEntry[];
}

export default function AuditLogModal({ isOpen, onClose, logs }: AuditLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl theme-card bg-[var(--surface-elevated)] p-6 rounded-[var(--radius)] shadow-2xl border border-[var(--border)] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              CMS OPERATIONS AUDIT LOG // TAMPER-RESISTANT TRAIL
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Chronological record of every draft save, publication event, version rollback, and media upload.
        </p>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="p-8 text-center border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] font-mono">
              NO AUDIT EVENTS RECORDED IN ACTIVE SESSION.
            </div>
          ) : (
            logs.map((log) => {
              const actionColors: Record<string, string> = {
                PUBLISH: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
                SAVE_DRAFT: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
                REVERT_VERSION: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
                UPLOAD_MEDIA: 'text-violet-400 border-violet-500/40 bg-violet-950/20',
                TOGGLE_FEATURED: 'text-pink-400 border-pink-500/40 bg-pink-950/20',
              };

              return (
                <div
                  key={log.id}
                  className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] px-2 py-0.5 border rounded uppercase font-bold ${
                          actionColors[log.action] || 'text-[var(--text)]'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-[10px] text-[var(--accent)] font-bold">
                        {String(log.sectionKey).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text)]">{log.summary}</div>
                  </div>

                  <div className="text-right shrink-0 text-[10px] text-[var(--text-dim)]">
                    <div>{log.authorName}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-[var(--border)] text-right">
          <button
            onClick={onClose}
            className="theme-btn-secondary px-4 py-2 text-xs font-semibold uppercase"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

