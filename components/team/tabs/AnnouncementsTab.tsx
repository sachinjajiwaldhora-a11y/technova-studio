// FILE PATH: components/team/tabs/AnnouncementsTab.tsx
'use client';

import React, { useState } from 'react';
import {
  StudioAnnouncement, StudioMember, AnnouncementCategory,
  RBACPermissions, STORAGE_KEYS, setStore,
} from '@/lib/store';
import {
  Megaphone, Pin, Plus, X, AlertTriangle, Calendar, Shield, Info,
} from 'lucide-react';

const CATEGORY_META: Record<AnnouncementCategory, { label: string; icon: React.ElementType; color: string; border: string; bg: string }> = {
  IMPORTANT: { label: 'IMPORTANT', icon: AlertTriangle, color: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-950/20' },
  MEETING:   { label: 'MEETING',   icon: Calendar,      color: 'text-violet-400', border: 'border-violet-500/50', bg: 'bg-violet-950/20' },
  POLICY:    { label: 'POLICY',    icon: Shield,        color: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/20' },
  GENERAL:   { label: 'GENERAL',   icon: Info,          color: 'text-zinc-400', border: 'border-zinc-600/50', bg: 'bg-zinc-900/30' },
};

interface AnnouncementsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  announcements: StudioAnnouncement[];
  onAnnouncementsChange: (announcements: StudioAnnouncement[]) => void;
}

export default function AnnouncementsTab({
  currentUser, perms, announcements, onAnnouncementsChange,
}: AnnouncementsTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [filterCat, setFilterCat] = useState<AnnouncementCategory | 'ALL'>('ALL');
  const [form, setForm] = useState({
    title: '', content: '', category: 'GENERAL' as AnnouncementCategory, pinned: false,
  });

  function save(updated: StudioAnnouncement[]) {
    setStore(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    onAnnouncementsChange(updated);
  }

  function post() {
    if (!form.title.trim() || !form.content.trim()) return;
    const ann: StudioAnnouncement = {
      id: `ann-${Date.now()}`,
      title: form.title,
      content: form.content,
      category: form.category,
      authorId: currentUser.id,
      authorName: currentUser.name,
      pinned: form.pinned,
      readBy: [currentUser.id],
      createdAt: new Date().toISOString(),
    };
    save([ann, ...announcements]);
    setShowCreate(false);
    setForm({ title: '', content: '', category: 'GENERAL', pinned: false });
  }

  function markRead(annId: string) {
    const updated = announcements.map((a) =>
      a.id === annId && !a.readBy.includes(currentUser.id)
        ? { ...a, readBy: [...a.readBy, currentUser.id] }
        : a
    );
    save(updated);
  }

  function togglePin(annId: string) {
    if (!perms.canPinAnnouncements) return;
    const updated = announcements.map((a) =>
      a.id === annId ? { ...a, pinned: !a.pinned } : a
    );
    save(updated);
  }

  function deleteAnn(annId: string) {
    if (!perms.canPostAnnouncements) return;
    save(announcements.filter((a) => a.id !== annId));
  }

  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visible = sorted.filter((a) => filterCat === 'ALL' || a.category === filterCat);
  const unreadCount = announcements.filter((a) => !a.readBy.includes(currentUser.id)).length;

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">STUDIO NOTICES</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase flex items-center gap-3">
            DISPATCH HUB
            {unreadCount > 0 && (
              <span className="text-sm border border-red-500/50 bg-red-950/30 text-red-400 px-2.5 py-0.5 font-mono tracking-widest">
                {unreadCount} UNREAD
              </span>
            )}
          </h2>
        </div>
        {perms.canPostAnnouncements && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-all hud-clip"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>POST DISPATCH</span>
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 border border-red-500/40 bg-[#080808] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">BROADCAST NEW DISPATCH</p>
            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Sprint call this Friday 6PM IST"
                className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Content *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                placeholder="Full announcement details, links, important notes..."
                className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as AnnouncementCategory })}
                  className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="IMPORTANT">IMPORTANT</option>
                  <option value="MEETING">MEETING</option>
                  <option value="POLICY">POLICY</option>
                </select>
              </div>
              {perms.canPinAnnouncements && (
                <div className="flex items-center space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, pinned: !form.pinned })}
                    className={`flex items-center space-x-2 px-4 py-2.5 border font-mono text-xs transition-colors ${
                      form.pinned ? 'border-amber-500 bg-amber-950/30 text-amber-400' : 'border-white/15 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{form.pinned ? 'PINNED' : 'PIN IT'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <button onClick={post} className="w-full border border-red-500 bg-red-600 py-3 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-500 transition-colors hud-clip">
            BROADCAST TO ALL MEMBERS
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['ALL', 'IMPORTANT', 'MEETING', 'POLICY', 'GENERAL'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 font-mono text-[9px] tracking-widest border transition-colors ${
              filterCat === cat ? 'border-red-500 bg-red-600/20 text-white' : 'border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcement Cards */}
      <div className="space-y-3">
        {visible.map((ann) => {
          const meta = CATEGORY_META[ann.category];
          const Icon = meta.icon;
          const isUnread = !ann.readBy.includes(currentUser.id);

          return (
            <div
              key={ann.id}
              onClick={() => markRead(ann.id)}
              className={`border ${isUnread ? 'border-red-500/30' : 'border-white/10'} bg-[#060606] p-5 hud-clip cursor-pointer hover:bg-white/[0.02] transition-colors`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Category Badge */}
                  <div className={`shrink-0 flex items-center space-x-1 border ${meta.border} ${meta.bg} px-2 py-1`}>
                    <Icon className={`w-3 h-3 ${meta.color}`} />
                    <span className={`font-mono text-[8px] tracking-widest ${meta.color}`}>{meta.label}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
                      <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {ann.content}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[9px] text-zinc-500">
                      <span>by {ann.authorName}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{ann.readBy.length} read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {perms.canPinAnnouncements && (
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePin(ann.id); }}
                      className={`p-1.5 transition-colors ${ann.pinned ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'}`}
                      title="Toggle pin"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {(perms.canPostAnnouncements && (ann.authorId === currentUser.id || currentUser.role === 'admin')) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteAnn(ann.id); }}
                      className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="text-center py-16 border border-white/8 bg-[#060606]">
            <Megaphone className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">NO DISPATCHES FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
