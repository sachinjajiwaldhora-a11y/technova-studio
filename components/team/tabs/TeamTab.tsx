// FILE PATH: components/team/tabs/TeamTab.tsx
'use client';

import React, { useState } from 'react';
import {
  StudioMember, UserRole, Department, RBACPermissions, JoinRequest,
  STORAGE_KEYS, getStore, setStore, SEED_JOIN_REQUESTS,
} from '@/lib/store';
import {
  Plus, X, ChevronDown, ChevronUp, Shield, Edit3,
  Clock, CheckCircle2, AlertTriangle, Zap, Lock, Users,
  ExternalLink, UserCheck, UserX, Sparkles, KeyRound,
} from 'lucide-react';

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'text-red-400 border-red-500/50 bg-red-950/30',
  manager: 'text-violet-400 border-violet-500/50 bg-violet-950/30',
  working_member: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
  member: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'ADMIN',
  manager: 'MANAGER',
  working_member: 'WORKING MEMBER',
  member: 'MEMBER',
};

const CLEARANCE: Record<UserRole, string> = {
  admin: 'LVL-09-OMEGA',
  manager: 'LVL-07-SIGMA',
  working_member: 'LVL-05-ALPHA',
  member: 'LVL-01-RESTRICTED',
};

const DEPARTMENTS: Department[] = [
  'WebGL & Graphics',
  'Fullstack Engineering',
  'AI & Systems',
  'Growth & Sales',
  'UI/UX Design',
  'Management',
];

interface TeamTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  members: StudioMember[];
  onMembersChange: (members: StudioMember[]) => void;
}

