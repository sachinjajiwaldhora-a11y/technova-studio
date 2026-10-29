// FILE PATH: components/team/tabs/ProjectsTab.tsx
'use client';

import React, { useState } from 'react';
import {
  StudioProject, StudioMember, RBACPermissions, ProjectStatus, Priority,
  ProjectType, ResourceLink, Milestone, HourLog, ProjectComment,
  STORAGE_KEYS, setStore, getProjectProgress,
} from '@/lib/store';
import {
  Plus, X, ChevronDown, ChevronUp, CheckSquare, Square, Link2,
  Clock, Users, ArrowUpRight, Filter, Search, Trash2, MessageSquare,
  Timer, ExternalLink, GitBranch, FileSpreadsheet, FileText, Layout, Briefcase,
} from 'lucide-react';

const STATUS_COLORS: Record<ProjectStatus, string> = {
  INQUIRY: 'text-zinc-400 border-zinc-500/40',
  SCOPING: 'text-amber-400 border-amber-500/40',
  ACTIVE: 'text-cyan-400 border-cyan-500/40',
  REVIEW: 'text-violet-400 border-violet-500/40',
  COMPLETED: 'text-emerald-400 border-emerald-500/40',
  ARCHIVED: 'text-zinc-600 border-zinc-700/40',
};

const PRIO_COLORS: Record<Priority, string> = {
  CRITICAL: 'text-red-400 border-red-500/50 bg-red-950/30',
  HIGH: 'text-amber-400 border-amber-500/50 bg-amber-950/30',
  NOMINAL: 'text-zinc-400 border-zinc-600/50 bg-zinc-900/30',
};

const TYPE_ICONS: Record<ProjectType | 'INTERNAL', React.ElementType> = {
  LEAD_GEN: FileSpreadsheet,
  RESEARCH: FileText,
  DEV_BUILD: GitBranch,
  CLIENT_COMMISSION: ArrowUpRight,
  INTERNAL: Layout,
};

interface ProjectsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  projects: StudioProject[];
  members: StudioMember[];
  onProjectsChange: (projects: StudioProject[]) => void;
}

