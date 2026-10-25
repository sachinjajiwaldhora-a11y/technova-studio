// FILE PATH: components/team/tabs/AnalyticsTab.tsx
'use client';

import React, { useMemo } from 'react';
import {
  StudioMember, StudioProject, ClientInquiry, RBACPermissions,
} from '@/lib/store';
import {
  TrendingUp, Users, Briefcase, DollarSign, Clock,
  CheckCircle2, AlertTriangle, BarChart3, Target, Zap,
} from 'lucide-react';

interface AnalyticsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  projects: StudioProject[];
  inquiries: ClientInquiry[];
  members: StudioMember[];
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-zinc-800 overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsTab({
  currentUser, perms, projects, inquiries, members,
}: AnalyticsTabProps) {
  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === 'ACTIVE');
    const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
    const inReview = projects.filter((p) => p.status === 'REVIEW');

    const totalMilestones = projects.flatMap((p) => p.milestones);
    const doneMilestones = totalMilestones.filter((m) => m.completed);
    const milestoneCompletionPct = totalMilestones.length > 0
      ? Math.round((doneMilestones.length / totalMilestones.length) * 100) : 0;

    const totalHours = projects.reduce((s, p) => s + p.actualHours, 0);
    const estimatedHours = projects.reduce((s, p) => s + p.estimatedHours, 0);

    const pipelineRevenue = inquiries.filter((i) => i.status !== 'LOST').reduce((s, i) => s + i.expectedRevenue, 0);
    const closedRevenue = projects
      .filter((p) => p.source === 'CLIENT_INQUIRY' && p.status === 'COMPLETED')
      .reduce((s, p) => s + (p.clientInfo?.expectedRevenue || 0), 0);

    const conversionRate = inquiries.length > 0
      ? Math.round((inquiries.filter((i) => i.status === 'LOCKED_DEAL').length / inquiries.length) * 100) : 0;

    const avgDelivery = members.reduce((s, m) => s + m.metrics.deliveryRatePct, 0) / (members.length || 1);

    const projectsByType = projects.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const inquiryByStatus = inquiries.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      inReview: inReview.length,
      totalProjects: projects.length,
      milestoneCompletionPct,
      doneMilestones: doneMilestones.length,
      totalMilestones: totalMilestones.length,
      totalHours,
      estimatedHours,
      pipelineRevenue,
      closedRevenue,
      conversionRate,
      avgDelivery: Math.round(avgDelivery),
      projectsByType,
      inquiryByStatus,
    };
  }, [projects, inquiries, members]);

  const topPerformers = [...members]
    .sort((a, b) => b.metrics.tasksCompleted - a.metrics.tasksCompleted)
    .slice(0, 5);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">TELEMETRY DATA</p>
        <h2 className="text-2xl font-extrabold tracking-tight uppercase">STUDIO ANALYTICS</h2>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE PROJECTS', value: stats.activeProjects, icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-500/30' },
          { label: 'COMPLETED', value: stats.completedProjects, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/30' },
          { label: 'MILESTONE %', value: `${stats.milestoneCompletionPct}%`, icon: Target, color: 'text-violet-400', bg: 'bg-violet-950/20 border-violet-500/30' },
          { label: 'TEAM DELIVERY', value: `${stats.avgDelivery}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-500/30' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`border ${bg} p-5 hud-clip`}>
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="font-mono text-[8px] text-zinc-500 tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      {perms.canViewRevenueMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">REVENUE TELEMETRY</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">OPEN PIPELINE</span>
                  <span className="text-emerald-400">${stats.pipelineRevenue.toLocaleString()}</span>
                </div>
                <MiniBar value={stats.pipelineRevenue} max={stats.pipelineRevenue + stats.closedRevenue} color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">CLOSED / EARNED</span>
                  <span className="text-cyan-400">${stats.closedRevenue.toLocaleString()}</span>
                </div>
                <MiniBar value={stats.closedRevenue} max={stats.pipelineRevenue + stats.closedRevenue} color="bg-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">CONVERSION RATE</span>
                  <span className="text-violet-400">{stats.conversionRate}%</span>
                </div>
                <MiniBar value={stats.conversionRate} max={100} color="bg-violet-500" />
              </div>
            </div>
          </div>

          {/* Inquiry Status Breakdown */}
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-4 h-4 text-red-400" />
              <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">INQUIRY PIPELINE</p>
            </div>
            <div className="space-y-3">
              {Object.entries(stats.inquiryByStatus).map(([status, count]) => {
                const pct = inquiries.length > 0 ? (count / inquiries.length) * 100 : 0;
                const colors: Record<string, string> = {
                  NEW_INQUIRY: 'bg-cyan-500',
                  CALL_SCHEDULED: 'bg-violet-500',
                  PROPOSAL_SENT: 'bg-amber-500',
                  LOCKED_DEAL: 'bg-emerald-500',
                  LOST: 'bg-zinc-600',
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between font-mono text-[9px] mb-1">
                      <span className="text-zinc-400">{status.replace('_', ' ')}</span>
                      <span className="text-white">{count}</span>
                    </div>
                    <MiniBar value={pct} max={100} color={colors[status] || 'bg-zinc-500'} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Type Breakdown */}
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">PROJECTS BY TYPE</p>
            </div>
            <div className="space-y-3">
              {Object.entries(stats.projectsByType).map(([type, count]) => {
                const pct = projects.length > 0 ? (count / projects.length) * 100 : 0;
                const colors: Record<string, string> = {
                  DEV_BUILD: 'bg-red-500',
                  CLIENT_COMMISSION: 'bg-cyan-500',
                  LEAD_GEN: 'bg-emerald-500',
                  RESEARCH: 'bg-violet-500',
                  INTERNAL: 'bg-amber-500',
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between font-mono text-[9px] mb-1">
                      <span className="text-zinc-400">{type.replace('_', ' ')}</span>
                      <span className="text-white">{count}</span>
                    </div>
                    <MiniBar value={pct} max={100} color={colors[type] || 'bg-zinc-500'} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hours Telemetry */}
      <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
        <div className="flex items-center space-x-2 mb-5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">HOURS TELEMETRY</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-cyan-400">{stats.totalHours}</p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">TOTAL HOURS LOGGED</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-violet-400">{stats.estimatedHours}</p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">TOTAL ESTIMATED</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-amber-400">
              {stats.estimatedHours > 0 ? Math.round((stats.totalHours / stats.estimatedHours) * 100) : 0}%
            </p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">UTILIZATION RATE</p>
          </div>
        </div>
        <div className="mt-5">
          <MiniBar value={stats.totalHours} max={stats.estimatedHours} color="bg-gradient-to-r from-cyan-500 to-violet-500" />
        </div>
      </div>

      {/* Team Performance Leaderboard */}
      {perms.canViewTeamMetrics && (
        <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
          <div className="flex items-center space-x-2 mb-5">
            <Users className="w-4 h-4 text-violet-400" />
            <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">TEAM PERFORMANCE LEADERBOARD</p>
          </div>
          <div className="space-y-3">
            {topPerformers.map((m, idx) => (
              <div key={m.id} className="flex items-center space-x-4 border border-white/8 bg-white/[0.02] p-3.5">
                <span className={`font-mono text-xs font-bold w-5 shrink-0 ${idx === 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: m.accentColor }}
                >
                  {m.photoInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{m.name}</p>
                  <p className="font-mono text-[8px] text-zinc-500">{m.department}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-mono text-xs text-emerald-400 font-bold">{m.metrics.tasksCompleted}</p>
                    <p className="font-mono text-[7px] text-zinc-600">DONE</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs text-cyan-400 font-bold">{m.metrics.hoursLoggedTotal}h</p>
                    <p className="font-mono text-[7px] text-zinc-600">HOURS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs text-violet-400 font-bold">{m.metrics.deliveryRatePct}%</p>
                    <p className="font-mono text-[7px] text-zinc-600">RATE</p>
                  </div>
                  {m.metrics.tasksOverdue > 0 && (
                    <div className="flex items-center space-x-1 font-mono text-[9px] text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{m.metrics.tasksOverdue}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone Velocity */}
      <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
        <div className="flex items-center space-x-2 mb-5">
          <Zap className="w-4 h-4 text-amber-400" />
          <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">MILESTONE VELOCITY</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL', value: stats.totalMilestones, color: 'text-white' },
            { label: 'COMPLETED', value: stats.doneMilestones, color: 'text-emerald-400' },
            { label: 'PENDING', value: stats.totalMilestones - stats.doneMilestones, color: 'text-amber-400' },
            { label: 'COMPLETION %', value: `${stats.milestoneCompletionPct}%`, color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="font-mono text-[8px] text-zinc-500 tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <MiniBar value={stats.milestoneCompletionPct} max={100} color="bg-gradient-to-r from-amber-500 to-violet-500" />
        </div>
      </div>
    </div>
  );
}
