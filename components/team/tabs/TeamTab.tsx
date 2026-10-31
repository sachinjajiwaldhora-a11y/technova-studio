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
  Eye, EyeOff, RotateCw, Copy, Check,
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
  joinRequests?: JoinRequest[];
  onMembersChange: (members: StudioMember[]) => void;
  onJoinRequestsChange?: (reqs: JoinRequest[]) => void;
}

export default function TeamTab({
  currentUser,
  perms,
  members,
  joinRequests: externalJoinRequests,
  onMembersChange,
  onJoinRequestsChange,
}: TeamTabProps) {
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

  // Join Requests state (applied from website Join Us modal and MongoDB)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() => {
    const raw = Array.isArray(externalJoinRequests) && externalJoinRequests.length > 0
      ? externalJoinRequests
      : getStore<JoinRequest[]>(STORAGE_KEYS.JOIN_REQUESTS, []);
    return Array.from(new Map(raw.map((r) => [r.email?.toLowerCase().trim() || r.id, r])).values());
  });

  React.useEffect(() => {
    if (Array.isArray(externalJoinRequests)) {
      const deduped = Array.from(
        new Map(externalJoinRequests.map((r) => [r.email?.toLowerCase().trim() || r.id, r])).values()
      );
      setJoinRequests(deduped);
    }
  }, [externalJoinRequests]);

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
    if (onJoinRequestsChange) {
      onJoinRequestsChange(updated);
    }
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

  // Helper to generate strong readable default passkeys
  function generateSecurePasskey(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `Nova@${num}!`;
  }

  // Onboard Applicant with explicit Password Assignment
  const [applicantToOnboard, setApplicantToOnboard] = useState<JoinRequest | null>(null);
  const [onboardRole, setOnboardRole] = useState<UserRole>('working_member');
  const [onboardPasskey, setOnboardPasskey] = useState<string>('');
  const [showOnboardPasskey, setShowOnboardPasskey] = useState<boolean>(true);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [onboardSuccess, setOnboardSuccess] = useState<{
    name: string;
    email: string;
    passkey: string;
    role: string;
  } | null>(null);
  const [hasCopiedCredentials, setHasCopiedCredentials] = useState<boolean>(false);

  function openOnboardModal(req: JoinRequest) {
    setApplicantToOnboard(req);
    setOnboardRole(applicantRoles[req.id] || 'working_member');
    setOnboardPasskey(generateSecurePasskey());
    setShowOnboardPasskey(true);
    setHasCopiedCredentials(false);
  }

  async function confirmOnboardApplicant() {
    if (!applicantToOnboard) return;
    const passkey = onboardPasskey.trim();
    if (passkey.length < 4) {
      alert('Please enter a passkey of at least 4 characters.');
      return;
    }

    setIsOnboarding(true);
    try {
      const newMemberId = `usr-${Date.now()}`;
      const newMember: StudioMember = {
        id: newMemberId,
        name: applicantToOnboard.fullName,
        email: applicantToOnboard.email,
        password: passkey,
        role: onboardRole,
        department: applicantToOnboard.department,
        skills: applicantToOnboard.skills,
        clearanceCode: CLEARANCE[onboardRole],
        photoInitials: applicantToOnboard.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        accentColor: ['#dc2626', '#7c3aed', '#0891b2', '#059669', '#d97706'][Math.floor(Math.random() * 5)],
        privateNotes: `Applicant Statement: "${applicantToOnboard.statement}". Portfolio: ${applicantToOnboard.portfolioUrl}`,
        managerNotes: `Onboarded from website candidacy application on ${new Date().toISOString().split('T')[0]}. Passkey assigned at onboarding.`,
        activeProjectIds: [],
        metrics: { tasksCompleted: 0, tasksOverdue: 0, avgCompletionDays: 0, hoursLoggedTotal: 0, deliveryRatePct: 100 },
        createdAt: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
      };

      // 1. Direct save to remote MongoDB
      const saveRes = await fetch('/api/data/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${saveRes.status}`);
      }

      // 2. Mark join request as APPROVED in remote MongoDB
      const updatedReq = { ...applicantToOnboard, status: 'APPROVED' as const };
      await fetch('/api/data/join_requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReq),
      });

      // 3. Update local state & store
      saveMembers([...members, newMember]);
      const updatedReqs = joinRequests.map((r) =>
        r.id === applicantToOnboard.id ? { ...r, status: 'APPROVED' as const } : r
      );
      saveJoinRequests(updatedReqs);

      // 4. Show success credentials modal
      setOnboardSuccess({
        name: applicantToOnboard.fullName,
        email: applicantToOnboard.email,
        passkey,
        role: ROLE_LABELS[onboardRole],
      });
      setApplicantToOnboard(null);
    } catch (err: any) {
      alert(`Failed to complete onboarding: ${err?.message || 'Server error'}`);
    } finally {
      setIsOnboarding(false);
    }
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
    if (!perms.canOnboardMembers && currentUser.role !== 'admin') {
      alert('You do not have permissions to remove team members.');
      return;
    }
    const target = members.find((m) => m.id === memberId);
    if (!target) return;
    if (target.id === currentUser.id || target.email === currentUser.email) {
      alert('You cannot delete your own logged-in administrator account.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently remove "${target.name}" (${target.role.toUpperCase()}) from the studio roster and delete their MongoDB record? This action cannot be undone.`)) {
      return;
    }
    saveMembers(members.filter((m) => m.id !== memberId));
    if (expandedId === memberId) setExpandedId(null);
    if (editingMember?.id === memberId) setEditingMember(null);
  }

  // Robust Member Passkey Reset with direct API persistence and instant feedback
  const [updatingPwdMemberId, setUpdatingPwdMemberId] = useState<string | null>(null);
  const [passkeyNotice, setPasskeyNotice] = useState<{
    memberId: string;
    name: string;
    key: string;
    isError?: boolean;
    message: string;
  } | null>(null);

  async function handleResetMemberPasskey(member: StudioMember, newPwd: string) {
    if (!perms.canChangePasswords) {
      alert('Access Denied: You do not have permissions to reset passkeys.');
      return;
    }
    const trimmed = newPwd.trim();
    if (trimmed.length < 4) {
      setPasskeyNotice({
        memberId: member.id,
        name: member.name,
        key: '',
        isError: true,
        message: 'Passkey must contain at least 4 characters.',
      });
      return;
    }

    setUpdatingPwdMemberId(member.id);
    setPasskeyNotice(null);

    try {
      const res = await fetch('/api/data/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: member.id,
          password: trimmed,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      // Success: update local state & clear input
      const updated = members.map((m) => (m.id === member.id ? { ...m, password: trimmed } : m));
      saveMembers(updated);
      setPwdInputs((prev) => ({ ...prev, [member.id]: '' }));

      setPasskeyNotice({
        memberId: member.id,
        name: member.name,
        key: trimmed,
        isError: false,
        message: `PASSKEY UPDATED FOR ${member.name.toUpperCase()}!`,
      });
    } catch (err: any) {
      setPasskeyNotice({
        memberId: member.id,
        name: member.name,
        key: '',
        isError: true,
        message: `FAILED TO UPDATE PASSKEY: ${err?.message || 'Server error'}`,
      });
    } finally {
      setUpdatingPwdMemberId(null);
    }
  }

  const [pwdInputs, setPwdInputs] = useState<Record<string, string>>({});

  const rawFiltered = perms.canViewAllMembers
    ? members
    : members.filter((m) => m.id === currentUser.id);

  // Guarantee strictly unique keys by deduplicating member IDs
  const visibleMembers = Array.from(
    new Map(rawFiltered.map((m) => [m.id, m])).values()
  );

  const pendingApplicants = Array.from(
    new Map(
      joinRequests
        .filter((r) => r.status === 'PENDING')
        .map((r) => [r.email?.toLowerCase().trim() || r.id, r])
    ).values()
  );

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-red-500 uppercase">STUDIO ROSTER & TALENT PIPELINE</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase text-white">TEAM COMMAND</h2>
        </div>
        {perms.canOnboardMembers && (
          <button
            onClick={() => setShowOnboard(!showOnboard)}
            className="flex items-center space-x-2 border border-red-500 bg-red-600/30 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase hover:bg-red-600 transition-all rounded shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>MANUAL ONBOARD MEMBER</span>
          </button>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* PENDING TALENT CANDIDACY / JOIN APPLICATIONS FROM WEBSITE HUD */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {perms.canOnboardMembers && (
        pendingApplicants.length > 0 ? (
        <div className="border border-red-500/50 bg-[#090404] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-bold text-red-400 tracking-wider uppercase">
                PENDING TALENT ONBOARDING APPLICATIONS ({pendingApplicants.length})
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              Submitted via Website Join Collective Terminal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplicants.map((req) => {
              const selectedRole = applicantRoles[req.id] || 'working_member';
              return (
                <div
                  key={req.id}
                  className="border border-white/15 bg-black/80 p-5 hud-clip space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white">{req.fullName}</h4>
                        <p className="text-xs font-semibold text-zinc-300">{req.email}</p>
                      </div>
                      <span className="text-xs font-bold border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-red-300 rounded">
                        {req.department}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold border border-white/20 bg-white/[0.06] px-2.5 py-1 text-zinc-200 rounded"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 italic border-l-2 border-red-500/50 pl-3 py-1 leading-relaxed">
                      &ldquo;{req.statement}&rdquo;
                    </p>

                    <div className="flex items-center space-x-4 text-xs font-bold pt-1">
                      {req.portfolioUrl && (
                        <a
                          href={req.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-cyan-400 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>PORTFOLIO</span>
                        </a>
                      )}
                      {req.githubUrl && (
                        <a
                          href={req.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-zinc-300 hover:text-white hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>GITHUB</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions & Role Selection */}
                  <div className="border-t border-white/10 pt-3 space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">ASSIGN ROLE:</span>
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          setApplicantRoles((prev) => ({
                            ...prev,
                            [req.id]: e.target.value as UserRole,
                          }))
                        }
                        className="flex-1 border border-white/20 bg-black px-2.5 py-1.5 text-xs font-semibold text-white focus:border-red-500 focus:outline-none rounded"
                      >
                        <option value="working_member">WORKING MEMBER (Active Sprints)</option>
                        <option value="member">MEMBER (Standard)</option>
                        <option value="manager">MANAGER (Tech Lead)</option>
                      </select>
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => openOnboardModal(req)}
                        className="flex-1 flex items-center justify-center space-x-1.5 border border-emerald-500 bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-300 uppercase hover:bg-emerald-600 hover:text-black transition-all rounded shadow-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>ACCEPT & ASSIGN PASSKEY</span>
                      </button>
                      <button
                        onClick={() => rejectApplicant(req.id)}
                        className="border border-white/20 px-3.5 py-2.5 text-xs font-bold text-zinc-400 hover:text-red-400 hover:border-red-500 transition-colors rounded"
                        title="Reject application"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : (
          <div className="border border-white/10 bg-white/[0.02] px-5 py-3.5 rounded flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                TALENT PIPELINE ACTIVE // 0 PENDING CANDIDACY APPLICATIONS
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Awaiting new dossiers from Website Direct Intake HUD
            </span>
          </div>
        )
      )}

      {/* Manual Onboard Form */}
      {showOnboard && (
        <div className="border border-red-500/50 bg-[#080808] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <p className="text-sm font-bold tracking-wider text-red-400 uppercase">AUTHORIZE NEW STUDIO MEMBER</p>
            <button onClick={() => setShowOnboard(false)} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dev Malhotra" className="w-full border border-white/20 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="dev@technovastudio.dev" className="w-full border border-white/20 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Initial Passkey</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full border border-white/20 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-semibold text-white focus:outline-none rounded">
                <option value="member">MEMBER</option>
                <option value="working_member">WORKING MEMBER</option>
                <option value="manager">MANAGER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as Department })} className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-semibold text-white focus:outline-none rounded">
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">Skills (comma-separated)</label>
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="WebGL, GLSL, Rust" className="w-full border border-white/20 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none rounded" />
            </div>
          </div>
          <button onClick={onboardMember} className="w-full border border-red-500 bg-red-600 py-3 text-xs font-bold tracking-widest text-white uppercase hover:bg-red-500 transition-colors rounded shadow-sm">
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
          const canDeleteThisMember = (perms.canOnboardMembers || currentUser.role === 'admin') && !isMe;

          return (
            <div key={member.id} className="border border-white/15 bg-[#060606] hud-clip overflow-hidden shadow-sm">
              {/* Member Card Bar */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-white border border-white/25 shrink-0 shadow-sm"
                  style={{ background: member.accentColor }}
                >
                  {member.photoInitials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-white text-base truncate">{member.name}</span>
                    {isMe && (
                      <span className="text-xs font-bold bg-red-600/30 border border-red-500/60 text-red-200 px-2 py-0.5 rounded">YOU</span>
                    )}
                    <span className={`text-xs font-bold border px-2.5 py-0.5 rounded ${ROLE_COLORS[member.role]}`}>
                      {ROLE_LABELS[member.role]}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded">
                      {member.clearanceCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-zinc-300">
                    <span className="font-semibold text-white">{member.email}</span>
                    <span className="text-zinc-500">&bull;</span>
                    <span className="text-zinc-300">{member.department}</span>
                    <span className="text-zinc-500">&bull;</span>
                    <span className="text-emerald-400 font-bold">{member.metrics.deliveryRatePct}% Delivery</span>
                  </div>
                </div>

                {/* Edit Member Details Button */}
                {canEditThisMember && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(member);
                    }}
                    className="text-xs font-bold border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-zinc-200 hover:border-red-500 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0 rounded"
                    title="Edit profile, role, department or skills"
                  >
                    EDIT DETAILS ✎
                  </button>
                )}

                {/* Delete Member Button */}
                {canDeleteThisMember && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(member.id);
                    }}
                    className="text-xs font-bold border border-red-500/50 bg-red-950/30 px-3 py-1.5 text-red-400 hover:bg-red-600 hover:text-white transition-colors shrink-0 flex items-center gap-1 rounded"
                    title="Delete member from studio and MongoDB"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>DELETE</span>
                  </button>
                )}

                {/* Quick Role Cycle (Manager/Admin Only) */}
                {perms.canEditMemberRoles && member.role !== 'admin' && !isMe && (
                  <button
                    onClick={(e) => { e.stopPropagation(); cycleRole(member.id); }}
                    className="text-xs font-bold border border-white/20 px-3 py-1.5 text-zinc-300 hover:border-violet-500 hover:text-violet-300 transition-colors shrink-0 rounded"
                    title="Click to cycle role"
                  >
                    CYCLE ROLE ↺
                  </button>
                )}

                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
              </div>

              {/* Expanded Dossier */}
              {isExpanded && (
                <div className="border-t border-white/10 p-5 space-y-6 bg-[#040404]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Skills */}
                    <div>
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">VERIFIED SKILLS</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map((s) => (
                          <span key={s} className="text-xs font-semibold border border-white/20 bg-white/[0.05] px-2.5 py-1 text-zinc-200 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Department & Clearance */}
                    <div>
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">OPERATIONAL CLEARANCE</p>
                      <div className="space-y-1.5 text-xs font-medium">
                        <p className="text-zinc-400">DEPT: <strong className="text-white">{member.department}</strong></p>
                        <p className="text-zinc-400">CLEARANCE: <strong className="text-red-400">{member.clearanceCode}</strong></p>
                        <p className="text-zinc-400">MEMBER SINCE: <strong className="text-white">{member.createdAt}</strong></p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">PERFORMANCE</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">Delivery Rate</span>
                          <span className="text-emerald-400 font-bold">{member.metrics.deliveryRatePct}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded" style={{ width: `${member.metrics.deliveryRatePct}%` }} />
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">Tasks Completed</span>
                          <span className="text-cyan-400 font-bold">{member.metrics.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">Hours Logged</span>
                          <span className="text-violet-400 font-bold">{member.metrics.hoursLoggedTotal}h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Private Notes (only self) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">PRIVATE NOTES (ONLY YOU)</p>
                      {canSeePrivate && (
                        <button
                          onClick={() => {
                            setPrivateNoteEdit(isMe ? member.id : null);
                            setPrivateNoteInputs((p) => ({ ...p, [member.id]: member.privateNotes }));
                          }}
                          className="text-xs font-bold text-zinc-300 hover:text-white flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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
                            className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-medium text-white focus:border-red-500 focus:outline-none resize-none rounded"
                          />
                          <div className="flex space-x-2">
                            <button onClick={() => savePrivateNote(member.id)} className="border border-emerald-500/60 bg-emerald-950/30 px-4 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-600 hover:text-black rounded">SAVE</button>
                            <button onClick={() => setPrivateNoteEdit(null)} className="border border-white/20 px-4 py-1.5 text-xs font-bold text-zinc-300 hover:text-white rounded">CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <p className="border border-white/10 bg-white/[0.03] p-3.5 text-xs font-medium text-zinc-200 whitespace-pre-wrap min-h-[40px] rounded leading-relaxed">
                          {member.privateNotes || '— No private notes —'}
                        </p>
                      )
                    ) : (
                      <div className="border border-white/10 bg-white/[0.03] p-3 flex items-center space-x-2 rounded">
                        <Lock className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-semibold text-zinc-400">PRIVATE — MEMBER ACCESS ONLY</p>
                      </div>
                    )}
                  </div>

                  {/* Manager Notes (manager/admin only) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">MANAGER NOTES (CONFIDENTIAL)</p>
                      {canSeeManagerNotes && perms.canWriteManagerNotes && (
                        <button
                          onClick={() => {
                            setManagerNoteEdit(member.id);
                            setManagerNoteInputs((p) => ({ ...p, [member.id]: member.managerNotes }));
                          }}
                          className="text-xs font-bold text-zinc-300 hover:text-white flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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
                            className="w-full border border-violet-500/40 bg-violet-950/15 px-3 py-2 text-xs font-medium text-white focus:border-violet-500 focus:outline-none resize-none rounded"
                          />
                          <div className="flex space-x-2">
                            <button onClick={() => saveManagerNote(member.id)} className="border border-violet-500/60 bg-violet-950/30 px-4 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600 hover:text-white rounded">SAVE</button>
                            <button onClick={() => setManagerNoteEdit(null)} className="border border-white/20 px-4 py-1.5 text-xs font-bold text-zinc-300 hover:text-white rounded">CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <p className="border border-violet-500/30 bg-violet-950/15 p-3.5 text-xs font-medium text-zinc-200 whitespace-pre-wrap min-h-[40px] rounded leading-relaxed">
                          {member.managerNotes || '— No manager notes —'}
                        </p>
                      )
                    ) : (
                      <div className="border border-white/10 bg-white/[0.03] p-3 flex items-center space-x-2 rounded">
                        <Lock className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-semibold text-zinc-400">CONFIDENTIAL — MANAGER & ADMIN ONLY</p>
                      </div>
                    )}
                  </div>

                  {/* Admin Controls: Password Reset + Remove */}
                  {(perms.canChangePasswords || (canDeleteThisMember && !isMe)) && (
                    <div className="border border-white/8 bg-[#030303] p-4 space-y-3">
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                        {isMe ? 'SECURITY CONTROLS (YOUR ACCOUNT)' : 'ADMIN CONTROLS'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                        {perms.canChangePasswords && (
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <div className="relative flex-1">
                                <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={pwdInputs[member.id] || ''}
                                  onChange={(e) => setPwdInputs((p) => ({ ...p, [member.id]: e.target.value }))}
                                  placeholder="New passkey (min 4 chars)..."
                                  disabled={updatingPwdMemberId === member.id}
                                  className="w-full border border-white/10 bg-black pl-8 pr-2.5 py-2 font-mono text-xs text-white focus:border-amber-500 focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => void handleResetMemberPasskey(member, pwdInputs[member.id] || '')}
                                disabled={updatingPwdMemberId === member.id || !(pwdInputs[member.id] || '').trim()}
                                className="border border-amber-500/60 bg-amber-950/30 px-3 font-mono text-[9px] font-bold text-amber-400 hover:bg-amber-600 hover:text-black transition-colors disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                              >
                                {updatingPwdMemberId === member.id ? (
                                  <span className="animate-spin inline-block">⟳</span>
                                ) : (
                                  <KeyRound className="w-3 h-3" />
                                )}
                                <span>{updatingPwdMemberId === member.id ? 'SAVING...' : 'CHANGE KEY'}</span>
                              </button>
                            </div>

                            {/* Passkey notification message for this member */}
                            {passkeyNotice && passkeyNotice.memberId === member.id && (
                              <div
                                className={`p-2.5 text-xs font-mono border rounded ${
                                  passkeyNotice.isError
                                    ? 'border-red-500/40 bg-red-950/30 text-red-400'
                                    : 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                                } flex items-center justify-between gap-2`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  {passkeyNotice.isError ? (
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  )}
                                  <span className="truncate">{passkeyNotice.message}</span>
                                </div>
                                {!passkeyNotice.isError && passkeyNotice.key && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(passkeyNotice.key);
                                      alert(`Copied new key for ${member.name}: ${passkeyNotice.key}`);
                                    }}
                                    className="border border-emerald-500/40 bg-emerald-900/40 px-2 py-0.5 text-[9px] font-bold text-emerald-200 hover:bg-emerald-600 hover:text-white shrink-0"
                                  >
                                    COPY KEY
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {canDeleteThisMember && !isMe && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="border border-red-500/40 bg-red-950/20 px-3 py-2 font-mono text-[9px] text-red-400 hover:bg-red-600/20 transition-colors flex items-center justify-center gap-1.5 h-[34px]"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>REMOVE FROM ROSTER</span>
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
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  SKILLS (COMMA-SEPARATED)
                </label>
                <input
                  value={editForm.skills}
                  onChange={(e) => setEditForm((p) => ({ ...p, skills: e.target.value }))}
                  className="w-full border border-white/20 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  AVATAR ACCENT COLOR
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={editForm.accentColor}
                    onChange={(e) => setEditForm((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-10 h-9 bg-black border border-white/20 cursor-pointer p-0.5 rounded"
                  />
                  <span className="font-mono text-xs text-zinc-300 font-semibold">{editForm.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  CLEARANCE CODE
                </label>
                <input
                  value={editForm.clearanceCode}
                  onChange={(e) => setEditForm((p) => ({ ...p, clearanceCode: e.target.value }))}
                  className="w-full border border-white/20 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-red-500 focus:outline-none rounded"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="flex-1 min-w-[100px] border border-white/20 py-2.5 font-mono text-xs text-zinc-400 uppercase hover:text-white transition-colors"
              >
                CANCEL
              </button>
              {(perms.canOnboardMembers || currentUser.role === 'admin') && editingMember.id !== currentUser.id && (
                <button
                  type="button"
                  onClick={() => removeMember(editingMember.id)}
                  className="border border-red-500/50 bg-red-950/30 px-4 py-2.5 font-mono text-xs text-red-400 uppercase hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>DELETE MEMBER</span>
                </button>
              )}
              <button
                type="button"
                onClick={saveMemberEdit}
                className="flex-1 min-w-[140px] border border-red-500 bg-red-600/30 py-2.5 font-mono text-xs text-white uppercase hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                SAVE MEMBER DETAILS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: AUTHORIZE CANDIDATE & ASSIGN PASSKEY ────────────────── */}
      {applicantToOnboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="border border-emerald-500/60 bg-[#070b09] p-6 max-w-lg w-full hud-clip space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    AUTHORIZE OPERATIVE // ONBOARDING
                  </h3>
                  <p className="font-mono text-xs font-bold text-emerald-400">ASSIGN CLEARANCE & SYSTEM PASSKEY</p>
                </div>
              </div>
              <button
                onClick={() => setApplicantToOnboard(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Dossier Summary */}
            <div className="border border-white/10 bg-black/60 p-3.5 rounded space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-sm">{applicantToOnboard.fullName}</p>
                  <p className="text-zinc-300 font-medium text-xs">{applicantToOnboard.email}</p>
                </div>
                <span className="border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 text-xs font-bold text-cyan-300 rounded">
                  {applicantToOnboard.department}
                </span>
              </div>
              {applicantToOnboard.statement && (
                <p className="text-zinc-200 italic text-xs border-l-2 border-emerald-500/60 pl-2">
                  &ldquo;{applicantToOnboard.statement}&rdquo;
                </p>
              )}
            </div>

            {/* Role Assignment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                ASSIGN SYSTEM CLEARANCE / ROLE:
              </label>
              <select
                value={onboardRole}
                onChange={(e) => setOnboardRole(e.target.value as UserRole)}
                className="w-full border border-white/20 bg-black px-3 py-2 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none rounded"
              >
                <option value="working_member">WORKING MEMBER (Active Sprints - LVL-05-ALPHA)</option>
                <option value="member">MEMBER (Standard Access - LVL-01-RESTRICTED)</option>
                <option value="manager">MANAGER (Tech / Squad Lead - LVL-07-SIGMA)</option>
                <option value="admin">ADMIN (Executive Clearance - LVL-09-OMEGA)</option>
              </select>
            </div>

            {/* Passkey Assignment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  ASSIGN INITIAL PASSKEY:
                </label>
                <button
                  type="button"
                  onClick={() => setOnboardPasskey(generateSecurePasskey())}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>GENERATE NEW</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showOnboardPasskey ? 'text' : 'password'}
                  value={onboardPasskey}
                  onChange={(e) => setOnboardPasskey(e.target.value)}
                  placeholder="Enter passkey for member..."
                  className="w-full border border-emerald-500/50 bg-black pl-9 pr-10 py-2.5 font-mono text-sm text-emerald-300 focus:border-emerald-400 focus:outline-none tracking-wider rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowOnboardPasskey(!showOnboardPasskey)}
                  className="text-zinc-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showOnboardPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-medium text-zinc-400">
                * This passkey will be hashed in MongoDB and used by the operative to log in at /login.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setApplicantToOnboard(null)}
                disabled={isOnboarding}
                className="flex-1 border border-white/20 py-2.5 font-mono text-xs text-zinc-400 uppercase hover:text-white hover:border-white transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => void confirmOnboardApplicant()}
                disabled={isOnboarding || !onboardPasskey.trim()}
                className="flex-2 flex items-center justify-center space-x-2 border border-emerald-500 bg-emerald-600 px-6 py-2.5 font-mono text-xs font-bold text-black uppercase hover:bg-emerald-500 transition-all disabled:opacity-50"
              >
                {isOnboarding ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>ACTIVATING...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>CONFIRM & ACTIVATE OPERATIVE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ONBOARDING SUCCESS CREDENTIALS POPUP ────────────────── */}
      {onboardSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="border border-emerald-500 bg-[#050e08] p-6 max-w-md w-full hud-clip space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                OPERATIVE ACTIVATED SUCCESSFULLY!
              </h3>
            </div>
            <p className="font-mono text-xs text-zinc-300">
              The applicant has been accepted and added to the official studio roster with verified system clearance.
            </p>

            {/* Credentials Card */}
            <div className="border border-emerald-500/40 bg-black/70 p-4 rounded font-mono text-xs space-y-2">
              <p className="text-[10px] text-emerald-400 tracking-widest uppercase font-bold">ACCESS CREDENTIALS</p>
              <div className="space-y-1 text-zinc-300 text-xs">
                <p><span className="text-zinc-500">OPERATIVE:</span> <strong className="text-white">{onboardSuccess.name}</strong></p>
                <p><span className="text-zinc-500">CLEARANCE:</span> <strong className="text-cyan-400">{onboardSuccess.role}</strong></p>
                <p><span className="text-zinc-500">EMAIL:</span> <strong className="text-white">{onboardSuccess.email}</strong></p>
                <p><span className="text-zinc-500">PASSKEY:</span> <strong className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded">{onboardSuccess.passkey}</strong></p>
                <p><span className="text-zinc-500">LOGIN URL:</span> <span className="text-zinc-400">{typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}</span></p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://my-studio-website-sachin-c363.vercel.app/login';
                  const text = `TECHNOVA STUDIO // ACCESS AUTHORIZED\n\nOperative: ${onboardSuccess.name}\nClearance Role: ${onboardSuccess.role}\nLogin Email: ${onboardSuccess.email}\nAssigned Passkey: ${onboardSuccess.passkey}\nConsole URL: ${url}\n\nPlease keep these credentials secure.`;
                  navigator.clipboard.writeText(text);
                  setHasCopiedCredentials(true);
                  setTimeout(() => setHasCopiedCredentials(false), 3000);
                }}
                className="w-full flex items-center justify-center space-x-2 border border-emerald-400 bg-emerald-950/40 py-2.5 font-mono text-xs text-emerald-300 font-bold uppercase hover:bg-emerald-600 hover:text-black transition-all"
              >
                {hasCopiedCredentials ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY CREDENTIALS & SHARE</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setOnboardSuccess(null)}
                className="w-full border border-white/20 py-2 font-mono text-xs text-zinc-400 uppercase hover:text-white transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