export default function ProjectsTab({
  currentUser, perms, projects, members, onProjectsChange,
}: ProjectsTabProps) {
  const [sourceCategory, setSourceCategory] = useState<'ALL' | 'CLIENT' | 'TEAM'>('ALL');
  const [filter, setFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Edit Assigned Members modal state
  const [reassignProject, setReassignProject] = useState<StudioProject | null>(null);
  const [editAssignedIds, setEditAssignedIds] = useState<string[]>([]);
  const [editManagerId, setEditManagerId] = useState<string>('');

  // Create form state
  const [form, setForm] = useState({
    title: '', description: '', type: 'DEV_BUILD' as ProjectType,
    priority: 'HIGH' as Priority, dueDate: '',
    estimatedHours: '', assignedMemberIds: [] as string[],
    source: 'INTERNAL_TEAM' as 'INTERNAL_TEAM' | 'CLIENT_INQUIRY',
    clientName: '', company: '', contact: '', budget: '',
    liveUrl: '', repoUrl: '',
  });

  // Comment input state
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  // Milestone input state
  const [milestoneInputs, setMilestoneInputs] = useState<Record<string, string>>({});
  // Hour log input state
  const [hourInputs, setHourInputs] = useState<Record<string, { hours: string; desc: string }>>({});
  // Link input state
  const [linkInputs, setLinkInputs] = useState<Record<string, { label: string; url: string; type: ResourceLink['type'] }>>({});

  const visibleProjects = projects.filter((p) => {
    const canSee = perms.canViewAllProjects
      ? true
      : (p.assignedMemberIds || []).includes(currentUser.id) || p.managerId === currentUser.id || p.createdBy === currentUser.id;
    if (!canSee) return false;
    if (sourceCategory === 'CLIENT' && p.source !== 'CLIENT_INQUIRY') return false;
    if (sourceCategory === 'TEAM' && p.source !== 'INTERNAL_TEAM') return false;
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function saveAndUpdate(updated: StudioProject[]) {
    setStore(STORAGE_KEYS.PROJECTS, updated);
    onProjectsChange(updated);
  }

  function createProject() {
    if (!form.title.trim()) return;
    const newProject: StudioProject = {
      id: `prj-${Date.now()}`,
      title: form.title,
      description: form.description,
      source: form.source,
      type: form.type,
      status: 'SCOPING',
      priority: form.priority,
      ...(form.source === 'CLIENT_INQUIRY' ? {
        clientInfo: {
          clientName: form.clientName,
          company: form.company,
          contact: form.contact,
          budget: form.budget,
          expectedRevenue: parseInt(form.budget.replace(/\D/g, '')) || 0,
          followUpDate: form.dueDate,
          leadSource: 'DIRECT',
        },
      } : {}),
      assignedMemberIds: form.assignedMemberIds,
      managerId: currentUser.id,
      createdBy: currentUser.id,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate,
      estimatedHours: parseInt(form.estimatedHours) || 0,
      actualHours: 0,
      resourceLinks: [],
      milestones: [],
      comments: [],
      hourLogs: [],
      tags: [],
      liveUrl: form.liveUrl,
      repoUrl: form.repoUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAndUpdate([newProject, ...projects]);
    setShowCreate(false);
    setForm({ title: '', description: '', type: 'DEV_BUILD', priority: 'HIGH', dueDate: '', estimatedHours: '', assignedMemberIds: [], source: 'INTERNAL_TEAM', clientName: '', company: '', contact: '', budget: '', liveUrl: '', repoUrl: '' });
  }

  function openReassignModal(project: StudioProject) {
    setReassignProject(project);
    setEditAssignedIds(project.assignedMemberIds || []);
    setEditManagerId(project.managerId || currentUser.id);
  }

  function saveReassignments() {
    if (!reassignProject) return;
    const updated = projects.map((p) => {
      if (p.id !== reassignProject.id) return p;
      return {
        ...p,
        assignedMemberIds: editAssignedIds,
        managerId: editManagerId,
        updatedAt: new Date().toISOString(),
      };
    });
    saveAndUpdate(updated);
    setReassignProject(null);
  }

  function cycleStatus(projectId: string) {
    if (!perms.canUpdateProjectStatus) return;
    const order: ProjectStatus[] = ['INQUIRY', 'SCOPING', 'ACTIVE', 'REVIEW', 'COMPLETED', 'ARCHIVED'];
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const next = order[(order.indexOf(p.status) + 1) % order.length];
        const isFinished = next === 'COMPLETED' || next === 'ARCHIVED';
        return {
          ...p,
          status: next,
          milestones: isFinished
            ? (p.milestones || []).map((m) => ({ ...m, completed: true }))
            : p.milestones || [],
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    saveAndUpdate(updated);
  }

  function toggleMilestone(projectId: string, msId: string) {
    if (!perms.canCompleteMilestone) return;
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: (p.milestones || []).map((m) =>
            m.id === msId ? { ...m, completed: !m.completed } : m
          ),
        };
      }
      return p;
    });
    saveAndUpdate(updated);
  }

  function addMilestone(projectId: string) {
    if (!perms.canCreateMilestone) return;
    const text = milestoneInputs[projectId]?.trim();
    if (!text) return;
    const ms: Milestone = { id: `ms-${Date.now()}`, title: text, completed: false, createdAt: new Date().toISOString() };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, milestones: [...(p.milestones || []), ms] } : p
    );
    saveAndUpdate(updated);
    setMilestoneInputs((prev) => ({ ...prev, [projectId]: '' }));
  }

  function addComment(projectId: string) {
    if (!perms.canAddComments) return;
    const text = commentInputs[projectId]?.trim();
    if (!text) return;
    const comment: ProjectComment = {
      id: `cmt-${Date.now()}`, authorId: currentUser.id,
      authorName: currentUser.name, text, createdAt: new Date().toISOString(),
    };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, comments: [...p.comments, comment] } : p
    );
    saveAndUpdate(updated);
    setCommentInputs((prev) => ({ ...prev, [projectId]: '' }));
  }

  function logHours(projectId: string) {
    if (!perms.canLogHours) return;
    const { hours, desc } = hourInputs[projectId] || {};
    if (!hours || !desc) return;
    const log: HourLog = {
      id: `hl-${Date.now()}`, memberId: currentUser.id, memberName: currentUser.name,
      hours: parseFloat(hours), description: desc, date: new Date().toISOString().split('T')[0],
    };
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, actualHours: p.actualHours + log.hours, hourLogs: [...p.hourLogs, log] };
    });
    saveAndUpdate(updated);
    setHourInputs((prev) => ({ ...prev, [projectId]: { hours: '', desc: '' } }));
  }

  function addLink(projectId: string) {
    if (!perms.canAddProjectLinks) return;
    const li = linkInputs[projectId];
    if (!li?.label || !li?.url) return;
    const link: ResourceLink = { id: `lnk-${Date.now()}`, label: li.label, url: li.url, type: li.type };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, resourceLinks: [...p.resourceLinks, link] } : p
    );
    saveAndUpdate(updated);
    setLinkInputs((prev) => ({ ...prev, [projectId]: { label: '', url: '', type: 'other' } }));
  }

  function deleteProject(projectId: string) {
    if (!perms.canDeleteProject) return;
    if (!confirm('Delete this project permanently?')) return;
    saveAndUpdate(projects.filter((p) => p.id !== projectId));
    if (expandedId === projectId) setExpandedId(null);
  }

  const linkTypeIcon: Record<ResourceLink['type'], React.ElementType> = {
    sheet: FileSpreadsheet, doc: FileText, live_demo: ExternalLink,
    repo: GitBranch, figma: Layout, other: Link2,
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">ENGINEERING HUB</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">PROJECTS MATRIX</h2>
        </div>
        {perms.canCreateProject && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-all hud-clip"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW PROJECT</span>
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 border border-red-500/40 bg-[#080808] p-6 hud-clip space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">INITIALIZE NEW PROJECT</p>
            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Project Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. NOVA WebGL Dashboard v2" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Project scope, goals, and technical requirements..." className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as typeof form.source })} className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none">
                <option value="INTERNAL_TEAM">INTERNAL TEAM</option>
                <option value="CLIENT_INQUIRY">CLIENT PROJECT</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })} className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none">
                <option value="DEV_BUILD">DEV BUILD</option>
                <option value="LEAD_GEN">LEAD GENERATION</option>
                <option value="RESEARCH">RESEARCH & R&D</option>
                <option value="CLIENT_COMMISSION">CLIENT COMMISSION</option>
                <option value="INTERNAL">INTERNAL PROJECT</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none">
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NOMINAL">NOMINAL</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Estimated Hours</label>
              <input type="number" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} placeholder="160" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>

            {form.source === 'CLIENT_INQUIRY' && (
              <>
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Client Name</label>
                  <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client Name" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Company</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company / Venture" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Budget</label>
                  <input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="$25,000" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Assign Members</label>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm((prev) => ({
                      ...prev,
                      assignedMemberIds: (prev.assignedMemberIds || []).includes(m.id)
                        ? prev.assignedMemberIds.filter((id) => id !== m.id)
                        : [...prev.assignedMemberIds, m.id],
                    }))}
                    className={`px-2.5 py-1.5 font-mono text-[9px] border transition-colors ${
                      (form.assignedMemberIds || []).includes(m.id)
                        ? 'border-red-500 bg-red-600/20 text-white'
                        : 'border-white/15 text-zinc-400 hover:border-white/40'
                    }`}
                  >
                    {m.photoInitials} {m.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={createProject}
            className="w-full border border-red-500 bg-red-600 py-3 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-500 transition-colors hud-clip"
          >
            + DEPLOY PROJECT TO MATRIX
          </button>
        </div>
      )}

      {/* Category Sub-Tabs: ALL / CLIENT / TEAM */}
      <div className="flex border-b border-white/10 mb-5 gap-1">
        <button
          onClick={() => setSourceCategory('ALL')}
          className={`px-4 py-2.5 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            sourceCategory === 'ALL'
              ? 'border-red-500 text-white font-bold bg-white/[0.03]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ALL PROJECTS ({projects.length})
        </button>
        <button
          onClick={() => setSourceCategory('CLIENT')}
          className={`px-4 py-2.5 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            sourceCategory === 'CLIENT'
              ? 'border-red-500 text-white font-bold bg-white/[0.03]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          CLIENT COMMISSIONS ({projects.filter((p) => p.source === 'CLIENT_INQUIRY').length})
        </button>
        <button
          onClick={() => setSourceCategory('TEAM')}
          className={`px-4 py-2.5 font-mono text-xs tracking-wider uppercase border-b-2 transition-all ${
            sourceCategory === 'TEAM'
              ? 'border-red-500 text-white font-bold bg-white/[0.03]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          INTERNAL / TEAM BUILDS ({projects.filter((p) => p.source === 'INTERNAL_TEAM').length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center space-x-1 border border-white/10 bg-black px-3 py-2">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-transparent font-mono text-xs text-white placeholder-zinc-600 focus:outline-none w-40"
          />
        </div>
        <div className="flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          {(['ALL', 'ACTIVE', 'SCOPING', 'REVIEW', 'COMPLETED', 'ARCHIVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1.5 font-mono text-[9px] tracking-widest border transition-colors ${
                filter === s ? 'border-red-500 bg-red-600/20 text-white' : 'border-white/10 text-zinc-500 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-3">
        {visibleProjects.map((project) => {
          const isExpanded = expandedId === project.id;
          const pct = getProjectProgress(project);
          const milestones = project.milestones || [];
          const doneMilestones = milestones.filter((m) => m.completed).length;
          const TypeIcon = TYPE_ICONS[project.type] || Layout;
          const assignedMembers = members.filter((m) => (project.assignedMemberIds || []).includes(m.id));

          return (
            <div key={project.id} className="border border-white/10 bg-[#060606] hud-clip overflow-hidden">
              {/* Card Header */}
              <div
                className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
              >
                <TypeIcon className="w-4 h-4 text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">{project.title}</p>
                    <span className={`font-mono text-[8px] border px-1.5 py-0.5 ${PRIO_COLORS[project.priority]}`}>
                      {project.priority}
                    </span>
                    <span className={`font-mono text-[8px] border px-1.5 py-0.5 ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {/* Progress bar */}
                    <div className="flex items-center space-x-2 flex-1 max-w-[220px]">
                      <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-500 ease-out ${
                            pct === 100
                              ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                              : pct >= 80
                              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                              : pct >= 50
                              ? 'bg-amber-400'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono text-[9px] font-bold shrink-0 transition-colors ${
                          pct === 100 ? 'text-emerald-400 font-semibold' : 'text-zinc-400'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                    {project.dueDate && (
                      <span className="font-mono text-[8px] text-zinc-500 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{project.dueDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned member avatars */}
                <div className="flex -space-x-1.5">
                  {assignedMembers.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      title={m.name}
                      className="w-6 h-6 rounded-full border border-[#060606] flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: m.accentColor }}
                    >
                      {m.photoInitials}
                    </div>
                  ))}
                </div>

                {perms.canAssignMembers && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReassignModal(project);
                    }}
                    className="font-mono text-[9px] border border-cyan-500/40 bg-cyan-950/20 px-2.5 py-1.5 text-cyan-300 hover:bg-cyan-600 hover:text-white transition-colors shrink-0 flex items-center space-x-1"
                    title="Edit Assigned Team Members & Lead"
                  >
                    <span>TEAM ({assignedMembers.length})</span>
                    <span className="text-cyan-400 font-bold">✎</span>
                  </button>
                )}

                {/* Status cycle button */}
                {perms.canUpdateProjectStatus && (
                  <button
                    onClick={(e) => { e.stopPropagation(); cycleStatus(project.id); }}
                    className="font-mono text-[9px] border border-white/15 px-2.5 py-1.5 text-zinc-400 hover:border-red-500 hover:text-white transition-colors shrink-0"
                  >
                    ADVANCE →
                  </button>
                )}

                {perms.canDeleteProject && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="border-t border-white/8 p-5 space-y-6 bg-[#040404]">
                  {/* Description + Client Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">DESCRIPTION</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{project.description || '—'}</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div>
                          <p className="font-mono text-[8px] text-zinc-500 mb-0.5">EST. HOURS</p>
                          <p className="font-mono text-sm text-white">{project.estimatedHours}h</p>
                        </div>
                        <div>
                          <p className="font-mono text-[8px] text-zinc-500 mb-0.5">ACTUAL</p>
                          <p className="font-mono text-sm text-cyan-400">{project.actualHours}h</p>
                        </div>
                        <div>
                          <p className="font-mono text-[8px] text-zinc-500 mb-0.5">SOURCE</p>
                          <p className="font-mono text-[10px] text-white">{project.source}</p>
                        </div>
                      </div>
                      {/* Quick Links */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 border border-cyan-500/40 bg-cyan-950/20 px-2.5 py-1.5 font-mono text-[9px] text-cyan-400 hover:bg-cyan-600/20 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>LIVE DEMO</span>
                          </a>
                        )}
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 border border-violet-500/40 bg-violet-950/20 px-2.5 py-1.5 font-mono text-[9px] text-violet-400 hover:bg-violet-600/20 transition-colors">
                            <GitBranch className="w-2.5 h-2.5" />
                            <span>REPO</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {project.clientInfo && perms.canViewClientFinancials && (
                      <div className="border border-white/10 bg-white/[0.02] p-4">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">CLIENT INFO</p>
                        <div className="space-y-1.5">
                          {[
                            { l: 'CLIENT', v: project.clientInfo.clientName },
                            { l: 'COMPANY', v: project.clientInfo.company },
                            { l: 'CONTACT', v: project.clientInfo.contact },
                            { l: 'BUDGET', v: project.clientInfo.budget },
                            { l: 'FOLLOW-UP', v: project.clientInfo.followUpDate },
                          ].map(({ l, v }) => (
                            <div key={l} className="flex items-center justify-between">
                              <span className="font-mono text-[9px] text-zinc-500">{l}</span>
                              <span className="font-mono text-[10px] text-white">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">MILESTONES</p>
                    <div className="space-y-1.5">
                      {(project.milestones || []).map((ms) => (
                        <button
                          key={ms.id}
                          onClick={() => toggleMilestone(project.id, ms.id)}
                          disabled={!perms.canCompleteMilestone}
                          className="w-full flex items-center space-x-3 text-left border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:border-red-500/30 transition-colors disabled:cursor-default"
                        >
                          {ms.completed
                            ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            : <Square className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          }
                          <span className={`text-sm ${ms.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                            {ms.title}
                          </span>
                        </button>
                      ))}
                    </div>
                    {perms.canCreateMilestone && (
                      <div className="mt-2 flex space-x-2">
                        <input
                          value={milestoneInputs[project.id] || ''}
                          onChange={(e) => setMilestoneInputs((p) => ({ ...p, [project.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') addMilestone(project.id); }}
                          placeholder="Add milestone and press Enter..."
                          className="flex-1 border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <button onClick={() => addMilestone(project.id)} className="border border-red-500/50 bg-red-950/20 px-3 font-mono text-[10px] text-red-400 hover:bg-red-600/20 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Resource Links */}
                  <div>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">RESOURCE LINKS</p>
                    <div className="space-y-1.5">
                      {project.resourceLinks.map((link) => {
                        const LinkIcon = linkTypeIcon[link.type];
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 border border-white/8 bg-white/[0.02] px-3 py-2 hover:border-red-500/30 transition-colors group"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="font-mono text-xs text-zinc-300 group-hover:text-white flex-1">{link.label}</span>
                            <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-red-400" />
                          </a>
                        );
                      })}
                    </div>
                    {perms.canAddProjectLinks && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <input
                          value={linkInputs[project.id]?.label || ''}
                          onChange={(e) => setLinkInputs((p) => ({ ...p, [project.id]: { ...(p[project.id] || { label: '', url: '', type: 'other' as const }), label: e.target.value } }))}
                          placeholder="Link label"
                          className="border border-white/10 bg-black px-2.5 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <input
                          value={linkInputs[project.id]?.url || ''}
                          onChange={(e) => setLinkInputs((p) => ({ ...p, [project.id]: { ...(p[project.id] || { label: '', url: '', type: 'other' as const }), url: e.target.value } }))}
                          placeholder="https://..."
                          className="border border-white/10 bg-black px-2.5 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <div className="flex space-x-1">
                          <select
                            value={linkInputs[project.id]?.type || 'other'}
                            onChange={(e) => setLinkInputs((p) => ({ ...p, [project.id]: { ...(p[project.id] || { label: '', url: '', type: 'other' as const }), type: e.target.value as ResourceLink['type'] } }))}
                            className="flex-1 border border-white/10 bg-black px-2 py-2 font-mono text-[9px] text-zinc-300 focus:outline-none"
                          >
                            <option value="sheet">SHEET</option>
                            <option value="doc">DOC</option>
                            <option value="live_demo">DEMO</option>
                            <option value="repo">REPO</option>
                            <option value="figma">FIGMA</option>
                            <option value="other">OTHER</option>
                          </select>
                          <button onClick={() => addLink(project.id)} className="border border-red-500/50 bg-red-950/20 px-3 font-mono text-[10px] text-red-400 hover:bg-red-600/20 transition-colors">
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hour Log */}
                  {perms.canLogHours && (
                    <div>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">LOG HOURS</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.hourLogs.slice(-3).map((log) => (
                          <div key={log.id} className="border border-white/8 bg-white/[0.02] px-3 py-2">
                            <p className="font-mono text-[9px] text-zinc-300">{log.memberName} — <span className="text-cyan-400">{log.hours}h</span></p>
                            <p className="font-mono text-[8px] text-zinc-500">{log.description}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={hourInputs[project.id]?.hours || ''}
                          onChange={(e) => setHourInputs((p) => ({ ...p, [project.id]: { ...(p[project.id] || { hours: '', desc: '' }), hours: e.target.value } }))}
                          placeholder="Hours"
                          className="w-20 border border-white/10 bg-black px-2.5 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <input
                          value={hourInputs[project.id]?.desc || ''}
                          onChange={(e) => setHourInputs((p) => ({ ...p, [project.id]: { ...(p[project.id] || { hours: '', desc: '' }), desc: e.target.value } }))}
                          placeholder="What did you work on?"
                          className="flex-1 border border-white/10 bg-black px-2.5 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <button onClick={() => logHours(project.id)} className="border border-cyan-500/50 bg-cyan-950/20 px-3 font-mono text-[10px] text-cyan-400 hover:bg-cyan-600/20 transition-colors">
                          <Timer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">
                      THREADED COMMENTS ({project.comments.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {project.comments.map((c) => (
                        <div key={c.id} className="flex space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                            {c.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[9px] text-zinc-300">{c.authorName}</span>
                              <span className="font-mono text-[8px] text-zinc-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-zinc-200">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {perms.canAddComments && (
                      <div className="mt-2 flex space-x-2">
                        <input
                          value={commentInputs[project.id] || ''}
                          onChange={(e) => setCommentInputs((p) => ({ ...p, [project.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(project.id); } }}
                          placeholder="Add comment (Enter to send)..."
                          className="flex-1 border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                        />
                        <button onClick={() => addComment(project.id)} className="border border-red-500/50 bg-red-950/20 px-3 font-mono text-[10px] text-red-400 hover:bg-red-600/20 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleProjects.length === 0 && (
          <div className="text-center py-16 border border-white/8 bg-[#060606]">
            <Briefcase className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">NO PROJECTS FOUND</p>
          </div>
        )}
      </div>

      {/* REASSIGN MEMBERS MODAL */}
      {reassignProject && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-cyan-500/50 bg-[#070707] p-6 hud-clip space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                  ASSIGNMENT CONSOLE // {reassignProject.id}
                </p>
                <h4 className="text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                  {reassignProject.title}
                </h4>
              </div>
              <button
                onClick={() => setReassignProject(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Lead Manager */}
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1.5">
                LEAD MANAGER / TECH LEAD
              </label>
              <select
                value={editManagerId}
                onChange={(e) => setEditManagerId(e.target.value)}
                className="w-full border border-white/15 bg-black px-3 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.toUpperCase()}) — {m.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Assigned Members */}
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1.5">
                ASSIGNED TEAM SPRINT MEMBERS ({editAssignedIds.length})
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto border border-white/10 p-2 bg-black/40">
                {members.map((m) => {
                  const isAssigned = editAssignedIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        setEditAssignedIds((prev) =>
                          prev.includes(m.id)
                            ? prev.filter((id) => id !== m.id)
                            : [...prev, m.id]
                        )
                      }
                      className={`flex items-center justify-between p-2.5 border cursor-pointer transition-colors ${
                        isAssigned
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-white/5 bg-transparent text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ background: m.accentColor }}
                        >
                          {m.photoInitials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">
                            {m.name}
                          </div>
                          <div className="font-mono text-[9px] text-zinc-500">
                            {m.department} &bull; {m.role}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-cyan-400">
                        {isAssigned ? '[ ASSIGNED ]' : '+ ADD'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setReassignProject(null)}
                className="flex-1 border border-white/20 py-2.5 font-mono text-xs text-zinc-400 uppercase hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={saveReassignments}
                className="flex-1 border border-cyan-500 bg-cyan-600/30 py-2.5 font-mono text-xs text-white uppercase hover:bg-cyan-600 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                SAVE ASSIGNMENTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