export default function TeamTab({ currentUser, perms, members, onMembersChange }: TeamTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showOnboard, setShowOnboard] = useState(false);
  const [privateNoteEdit, setPrivateNoteEdit] = useState<string | null>(null);
  const [privateNoteInputs, setPrivateNoteInputs] = useState<Record<string, string>>({});
  const [managerNoteEdit, setManagerNoteEdit] = useState<string | null>(null);
  const [managerNoteInputs, setManagerNoteInputs] = useState<Record<string, string>>({});

  // Edit existing member profile state
  const [editingMember, setEditingMember] = useState<StudioMember | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: UserRole;
    department: Department;
    skills: string;
    accentColor: string;
    clearanceCode: string;
  }>({
    name: '',
    email: '',
    role: 'member',
    department: 'Fullstack Engineering',
    skills: '',
    accentColor: '#dc2626',
    clearanceCode: 'LVL-01-RESTRICTED',
  });

  // Join Requests state (applied from website Join Us modal)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() =>
    getStore<JoinRequest[]>(STORAGE_KEYS.JOIN_REQUESTS, SEED_JOIN_REQUESTS)
  );
  const [applicantRoles, setApplicantRoles] = useState<Record<string, UserRole>>({});

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'member' as UserRole,
    department: 'Fullstack Engineering' as Department,
    skills: '',
  });

  function saveMembers(updated: StudioMember[]) {
    setStore(STORAGE_KEYS.MEMBERS, updated);
    onMembersChange(updated);
  }

  function saveJoinRequests(updated: JoinRequest[]) {
    setStore(STORAGE_KEYS.JOIN_REQUESTS, updated);
    setJoinRequests(updated);
  }

  function onboardMember() {
    if (!form.name || !form.email || !form.password) return;
    const newMember: StudioMember = {
      id: `usr-${Date.now()}`,
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      clearanceCode: CLEARANCE[form.role],
      photoInitials: form.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      accentColor: ['#dc2626', '#7c3aed', '#0891b2', '#059669', '#d97706'][Math.floor(Math.random() * 5)],
      privateNotes: '',
      managerNotes: '',
      activeProjectIds: [],
      metrics: { tasksCompleted: 0, tasksOverdue: 0, avgCompletionDays: 0, hoursLoggedTotal: 0, deliveryRatePct: 100 },
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
    };
    saveMembers([...members, newMember]);
    setShowOnboard(false);
    setForm({ name: '', email: '', password: '', role: 'member', department: 'Fullstack Engineering', skills: '' });
  }

  // Edit Member Profile Handler
  function openEditModal(member: StudioMember) {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      skills: member.skills.join(', '),
      accentColor: member.accentColor,
      clearanceCode: member.clearanceCode,
    });
  }

  function saveMemberEdit() {
    if (!editingMember) return;
    const updated = members.map((m) => {
      if (m.id !== editingMember.id) return m;
      return {
        ...m,
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        department: editForm.department,
        skills: editForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        accentColor: editForm.accentColor,
        clearanceCode: editForm.clearanceCode || CLEARANCE[editForm.role],
        photoInitials: editForm.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      };
    });
    saveMembers(updated);
    setEditingMember(null);
  }

  // Accept and onboard applicant from Join Us form
  function approveApplicant(req: JoinRequest) {
    const assignedRole = applicantRoles[req.id] || 'working_member';
    const newMember: StudioMember = {
      id: `usr-${Date.now()}`,
      name: req.fullName,
      email: req.email,
      password: `NOVA-JOIN-${Math.floor(1000 + Math.random() * 9000)}`,
      role: assignedRole,
      department: req.department,
      skills: req.skills,
      clearanceCode: CLEARANCE[assignedRole],
      photoInitials: req.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      accentColor: ['#dc2626', '#7c3aed', '#0891b2', '#059669', '#d97706'][Math.floor(Math.random() * 5)],
      privateNotes: `Applicant Statement: "${req.statement}". Portfolio: ${req.portfolioUrl}`,
      managerNotes: `Onboarded from website candidacy application on ${new Date().toISOString().split('T')[0]}.`,
      activeProjectIds: [],
      metrics: { tasksCompleted: 0, tasksOverdue: 0, avgCompletionDays: 0, hoursLoggedTotal: 0, deliveryRatePct: 100 },
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
    };

    saveMembers([...members, newMember]);
    const updatedReqs = joinRequests.map((r) =>
      r.id === req.id ? { ...r, status: 'APPROVED' as const } : r
    );
    saveJoinRequests(updatedReqs);
  }

  function rejectApplicant(reqId: string) {
    const updated = joinRequests.map((r) =>
      r.id === reqId ? { ...r, status: 'REJECTED' as const } : r
    );
    saveJoinRequests(updated);
  }

  function cycleRole(memberId: string) {
    if (!perms.canEditMemberRoles) return;
    const order: UserRole[] = ['member', 'working_member', 'manager'];
    const updated = members.map((m) => {
      if (m.id !== memberId || m.role === 'admin') return m;
      const next = order[(order.indexOf(m.role as UserRole) + 1) % order.length];
      return { ...m, role: next, clearanceCode: CLEARANCE[next] };
    });
    saveMembers(updated);
  }

  function savePrivateNote(memberId: string) {
    if (memberId !== currentUser.id) return;
    const note = privateNoteInputs[memberId] ?? '';
    const updated = members.map((m) => m.id === memberId ? { ...m, privateNotes: note } : m);
    saveMembers(updated);
    setPrivateNoteEdit(null);
    const active = updated.find((m) => m.id === currentUser.id);
    if (active) setStore(STORAGE_KEYS.ACTIVE_USER, active);
  }

  function saveManagerNote(memberId: string) {
    if (!perms.canWriteManagerNotes) return;
    const note = managerNoteInputs[memberId] ?? '';
    const updated = members.map((m) => m.id === memberId ? { ...m, managerNotes: note } : m);
    saveMembers(updated);
    setManagerNoteEdit(null);
  }

  function removeMember(memberId: string) {
    if (!perms.canOnboardMembers) return;
    if (!confirm('Remove this member from the studio roster?')) return;
    saveMembers(members.filter((m) => m.id !== memberId));
    if (expandedId === memberId) setExpandedId(null);
  }

  function resetPassword(memberId: string, newPwd: string) {
    if (!perms.canChangePasswords || !newPwd.trim()) return;
    const updated = members.map((m) => m.id === memberId ? { ...m, password: newPwd } : m);
    saveMembers(updated);
  }

  const [pwdInputs, setPwdInputs] = useState<Record<string, string>>({});

  const visibleMembers = perms.canViewAllMembers
    ? members
    : members.filter((m) => m.id === currentUser.id);

  const pendingApplicants = joinRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">STUDIO ROSTER & TALENT PIPELINE</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">TEAM COMMAND</h2>
        </div>
        {perms.canOnboardMembers && (
          <button
            onClick={() => setShowOnboard(!showOnboard)}
            className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-all hud-clip"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>MANUAL ONBOARD MEMBER</span>
          </button>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* PENDING TALENT CANDIDACY / JOIN APPLICATIONS FROM WEBSITE HUD */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {pendingApplicants.length > 0 && perms.canOnboardMembers && (
        <div className="border border-red-500/50 bg-[#090404] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
                PENDING TALENT ONBOARDING APPLICATIONS ({pendingApplicants.length})
              </span>
            </div>
            <span className="font-mono text-[9px] text-zinc-400">
              Submitted via Website Join Collective Terminal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplicants.map((req) => {
              const selectedRole = applicantRoles[req.id] || 'working_member';
              return (
                <div
                  key={req.id}
                  className="border border-white/10 bg-black/70 p-4 hud-clip space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{req.fullName}</h4>
                        <p className="font-mono text-[10px] text-zinc-400">{req.email}</p>
                      </div>
                      <span className="font-mono text-[9px] border border-red-500/40 bg-red-950/30 px-2 py-0.5 text-red-300">
                        {req.department}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[8px] border border-white/10 bg-white/[0.03] px-2 py-0.5 text-zinc-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 italic border-l-2 border-red-500/40 pl-3 py-1">
                      &ldquo;{req.statement}&rdquo;
                    </p>

                    <div className="flex items-center space-x-3 font-mono text-[10px] pt-1">
                      {req.portfolioUrl && (
                        <a
                          href={req.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-cyan-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>PORTFOLIO</span>
                        </a>
                      )}
                      {req.githubUrl && (
                        <a
                          href={req.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-zinc-400 hover:text-white hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>GITHUB</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions & Role Selection */}
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] text-zinc-400 uppercase">ASSIGN ROLE:</span>
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          setApplicantRoles((prev) => ({
                            ...prev,
                            [req.id]: e.target.value as UserRole,
                          }))
                        }
                        className="flex-1 border border-white/15 bg-black px-2 py-1 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="working_member">WORKING MEMBER (Active Sprints)</option>
                        <option value="member">MEMBER (Standard)</option>
                        <option value="manager">MANAGER (Tech Lead)</option>
                      </select>
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => approveApplicant(req)}
                        className="flex-1 flex items-center justify-center space-x-1 border border-emerald-500 bg-emerald-950/30 py-2 font-mono text-[10px] text-emerald-400 uppercase hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>APPROVE & ONBOARD TO ROSTER</span>
                      </button>
                      <button
                        onClick={() => rejectApplicant(req.id)}
                        className="border border-white/15 px-3 py-2 font-mono text-[10px] text-zinc-400 hover:text-red-400 hover:border-red-500 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Onboard Form */}
      {showOnboard && (
        <div className="border border-red-500/40 bg-[#080808] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">AUTHORIZE NEW STUDIO MEMBER</p>
            <button onClick={() => setShowOnboard(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dev Malhotra" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="dev@technovastudio.dev" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Initial Passkey</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:outline-none">
                <option value="member">MEMBER</option>
                <option value="working_member">WORKING MEMBER</option>
                <option value="manager">MANAGER</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as Department })} className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:outline-none">
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Skills (comma-separated)</label>
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="WebGL, GLSL, Rust" className="w-full border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
          </div>
          <button onClick={onboardMember} className="w-full border border-red-500 bg-red-600 py-3 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-500 transition-colors hud-clip">
            CONFIRM ONBOARDING & ISSUE PASSKEY
          </button>
        </div>
      )}

      {/* Roster Cards */}
      <div className="space-y-4">
        {visibleMembers.map((member) => {
          const isExpanded = expandedId === member.id;
          const isMe = member.id === currentUser.id;
          const canSeePrivate = isMe;
          const canSeeManagerNotes = perms.canReadManagerNotes;
          const canEditThisMember = perms.canEditMemberRoles || isMe;

          return (
            <div key={member.id} className="border border-white/10 bg-[#060606] hud-clip overflow-hidden">
              {/* Member Card Bar */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white border border-white/20 shrink-0"
                  style={{ background: member.accentColor }}
                >
                  {member.photoInitials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base truncate">{member.name}</span>
                    {isMe && (
                      <span className="font-mono text-[9px] bg-red-600/30 border border-red-500/50 text-red-300 px-1.5 py-0.5">YOU</span>
                    )}
                    <span className={`font-mono text-[9px] border px-2 py-0.5 ${ROLE_COLORS[member.role]}`}>
                      {ROLE_LABELS[member.role]}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500 border border-white/8 px-2 py-0.5">
                      {member.clearanceCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-[10px] text-zinc-500">
                    <span>{member.email}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400">{member.department}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400">{member.metrics.deliveryRatePct}% Delivery</span>
                  </div>
                </div>

                {/* Edit Member Details Button */}
                {canEditThisMember && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(member);
                    }}
                    className="font-mono text-[9px] border border-white/20 bg-white/[0.04] px-3 py-1.5 text-zinc-300 hover:border-red-500 hover:text-white transition-colors shrink-0"
                    title="Edit profile, role, department or skills"
                  >
                    EDIT DETAILS ✎
                  </button>
                )}

                {/* Quick Role Cycle (Manager/Admin Only) */}
                {perms.canEditMemberRoles && member.role !== 'admin' && !isMe && (
                  <button
                    onClick={(e) => { e.stopPropagation(); cycleRole(member.id); }}
                    className="font-mono text-[9px] border border-white/15 px-3 py-1.5 text-zinc-400 hover:border-violet-500 hover:text-violet-300 transition-colors shrink-0"
                    title="Click to cycle role"
                  >
                    CYCLE ROLE ↺
                  </button>
                )}

                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
              </div>

              {/* Expanded Dossier */}
              {isExpanded && (
                <div className="border-t border-white/8 p-5 space-y-6 bg-[#040404]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Skills */}
                    <div>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">VERIFIED SKILLS</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map((s) => (
                          <span key={s} className="font-mono text-[9px] border border-white/10 bg-white/[0.02] px-2 py-0.5 text-zinc-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Department & Clearance */}
                    <div>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">OPERATIONAL CLEARANCE</p>
                      <div className="space-y-1 font-mono text-xs">
                        <p className="text-zinc-400">DEPT: <span className="text-white">{member.department}</span></p>
                        <p className="text-zinc-400">CLEARANCE: <span className="text-red-400">{member.clearanceCode}</span></p>
                        <p className="text-zinc-400">MEMBER SINCE: <span className="text-white">{member.createdAt}</span></p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">PERFORMANCE</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-[9px]">
                          <span className="text-zinc-500">Delivery Rate</span>
                          <span className="text-emerald-400">{member.metrics.deliveryRatePct}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${member.metrics.deliveryRatePct}%` }} />
                        </div>
                        <div className="flex justify-between font-mono text-[9px]">
                          <span className="text-zinc-500">Tasks Completed</span>
                          <span className="text-cyan-400">{member.metrics.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between font-mono text-[9px]">
                          <span className="text-zinc-500">Hours Logged</span>
                          <span className="text-violet-400">{member.metrics.hoursLoggedTotal}h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Private Notes (only self) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">PRIVATE NOTES (ONLY YOU)</p>
                      {canSeePrivate && (
                        <button
                          onClick={() => {
                            setPrivateNoteEdit(isMe ? member.id : null);
                            setPrivateNoteInputs((p) => ({ ...p, [member.id]: member.privateNotes }));
                          }}
                          className="font-mono text-[9px] text-zinc-500 hover:text-white flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>EDIT</span>
                        </button>
                      )}
                    </div>
                    {canSeePrivate ? (
                      privateNoteEdit === member.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={privateNoteInputs[member.id] || ''}
                            onChange={(e) => setPrivateNoteInputs((p) => ({ ...p, [member.id]: e.target.value }))}
                            rows={3}
                            placeholder="Your private notes, tasks, reminders..."
                            className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                          />
                          <div className="flex space-x-2">
                            <button onClick={() => savePrivateNote(member.id)} className="border border-emerald-500/50 bg-emerald-950/20 px-4 py-1.5 font-mono text-[9px] text-emerald-400 hover:bg-emerald-600/20">SAVE</button>
                            <button onClick={() => setPrivateNoteEdit(null)} className="border border-white/15 px-4 py-1.5 font-mono text-[9px] text-zinc-400 hover:text-white">CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <p className="border border-white/8 bg-white/[0.02] p-3 font-mono text-[10px] text-zinc-300 whitespace-pre-wrap min-h-[40px]">
                          {member.privateNotes || '— No private notes —'}
                        </p>
                      )
                    ) : (
                      <div className="border border-white/8 bg-white/[0.02] p-3 flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        <p className="font-mono text-[9px] text-zinc-600">PRIVATE — MEMBER ACCESS ONLY</p>
                      </div>
                    )}
                  </div>

                  {/* Manager Notes (manager/admin only) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">MANAGER NOTES (CONFIDENTIAL)</p>
                      {canSeeManagerNotes && perms.canWriteManagerNotes && (
                        <button
                          onClick={() => {
                            setManagerNoteEdit(member.id);
                            setManagerNoteInputs((p) => ({ ...p, [member.id]: member.managerNotes }));
                          }}
                          className="font-mono text-[9px] text-zinc-500 hover:text-white flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>EDIT</span>
                        </button>
                      )}
                    </div>
                    {canSeeManagerNotes ? (
                      managerNoteEdit === member.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={managerNoteInputs[member.id] || ''}
                            onChange={(e) => setManagerNoteInputs((p) => ({ ...p, [member.id]: e.target.value }))}
                            rows={3}
                            placeholder="Confidential: performance review, salary notes, promotion flags..."
                            className="w-full border border-violet-500/40 bg-violet-950/10 px-3 py-2 font-mono text-xs text-white focus:border-violet-500 focus:outline-none resize-none"
                          />
                          <div className="flex space-x-2">
                            <button onClick={() => saveManagerNote(member.id)} className="border border-violet-500/50 bg-violet-950/20 px-4 py-1.5 font-mono text-[9px] text-violet-400 hover:bg-violet-600/20">SAVE</button>
                            <button onClick={() => setManagerNoteEdit(null)} className="border border-white/15 px-4 py-1.5 font-mono text-[9px] text-zinc-400 hover:text-white">CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <p className="border border-violet-500/20 bg-violet-950/10 p-3 font-mono text-[10px] text-zinc-300 whitespace-pre-wrap min-h-[40px]">
                          {member.managerNotes || '— No manager notes —'}
                        </p>
                      )
                    ) : (
                      <div className="border border-white/8 bg-white/[0.02] p-3 flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        <p className="font-mono text-[9px] text-zinc-600">CONFIDENTIAL — MANAGER & ADMIN ONLY</p>
                      </div>
                    )}
                  </div>

                  {/* Admin Controls: Password Reset + Remove */}
                  {perms.canChangePasswords && !isMe && member.role !== 'admin' && (
                    <div className="border border-white/8 bg-[#030303] p-4 space-y-3">
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">ADMIN CONTROLS</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={pwdInputs[member.id] || ''}
                            onChange={(e) => setPwdInputs((p) => ({ ...p, [member.id]: e.target.value }))}
                            placeholder="New passkey..."
                            className="flex-1 border border-white/10 bg-black px-2.5 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                          />
                          <button
                            onClick={() => { resetPassword(member.id, pwdInputs[member.id] || ''); setPwdInputs((p) => ({ ...p, [member.id]: '' })); }}
                            className="border border-amber-500/50 bg-amber-950/20 px-3 font-mono text-[9px] text-amber-400 hover:bg-amber-600/20 transition-colors"
                          >
                            RESET
                          </button>
                        </div>
                        {perms.canOnboardMembers && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="border border-red-500/40 bg-red-950/20 px-3 py-2 font-mono text-[9px] text-red-400 hover:bg-red-600/20 transition-colors"
                          >
                            REMOVE FROM ROSTER
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* EDIT MEMBER PROFILE MODAL (Available after onboarding) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {editingMember && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-red-500/50 bg-[#070707] p-6 hud-clip space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest">
                  EDIT MEMBER DOSSIER // {editingMember.id}
                </p>
                <h4 className="text-base font-bold text-white">
                  {editingMember.name}
                </h4>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  FULL NAME
                </label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  WORK EMAIL
                </label>
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {perms.canEditMemberRoles && editingMember.role !== 'admin' && (
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                    ROLE LEVEL
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        role: e.target.value as UserRole,
                        clearanceCode: CLEARANCE[e.target.value as UserRole],
                      }))
                    }
                    className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="member">MEMBER</option>
                    <option value="working_member">WORKING MEMBER</option>
                    <option value="manager">MANAGER</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  DEPARTMENT
                </label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value as Department }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  SKILLS (COMMA-SEPARATED)
                </label>
                <input
                  value={editForm.skills}
                  onChange={(e) => setEditForm((p) => ({ ...p, skills: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  AVATAR ACCENT COLOR
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={editForm.accentColor}
                    onChange={(e) => setEditForm((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-10 h-9 bg-black border border-white/15 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-xs text-zinc-400">{editForm.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  CLEARANCE CODE
                </label>
                <input
                  value={editForm.clearanceCode}
                  onChange={(e) => setEditForm((p) => ({ ...p, clearanceCode: e.target.value }))}
                  className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setEditingMember(null)}
                className="flex-1 border border-white/20 py-2.5 font-mono text-xs text-zinc-400 uppercase hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={saveMemberEdit}
                className="flex-1 border border-red-500 bg-red-600/30 py-2.5 font-mono text-xs text-white uppercase hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                SAVE MEMBER DETAILS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
