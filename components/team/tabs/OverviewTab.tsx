// FILE PATH: components/team/tabs/OverviewTab.tsx
// TECHNOVA STUDIO // OVERVIEW DASHBOARD & TARGET TRACKING TELEMETRY
'use client';

import React, { useState } from 'react';
import {
  StudioMember, StudioProject, ClientInquiry, StudioAnnouncement,
  StudioLead, StudioTarget, DEFAULT_TARGETS, STORAGE_KEYS, setStore,
  getProjectProgress, RBACPermissions,
} from '@/lib/store';
import {
  Briefcase, TrendingUp, Users, Clock, CheckCircle2, AlertTriangle,
  Megaphone, ArrowUpRight, Zap, Target, Edit3, X, Check, Plus,
  Sparkles, DollarSign, Award,
} from 'lucide-react';

interface OverviewTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  projects: StudioProject[];
  inquiries: ClientInquiry[];
  members: StudioMember[];
  announcements: StudioAnnouncement[];
  leads?: StudioLead[];
  targets?: StudioTarget[];
  onTargetsChange?: (targets: StudioTarget[]) => void;
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({
  currentUser,
  perms,
  projects,
  inquiries,
  members,
  announcements,
  leads = [],
  targets = DEFAULT_TARGETS,
  onTargetsChange,
  onTabChange,
}: OverviewTabProps) {
  const [configureTargetsOpen, setConfigureTargetsOpen] = useState(false);
  const [editableTargets, setEditableTargets] = useState<StudioTarget[]>(targets);

  const myProjects = projects.filter((p) =>
    perms.canViewAllProjects
      ? true
      : p.assignedMemberIds.includes(currentUser.id) || p.managerId === currentUser.id
  );

  const activeProjects = myProjects.filter((p) => p.status === 'ACTIVE');
  const completedProjects = myProjects.filter((p) => p.status === 'COMPLETED');
  const criticalProjects = myProjects.filter((p) => p.priority === 'CRITICAL' && p.status === 'ACTIVE');
  const newInquiries = inquiries.filter((i) => i.status === 'NEW_INQUIRY');

  // Revenue pipeline: Won leads + open inquiries expected revenue
  const wonLeadsRev = leads
    .filter((l) => l.status === 'DEAL_WON')
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const inqRev = inquiries.reduce((sum, i) => sum + i.expectedRevenue, 0);
  const totalRevenuePipeline = wonLeadsRev + inqRev;

  // Deals won count
  const dealsWonCount =
    leads.filter((l) => l.status === 'DEAL_WON').length +
    inquiries.filter((i) => i.status === 'LOCKED_DEAL').length;

  // Leads contacted count
  const leadsContactedCount = leads.filter(
    (l) => l.status === 'CONTACTED' || l.status === 'FOLLOW_UP' || l.status === 'INTERESTED' || l.status === 'DEAL_WON'
  ).length;

  const myMilestones = myProjects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectTitle: p.title, projectId: p.id }))
  );
  const pendingMilestones = myMilestones.filter((m) => !m.completed);

  const unread = announcements.filter((a) => !a.readBy.includes(currentUser.id));

  // Compute live value for each target
  const getLiveMetricValue = (metric: StudioTarget['metric']) => {
    switch (metric) {
      case 'REVENUE':
        return totalRevenuePipeline;
      case 'DEALS_WON':
        return dealsWonCount;
      case 'LEADS_CONTACTED':
        return leadsContactedCount;
      case 'PROJECTS_DELIVERED':
        return completedProjects.length;
      default:
        return 0;
    }
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTargetsChange) {
      onTargetsChange(editableTargets);
    }
    setStore(STORAGE_KEYS.TARGETS, editableTargets);
    setConfigureTargetsOpen(false);

    try {
      fetch('/api/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: editableTargets }),
      });
    } catch {
      // Local fallback handled
    }
  };

  const statCards = [
    {
      label: 'ACTIVE PROJECTS',
      value: activeProjects.length.toString(),
      sub: `${criticalProjects.length} critical`,
      icon: Briefcase,
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-950/20',
      tab: 'PROJECTS',
    },
    {
      label: 'PENDING MILESTONES',
      value: pendingMilestones.length.toString(),
      sub: 'across all projects',
      icon: Target,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      tab: 'PROJECTS',
    },
    {
      label: 'COMPLETED BUILDS',
      value: completedProjects.length.toString(),
      sub: 'this quarter',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      tab: 'PROJECTS',
    },
    ...(perms.canViewLeads
      ? [
          {
            label: 'LEADS PIPELINE',
            value: leads.filter((l) => l.status !== 'LOST').length.toString(),
            sub: `${leads.filter((l) => l.status === 'NEW').length} new inbounds`,
            icon: Users,
            color: 'text-cyan-400',
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-950/20',
            tab: 'LEADS',
          },
        ]
      : []),
    ...(perms.canViewAllInquiries
      ? [
          {
            label: 'NEW INQUIRIES',
            value: newInquiries.length.toString(),
            sub: 'awaiting response',
            icon: TrendingUp,
            color: 'text-violet-400',
            border: 'border-violet-500/30',
            bg: 'bg-violet-950/20',
            tab: 'INQUIRIES',
          },
        ]
      : []),
    ...(perms.canViewRevenueMetrics
      ? [
          {
            label: 'REVENUE PIPELINE',
            value: `$${(totalRevenuePipeline / 1000).toFixed(0)}K`,
            sub: `${dealsWonCount} closed deals`,
            icon: Zap,
            color: 'text-emerald-400',
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-950/20',
            tab: 'ANALYTICS',
          },
        ]
      : []),
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">
          TECHNOVA STUDIO // COMMAND CENTER
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
          WELCOME BACK,{' '}
          <span className="bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
            {currentUser.name.split(' ')[0]}
          </span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400 font-mono">
          {currentUser.clearanceCode} // {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onTabChange(card.tab)}
              className={`text-left p-4 border ${card.border} ${card.bg} hover:border-opacity-80 transition-all hud-clip group`}
            >
              <div className="flex items-start justify-between">
                <Icon className={`w-4 h-4 ${card.color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <p className={`mt-3 text-2xl font-black tracking-tight ${card.color}`}>{card.value}</p>
              <p className="mt-0.5 font-mono text-[8px] tracking-[0.18em] text-white uppercase">{card.label}</p>
              <p className="mt-0.5 font-mono text-[8px] text-zinc-500">{card.sub}</p>
            </button>
          );
        })}
      </div>

      {/* ─── INTERACTIVE TARGET TRACKING WIDGET ──────────────────────────── */}
      <div className="border border-white/10 bg-[#060606] p-6 hud-clip">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2.5">
            <Target className="w-4 h-4 text-red-500" />
            <div>
              <span className="font-mono text-xs tracking-widest text-white uppercase font-bold">
                STUDIO TARGET TRACKING & VELOCITY
              </span>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Auto-synchronized live performance against quarterly milestone goals
              </p>
            </div>
          </div>
          {perms.canManageTargets && (
            <button
              type="button"
              onClick={() => {
                setEditableTargets(targets);
                setConfigureTargetsOpen(true);
              }}
              className="px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10 bg-white/5 hover:border-red-500/50 text-white flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <Edit3 className="w-3 h-3 text-red-400" />
              <span>CONFIGURE TARGETS</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {targets.map((tgt) => {
            const liveCurrent = getLiveMetricValue(tgt.metric);
            const targetVal = tgt.targetValue || 1;
            const pct = Math.min(100, Math.round((liveCurrent / targetVal) * 100));
            const isCompleted = pct >= 100;

            const formatVal = (val: number) => {
              if (tgt.unit === '$') return `$${val.toLocaleString()}`;
              return `${val} ${tgt.unit !== '#' ? tgt.unit : ''}`.trim();
            };

            return (
              <div
                key={tgt.id}
                className="p-4 rounded border border-white/8 bg-white/[0.02] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                      {tgt.period} TARGET
                    </span>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isCompleted
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                          : pct >= 50
                          ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <h4 className="font-mono text-xs font-bold text-white mt-1 uppercase">{tgt.title}</h4>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${tgt.color || 'from-red-600 to-amber-500'} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400">
                    <span>
                      LIVE: <span className="text-white font-bold">{formatVal(liveCurrent)}</span>
                    </span>
                    <span>
                      GOAL: <span className="text-zinc-300">{formatVal(targetVal)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Col Grid: Active Projects + Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects List */}
        <div className="lg:col-span-2 border border-white/10 bg-[#060606] p-6 hud-clip">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono text-[11px] tracking-widest text-white uppercase font-bold">
                ACTIVE ENGINEERING PROJECTS ({activeProjects.length})
              </span>
            </div>
            <button
              onClick={() => onTabChange('PROJECTS')}
              className="font-mono text-[9px] text-zinc-500 hover:text-red-400 flex items-center space-x-1 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeProjects.slice(0, 5).map((p) => {
              const pct = getProjectProgress(p);
              const doneMilestones = p.milestones.filter((m) => m.completed).length;
              const totalMilestones = p.milestones.length;
              return (
                <div
                  key={p.id}
                  onClick={() => onTabChange('PROJECTS')}
                  className="p-4 border border-white/8 bg-white/[0.02] hover:border-red-500/40 hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[9px] text-zinc-500">[{p.id.toUpperCase()}]</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                          {p.title}
                        </h4>
                        {p.priority === 'CRITICAL' && (
                          <span className="font-mono text-[8px] bg-red-950/80 border border-red-500/60 text-red-400 px-1.5 py-0.2">
                            CRITICAL
                          </span>
                        )}
                        {p.customerId && (
                          <span className="font-mono text-[8px] bg-violet-950/80 border border-violet-500/60 text-violet-400 px-1.5 py-0.2">
                            {p.customerId}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{p.description}</p>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 shrink-0 ml-3">
                      {p.type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center space-x-3">
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`font-mono text-[9px] font-bold shrink-0 ${
                        pct === 100 ? 'text-emerald-400' : 'text-zinc-400'
                      }`}
                    >
                      {pct}%{totalMilestones > 0 ? ` (${doneMilestones}/${totalMilestones})` : ''}
                    </span>
                  </div>
                  {p.dueDate && (
                    <div className="mt-1.5 flex items-center space-x-1 font-mono text-[9px] text-zinc-500">
                      <Clock className="w-2.5 h-2.5" />
                      <span>DUE: {p.dueDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {activeProjects.length === 0 && (
              <p className="text-xs text-zinc-500 font-mono text-center py-6">NO ACTIVE PROJECTS</p>
            )}
          </div>
        </div>

        {/* Announcements Quick View */}
        <div className="border border-white/10 bg-[#060606] p-6 hud-clip">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono text-[11px] tracking-widest text-white uppercase font-bold">
                STUDIO DISPATCH
              </span>
            </div>
            <button
              onClick={() => onTabChange('ANNOUNCEMENTS')}
              className="font-mono text-[9px] text-zinc-500 hover:text-red-400 flex items-center space-x-1 transition-colors"
            >
              <span>ALL</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((ann) => {
              const isUnread = !ann.readBy.includes(currentUser.id);
              const catColors: Record<string, string> = {
                IMPORTANT: 'text-red-400 border-red-500/50',
                MEETING: 'text-violet-400 border-violet-500/50',
                POLICY: 'text-amber-400 border-amber-500/50',
                GENERAL: 'text-zinc-400 border-white/20',
              };
              return (
                <div
                  key={ann.id}
                  className={`border ${isUnread ? 'border-red-500/30 bg-red-950/10' : 'border-white/8 bg-white/[0.02]'} p-3.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[8px] border px-1.5 py-0.5 uppercase ${catColors[ann.category]}`}>
                      {ann.category}
                    </span>
                    {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {ann.pinned && !isUnread && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-white">{ann.title}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-zinc-500">by {ann.authorName}</p>
                </div>
              );
            })}
            {announcements.length === 0 && (
              <p className="text-xs text-zinc-500 font-mono text-center py-6">NO ANNOUNCEMENTS</p>
            )}
          </div>
          {unread.length > 0 && (
            <div className="mt-3 border border-red-500/30 bg-red-950/20 p-2.5 text-center">
              <p className="font-mono text-[9px] text-red-400">
                {unread.length} UNREAD DISPATCH{unread.length > 1 ? 'ES' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CONFIGURE TARGETS */}
      {configureTargetsOpen && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border border-white/10 bg-[#141416] p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  CONFIGURE STUDIO VELOCITY TARGETS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfigureTargetsOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-4">
              {editableTargets.map((tgt, idx) => (
                <div key={tgt.id} className="p-3 rounded border border-white/8 bg-black/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px] uppercase">{tgt.title}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">({tgt.period})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">{tgt.unit === '$' ? '$' : 'Goal:'}</span>
                    <input
                      type="number"
                      value={tgt.targetValue}
                      onChange={(e) => {
                        const next = [...editableTargets];
                        next[idx].targetValue = parseInt(e.target.value) || 0;
                        setEditableTargets(next);
                      }}
                      className="flex-1 bg-black/60 border border-white/10 rounded px-2 py-1 text-white focus:outline-none"
                    />
                    <span className="text-zinc-500">{tgt.unit !== '$' ? tgt.unit : 'USD'}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfigureTargetsOpen(false)}
                  className="px-3 py-1.5 border border-white/10 rounded text-zinc-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 text-white font-bold rounded hover:bg-red-500 shadow-md"
                >
                  SAVE TARGETS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
