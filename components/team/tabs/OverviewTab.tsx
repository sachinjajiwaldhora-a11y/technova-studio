// FILE PATH: components/team/tabs/OverviewTab.tsx
'use client';

import React from 'react';
import {
  StudioMember, StudioProject, ClientInquiry, StudioAnnouncement,
  getProjectProgress,
} from '@/lib/store';
import { RBACPermissions } from '@/lib/store';
import {
  Briefcase, TrendingUp, Users, Clock, CheckCircle2, AlertTriangle,
  Megaphone, ArrowUpRight, Zap, Target,
} from 'lucide-react';

interface OverviewTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  projects: StudioProject[];
  inquiries: ClientInquiry[];
  members: StudioMember[];
  announcements: StudioAnnouncement[];
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({
  currentUser, perms, projects, inquiries, members, announcements, onTabChange,
}: OverviewTabProps) {
  const myProjects = projects.filter((p) =>
    perms.canViewAllProjects
      ? true
      : p.assignedMemberIds.includes(currentUser.id) || p.managerId === currentUser.id
  );

  const activeProjects = myProjects.filter((p) => p.status === 'ACTIVE');
  const completedProjects = myProjects.filter((p) => p.status === 'COMPLETED');
  const criticalProjects = myProjects.filter((p) => p.priority === 'CRITICAL' && p.status === 'ACTIVE');
  const newInquiries = inquiries.filter((i) => i.status === 'NEW_INQUIRY');
  const totalRevenuePipeline = inquiries.reduce((sum, i) => sum + i.expectedRevenue, 0);

  const myMilestones = myProjects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectTitle: p.title, projectId: p.id }))
  );
  const pendingMilestones = myMilestones.filter((m) => !m.completed);

  const unread = announcements.filter(
    (a) => !a.readBy.includes(currentUser.id)
  );

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
      label: 'COMPLETED',
      value: completedProjects.length.toString(),
      sub: 'this quarter',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      tab: 'PROJECTS',
    },
    ...(perms.canViewAllInquiries ? [{
      label: 'NEW INQUIRIES',
      value: newInquiries.length.toString(),
      sub: 'awaiting response',
      icon: TrendingUp,
      color: 'text-violet-400',
      border: 'border-violet-500/30',
      bg: 'bg-violet-950/20',
      tab: 'INQUIRIES',
    }] : []),
    ...(perms.canViewRevenueMetrics ? [{
      label: 'REVENUE PIPELINE',
      value: `$${(totalRevenuePipeline / 1000).toFixed(0)}K`,
      sub: 'open deals total',
      icon: Zap,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      tab: 'ANALYTICS',
    }] : []),
    ...(perms.canViewAllMembers ? [{
      label: 'TEAM MEMBERS',
      value: members.length.toString(),
      sub: `${members.filter((m) => m.role === 'admin' || m.role === 'manager').length} leads`,
      icon: Users,
      color: 'text-pink-400',
      border: 'border-pink-500/30',
      bg: 'bg-pink-950/20',
      tab: 'TEAM',
    }] : []),
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onTabChange(card.tab)}
              className={`text-left p-5 border ${card.border} ${card.bg} hover:border-opacity-80 transition-all hud-clip group`}
            >
              <div className="flex items-start justify-between">
                <Icon className={`w-4 h-4 ${card.color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <p className={`mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight ${card.color}`}>
                {card.value}
              </p>
              <p className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-white uppercase">{card.label}</p>
              <p className="mt-0.5 font-mono text-[8px] text-zinc-500">{card.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Two-column: Active Projects + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Quick View */}
        <div className="border border-white/10 bg-[#060606] p-6 hud-clip">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono text-[11px] tracking-widest text-white uppercase font-bold">
                MY ACTIVE PROJECTS
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
            {activeProjects.slice(0, 4).map((p) => {
              const pct = getProjectProgress(p);
              const doneMilestones = p.milestones.filter((m) => m.completed).length;
              const totalMilestones = p.milestones.length;
              const prioColor = p.priority === 'CRITICAL' ? 'text-red-400' : p.priority === 'HIGH' ? 'text-amber-400' : 'text-zinc-400';
              return (
                <div key={p.id} className="border border-white/8 bg-white/[0.02] p-3.5 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white truncate max-w-[200px]">{p.title}</p>
                    <span className={`font-mono text-[9px] ${prioColor}`}>{p.priority}</span>
                  </div>
                  <div className="mt-2.5 flex items-center space-x-2">
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
                    {isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {ann.pinned && !isUnread && (
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                    )}
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

      {/* My Performance Quick Stats (own metrics) */}
      <div className="border border-white/10 bg-[#060606] p-6 hud-clip">
        <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase mb-4">MY PERFORMANCE TELEMETRY</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TASKS DONE', value: currentUser.metrics.tasksCompleted, color: 'text-emerald-400' },
            { label: 'OVERDUE', value: currentUser.metrics.tasksOverdue, color: 'text-red-400' },
            { label: 'AVG DELIVERY', value: `${currentUser.metrics.avgCompletionDays}d`, color: 'text-cyan-400' },
            { label: 'HOURS LOGGED', value: currentUser.metrics.hoursLoggedTotal, color: 'text-violet-400' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
              <p className="font-mono text-[8px] tracking-[0.18em] text-zinc-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-violet-500 to-cyan-500 transition-all"
            style={{ width: `${currentUser.metrics.deliveryRatePct}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-[9px] text-zinc-500 text-right">
          DELIVERY RATE: {currentUser.metrics.deliveryRatePct}%
        </p>
      </div>
    </div>
  );
}
