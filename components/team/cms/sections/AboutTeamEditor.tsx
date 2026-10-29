// FILE PATH: components/team/cms/sections/AboutTeamEditor.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Upload, ShieldCheck, Users } from 'lucide-react';
import { AboutContent, PublicTeamMemberItem } from '@/lib/cms-types';
import MediaUploaderModal from '../modals/MediaUploaderModal';
import { StudioMember } from '@/lib/store';

interface AboutTeamEditorProps {
  data: AboutContent;
  onChange: (updated: AboutContent) => void;
  currentUser: StudioMember;
  studioMembers?: StudioMember[];
}

export default function AboutTeamEditor({
  data,
  onChange,
  currentUser,
  studioMembers = [],
}: AboutTeamEditorProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);

  const update = (fields: Partial<AboutContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateMembers = (publicMembers: PublicTeamMemberItem[]) => {
    onChange({ ...data, publicMembers });
  };

  const updateTenets = (tenets: { title: string; desc: string }[]) => {
    onChange({ ...data, tenets });
  };

  const handleAddMemberFromTeam = (member: StudioMember) => {
    const exists = (data.publicMembers || []).some((m) => m.memberId === member.id);
    if (exists) {
      alert('This team member is already added to the public roster.');
      return;
    }

    const newPubMember: PublicTeamMemberItem = {
      memberId: member.id,
      publicName: member.name,
      publicRole: member.role === 'admin' ? 'Principal Architect' : 'Staff Engineer',
      publicDepartment: member.department || 'Fullstack Engineering',
      publicBio: 'Specializes in high-resilience architecture and distributed systems.',
      skills: member.skills || ['TypeScript', 'Distributed Systems'],
      visible: true,
      order: (data.publicMembers || []).length + 1,
    };

    updateMembers([...(data.publicMembers || []), newPubMember]);
    setMemberPickerOpen(false);
  };

  const handleAddManualMember = () => {
    const newPubMember: PublicTeamMemberItem = {
      memberId: `mem-${Date.now()}`,
      publicName: 'NEW ARCHITECT',
      publicRole: 'Senior Systems Engineer',
      publicDepartment: 'Engineering',
      publicBio: 'Architecting ultra-reliable digital infrastructure.',
      skills: ['Next.js', 'Go', 'Kubernetes'],
      visible: true,
      order: (data.publicMembers || []).length + 1,
    };
    updateMembers([...(data.publicMembers || []), newPubMember]);
  };

  const handleRemoveMember = (index: number) => {
    const next = [...(data.publicMembers || [])];
    next.splice(index, 1);
    next.forEach((item, i) => (item.order = i + 1));
    updateMembers(next);
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const list = data.publicMembers || [];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => (item.order = i + 1));
    updateMembers(next);
  };

  const handleMemberChange = (index: number, field: keyof PublicTeamMemberItem, value: any) => {
    const next = [...(data.publicMembers || [])];
    next[index] = { ...next[index], [field]: value };
    updateMembers(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 08 // ABOUT STUDIO & PUBLIC SQUAD ROSTER
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage studio manifesto, vision, architectural tenets, and publicly visible squad members.
          </p>
        </div>
      </div>

      {/* Studio Ethos & Manifesto */}
      <div className="space-y-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
          STUDIO ETHOS, FOUNDING & SECURITY GUARANTEE
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              HERO TAGLINE
            </label>
            <input
              value={data.heroTagline}
              onChange={(e) => update({ heroTagline: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              FOUNDED YEAR
            </label>
            <input
              value={data.foundedYear}
              onChange={(e) => update({ foundedYear: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              LOCATION BASE
            </label>
            <input
              value={data.location}
              onChange={(e) => update({ location: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            STUDIO MANIFESTO
          </label>
          <textarea
            rows={3}
            value={data.manifesto}
            onChange={(e) => update({ manifesto: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              LONG-TERM VISION
            </label>
            <textarea
              rows={2}
              value={data.vision}
              onChange={(e) => update({ vision: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SECURITY & CODE INTEGRITY GUARANTEE
            </label>
            <textarea
              rows={2}
              value={data.securityGuarantee}
              onChange={(e) => update({ securityGuarantee: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Tenets */}
      <div className="space-y-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            CORE ARCHITECTURAL TENETS
          </h4>
          <button
            type="button"
            onClick={() =>
              updateTenets([
                ...(data.tenets || []),
                { title: 'NEW TENET', desc: 'Core operational discipline.' },
              ])
            }
            className="theme-button flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD TENET
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data.tenets || []).map((tenet, idx) => (
            <div key={idx} className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                  TENET #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...data.tenets];
                    next.splice(idx, 1);
                    updateTenets(next);
                  }}
                  className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                value={tenet.title}
                onChange={(e) => {
                  const next = [...data.tenets];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateTenets(next);
                }}
                className="theme-input font-mono text-xs font-semibold"
                placeholder="Tenet Title"
              />
              <textarea
                rows={2}
                value={tenet.desc}
                onChange={(e) => {
                  const next = [...data.tenets];
                  next[idx] = { ...next[idx], desc: e.target.value };
                  updateTenets(next);
                }}
                className="theme-input font-mono text-xs"
                placeholder="Description"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Public Team Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              PUBLIC SQUAD ROSTER
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Select verified studio members to feature on the public site. Internal notes and compensation are never exposed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMemberPickerOpen(true)}
              className="theme-button flex items-center gap-1.5 text-xs text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
            >
              <Users className="w-3.5 h-3.5" />
              ADD FROM STUDIO TEAM
            </button>
            <button
              type="button"
              onClick={handleAddManualMember}
              className="theme-button flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD MANUAL PROFILE
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {(data.publicMembers || []).map((mem, idx) => (
            <div
              key={mem.memberId}
              className={`p-4 rounded-lg border transition-all ${
                mem.visible
                  ? 'border-[var(--border)] bg-[var(--surface)]'
                  : 'border-dashed border-[var(--border)]/50 opacity-60 bg-[var(--surface-sunken)]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-sm font-bold text-[var(--text)]">
                    {mem.publicName}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    ({mem.publicRole})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMemberChange(idx, 'visible', !mem.visible)}
                    className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {mem.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveMember(idx, 'up')}
                    className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === (data.publicMembers || []).length - 1}
                    onClick={() => handleMoveMember(idx, 'down')}
                    className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                    PUBLIC NAME
                  </label>
                  <input
                    value={mem.publicName}
                    onChange={(e) => handleMemberChange(idx, 'publicName', e.target.value)}
                    className="theme-input font-mono text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                    PUBLIC ROLE / TITLE
                  </label>
                  <input
                    value={mem.publicRole}
                    onChange={(e) => handleMemberChange(idx, 'publicRole', e.target.value)}
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                    DEPARTMENT
                  </label>
                  <input
                    value={mem.publicDepartment}
                    onChange={(e) => handleMemberChange(idx, 'publicDepartment', e.target.value)}
                    className="theme-input font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                    BIO / FOCUS
                  </label>
                  <input
                    value={mem.publicBio}
                    onChange={(e) => handleMemberChange(idx, 'publicBio', e.target.value)}
                    className="theme-input font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                    AVATAR URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={mem.publicAvatar || ''}
                      onChange={(e) => handleMemberChange(idx, 'publicAvatar', e.target.value)}
                      placeholder="/uploads/... or https://..."
                      className="theme-input font-mono text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveItemIndex(idx);
                        setUploaderOpen(true);
                      }}
                      className="theme-button flex items-center gap-1 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Picker Modal */}
      {memberPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h4 className="font-mono text-sm font-bold uppercase text-[var(--text)]">
                  SELECT STUDIO TEAM MEMBER
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Choose a member to add to the public squad.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMemberPickerOpen(false)}
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1"
              >
                CLOSE
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {studioMembers.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)]">
                  NO MEMBERS FOUND
                </div>
              ) : (
                studioMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded border border-[var(--border)] bg-[var(--surface-sunken)] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-[var(--text)]">
                        {m.name}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        {m.department} // {m.role}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddMemberFromTeam(m)}
                      className="theme-button text-xs font-mono text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
                    >
                      SELECT
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Uploader Modal */}
      {uploaderOpen && (
        <MediaUploaderModal
          isOpen={uploaderOpen}
          onClose={() => {
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
          currentUser={currentUser}
          onUploaded={(url: string) => {
            if (activeItemIndex !== null) {
              handleMemberChange(activeItemIndex, 'publicAvatar', url);
            }
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
        />
      )}
    </div>
  );
}
