// FILE PATH: components/team/cms/modals/VersionHistoryModal.tsx
'use client';

import React from 'react';
import { X, History, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { CMSVersion, CMSSectionKey } from '@/lib/cms-types';
import { revertToVersion } from '@/lib/cms';
import { StudioMember } from '@/lib/store';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: CMSSectionKey;
  versions: CMSVersion[];
  onReverted: () => void;
  currentUser: StudioMember;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  sectionKey,
  versions,
  onReverted,
  currentUser,
}: VersionHistoryModalProps) {
  if (!isOpen) return null;

  const handleRevert = async (ver: CMSVersion) => {
    if (!window.confirm(`Are you sure you want to revert ${sectionKey.toUpperCase()} to Version ${ver.versionNumber}?`)) {
      return;
    }

    revertToVersion(ver.id, { id: currentUser.id, name: currentUser.name });
    try {
      await fetch('/api/cms/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-id': currentUser.id,
          'x-author-name': currentUser.name,
          'x-author-role': currentUser.role,
        },
        body: JSON.stringify({ versionId: ver.id }),
      });
    } catch {
      // Local fallback handled
    }

    onReverted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg theme-card bg-[var(--surface-elevated)] p-6 rounded-[var(--radius)] shadow-2xl border border-[var(--border)] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              VERSION SNAPSHOTS // {sectionKey.toUpperCase()}
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
          Technova CMS retains the last 10 published versions of each section for rollback integrity.
        </p>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {versions.length === 0 ? (
            <div className="p-8 text-center border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] font-mono">
              NO PREVIOUS VERSION SNAPSHOTS RECORDED YET.
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.id}
                className="p-3.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between hover:border-[var(--accent)] transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      VERSION {ver.versionNumber}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-dim)] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ver.timestamp).toLocaleString()}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text)] mt-1 font-medium">{ver.summary}</p>
                  <p className="font-mono text-[9px] text-[var(--text-muted)] mt-0.5">
                    Author: {ver.authorName} ({ver.authorId})
                  </p>
                </div>

                <button
                  onClick={() => handleRevert(ver)}
                  className="theme-btn-secondary px-3 py-1.5 text-xs font-semibold uppercase flex items-center space-x-1 hover:border-amber-400 hover:text-amber-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REVERT</span>
                </button>
              </div>
            ))
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

