// FILE PATH: components/team/tabs/InquiriesTab.tsx
'use client';

import React, { useState } from 'react';
import {
  ClientInquiry, StudioMember, StudioProject, RBACPermissions,
  InquiryStatus, STORAGE_KEYS, setStore,
} from '@/lib/store';
import {
  Phone, Mail, Building2, DollarSign, Calendar, ArrowRight,
  Plus, X, ChevronDown, ChevronUp, Rocket, Clock, User,
  FileCode2, Video, CheckCircle2, AlertCircle,
} from 'lucide-react';

const STATUS_META: Record<InquiryStatus, { label: string; color: string; next: InquiryStatus | null }> = {
  NEW_INQUIRY:     { label: 'NEW INQUIRY',    color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',   next: 'CALL_SCHEDULED' },
  CALL_SCHEDULED:  { label: 'CALL SCHEDULED', color: 'text-violet-400 border-violet-500/50 bg-violet-950/30', next: 'PROPOSAL_SENT' },
  PROPOSAL_SENT:   { label: 'PROPOSAL SENT',  color: 'text-amber-400 border-amber-500/50 bg-amber-950/30', next: 'LOCKED_DEAL' },
  LOCKED_DEAL:     { label: 'DEAL LOCKED',    color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30', next: null },
  LOST:            { label: 'LOST',           color: 'text-zinc-500 border-zinc-700/50 bg-zinc-900/30',   next: null },
};

interface InquiriesTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  inquiries: ClientInquiry[];
  members: StudioMember[];
  projects: StudioProject[];
  onInquiriesChange: (inquiries: ClientInquiry[]) => void;
  onProjectsChange: (projects: StudioProject[]) => void;
}

export default function InquiriesTab({
  currentUser, perms, inquiries, members, projects, onInquiriesChange, onProjectsChange,
}: InquiriesTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [kindFilter, setKindFilter] = useState<'ALL' | 'CALL_BOOKING' | 'PROJECT_INQUIRY'>('ALL');
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'ALL'>('ALL');

  // Convert to Project Modal state
  const [convertingInquiry, setConvertingInquiry] = useState<ClientInquiry | null>(null);
  const [convertForm, setConvertForm] = useState({
    title: '',
    managerId: currentUser.id,
    assignedMemberIds: [] as string[],
    dueDate: '',
    estimatedHours: '80',
    priority: 'HIGH' as StudioProject['priority'],
    type: 'CLIENT_COMMISSION' as StudioProject['type'],
  });

  const [form, setForm] = useState({
    clientName: '', company: '', email: '', phone: '', scope: '',
    budget: '', expectedRevenue: '', leadSource: 'WEBSITE_HUD' as ClientInquiry['leadSource'],
    preferredCallDate: '', dealNotes: '', assignedSalesId: currentUser.id,
  });
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const visibleInquiries = inquiries.filter((i) => {
    if (!perms.canViewAllInquiries) return i.assignedSalesId === currentUser.id;
    if (kindFilter !== 'ALL' && (i.kind || 'PROJECT_INQUIRY') !== kindFilter) return false;
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    return true;
  });

  function saveInquiries(updated: ClientInquiry[]) {
    setStore(STORAGE_KEYS.INQUIRIES, updated);
    onInquiriesChange(updated);
  }

  function createInquiry() {
    if (!form.clientName || !form.email) return;
    const inq: ClientInquiry = {
      id: `inq-${Date.now()}`,
      kind: 'PROJECT_INQUIRY',
      clientName: form.clientName,
      company: form.company,
      email: form.email,
      phone: form.phone,
      scope: form.scope,
      budget: form.budget,
      expectedRevenue: parseInt(form.expectedRevenue) || 0,
      leadSource: form.leadSource,
      preferredCallDate: form.preferredCallDate,
      status: 'NEW_INQUIRY',
      assignedSalesId: form.assignedSalesId,
      dealNotes: form.dealNotes,
      submittedAt: new Date().toISOString(),
      followUpDate: form.preferredCallDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    };
    saveInquiries([inq, ...inquiries]);
    setShowCreate(false);
    setForm({ clientName: '', company: '', email: '', phone: '', scope: '', budget: '', expectedRevenue: '', leadSource: 'WEBSITE_HUD', preferredCallDate: '', dealNotes: '', assignedSalesId: currentUser.id });
  }

  function advanceStatus(id: string) {
    if (!perms.canUpdateInquiryStatus) return;
    const updated = inquiries.map((i) => {
      if (i.id !== id) return i;
      const meta = STATUS_META[i.status];
      if (!meta.next) return i;
      return { ...i, status: meta.next };
    });
    saveInquiries(updated);
  }

  function markLost(id: string) {
    if (!perms.canUpdateInquiryStatus) return;
    const updated = inquiries.map((i) => i.id === id ? { ...i, status: 'LOST' as InquiryStatus } : i);
    saveInquiries(updated);
  }

  function updateNotes(id: string) {
    const note = noteInputs[id]?.trim();
    if (!note) return;
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, dealNotes: i.dealNotes ? `${i.dealNotes}\n${note}` : note } : i
    );
    saveInquiries(updated);
    setNoteInputs((p) => ({ ...p, [id]: '' }));
  }

  // Open modal to configure and convert inquiry into a live project
  function openConvertModal(inq: ClientInquiry) {
    setConvertingInquiry(inq);
    setConvertForm({
      title: inq.title || `${inq.company} — ${inq.scope.slice(0, 40)}`,
      managerId: currentUser.id,
      assignedMemberIds: inq.assignedSalesId ? [inq.assignedSalesId] : [],
      dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      estimatedHours: '120',
      priority: inq.expectedRevenue > 40000 ? 'CRITICAL' : 'HIGH',
      type: 'CLIENT_COMMISSION',
    });
  }

  function confirmConversion() {
    if (!convertingInquiry || !perms.canConvertInquiryToProject) return;

    const prjId = `prj-${Date.now()}`;
    const newProject: StudioProject = {
      id: prjId,
      title: convertForm.title || `${convertingInquiry.company} Engagement`,
      description: convertingInquiry.description || `Converted from ${convertingInquiry.kind === 'CALL_BOOKING' ? 'Discovery Call' : 'Project Inquiry'} ${convertingInquiry.id}. Scope: ${convertingInquiry.scope}`,
      source: 'CLIENT_INQUIRY',
      type: convertForm.type,
      status: 'SCOPING',
      priority: convertForm.priority,
      trackingCode: convertingInquiry.trackingCode || convertingInquiry.id,
      clientInfo: {
        clientName: convertingInquiry.clientName,
        company: convertingInquiry.company,
        contact: convertingInquiry.email,
        budget: convertingInquiry.budget,
        expectedRevenue: convertingInquiry.expectedRevenue,
        followUpDate: convertingInquiry.followUpDate,
        leadSource: convertingInquiry.leadSource,
        trackingCode: convertingInquiry.trackingCode || convertingInquiry.id,
      },
      assignedMemberIds: convertForm.assignedMemberIds,
      managerId: convertForm.managerId,
      createdBy: currentUser.id,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: convertForm.dueDate,
      estimatedHours: parseInt(convertForm.estimatedHours) || 80,
      actualHours: 0,
      resourceLinks: [],
      milestones: [
        { id: `ms-${Date.now()}-1`, title: 'Kickoff & Client Briefing Alignment', completed: false, createdAt: new Date().toISOString() },
        { id: `ms-${Date.now()}-2`, title: 'Technical Architecture & GLSL Pipeline Pass', completed: false, createdAt: new Date().toISOString() },
        { id: `ms-${Date.now()}-3`, title: 'Staging Delivery & QA Review', completed: false, createdAt: new Date().toISOString() },
      ],
      comments: [
        {
          id: `cmt-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          text: `Project accepted and instantiated from inquiry ${convertingInquiry.id} (${convertingInquiry.clientName} / ${convertingInquiry.company}).`,
          createdAt: new Date().toISOString(),
        },
      ],
      hourLogs: [],
      tags: ['Client-Commission', convertingInquiry.kind || 'Inquiry'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [newProject, ...projects];
    setStore(STORAGE_KEYS.PROJECTS, updatedProjects);
    onProjectsChange(updatedProjects);

    const updatedInquiries = inquiries.map((i) =>
      i.id === convertingInquiry.id
        ? { ...i, convertedToProjectId: newProject.id, status: 'LOCKED_DEAL' as InquiryStatus }
        : i
    );
    saveInquiries(updatedInquiries);
    setConvertingInquiry(null);
  }

  const pipelineValue = visibleInquiries
    .filter((i) => i.status !== 'LOST')
    .reduce((sum, i) => sum + i.expectedRevenue, 0);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">CLIENT INTAKE & CALL BOOKINGS</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">INQUIRY PIPELINE</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right border-r border-white/10 pr-4 hidden sm:block">
            <span className="font-mono text-[9px] text-zinc-500 uppercase block">ACTIVE PIPELINE</span>
            <span className="font-mono text-base font-extrabold text-emerald-400">
              ${pipelineValue.toLocaleString()}
            </span>
          </div>
          {perms.canCreateInquiry && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-all hud-clip"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW INQUIRY</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Create Form */}
      {showCreate && (
        <div className="border border-red-500/40 bg-[#080808] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">LOG MANUAL CLIENT INQUIRY</p>
            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Client Contact</label>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Natasha Romanov" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Obsidian Capital" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@obsidian.io" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Scope / Requirements</label>
              <input value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} placeholder="Fullstack WebGL telemetry interface" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Budget Display</label>
              <input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="$45,000" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Estimated Value ($)</label>
              <input type="number" value={form.expectedRevenue} onChange={(e) => setForm({ ...form, expectedRevenue: e.target.value })} placeholder="45000" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
          </div>
          <button onClick={createInquiry} className="w-full border border-red-500 bg-red-600 py-3 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-500 transition-colors hud-clip">
            DISPATCH INQUIRY TO PIPELINE
          </button>
        </div>
      )}

      {/* Kind Sub-Tabs: ALL / CALLS / INQUIRIES */}
      <div className="flex border-b border-white/10 gap-1">
        <button
          onClick={() => setKindFilter('ALL')}
          className={`px-4 py-2 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            kindFilter === 'ALL'
              ? 'border-red-500 text-white font-bold bg-white/[0.03]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ALL INTAKE ({inquiries.length})
        </button>
        <button
          onClick={() => setKindFilter('CALL_BOOKING')}
          className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            kindFilter === 'CALL_BOOKING'
              ? 'border-violet-500 text-violet-300 font-bold bg-violet-950/20'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>SCHEDULED CALLS ({inquiries.filter((i) => i.kind === 'CALL_BOOKING').length})</span>
        </button>
        <button
          onClick={() => setKindFilter('PROJECT_INQUIRY')}
          className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            kindFilter === 'PROJECT_INQUIRY'
              ? 'border-cyan-500 text-cyan-300 font-bold bg-cyan-950/20'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>PROJECT INQUIRIES ({inquiries.filter((i) => i.kind !== 'CALL_BOOKING').length})</span>
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'NEW_INQUIRY', 'CALL_SCHEDULED', 'PROPOSAL_SENT', 'LOCKED_DEAL', 'LOST'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 font-mono text-[9px] tracking-widest border transition-colors ${
              filterStatus === s ? 'border-red-500 bg-red-600/20 text-white' : 'border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Inquiry Cards */}
      <div className="space-y-3">
        {visibleInquiries.map((inq) => {
          const isExpanded = expandedId === inq.id;
          const meta = STATUS_META[inq.status];
          const isConverted = Boolean(inq.convertedToProjectId);
          const isCall = inq.kind === 'CALL_BOOKING';

          return (
            <div key={inq.id} className="border border-white/10 bg-[#060606] hud-clip overflow-hidden">
              {/* Header Bar */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : inq.id)}
              >
                {/* Kind Badge Icon */}
                <div
                  className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${
                    isCall
                      ? 'border-violet-500/50 bg-violet-950/30 text-violet-400'
                      : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400'
                  }`}
                >
                  {isCall ? <Calendar className="w-4 h-4" /> : <FileCode2 className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">
                      {inq.company} — {inq.clientName}
                    </span>
                    <span
                      className={`font-mono text-[8px] border px-1.5 py-0.5 ${
                        isCall ? 'border-violet-500/40 text-violet-300' : 'border-cyan-500/40 text-cyan-300'
                      }`}
                    >
                      {isCall ? 'SCHEDULED CALL' : 'PROJECT BRIEF'}
                    </span>
                    <span className={`font-mono text-[8px] border px-2 py-0.5 ${meta.color}`}>
                      {meta.label}
                    </span>
                    {isConverted && (
                      <span className="font-mono text-[8px] border border-emerald-500/50 bg-emerald-950/40 text-emerald-400 px-2 py-0.5">
                        CONVERTED &bull; {inq.convertedToProjectId}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-[10px] text-zinc-500">
                    <span className="truncate max-w-xs text-zinc-300">{inq.title || inq.scope}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400">{inq.budget}</span>
                    <span>&bull;</span>
                    <span>Target: {inq.preferredCallDate || 'Immediate'}</span>
                  </div>
                </div>

                {/* Primary Action: ACCEPT & CONVERT TO PROJECT */}
                {perms.canConvertInquiryToProject && !isConverted && inq.status !== 'LOST' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openConvertModal(inq);
                    }}
                    className="flex items-center space-x-1.5 font-mono text-[9px] border border-emerald-500 bg-emerald-950/30 px-3 py-1.5 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    title="Accept and convert to active project"
                  >
                    <Rocket className="w-3 h-3" />
                    <span>ACCEPT & CONVERT →</span>
                  </button>
                )}

                {/* Status advance button */}
                {perms.canUpdateInquiryStatus && meta.next && (
                  <button
                    onClick={(e) => { e.stopPropagation(); advanceStatus(inq.id); }}
                    className="font-mono text-[9px] border border-white/15 px-2.5 py-1.5 text-zinc-400 hover:border-red-500 hover:text-white transition-colors shrink-0"
                  >
                    NEXT STAGE →
                  </button>
                )}

                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
              </div>

              {/* Expanded Dossier */}
              {isExpanded && (
                <div className="border-t border-white/8 p-5 space-y-5 bg-[#040404]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1">CLIENT CONTACT</p>
                      <p className="font-mono text-xs text-white">{inq.clientName}</p>
                      <a href={`mailto:${inq.email}`} className="font-mono text-[10px] text-red-400 hover:underline block mt-0.5">
                        {inq.email}
                      </a>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1">CALL SLOT / TIMELINE</p>
                      <p className="font-mono text-xs text-white">{inq.callTimeSlot || inq.timeline || 'Immediate Intake'}</p>
                      <p className="font-mono text-[10px] text-zinc-400">{inq.preferredCallDate || inq.submittedAt?.split('T')[0]}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1">ESTIMATED REVENUE</p>
                      <p className="font-mono text-xs text-emerald-400 font-bold">${inq.expectedRevenue.toLocaleString()}</p>
                      <p className="font-mono text-[10px] text-zinc-400">Budget: {inq.budget}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1">PLATFORM / CHANNEL</p>
                      <p className="font-mono text-xs text-white">{inq.meetingPlatform || 'Website Terminal'}</p>
                      <p className="font-mono text-[10px] text-zinc-400">Source: {inq.leadSource}</p>
                    </div>
                  </div>

                  {/* Detailed Description / Requirements */}
                  <div>
                    <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1.5">
                      {isCall ? 'MEETING AGENDA & TOPIC' : 'SPECIFICATIONS & REQUIREMENTS'}
                    </p>
                    <p className="border border-white/8 bg-black/60 p-3 text-xs text-zinc-200 leading-relaxed font-mono">
                      {inq.description || inq.scope}
                    </p>
                  </div>

                  {/* Deal Notes */}
                  <div>
                    <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-1.5">INTERNAL DEAL TELEMETRY NOTES</p>
                    <p className="border border-white/8 bg-white/[0.02] p-3 font-mono text-[10px] text-zinc-300 whitespace-pre-wrap">
                      {inq.dealNotes || '— No notes recorded —'}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <input
                        value={noteInputs[inq.id] || ''}
                        onChange={(e) => setNoteInputs((p) => ({ ...p, [inq.id]: e.target.value }))}
                        placeholder="Add internal deal update or client feedback..."
                        className="flex-1 border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                      <button onClick={() => updateNotes(inq.id)} className="border border-white/15 px-4 font-mono text-xs text-white hover:border-red-500">
                        ADD NOTE
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/8">
                    <div className="flex items-center space-x-2">
                      {perms.canConvertInquiryToProject && !isConverted && inq.status !== 'LOST' && (
                        <button
                          onClick={() => openConvertModal(inq)}
                          className="flex items-center space-x-1.5 border border-emerald-500 bg-emerald-600/20 px-4 py-2 font-mono text-[10px] text-emerald-400 uppercase hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          <span>ACCEPT & INSTANTIATE PROJECT</span>
                        </button>
                      )}
                    </div>
                    {perms.canUpdateInquiryStatus && inq.status !== 'LOST' && !isConverted && (
                      <button
                        onClick={() => markLost(inq.id)}
                        className="font-mono text-[9px] text-zinc-600 hover:text-red-500 transition-colors uppercase"
                      >
                        MARK AS LOST
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleInquiries.length === 0 && (
          <div className="text-center py-16 border border-white/8 bg-[#060606]">
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">NO INQUIRIES FOUND</p>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CONVERT INQUIRY TO PROJECT MODAL */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {convertingInquiry && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-emerald-500/60 bg-[#070707] p-6 hud-clip space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                  ACCEPT INTAKE // CONVERT TO LIVE PROJECT
                </p>
                <h4 className="text-base font-bold text-white truncate max-w-sm">
                  {convertingInquiry.company}
                </h4>
              </div>
              <button
                onClick={() => setConvertingInquiry(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                PROJECT TITLE *
              </label>
              <input
                value={convertForm.title}
                onChange={(e) => setConvertForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  LEAD MANAGER / TECH LEAD
                </label>
                <select
                  value={convertForm.managerId}
                  onChange={(e) => setConvertForm((p) => ({ ...p, managerId: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  TARGET DUE DATE
                </label>
                <input
                  type="date"
                  value={convertForm.dueDate}
                  onChange={(e) => setConvertForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                ASSIGN INITIAL SPRINT MEMBERS
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-white/10 p-2 bg-black/40">
                {members.map((m) => {
                  const isSelected = convertForm.assignedMemberIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setConvertForm((prev) => ({
                          ...prev,
                          assignedMemberIds: isSelected
                            ? prev.assignedMemberIds.filter((id) => id !== m.id)
                            : [...prev.assignedMemberIds, m.id],
                        }))
                      }
                      className={`px-2.5 py-1 font-mono text-[9px] border transition-colors ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 text-white'
                          : 'border-white/10 text-zinc-500 hover:border-white/30'
                      }`}
                    >
                      {m.photoInitials} {m.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setConvertingInquiry(null)}
                className="flex-1 border border-white/20 py-2.5 font-mono text-xs text-zinc-400 uppercase hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={confirmConversion}
                className="flex-1 border border-emerald-500 bg-emerald-600/30 py-2.5 font-mono text-xs text-white uppercase hover:bg-emerald-600 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                DEPLOY TO PROJECTS MATRIX &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
